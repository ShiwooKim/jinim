좋아. 지금 확정한 MVP 정책 기준이면 DB는 **너무 복잡하게 가지 말고**, 아래 원칙으로 잡는 게 좋아.

> 게스트도 카드는 만들 수 있다.
> 회원은 소품함을 가진다.
> 게스트 카드도 가입 후 회원 소품함으로 이전될 수 있다.
> 카드는 공유 URL을 가진다.
> 취향 읽기는 카드 1장 또는 소품함 단위로 저장한다.

아래는 **지님 MVP DB 스키마 초안**이야.

````markdown
# 지님 MVP DB 스키마 설계안

## 1. 설계 원칙

지님 MVP의 핵심 데이터는 다음 4가지다.

1. 사용자
2. 소품함
3. 지님 카드
4. 취향 읽기 결과

MVP에서는 커뮤니티, 좋아요, 댓글, 팔로우, 랭킹은 만들지 않는다.

따라서 DB도 아래 목적에 집중한다.

- 게스트가 지님 카드 1장을 만들 수 있다.
- 게스트 카드는 공유 URL을 가진다.
- 게스트 카드는 수정할 수 없다.
- 게스트가 가입하면 해당 카드를 내 소품함에 담을 수 있다.
- 회원은 최대 5개까지 지님 카드를 만들 수 있다.
- 회원은 자기 소품함 URL을 가진다.
- 회원은 카드 수정/삭제/공개 설정을 할 수 있다.
- 카드 1장 기준 취향 읽기와 소품함 기준 취향 리포트를 저장할 수 있다.

---

## 2. 테이블 구성

MVP 기준 테이블은 아래 5개면 충분하다.

| 테이블 | 역할 |
|---|---|
| `profiles` | 가입 사용자 프로필 |
| `collections` | 사용자별 소품함 |
| `jinim_cards` | 지님 카드 본체 |
| `card_answers` | 카드 생성 시 사용자가 입력한 질문 답변 |
| `taste_reports` | 취향 읽기/소품함 취향 리포트 결과 |

이미지 파일은 Supabase Storage에 저장하고, DB에는 URL/path만 저장한다.

---

## 3. profiles

가입한 사용자 정보를 저장한다.  
Supabase Auth의 `auth.users`와 1:1로 연결된다.

### 컬럼

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid pk | Supabase Auth user id |
| `nickname` | text | 표시 이름 |
| `email` | text | 이메일 |
| `provider` | text | `kakao` |
| `avatar_url` | text nullable | 카카오 프로필 이미지 |
| `created_at` | timestamptz | 생성일 |
| `updated_at` | timestamptz | 수정일 |

### 비고

- `id`는 `auth.users.id`를 그대로 사용한다.
- 카카오 로그인 성공 시 profile을 생성하거나 업데이트한다.
- 닉네임은 나중에 수정 가능하게 둔다.

---

## 4. collections

회원의 소품함 정보를 저장한다.  
MVP에서는 사용자 1명당 소품함 1개를 가진다.

### 컬럼

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid pk | 소품함 id |
| `user_id` | uuid fk | 소유자 |
| `slug` | text unique | 공개 URL용 slug |
| `title` | text | 소품함 제목 |
| `description` | text nullable | 소품함 설명 |
| `visibility` | text | `public`, `private`, `link_only` |
| `max_card_count` | int | MVP 기본 5 |
| `created_at` | timestamptz | 생성일 |
| `updated_at` | timestamptz | 수정일 |

### URL 구조

```text
jinim.kr/u/{slug}
````

예:

```text
jinim.kr/u/ian
```

### 비고

* 회원 가입 시 자동 생성한다.
* slug는 최초에는 랜덤 또는 닉네임 기반으로 생성한다.
* MVP에서는 `max_card_count = 5` 고정.
* 공개 소품함은 나중에 확장 가능.

---

## 5. jinim_cards

지님 카드의 핵심 테이블이다.
게스트 카드와 회원 카드를 모두 이 테이블에 저장한다.

### 컬럼

| 컬럼                 | 타입            | 설명                               |
| ------------------ | ------------- | -------------------------------- |
| `id`               | uuid pk       | 카드 id                            |
| `user_id`          | uuid nullable | 회원 카드의 소유자                       |
| `collection_id`    | uuid nullable | 소품함 id                           |
| `guest_token`      | text nullable | 게스트 카드 식별용 토큰                    |
| `share_slug`       | text unique   | 카드 공유 URL                        |
| `status`           | text          | `draft`, `published`, `archived` |
| `visibility`       | text          | `public`, `private`, `link_only` |
| `category`         | text          | 시계, 지갑, 펜 등                      |
| `object_name`      | text          | 물건 이름                            |
| `object_nickname`  | text nullable | 별명                               |
| `image_path`       | text nullable | Supabase Storage path            |
| `image_url`        | text nullable | 공개 이미지 URL 또는 signed URL         |
| `title`            | text          | 카드 제목                            |
| `role_text`        | text nullable | 역할                               |
| `reason_text`      | text nullable | 지닌 이유                            |
| `value_text`       | text nullable | 지님의 가치                           |
| `tags`             | text[]        | 태그 배열                            |
| `taste_summary`    | text nullable | 카드 1장 기반 취향 읽기 요약                |
| `is_guest_created` | boolean       | 게스트 생성 여부                        |
| `created_at`       | timestamptz   | 생성일                              |
| `updated_at`       | timestamptz   | 수정일                              |

### URL 구조

```text
jinim.kr/c/{share_slug}
```

예:

```text
jinim.kr/c/old-watch-a8f3
```

### 게스트 카드 정책

게스트 카드 생성 시:

| 값                  | 설명          |
| ------------------ | ----------- |
| `user_id`          | null        |
| `collection_id`    | null        |
| `guest_token`      | 발급          |
| `share_slug`       | 발급          |
| `is_guest_created` | true        |
| `visibility`       | `link_only` |
| `status`           | `published` |

게스트는 카드 생성 후 수정할 수 없다.
수정/소품함 저장/추가 생성 시 카카오 로그인을 유도한다.

### 회원 카드 정책

회원 카드 생성 시:

| 값                  | 설명          |
| ------------------ | ----------- |
| `user_id`          | 로그인 사용자 id  |
| `collection_id`    | 사용자의 소품함 id |
| `guest_token`      | null 가능     |
| `is_guest_created` | false       |
| `visibility`       | 사용자가 선택     |
| `status`           | `published` |

---

## 6. card_answers

사용자가 카드 생성 과정에서 입력한 원문 답변을 저장한다.

AI가 정리한 카드 문구와 사용자의 원문은 분리하는 것이 좋다.

이유:

* 사용자의 원문을 보존할 수 있음
* AI 결과를 다시 생성할 수 있음
* 나중에 질문을 개선할 수 있음
* 취향 리포트 생성 시 원문 활용 가능

### 컬럼

| 컬럼              | 타입          | 설명     |
| --------------- | ----------- | ------ |
| `id`            | uuid pk     | 답변 id  |
| `card_id`       | uuid fk     | 연결된 카드 |
| `question_key`  | text        | 질문 식별자 |
| `question_text` | text        | 질문 문구  |
| `answer_text`   | text        | 사용자 답변 |
| `sort_order`    | int         | 질문 순서  |
| `created_at`    | timestamptz | 생성일    |

### MVP 질문 3개

| question_key   | question_text           |
| -------------- | ----------------------- |
| `what_is_it`   | 이 물건은 무엇인가요?            |
| `why_keep_it`  | 왜 아직도 지니고 있나요?          |
| `why_continue` | 앞으로도 계속 지니고 싶은 이유가 있나요? |

선택 질문을 추가한다면:

| question_key | question_text           |
| ------------ | ----------------------- |
| `one_word`   | 이 물건을 한 단어로 표현하면 무엇인가요? |

---

## 7. taste_reports

취향 읽기 결과를 저장한다.

게스트 카드 1장 기반 결과와 회원 소품함 기반 결과를 모두 이 테이블에서 관리한다.

### 컬럼

| 컬럼                   | 타입              | 설명                                          |
| -------------------- | --------------- | ------------------------------------------- |
| `id`                 | uuid pk         | 리포트 id                                      |
| `user_id`            | uuid nullable   | 회원 리포트 소유자                                  |
| `collection_id`      | uuid nullable   | 소품함 리포트                                     |
| `card_id`            | uuid nullable   | 단일 카드 리포트                                   |
| `guest_token`        | text nullable   | 게스트 리포트 접근용                                 |
| `scope`              | text            | `guest_single`, `card_single`, `collection` |
| `summary`            | text            | 취향 요약                                       |
| `keywords`           | text[]          | 취향 키워드                                      |
| `selection_criteria` | text nullable   | 물건을 고르는 기준                                  |
| `mood_text`          | text nullable   | 소품함 분위기                                     |
| `suggested_items`    | jsonb nullable  | 다음에 기록해볼 물건 제안                              |
| `source_card_ids`    | uuid[] nullable | 분석에 사용된 카드 id 목록                            |
| `created_at`         | timestamptz     | 생성일                                         |
| `updated_at`         | timestamptz     | 수정일                                         |

### scope 정의

| scope          | 설명                  |
| -------------- | ------------------- |
| `guest_single` | 게스트 카드 1장 기반 취향 읽기  |
| `card_single`  | 회원 카드 1장 기반 취향 읽기   |
| `collection`   | 회원 소품함 전체 기반 취향 리포트 |

### 게스트 취향 읽기

게스트 카드 생성 후 1회 생성.

예시 데이터:

```json
{
  "summary": "당신은 오래 쓰는 물건에서 안정감과 기준점을 찾는 편입니다.",
  "keywords": ["단정함", "실용성", "오래감"],
  "selection_criteria": "매일 곁에 두어도 질리지 않는 물건을 선호합니다.",
  "suggested_items": [
    "오래 쓰는 지갑",
    "손에 익은 펜",
    "자주 들고 다니는 가방"
  ]
}
```

---

## 8. Storage 구조

Supabase Storage에는 이미지 파일을 저장한다.

### bucket

```text
jinim-card-images
```

### path 예시

게스트:

```text
guest/{guest_token}/{card_id}.jpg
```

회원:

```text
users/{user_id}/cards/{card_id}.jpg
```

### 비고

* MVP에서는 업로드 이미지를 공개 URL로 둘지, signed URL로 둘지 결정 필요.
* 카드 공유가 핵심이므로 `link_only` 카드 이미지는 접근 가능해야 한다.
* 비공개 카드 이미지는 나중에 RLS/Storage policy를 더 엄격히 잡는다.
* MVP에서는 우선 단순하게 가되, 공개 범위 정책은 코드 레벨에서 명확히 둔다.

---

## 9. 공개/비공개 정책

### visibility 값

| 값           | 설명                |
| ----------- | ----------------- |
| `public`    | 누구나 볼 수 있음        |
| `link_only` | 링크를 아는 사람만 볼 수 있음 |
| `private`   | 소유자만 볼 수 있음       |

### MVP 기본값

| 상황     | 기본값                        |
| ------ | -------------------------- |
| 게스트 카드 | `link_only`                |
| 회원 카드  | `private` 또는 사용자가 선택       |
| 회원 소품함 | `private` 기본               |
| 공유 시   | `link_only` 또는 `public` 선택 |

MVP에서는 너무 복잡하게 하지 않으려면:

* 게스트 카드는 무조건 `link_only`
* 회원 카드는 기본 `private`
* 사용자가 공유하면 `link_only`

이렇게 가는 것이 안전하다.

---

## 10. 게스트 → 회원 전환 처리

게스트가 카드를 만든 뒤 카카오 로그인하면, 해당 카드를 회원 소품함에 담을 수 있어야 한다.

### 처리 흐름

```text
1. 게스트 카드 생성
2. guest_token을 브라우저 localStorage 또는 쿠키에 저장
3. 사용자가 “소품함에 담기” 클릭
4. 카카오 로그인
5. 로그인 후 guest_token으로 기존 카드 조회
6. 해당 카드의 user_id, collection_id 업데이트
7. is_guest_created = false 처리
8. guest_token은 null 처리하거나 보관
```

### 주의

게스트 카드를 회원에게 귀속시킬 때는 반드시 현재 브라우저가 가진 `guest_token`을 확인해야 한다.

---

## 11. MVP SQL 초안

아래 SQL은 초기 설계용 초안이다.
실제 적용 전에 한 번 더 검토하고 실행하면 된다.

```sql
-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  email text,
  provider text default 'kakao',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- collections
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  title text not null default '나의 소품함',
  description text,
  visibility text not null default 'private',
  max_card_count int not null default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint collections_visibility_check
    check (visibility in ('public', 'private', 'link_only'))
);

-- jinim_cards
create table if not exists public.jinim_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  guest_token text,
  share_slug text not null unique,
  status text not null default 'published',
  visibility text not null default 'link_only',
  category text not null,
  object_name text not null,
  object_nickname text,
  image_path text,
  image_url text,
  title text not null,
  role_text text,
  reason_text,
  value_text,
  tags text[] default '{}',
  taste_summary text,
  is_guest_created boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint jinim_cards_status_check
    check (status in ('draft', 'published', 'archived')),

  constraint jinim_cards_visibility_check
    check (visibility in ('public', 'private', 'link_only'))
);

-- card_answers
create table if not exists public.card_answers (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.jinim_cards(id) on delete cascade,
  question_key text not null,
  question_text text not null,
  answer_text text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- taste_reports
create table if not exists public.taste_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  collection_id uuid references public.collections(id) on delete cascade,
  card_id uuid references public.jinim_cards(id) on delete cascade,
  guest_token text,
  scope text not null,
  summary text not null,
  keywords text[] default '{}',
  selection_criteria text,
  mood_text text,
  suggested_items jsonb,
  source_card_ids uuid[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint taste_reports_scope_check
    check (scope in ('guest_single', 'card_single', 'collection'))
);
```

---

## 12. MVP에서 당장 필요한 RLS 방향

RLS는 실제 구현 전에 꼭 정리해야 한다.
초안은 아래 방향으로 잡는다.

### profiles

| 작업     | 정책  |
| ------ | --- |
| select | 본인만 |
| insert | 본인만 |
| update | 본인만 |

### collections

| 작업     | 정책                                    |
| ------ | ------------------------------------- |
| select | public/link_only는 조회 가능, private는 본인만 |
| insert | 로그인 사용자 본인만                           |
| update | 소유자만                                  |
| delete | 소유자만                                  |

### jinim_cards

| 작업     | 정책                                     |
| ------ | -------------------------------------- |
| select | public/link_only는 조회 가능, private는 소유자만 |
| insert | 게스트 또는 로그인 사용자 가능                      |
| update | 로그인 소유자만                               |
| delete | 로그인 소유자만                               |

게스트는 insert는 가능하지만 update/delete는 불가.

### card_answers

| 작업     | 정책               |
| ------ | ---------------- |
| select | 연결된 카드 조회 권한을 따름 |
| insert | 카드 생성 시 가능       |
| update | 소유자만             |
| delete | 소유자만             |

### taste_reports

| 작업     | 정책                |
| ------ | ----------------- |
| select | 연결된 카드/소품함 권한을 따름 |
| insert | 게스트 또는 로그인 사용자 가능 |
| update | 소유자만              |
| delete | 소유자만              |

---

## 13. 추천 개발 순서

DB 작업은 아래 순서로 가는 게 좋다.

```text
1. 테이블 생성
2. RLS는 우선 최소 정책으로 시작
3. Storage bucket 생성
4. 게스트 카드 생성 API 구현
5. 카드 공유 페이지 구현
6. 카카오 로그인 구현
7. 게스트 카드 → 회원 소품함 귀속 구현
8. 회원 소품함 페이지 구현
9. 회원 카드 추가/수정/삭제 구현
10. 취향 읽기/리포트 저장 구현
```

---

## 14. 최종 구조 요약

```text
profiles
└── collections
    └── jinim_cards
        ├── card_answers
        └── taste_reports

guest
└── jinim_cards
    ├── card_answers
    └── taste_reports
```

회원은 `profiles → collections → jinim_cards` 흐름이고,
게스트는 `guest_token → jinim_cards` 흐름으로 관리한다.

---

## 15. 핵심 판단

이 스키마의 핵심은 `jinim_cards`가 게스트와 회원 카드를 모두 품는 구조다.

이렇게 하면:

* 게스트 카드 생성이 쉽고
* 공유 URL 발급이 가능하며
* 가입 후 소품함으로 이전할 수 있고
* 회원 카드와 같은 구조로 관리할 수 있다.

즉, MVP 정책과 잘 맞는 구조다.

```
```
