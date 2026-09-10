import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const AUTH_PROVIDER = 'google' as const

function nicknameFromUser(user: User): string | null {
  const meta = user.user_metadata ?? {}
  const name =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    null
  return name
}

function avatarFromUser(user: User): string | null {
  const meta = user.user_metadata ?? {}
  const url =
    (typeof meta.avatar_url === 'string' && meta.avatar_url) ||
    (typeof meta.picture === 'string' && meta.picture) ||
    null
  return url
}

function defaultCollectionSlug(userId: string, attempt = 0): string {
  const compact = userId.replace(/-/g, '')
  if (attempt === 0) {
    return `u-${compact.slice(0, 12)}`
  }
  return `u-${compact.slice(0, 12)}-${attempt}`
}

/**
 * Google OAuth 성공 후 profile upsert + 기본 소품함 1개 보장.
 * collections는 사용자당 이미 있으면 재사용(idempotent).
 * service role 없이 로그인 세션(RLS)으로만 수행한다.
 */
export async function ensureProfileAndCollection(
  supabase: SupabaseClient,
  user: User,
): Promise<{ collectionSlug: string | null; error: string | null }> {
  const now = new Date().toISOString()

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? null,
      nickname: nicknameFromUser(user),
      avatar_url: avatarFromUser(user),
      provider: AUTH_PROVIDER,
      updated_at: now,
    },
    { onConflict: 'id' },
  )

  if (profileError) {
    return { collectionSlug: null, error: profileError.message }
  }

  const { data: existing, error: selectError } = await supabase
    .from('collections')
    .select('id, slug')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (selectError) {
    return { collectionSlug: null, error: selectError.message }
  }

  if (existing?.slug) {
    return { collectionSlug: existing.slug, error: null }
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = defaultCollectionSlug(user.id, attempt)
    const { data: created, error: insertError } = await supabase
      .from('collections')
      .insert({
        user_id: user.id,
        slug,
        title: '나의 소품함',
        visibility: 'private',
      })
      .select('slug')
      .single()

    if (!insertError) {
      return { collectionSlug: created?.slug ?? slug, error: null }
    }

    // 동시 로그인 등으로 이미 생겼을 수 있음 → 재조회
    const { data: raced } = await supabase
      .from('collections')
      .select('id, slug')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (raced?.slug) {
      return { collectionSlug: raced.slug, error: null }
    }

    // slug unique 충돌이면 다음 attempt로 재시도, 그 외는 실패
    const isUniqueViolation =
      insertError.code === '23505' ||
      /duplicate|unique/i.test(insertError.message)

    if (!isUniqueViolation) {
      return { collectionSlug: null, error: insertError.message }
    }
  }

  return { collectionSlug: null, error: 'Failed to create default collection' }
}

export { AUTH_PROVIDER }
