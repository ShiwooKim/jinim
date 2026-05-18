import Image from 'next/image'
import Link from 'next/link'
import { GuestCardForm } from '@/components/cards/GuestCardForm'

export default function NewCardPage() {
  return (
    <div className="min-h-full bg-[#F5F1EA] text-[#2B2926]">
      <header className="border-b border-[#DDD2C4]/80 bg-[#F5F1EA]/95">
        <div className="mx-auto flex h-14 max-w-[52rem] items-center px-5 sm:h-16 sm:px-6">
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

      <main className="mx-auto max-w-[52rem] px-5 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 space-y-3 text-center sm:mb-10">
          <p className="text-xs font-medium tracking-wide text-[#7A624C]">나의 첫 지님</p>
          <h1 className="font-serif text-2xl font-semibold leading-snug text-[#4A3B30] sm:text-3xl">
            오래 지닌 물건 하나를 기록해보세요.
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-[#2B2926]/85">
            사진 한 장과 짧은 답변으로,
            <br className="sm:hidden" />
            나만의 지님 카드가 만들어집니다.
          </p>
          <p className="text-xs text-[#7A624C]/90">
            비싸지 않아도 좋습니다. 오래 지닌 이유가 있다면 충분합니다.
          </p>
        </header>

        <GuestCardForm />
      </main>
    </div>
  )
}
