-- 지님 MVP — Row Level Security (RLS) + 최소 GRANT
-- health_check 등 기존 테이블은 변경하지 않음.
-- 재실행 시: 동일 이름의 policy를 DROP 후 CREATE.
--
-- 전제
-- - profiles.id / collections.user_id / jinim_cards.user_id 는 auth.users.id 와 동일한 값.
-- - 게스트 플로우는 Supabase anon 키(비로그인)로 수행될 수 있으나, MVP에서는 브라우저에서 anon으로
--   직접 INSERT 하기보다 Next.js Route Handler(또는 서버 액션)에서 묶어서 처리하는 것을 권장한다.
--   서버에서 service_role 또는 요청 바디의 guest_token 검증 등 보조 검증을 두면 안전하다.
-- - card_answers 행에는 guest_token 컬럼이 없어, RLS만으로 “클라이언트가 들고 있는 토큰”과
--   행 단위로 일치하는지 검증하기 어렵다. 카드 id만 알면 답변을 붙일 여지가 남으므로, 게스트
--   답변·연관 insert는 Route Handler에서 토큰·플로우를 검증하는 전제를 둔다.
-- - taste_reports 는 삽입 행에 guest_token 이 있으므로, 부모 게스트 카드의 guest_token 과
--   일치할 때만 anon INSERT 를 허용한다(카드 id만으로는 부족).

-- ---------------------------------------------------------------------------
-- 기존 정책 제거 (이 파일에서 정의한 이름만)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;

DROP POLICY IF EXISTS collections_select_public_or_own ON public.collections;
DROP POLICY IF EXISTS collections_insert_own ON public.collections;
DROP POLICY IF EXISTS collections_update_own ON public.collections;
DROP POLICY IF EXISTS collections_delete_own ON public.collections;

DROP POLICY IF EXISTS jinim_cards_select_public_or_own ON public.jinim_cards;
DROP POLICY IF EXISTS jinim_cards_insert_guest_anon ON public.jinim_cards;
DROP POLICY IF EXISTS jinim_cards_insert_member ON public.jinim_cards;
DROP POLICY IF EXISTS jinim_cards_update_own ON public.jinim_cards;
DROP POLICY IF EXISTS jinim_cards_delete_own ON public.jinim_cards;

DROP POLICY IF EXISTS card_answers_select_if_card_visible ON public.card_answers;
DROP POLICY IF EXISTS card_answers_insert_guest_anon ON public.card_answers;
DROP POLICY IF EXISTS card_answers_insert_member ON public.card_answers;
DROP POLICY IF EXISTS card_answers_update_if_card_owned ON public.card_answers;
DROP POLICY IF EXISTS card_answers_delete_if_card_owned ON public.card_answers;

DROP POLICY IF EXISTS taste_reports_select_visible_or_own ON public.taste_reports;
DROP POLICY IF EXISTS taste_reports_insert_guest_anon ON public.taste_reports;
DROP POLICY IF EXISTS taste_reports_insert_member ON public.taste_reports;
DROP POLICY IF EXISTS taste_reports_update_own ON public.taste_reports;
DROP POLICY IF EXISTS taste_reports_delete_own ON public.taste_reports;

-- ---------------------------------------------------------------------------
-- RLS 활성화
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jinim_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taste_reports ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- profiles — 본인만 조회·삽입·수정
-- ---------------------------------------------------------------------------
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- ---------------------------------------------------------------------------
-- collections — 공개·링크공개는 누구나 조회, 비공개는 소유자만 / 소유자 CUD
-- ---------------------------------------------------------------------------
CREATE POLICY collections_select_public_or_own ON public.collections
  FOR SELECT TO anon, authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR visibility IN ('public', 'link_only')
  );

CREATE POLICY collections_insert_own ON public.collections
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY collections_update_own ON public.collections
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY collections_delete_own ON public.collections
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ---------------------------------------------------------------------------
-- jinim_cards
-- SELECT: 공개·링크공개 + published 는 누구나; 비공개·기타는 소유자만
-- INSERT: anon 게스트 1경로(MVP: link_only + published + guest_token 필수) / authenticated 회원
-- UPDATE·DELETE: 소유자만 (게스트 행은 user_id 가 null 이라 불가 → 링크 공유 카드는 수정·삭제 불가)
-- ---------------------------------------------------------------------------
CREATE POLICY jinim_cards_select_public_or_own ON public.jinim_cards
  FOR SELECT TO anon, authenticated
  USING (
    (
      visibility IN ('public', 'link_only')
      AND status = 'published'
    )
    OR (user_id IS NOT NULL AND user_id = (SELECT auth.uid()))
  );

CREATE POLICY jinim_cards_insert_guest_anon ON public.jinim_cards
  FOR INSERT TO anon
  WITH CHECK (
    user_id IS NULL
    AND collection_id IS NULL
    AND is_guest_created = true
    AND guest_token IS NOT NULL
    AND visibility = 'link_only'
    AND status = 'published'
  );

CREATE POLICY jinim_cards_insert_member ON public.jinim_cards
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND is_guest_created = false
    AND collection_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.collections c
      WHERE c.id = collection_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY jinim_cards_update_own ON public.jinim_cards
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY jinim_cards_delete_own ON public.jinim_cards
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ---------------------------------------------------------------------------
-- card_answers — 부모 카드 가시성·소유권에 맞춤
-- ---------------------------------------------------------------------------
CREATE POLICY card_answers_select_if_card_visible ON public.card_answers
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.jinim_cards j
      WHERE j.id = card_answers.card_id
        AND (
          (
            j.visibility IN ('public', 'link_only')
            AND j.status = 'published'
          )
          OR (
            j.user_id IS NOT NULL
            AND j.user_id = (SELECT auth.uid())
          )
        )
    )
  );

CREATE POLICY card_answers_insert_guest_anon ON public.card_answers
  FOR INSERT TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.jinim_cards j
      WHERE j.id = card_id
        AND j.user_id IS NULL
        AND j.is_guest_created = true
        AND j.guest_token IS NOT NULL
        AND j.visibility = 'link_only'
        AND j.status = 'published'
    )
  );

CREATE POLICY card_answers_insert_member ON public.card_answers
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.jinim_cards j
      WHERE j.id = card_id
        AND j.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY card_answers_update_if_card_owned ON public.card_answers
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.jinim_cards j
      WHERE j.id = card_id
        AND j.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.jinim_cards j
      WHERE j.id = card_id
        AND j.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY card_answers_delete_if_card_owned ON public.card_answers
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.jinim_cards j
      WHERE j.id = card_id
        AND j.user_id = (SELECT auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- taste_reports
-- SELECT: 소유자(user_id) 또는 연결된 공개·링크공개 카드/소품함 기준 조회
-- INSERT: anon 게스트(guest_single + 게스트 카드) / authenticated 소유 리소스
-- UPDATE·DELETE: 소유자만 (게스트 행 user_id null → 수정·삭제 불가)
-- ---------------------------------------------------------------------------
CREATE POLICY taste_reports_select_visible_or_own ON public.taste_reports
  FOR SELECT TO anon, authenticated
  USING (
    (user_id IS NOT NULL AND user_id = (SELECT auth.uid()))
    OR (
      card_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.jinim_cards j
        WHERE j.id = taste_reports.card_id
          AND j.visibility IN ('public', 'link_only')
          AND j.status = 'published'
      )
    )
    OR (
      collection_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.collections c
        WHERE c.id = taste_reports.collection_id
          AND c.visibility IN ('public', 'link_only')
      )
    )
  );

CREATE POLICY taste_reports_insert_guest_anon ON public.taste_reports
  FOR INSERT TO anon
  WITH CHECK (
    user_id IS NULL
    AND scope = 'guest_single'
    AND card_id IS NOT NULL
    AND guest_token IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.jinim_cards j
      WHERE j.id = card_id
        AND j.user_id IS NULL
        AND j.is_guest_created = true
        AND j.guest_token IS NOT NULL
        AND j.guest_token = guest_token
        AND j.visibility = 'link_only'
        AND j.status = 'published'
    )
  );

CREATE POLICY taste_reports_insert_member ON public.taste_reports
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      (
        scope = 'collection'
        AND collection_id IS NOT NULL
        AND EXISTS (
          SELECT 1
          FROM public.collections c
          WHERE c.id = collection_id
            AND c.user_id = (SELECT auth.uid())
        )
      )
      OR (
        scope = 'card_single'
        AND card_id IS NOT NULL
        AND EXISTS (
          SELECT 1
          FROM public.jinim_cards j
          WHERE j.id = card_id
            AND j.user_id = (SELECT auth.uid())
        )
      )
    )
  );

CREATE POLICY taste_reports_update_own ON public.taste_reports
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY taste_reports_delete_own ON public.taste_reports
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ---------------------------------------------------------------------------
-- API 역할에 대한 최소 권한 (프로젝트에 이미 있으면 중복 GRANT 는 무해)
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

GRANT SELECT ON public.collections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.collections TO authenticated;

GRANT SELECT ON public.jinim_cards TO anon, authenticated;
GRANT INSERT ON public.jinim_cards TO anon, authenticated;
GRANT UPDATE, DELETE ON public.jinim_cards TO authenticated;

GRANT SELECT ON public.card_answers TO anon, authenticated;
GRANT INSERT ON public.card_answers TO anon, authenticated;
GRANT UPDATE, DELETE ON public.card_answers TO authenticated;

GRANT SELECT ON public.taste_reports TO anon, authenticated;
GRANT INSERT ON public.taste_reports TO anon, authenticated;
GRANT UPDATE, DELETE ON public.taste_reports TO authenticated;
