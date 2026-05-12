import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-jinim-subtle/60 bg-jinim-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[72rem] items-center px-5 sm:h-16 sm:px-6">
        <Link
          href="#hero"
          className="relative block h-8 w-[7.5rem] shrink-0 opacity-95 transition-opacity hover:opacity-100 sm:h-9 sm:w-[8.5rem] -ml-1.5"
          aria-label="지님 홈"
        >
          <Image
            src="/jinim-logo.png"
            alt="지님"
            fill
            className="object-contain object-left"
            sizes="(max-width: 640px) 120px, 140px"
            priority
          />
        </Link>
        <Link
          href="#open-news"
          className="ml-auto text-xs font-medium tracking-wide text-jinim-primary underline-offset-4 transition hover:text-jinim-deep hover:underline"
        >
          오픈 소식
        </Link>
      </div>
    </header>
  );
}
