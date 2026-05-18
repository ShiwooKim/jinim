import Link from 'next/link'

export default function CardNotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-jinim-ivory px-5 py-16 text-center text-jinim-text">
      <h1 className="font-serif text-xl font-semibold text-jinim-deep">
        지님 카드를 찾을 수 없습니다
      </h1>
      <p className="mt-3 max-w-sm text-sm text-jinim-text/80">
        공유 링크가 올바른지 확인해 주세요. 비공개이거나 삭제된 카드일 수 있습니다.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-2xl border border-jinim-subtle bg-white/60 px-6 py-3 text-sm font-medium text-jinim-primary transition hover:border-jinim-primary/40"
      >
        지님 홈으로
      </Link>
    </div>
  )
}
