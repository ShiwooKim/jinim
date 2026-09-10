# Google OAuth 설정 · E2E 체크리스트

1차 MVP는 **Google 로그인만** 지원한다.  
Kakao는 추후 검토. 고객향 CTA는 **`Google로 소품함 만들기`**.

앱 코드의 `redirectTo`는 항상 **앱의** `/auth/callback`이다.  
Google Cloud와 Supabase Dashboard에 넣는 URI 역할이 다르다.

---

## Redirect URI 역할 구분 (중요)

### Google Cloud Console — Authorized redirect URI

여기에는 **Supabase Auth callback**만 등록한다.

```text
https://[SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback
```

이 프로젝트 예시 (`NEXT_PUBLIC_SUPABASE_URL` 기준):

```text
https://thrdlhgnknrqptzzgclo.supabase.co/auth/v1/callback
```

**넣지 말 것**

- `http://localhost:3000/auth/callback`
- `https://jinim.kr/auth/callback`

흐름: Google → Supabase Auth callback → 앱 `redirectTo`(`/auth/callback`).

### Google Cloud — Authorized JavaScript origins

```text
http://localhost:3000
https://jinim.kr
https://www.jinim.kr
```

### Supabase Dashboard — Redirect URLs (allowlist)

여기에는 **앱 callback / Site URL**을 등록한다.

로컬:

```text
http://localhost:3000/auth/callback
http://localhost:3000/**
```

프로덕션:

```text
https://jinim.kr/auth/callback
https://jinim.kr/**
https://www.jinim.kr/auth/callback
https://www.jinim.kr/**
```

Site URL 예: `https://jinim.kr`

앱은 `signInWithOAuth`의 `redirectTo`로  
`${origin}/auth/callback?next=/me` 형태를 쓰므로, allowlist에 앱 callback이 있어야 한다.

---

## 소셜 로그인 정책 (요약)

1. 1차 MVP: Google만
2. CTA: `Google로 소품함 만들기`
3. Kakao: 추후 검토
4. 성공 시 `profiles` upsert + 기본 소품함 `나의 소품함` (없으면 생성, 있으면 재사용)
5. 1차 검증 후 랜딩: `/me` (임시 확인 화면)

---

## DB provider default

- 신규 `schema.sql`: `provider` DEFAULT `'google'`
- 기존 DB에 DEFAULT `'kakao'`가 남아 있을 때만 `docs/database/alter-provider-google.sql` 실행
- 이미 `schema.sql`을 google 기본값으로 새로 적용했다면 alter는 불필요할 수 있음
- alter는 **DEFAULT만** 바꾸고 기존 행을 덮어쓰지 않음

---

## 외부 설정 체크리스트

### Supabase Dashboard

- [ ] Authentication > Providers > Google ON
- [ ] Google Client ID 입력
- [ ] Google Client Secret 입력
- [ ] Site URL: `https://jinim.kr`
- [ ] Redirect URLs에 로컬 앱 callback 추가
- [ ] Redirect URLs에 프로덕션 앱 callback 추가

### Google Cloud Console

- [ ] OAuth Client 생성 (Web application)
- [ ] Authorized JavaScript origins
  - [ ] `http://localhost:3000`
  - [ ] `https://jinim.kr`
  - [ ] 필요 시 `https://www.jinim.kr`
- [ ] Authorized redirect URI
  - [ ] `https://[SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback`

---

## 로컬 E2E

- [ ] `npm run dev`
- [ ] `/login` 접속
- [ ] Google 로그인 클릭
- [ ] Google 계정 선택
- [ ] `/auth/callback` 경유
- [ ] `/me` 도착
- [ ] Supabase `auth.users` 생성 확인
- [ ] `profiles` row 생성 확인 (`provider = google`)
- [ ] `collections` row 생성 확인 (`title = 나의 소품함`)
- [ ] 같은 계정 재로그인 시 collection 중복 없음

## 배포 E2E

- [ ] Vercel 배포
- [ ] `https://jinim.kr/login`
- [ ] Google 로그인 → 앱 복귀 → `/me`
- [ ] production DB row 확인
- [ ] 공개 페이지 정상: `/`, `/new`, `/c/[shareSlug]`

---

## 다음 단계 (이번 범위 밖)

```text
게스트가 만든 첫 지님 카드를 Google 로그인 후 내 소품함에 보관하는 귀속 플로우 구현
```

구현하지 않는 것: `/u/[slug]` 공개 소품함, 회원 카드 CRUD, 실 AI 취향 읽기, OG image 등.
