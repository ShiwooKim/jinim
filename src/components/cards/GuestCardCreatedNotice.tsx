import Link from 'next/link'

type GuestCardCreatedNoticeProps = {
  cardUrl: string
}

export function GuestCardCreatedNotice({ cardUrl }: GuestCardCreatedNoticeProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-[#DDD2C4] bg-white/50 p-6 text-center shadow-[0_8px_28px_-14px_rgba(43,41,38,0.1)] sm:p-8">
      <header className="space-y-3">
        <h2 className="font-serif text-xl font-semibold text-[#4A3B30] sm:text-2xl">
          이미 첫 지님 카드를 만들었어요.
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-[#2B2926]/85">
          게스트 상태에서는 지님 카드 1장을 만들 수 있습니다.
          <br />
          카드를 소품함에 보관하거나 새로운 지님을 더 기록하려면 소품함을 만들어주세요.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={cardUrl}
          className="inline-flex items-center justify-center rounded-2xl border border-[#7A624C] bg-[#7A624C] px-6 py-3 text-sm font-medium text-[#F5F1EA] transition hover:bg-[#4A3B30] hover:border-[#4A3B30]"
        >
          내 지님 카드 다시 보기
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-2xl border border-[#DDD2C4] bg-white/80 px-6 py-3 text-sm font-medium text-[#4A3B30] transition hover:border-[#7A624C]/50 hover:bg-[#F5F1EA]"
        >
          카카오로 소품함 만들기
        </Link>
      </div>
    </section>
  )
}
