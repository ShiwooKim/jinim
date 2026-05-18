import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const BUCKET = 'jinim-card-images'
const SIGNED_URL_TTL_SEC = 3600

function isAllowedImagePath(path: string): boolean {
  if (path.includes('..') || path.startsWith('/')) return false
  return path.startsWith('guest/') || path.startsWith('users/')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')?.trim()

  if (!path) {
    return NextResponse.json({ ok: false, error: 'path is required' }, { status: 400 })
  }

  if (!isAllowedImagePath(path)) {
    return NextResponse.json({ ok: false, error: 'Invalid path' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SEC)

  if (error || !data?.signedUrl) {
    console.error('Signed URL creation failed:', error?.message ?? 'no url')
    return NextResponse.json(
      { ok: false, error: 'Failed to create signed URL' },
      { status: 404 },
    )
  }

  return NextResponse.json({ ok: true, url: data.signedUrl })
}
