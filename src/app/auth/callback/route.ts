import { NextResponse } from 'next/server'
import { ensureProfileAndCollection } from '@/lib/auth/ensure-profile-and-collection'
import { getSafeNext } from '@/lib/auth/safe-next'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const safeNext = getSafeNext(searchParams.get('next'), '/me')

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error: bootstrapError } = await ensureProfileAndCollection(
          supabase,
          user,
        )
        if (bootstrapError) {
          console.error('ensureProfileAndCollection failed:', bootstrapError)
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      const baseUrl =
        !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin

      return NextResponse.redirect(`${baseUrl}${safeNext}`)
    }

    console.error('exchangeCodeForSession failed:', exchangeError)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
