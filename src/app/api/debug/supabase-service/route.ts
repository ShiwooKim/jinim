import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * 임시: SUPABASE_SERVICE_ROLE_KEY 로딩 및 DB 연결 확인용.
 * 테스트 후 이 파일(route)을 삭제할 것.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const hasUrl = Boolean(supabaseUrl?.trim())
  const hasAnonKey = Boolean(anonKey?.trim())
  const hasServiceRoleKey = Boolean(serviceRoleKey?.trim())

  let serviceClientReady = false
  let healthCheckOk = false

  try {
    if (hasUrl && hasServiceRoleKey && supabaseUrl && serviceRoleKey) {
      const client = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
      serviceClientReady = true

      const { error } = await client.from('health_check').select('*').limit(1)
      healthCheckOk = !error
    }
  } catch {
    serviceClientReady = false
    healthCheckOk = false
  }

  return NextResponse.json({
    hasUrl,
    hasAnonKey,
    hasServiceRoleKey,
    serviceClientReady,
    healthCheckOk,
  })
}
