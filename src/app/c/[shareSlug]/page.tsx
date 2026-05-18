import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const BUCKET = 'jinim-card-images'
const SIGNED_URL_TTL_SEC = 60 * 60

type PageProps = {
  params: Promise<{ shareSlug: string }>
}

type JinimCard = {
  id: string
  object_name: string
  object_nickname: string | null
  category: string
  image_path: string | null
  title: string
  role_text: string | null
  reason_text: string | null
  value_text: string | null
  tags: string[] | null
}

type CardAnswer = {
  question_text: string
  answer_text: string
  sort_order: number
}

type TasteReport = {
  summary: string
  keywords: string[] | null
  selection_criteria: string | null
  suggested_items: { items?: string[] } | string[] | null
}

function parseSuggestedItems(value: TasteReport['suggested_items']): string[] {
  if (value == null) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'object' && Array.isArray(value.items)) {
    return value.items
  }
  return []
}

async function getSignedImageUrl(imagePath: string | null): Promise<string | null> {
  if (!imagePath) return null

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(imagePath, SIGNED_URL_TTL_SEC)

  if (error || !data?.signedUrl) {
    console.error('Card image signed URL failed:', error?.message ?? 'no url')
    return null
  }

  return data.signedUrl
}

async function getSharedCard(shareSlug: string) {
  const { data: card, error: cardError } = await supabaseAdmin
    .from('jinim_cards')
    .select(
      'id, object_name, object_nickname, category, image_path, title, role_text, reason_text, value_text, tags',
    )
    .eq('share_slug', shareSlug)
    .eq('status', 'published')
    .in('visibility', ['public', 'link_only'])
    .maybeSingle()

  if (cardError || !card) {
    return null
  }

  const typedCard = card as JinimCard

  const [{ data: answers, error: answersError }, { data: tasteReport, error: reportError }] =
    await Promise.all([
      supabaseAdmin
        .from('card_answers')
        .select('question_text, answer_text, sort_order')
        .eq('card_id', typedCard.id)
        .order('sort_order', { ascending: true }),
      supabaseAdmin
        .from('taste_reports')
        .select('summary, keywords, selection_criteria, suggested_items')
        .eq('card_id', typedCard.id)
        .maybeSingle(),
    ])

  if (answersError) {
    console.error('card_answers fetch failed:', answersError.message)
  }
  if (reportError) {
    console.error('taste_reports fetch failed:', reportError.message)
  }

  const imageUrl = await getSignedImageUrl(typedCard.image_path)

  return {
    card: typedCard,
    answers: (answers ?? []) as CardAnswer[],
    tasteReport: (tasteReport as TasteReport | null) ?? null,
    imageUrl,
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { shareSlug } = await params
  const result = await getSharedCard(shareSlug)

  if (!result) {
    return { title: '지님 카드를 찾을 수 없습니다' }
  }

  return {
    title: `${result.card.object_name} — 지님 카드`,
    description: result.card.title,
  }
}

export default async function SharedCardPage({ params }: PageProps) {
  const { shareSlug } = await params
  const result = await getSharedCard(shareSlug)

  if (!result) {
    notFound()
  }

  const { card, answers, tasteReport, imageUrl } = result
  const tags = card.tags?.filter(Boolean) ?? []
  const suggestedItems = parseSuggestedItems(tasteReport?.suggested_items ?? null)
  const keywords = tasteReport?.keywords?.filter(Boolean) ?? []

  return (
    <div className="min-h-full bg-[#F5F1EA] text-[#2B2926]">
      <header className="border-b border-[#DDD2C4]/80 bg-[#F5F1EA]/95">
        <div className="mx-auto flex h-14 max-w-[56rem] items-center px-5 sm:h-16 sm:px-6">
          <Link
            href="/"
            className="relative block h-8 w-[7.5rem] shrink-0 opacity-95 transition-opacity hover:opacity-100"
            aria-label="지님 홈"
          >
            <Image
              src="/jinim-logo.png"
              alt="지님"
              fill
              className="object-contain object-left"
              sizes="120px"
              priority
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[56rem] px-5 py-10 sm:px-6 sm:py-14">
        <article className="overflow-hidden rounded-3xl border border-[#DDD2C4] bg-white/50 shadow-[0_8px_28px_-14px_rgba(43,41,38,0.1)]">
          {imageUrl ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-[#DDD2C4]/80 bg-[#F5F1EA]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={card.object_name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center border-b border-[#DDD2C4]/80 bg-[#DDD2C4]/25 text-sm text-[#7A624C]/80">
              이미지 없음
            </div>
          )}

          <div className="space-y-5 p-6 sm:p-8">
            <span className="inline-block rounded-full border border-[#DDD2C4] bg-[#F5F1EA] px-3 py-1 text-xs font-medium text-[#7A624C]">
              {card.category}
            </span>

            <header className="space-y-3">
              <h1 className="font-serif text-xl font-semibold leading-snug text-[#4A3B30] sm:text-2xl">
                {card.title}
              </h1>
              <p className="text-lg font-medium text-[#2B2926]">
                {card.object_name}
                {card.object_nickname ? (
                  <span className="ml-2 text-base font-normal text-[#7A624C]">
                    · {card.object_nickname}
                  </span>
                ) : null}
              </p>
            </header>

            {card.role_text ? (
              <div>
                <h2 className="text-xs font-semibold tracking-wide text-[#7A624C]">역할</h2>
                <p className="mt-1 text-sm leading-relaxed">{card.role_text}</p>
              </div>
            ) : null}

            {card.reason_text ? (
              <div>
                <h2 className="text-xs font-semibold tracking-wide text-[#7A624C]">
                  지님은 이유
                </h2>
                <p className="mt-1 text-sm leading-relaxed">{card.reason_text}</p>
              </div>
            ) : null}

            {card.value_text ? (
              <div>
                <h2 className="text-xs font-semibold tracking-wide text-[#7A624C]">
                  지님의 가치
                </h2>
                <p className="mt-1 text-sm leading-relaxed">{card.value_text}</p>
              </div>
            ) : null}

            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#DDD2C4] bg-white/80 px-3 py-1 text-xs text-[#4A3B30]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </article>

        {answers.length > 0 ? (
          <section className="mt-8 space-y-4">
            <h2 className="font-serif text-lg font-semibold text-[#4A3B30]">
              이 물건에 담긴 이야기
            </h2>
            <ul className="space-y-3">
              {answers.map((answer) => (
                <li
                  key={`${answer.sort_order}-${answer.question_text}`}
                  className="rounded-2xl border border-[#DDD2C4] bg-white/50 p-4 shadow-[0_4px_16px_-10px_rgba(43,41,38,0.08)] sm:p-5"
                >
                  <p className="text-xs font-medium text-[#7A624C]">{answer.question_text}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#2B2926]/95">
                    {answer.answer_text}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tasteReport ? (
          <section className="mt-8 space-y-4 rounded-3xl border border-[#7A624C]/20 bg-[#7A624C]/5 p-6 sm:p-7">
            <h2 className="font-serif text-lg font-semibold text-[#4A3B30]">
              이 물건이 보여주는 취향
            </h2>
            <p className="text-sm leading-relaxed text-[#2B2926]/95">{tasteReport.summary}</p>
            {keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-[#7A624C]/15 px-3 py-1 text-xs font-medium text-[#4A3B30]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}
            {tasteReport.selection_criteria ? (
              <div>
                <h3 className="text-xs font-semibold text-[#7A624C]">선택 기준</h3>
                <p className="mt-1 text-sm leading-relaxed">{tasteReport.selection_criteria}</p>
              </div>
            ) : null}
            {suggestedItems.length > 0 ? (
              <div>
                <h3 className="text-xs font-semibold text-[#7A624C]">비슷한 취향의 물건</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[#2B2926]/90">
                  {suggestedItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="mt-10 rounded-3xl border border-[#DDD2C4] bg-white/60 p-6 text-center shadow-[0_4px_20px_-12px_rgba(43,41,38,0.08)] sm:p-8">
          <h2 className="font-serif text-lg font-semibold text-[#4A3B30]">
            이 카드를 내 소품함에 보관하시겠어요?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#2B2926]/80">
            소품함을 만들면 지님 카드를 다시 보고, 더 많은 물건을 기록할 수 있습니다.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#7A624C] bg-[#7A624C] px-6 py-3 text-sm font-medium text-[#F5F1EA] transition hover:bg-[#4A3B30] hover:border-[#4A3B30]"
          >
            카카오로 소품함 만들기
          </Link>
        </section>
      </main>
    </div>
  )
}
