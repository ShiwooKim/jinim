'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSafeNext } from '@/lib/auth/safe-next'

type GoogleLoginButtonProps = {
  nextPath?: string
}

export function GoogleLoginButton({ nextPath = '/me' }: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)

    const safeNext = getSafeNext(nextPath, '/me')
    const supabase = createClient()
    const redirectTo = new URL('/auth/callback', window.location.origin)
    redirectTo.searchParams.set('next', safeNext)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo.toString(),
      },
    })

    if (oauthError) {
      console.error('Google OAuth sign-in failed:', oauthError)
      setError(oauthError.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#7A624C] bg-[#7A624C] px-6 py-3 text-sm font-medium text-[#F5F1EA] transition hover:border-[#4A3B30] hover:bg-[#4A3B30] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Google로 이동 중…' : 'Google로 소품함 만들기'}
      </button>
      {error ? (
        <p className="text-center text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
