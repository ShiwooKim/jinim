-- profiles.provider 기본값을 google로 맞출 때 사용 (non-destructive)
--
-- 언제 실행하나
-- - 이미 schema.sql을 새로 적용한 DB라면 이 파일이 필요 없을 수 있다.
--   (schema.sql 기본값이 이미 'google')
-- - 기존 DB에 provider DEFAULT 'kakao'가 남아 있는 경우에만 실행한다.
--
-- 무엇을 하나
-- - DEFAULT만 'google'로 변경한다.
-- - 기존 행의 provider 값을 덮어쓰지 않는다. (kakao 등 과거 값을 google로
--   강제 UPDATE하지 않음)
--
-- 전제
-- - public.profiles.provider 컬럼이 존재한다.
-- - provider에 CHECK constraint가 있다면 'google'을 허용해야 한다.
--   (현재 schema.sql에는 provider CHECK가 없음)
--
-- 적용 전 (영향 범위 dry-run)
--   SELECT column_name, column_default
--   FROM information_schema.columns
--   WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'provider';
--
--   SELECT provider, count(*) FROM public.profiles GROUP BY provider;

ALTER TABLE public.profiles
  ALTER COLUMN provider SET DEFAULT 'google';
