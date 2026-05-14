-- 지님 MVP — Supabase SQL Editor용 스키마 (테이블 생성만, RLS 없음)
-- 실행 순서: FK 의존성에 맞춰 아래 순서대로 정의됨.
-- 기존 health_check 등 다른 테이블은 변경하지 않음.
-- gen_random_uuid() 사용을 위해 pgcrypto 확장(미설치 시에만 생성).
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. profiles — Supabase Auth 사용자와 1:1
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text,
  email text,
  provider text DEFAULT 'kakao',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. collections — 로그인 사용자 소품함
-- ---------------------------------------------------------------------------
CREATE TABLE public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '나의 소품함',
  description text,
  visibility text NOT NULL DEFAULT 'private',
  max_card_count int NOT NULL DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT collections_visibility_check CHECK (
    visibility IN ('public', 'private', 'link_only')
  )
);

-- ---------------------------------------------------------------------------
-- 3. jinim_cards — 지님 카드 (게스트: user_id/collection_id nullable)
-- ---------------------------------------------------------------------------
CREATE TABLE public.jinim_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  collection_id uuid REFERENCES public.collections(id) ON DELETE SET NULL,
  guest_token text,
  share_slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'published',
  visibility text NOT NULL DEFAULT 'link_only',
  category text NOT NULL,
  object_name text NOT NULL,
  object_nickname text,
  image_path text,
  image_url text,
  title text NOT NULL,
  role_text text,
  reason_text text,
  value_text text,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  taste_summary text,
  is_guest_created boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT jinim_cards_status_check CHECK (
    status IN ('draft', 'published', 'archived')
  ),
  CONSTRAINT jinim_cards_visibility_check CHECK (
    visibility IN ('public', 'private', 'link_only')
  )
);

-- ---------------------------------------------------------------------------
-- 4. card_answers — 카드 질문/답변
-- ---------------------------------------------------------------------------
CREATE TABLE public.card_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.jinim_cards(id) ON DELETE CASCADE,
  question_key text NOT NULL,
  question_text text NOT NULL,
  answer_text text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 5. taste_reports — 취향 읽기 / 소품함 취향 리포트
-- ---------------------------------------------------------------------------
CREATE TABLE public.taste_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE,
  card_id uuid REFERENCES public.jinim_cards(id) ON DELETE CASCADE,
  guest_token text,
  scope text NOT NULL,
  summary text NOT NULL,
  keywords text[] NOT NULL DEFAULT '{}'::text[],
  selection_criteria text,
  mood_text text,
  suggested_items jsonb,
  source_card_ids uuid[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT taste_reports_scope_check CHECK (
    scope IN ('guest_single', 'card_single', 'collection')
  )
);
