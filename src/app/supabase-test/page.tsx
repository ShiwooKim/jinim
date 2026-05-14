import { supabase } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default async function SupabaseTestPage() {
  const { data, error } = await supabase
    .from('health_check')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)

  return (
    <main className="min-h-screen bg-[#F5F1EA] px-6 py-12 text-[#2B2926]">
      <section className="mx-auto max-w-2xl">
        <p className="mb-3 text-sm tracking-[0.3em] text-[#7A624C]">Jinim</p>

        <h1 className="text-3xl font-semibold">Supabase 연결 테스트</h1>

        <div className="mt-8 rounded-2xl border border-[#DDD2C4] bg-white/40 p-5">
          <p className="text-sm text-[#7A624C]">상태</p>

          {error ? (
            <pre className="mt-3 whitespace-pre-wrap text-sm text-red-700">
              {error.message}
            </pre>
          ) : (
            <pre className="mt-3 whitespace-pre-wrap text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </section>
    </main>
  )
}
