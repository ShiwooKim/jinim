import { type NextRequest, NextResponse } from 'next/server'
import { SERVICE_PAUSED } from '@/lib/service-paused'

export async function proxy(request: NextRequest) {
  if (SERVICE_PAUSED) {
    return NextResponse.next({ request })
  }

  const { updateSession } = await import('@/lib/supabase/proxy')
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
