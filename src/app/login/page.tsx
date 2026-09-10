import Link from 'next/link'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { getSafeNext } from '@/lib/auth/safe-next'

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const nextPath = getSafeNext(params.next, '/me')
  const showAuthError = params.error === 'auth'

  return (
    <main className="min-h-screen bg-[#F5F1EA] px-6 py-12 text-[#2B2926]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-10">
        <header className="space-y-4 text-center">
          <Link
            href="/"
            className="inline-block font-serif text-2xl font-semibold tracking-tight text-[#4A3B30]"
          >
            지님
          </Link>
          <h1 className="font-serif text-2xl font-semibold text-[#4A3B30] sm:text-3xl">
            Google로 소품함 만들기
          </h1>
          <p className="text-sm leading-relaxed text-[#2B2926]/80">
            Google 계정으로 간편하게 시작하면, 나만의 소품함을 만들고 지님
            카드를 보관할 수 있습니다.
          </p>
        </header>

        <section className="rounded-3xl border border-[#DDD2C4] bg-white/50 p-6 shadow-[0_8px_28px_-14px_rgba(43,41,38,0.1)] sm:p-8">
          {showAuthError ? (
            <p className="mb-4 text-center text-sm text-red-700" role="alert">
              로그인에 실패했습니다. 다시 시도해 주세요.
            </p>
          ) : null}
          <GoogleLoginButton nextPath={nextPath} />
        </section>

        <p className="text-center text-xs text-[#7A624C]">
          로그인하면 서비스 이용에 동의한 것으로 간주됩니다.
        </p>
      </div>
    </main>
  )
}
