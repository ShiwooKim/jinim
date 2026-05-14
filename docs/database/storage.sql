-- =============================================================================
-- 지님 MVP — Supabase Storage 설정 메모 + storage.objects RLS 정책 초안
-- =============================================================================
--
-- [1] Dashboard에서 먼저 할 일 (이 SQL로 bucket 자체는 만들지 않음)
-- -----------------------------------------------------------------------------
-- Supabase Dashboard → Storage → New bucket
--
--   Name:              jinim-card-images
--   Public bucket:     OFF (private)  ← MVP에서 private을 쓰는 이유는 하단 주석 참고
--   Allowed MIME:     image/jpeg, image/png, image/webp
--   Max file size:    5MB 또는 10MB (팀 기준 택일)
--
-- 앱 DB `jinim_cards.image_path`(또는 `image_url`만 쓸 경우)에는, 아래 규칙과 동일한
-- **객체 이름(name)** 을 저장하는 것을 권장한다. Storage 정책의 EXISTS 조인과 맞춘다.
--
--
-- [2] 권장 객체 경로(name) 규칙 — bucket 루트 기준 상대 경로
-- -----------------------------------------------------------------------------
-- 게스트 카드 (guest_token, card_id, 확장자 ext):
--
--   guest/{guest_token}/{card_id}.{ext}
--
-- 회원 카드 (user_id = auth.users.id, card_id, ext):
--
--   users/{user_id}/cards/{card_id}.{ext}
--
-- 주의: guest_token·card_id·user_id 경로 세그먼트에는 슬래시(/)가 들어가면 안 된다.
--
--
-- [3] MVP 보안·구현 판단 (Storage policy 한계 + Route Handler)
-- -----------------------------------------------------------------------------
-- · 게스트 업로드는 브라우저 anon으로 Storage에 직접 넣기보다, Next.js Route Handler에서
--   guest_token 검증, 파일 크기/MIME 재검증, 카드 생성과 같은 트랜잭션/흐름으로 묶는
--   방식을 **우선** 권장한다. 이 경우 Handler는 Supabase **service_role** 등으로
--   Storage에 쓰면 RLS를 우회하므로, 아래 **anon용 INSERT 정책은 제공하지 않는다.**
--
-- · 회원 업로드는 클라이언트에서 **authenticated** 세션으로 직접 올리되, 경로를
--   `users/{auth.uid()}/cards/...` 로 제한하는 정책으로 막는 방향(MVP 기본안).
--
-- · **읽기**: `jinim_cards.visibility`·소유자와 Storage 객체를 policy만으로 1:1로
--   엮으면 이상적이지만, `link_only`(링크 아는 사람만)는 Storage URL만으로는 구분이
--   어렵다. 본 파일은 DB RLS와 동일하게 **public + link_only + published** 이면
--   SELECT 허용으로 두었고, 그 결과 link_only 이미지도 “경로를 아는 사람”에게는
--   열릴 수 있다는 **MVP 트레이드오프**가 있다. 더 엄격히 하려면 이미지 조회를
--   Route Handler에서 프록시하거나 signed URL을 짧게 발급하는 방식을 검토한다.
--
-- · **비공개(private)** 카드 이미지: `jinim_cards`에 연결된 경로가 private이면
--   아래 EXISTS 분기로 anon/타인 SELECT는 막힌다. 다만 **게스트 경로(guest/...)** 에
--   올라간 파일은 DB 행과의 조인이 없으면 policy가 알 수 없으므로, private 게스트
--   이미지는 **서버에서 signed URL 발급** 등으로 보완하는 것이 안전하다.
--
--
-- [4] Route Handler(또는 서버)에서 보완 검증 권장 항목 체크리스트
-- -----------------------------------------------------------------------------
-- □ guest_token: 형식·만료·DB의 카드와 일치 여부
-- □ Content-Type / 시그니처 기반 MIME (클라이언트만 믿지 않기)
-- □ 파일 크기 상한 (bucket 제한 외 앱에서도 이중 검증)
-- □ 경로 조작: 위 규칙과 정확히 일치하는지, card_id·user_id와 세션·DB 일관성
-- □ 카드 생성/수정과 image_path 업데이트를 한 흐름으로 처리할지
-- □ private / link_only 엄격 노출이 필요하면: Storage 직링크 대신 Handler 프록시
--
--
-- [5] private bucket을 MVP에서 쓰는 이유 (public bucket 대신)
-- -----------------------------------------------------------------------------
-- · 버킷을 public으로 두면 객체 URL만 알면 **DB visibility와 무관하게** 노출될 수
--   있는 영역이 커진다. private + RLS/signed URL로 “기본은 막고, 정책으로만 연다”가
--   안전한 출발점이다.
-- · MIME·용량 제한과 RLS를 함께 두면, 이후 정책을 단계적으로 강화하기 쉽다.
-- · 목록(버킷 listing) 남용을 줄이고, 필요 시 서명 URL·서버 경유로 노출을 통제한다.
--
--
-- [6] 이 파일의 SQL 적용 순서
-- -----------------------------------------------------------------------------
-- 1) Dashboard에서 bucket `jinim-card-images` 생성
-- 2) Supabase SQL Editor에서 아래 DROP/CREATE 구문 실행
-- 3) 클라이언트 업로드 시 `upsert` 등으로 동일 name이면 UPDATE가 필요할 수 있음 —
--    정책에 UPDATE 포함. (프로젝트에 맞게 조정)
--
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 기존 정책 제거 (이 파일에서 정의한 이름만). bucket id는 이름으로 조회.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS jinim_card_images_select_mvp ON storage.objects;
DROP POLICY IF EXISTS jinim_card_images_insert_member ON storage.objects;
DROP POLICY IF EXISTS jinim_card_images_update_member ON storage.objects;
DROP POLICY IF EXISTS jinim_card_images_delete_member ON storage.objects;

-- ---------------------------------------------------------------------------
-- SELECT — (A) 회원 본인 prefix 전체 읽기  OR  (B) DB에 연결된 공개·링크공개 카드 이미지
--
-- (B)는 public.jinim_cards.image_path = storage.objects.name 일 때만 통과한다.
--      image_path에 bucket 이름을 넣지 말고, **객체 name과 동일한 문자열**을 저장할 것.
--      image_path가 NULL이면 Storage policy와 조인되지 않아 읽기 허용되지 않는다.
--
-- 한계: link_only·게스트 private 등은 상단 주석 참고.
-- ---------------------------------------------------------------------------
CREATE POLICY jinim_card_images_select_mvp ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = (SELECT id FROM storage.buckets WHERE name = 'jinim-card-images')
    AND (
      -- (A) 회원 자신 폴더 — users/{uid}/cards/{파일} 한 단계만 (비공개 포함, 본인만)
      (
        split_part(name, '/', 1) = 'users'
        AND split_part(name, '/', 2) = (SELECT auth.uid()::text)
        AND split_part(name, '/', 3) = 'cards'
        AND split_part(name, '/', 4) <> ''
        AND split_part(name, '/', 5) = ''
      )
      OR
      -- (B) 카드 메타와 조인: 공개·링크공개 + published 만 “누구나 GET” 허용
      EXISTS (
        SELECT 1
        FROM public.jinim_cards j
        WHERE j.image_path = name
          AND j.visibility IN ('public', 'link_only')
          AND j.status = 'published'
      )
    )
  );

-- ---------------------------------------------------------------------------
-- INSERT — 회원만: users/{auth.uid()}/cards/{파일명} 4단 구조 강제
-- guest/... 업로드는 anon 정책을 두지 않음 → Route Handler + service_role 권장.
-- ---------------------------------------------------------------------------
CREATE POLICY jinim_card_images_insert_member ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = (SELECT id FROM storage.buckets WHERE name = 'jinim-card-images')
    AND split_part(name, '/', 1) = 'users'
    AND split_part(name, '/', 2) = (SELECT auth.uid()::text)
    AND split_part(name, '/', 3) = 'cards'
    AND split_part(name, '/', 4) <> ''
    AND split_part(name, '/', 5) = ''
  );

-- ---------------------------------------------------------------------------
-- UPDATE — 본인 prefix 안의 객체만 (덮어쓰기/메타 수정 등)
-- ---------------------------------------------------------------------------
CREATE POLICY jinim_card_images_update_member ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = (SELECT id FROM storage.buckets WHERE name = 'jinim-card-images')
    AND split_part(name, '/', 1) = 'users'
    AND split_part(name, '/', 2) = (SELECT auth.uid()::text)
    AND split_part(name, '/', 3) = 'cards'
    AND split_part(name, '/', 4) <> ''
    AND split_part(name, '/', 5) = ''
  )
  WITH CHECK (
    bucket_id = (SELECT id FROM storage.buckets WHERE name = 'jinim-card-images')
    AND split_part(name, '/', 1) = 'users'
    AND split_part(name, '/', 2) = (SELECT auth.uid()::text)
    AND split_part(name, '/', 3) = 'cards'
    AND split_part(name, '/', 4) <> ''
    AND split_part(name, '/', 5) = ''
  );

-- ---------------------------------------------------------------------------
-- DELETE — 본인 prefix 만
-- ---------------------------------------------------------------------------
CREATE POLICY jinim_card_images_delete_member ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = (SELECT id FROM storage.buckets WHERE name = 'jinim-card-images')
    AND split_part(name, '/', 1) = 'users'
    AND split_part(name, '/', 2) = (SELECT auth.uid()::text)
    AND split_part(name, '/', 3) = 'cards'
    AND split_part(name, '/', 4) <> ''
    AND split_part(name, '/', 5) = ''
  );

-- ---------------------------------------------------------------------------
-- (선택) 게스트 anon 직접 업로드를 반드시 열어야 할 때만 검토
-- -----------------------------------------------------------------------------
-- 아래는 **비권장** 샘플이다. guest_token 유효성·남용 방지를 Storage만으로 할 수 없다.
-- 주석을 해제하기 전에 팀 합의가 필요하다.
--
-- CREATE POLICY jinim_card_images_insert_guest_anon_optional ON storage.objects
--   FOR INSERT TO anon
--   WITH CHECK (
--     bucket_id = (SELECT id FROM storage.buckets WHERE name = 'jinim-card-images')
--     AND split_part(name, '/', 1) = 'guest'
--     AND split_part(name, '/', 2) <> ''
--     AND split_part(name, '/', 3) <> ''
--     AND split_part(name, '/', 4) = ''
--   );
--
-- =============================================================================
