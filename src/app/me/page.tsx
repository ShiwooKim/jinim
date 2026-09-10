import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function MePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/me')
  }

  const [{ data: profile }, { data: collection }] = await Promise.all([
    supabase
      .from('profiles')
      .select('nickname, email, provider, avatar_url')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('collections')
      .select('title, slug')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  const displayName =
    profile?.nickname || user.user_metadata?.full_name || user.email || '회원'
  const email = profile?.email || user.email || '—'
  const provider = profile?.provider || 'google'
  const collectionTitle = collection?.title || '나의 소품함'
  const collectionSlug = collection?.slug || '(아직 없음)'

  return (
    <main className="min-h-screen bg-[#F5F1EA] px-6 py-12 text-[#2B2926]">
      <div className="mx-auto w-full max-w-lg space-y-8">
        <header className="space-y-3 text-center">
          <Link
            href="/"
            className="inline-block font-serif text-2xl font-semibold tracking-tight text-[#4A3B30]"
          >
            지님
          </Link>
          <h1 className="font-serif text-2xl font-semibold text-[#4A3B30] sm:text-3xl">
            나의 소품함
          </h1>
          <p className="text-sm text-[#2B2926]/75">
            Google 로그인 확인용 임시 화면입니다.
          </p>
        </header>

        <section className="space-y-4 rounded-3xl border border-[#DDD2C4] bg-white/50 p-6 shadow-[0_8px_28px_-14px_rgba(43,41,38,0.1)] sm:p-8">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-[#DDD2C4]/80 pb-3">
              <dt className="text-[#7A624C]">계정</dt>
              <dd className="text-right font-medium text-[#4A3B30]">
                {displayName}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[#DDD2C4]/80 pb-3">
              <dt className="text-[#7A624C]">이메일</dt>
              <dd className="text-right text-[#2B2926]">{email}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[#DDD2C4]/80 pb-3">
              <dt className="text-[#7A624C]">로그인 방식</dt>
              <dd className="text-right text-[#2B2926]">{provider}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[#DDD2C4]/80 pb-3">
              <dt className="text-[#7A624C]">소품함 이름</dt>
              <dd className="text-right font-medium text-[#4A3B30]">
                {collectionTitle}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#7A624C]">소품함 slug</dt>
              <dd className="text-right font-mono text-xs text-[#2B2926] sm:text-sm">
                {collectionSlug}
              </dd>
            </div>
          </dl>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/new"
            className="inline-flex items-center justify-center rounded-2xl border border-[#7A624C] bg-[#7A624C] px-6 py-3 text-sm font-medium text-[#F5F1EA] transition hover:border-[#4A3B30] hover:bg-[#4A3B30]"
          >
            지님 추가하기
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-[#DDD2C4] bg-white/80 px-6 py-3 text-sm font-medium text-[#4A3B30] transition hover:border-[#7A624C]/50 hover:bg-[#F5F1EA]"
          >
            홈으로
          </Link>
        </div>
      </div>
    </main>
  )
}
