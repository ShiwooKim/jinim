import Image from "next/image";
import {
  CtaOpenNews,
  OpenNewsSubmitButton,
} from "@/components/brand/CtaOpenNews";

const pageMax = "mx-auto w-full max-w-[72rem]";

/** warm minimal: border #DDD2C4, soft radius, very light shadow */
function ImageFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[22px] border border-[#DDD2C4] bg-jinim-ivory shadow-[0_6px_24px_-10px_rgba(43,41,38,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-10px_rgba(43,41,38,0.16)] ${className}`.trim()}
    >
      {children}
    </div>
  );
}

const differenceRows = [
  { old: "이 물건은 얼마인가요?", jinim: "나에게 어떤 의미인가요?" },
  { old: "어떤 브랜드인가요?", jinim: "왜 이 물건을 선택했나요?" },
  { old: "새로 산 물건인가요?", jinim: "앞으로도 계속 지니고 싶은가요?" },
] as const;

const experienceSteps = [
  "오래 지닌 물건을 고릅니다.",
  "그 물건에 담긴 이야기를 남깁니다.",
  "나만의 지님 카드가 만들어집니다.",
  "소품함에 기록이 쌓입니다.",
] as const;

const values = [
  { title: "소유보다 의미", line: "무엇을 가졌는가보다, 왜 지니고 있는지를 봅니다." },
  { title: "자랑보다 이야기", line: "보여주기보다, 그 물건에 얽힌 시간을 기록합니다." },
  { title: "구매보다 발견", line: "더 사기보다, 나다운 물건을 발견합니다." },
  { title: "컬렉션보다 태도", line: "많이 갖는 것보다, 어떻게 고르고 지니는지를 봅니다." },
  { title: "생성보다 지녀온 시간", line: "만들어낸 것보다, 실제로 살아온 시간을 소중히 여깁니다." },
] as const;

const moreQuestions = [
  "왜 이 물건을 선택했나요?",
  "왜 아직도 지니고 있나요?",
  "앞으로도 계속 지니고 싶은가요?",
] as const;

const mvpBullets = [
  "사진 한 장으로 시작하는 지님 등록",
  "세 가지 질문으로 남기는 물건의 이야기",
  "저장하고 공유할 수 있는 지님 카드",
  "나의 기록이 쌓이는 소품함",
] as const;

const cardSamples = [
  { src: "/images/cards/card-sample-01.png", alt: "예시 지님 카드: 시계" },
  { src: "/images/cards/card-sample-02.png", alt: "예시 지님 카드: 지갑" },
  { src: "/images/cards/card-sample-03.png", alt: "예시 지님 카드: 펜" },
] as const;

export function BrandLanding() {
  return (
    <main className="flex flex-1 flex-col">
      {/* 1. Hero */}
      <section
        id="hero"
        className="jinim-paper-texture scroll-mt-20 border-b border-jinim-subtle/50 px-5 pb-20 pt-28 sm:scroll-mt-24 sm:px-6 sm:pb-28 sm:pt-32"
      >
        <div className={`${pageMax} grid items-center gap-10 lg:grid-cols-2 lg:gap-14`}>
          <div className="order-1 text-center lg:order-none lg:text-left">
            <h1 className="font-serif text-2xl font-semibold leading-snug tracking-tight text-jinim-deep sm:text-3xl md:text-[1.75rem] md:leading-[1.35] lg:max-w-lg">
              당신에게 지님의 가치는
              <br />
              무엇인가요?
            </h1>
            <p className="mx-auto mt-8 max-w-lg text-[0.95rem] leading-relaxed text-jinim-text/90 sm:text-base lg:mx-0">
              오래 지닌 물건에 담긴 시간과 의미를 기록하는
              <br />
              취향 아카이브, 지님.
            </p>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-jinim-text/72 sm:text-[0.95rem] lg:mx-0">
              시계, 지갑, 펜, 안경처럼 매일 곁에 있던 물건의 이야기를
              남겨보세요.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 lg:items-start">
              <CtaOpenNews />
              <p className="max-w-xs text-center text-xs leading-relaxed text-jinim-text/55 lg:text-left">
                첫 버전이 준비되면 가장 먼저 알려드릴게요.
              </p>
            </div>
          </div>
          <div className="order-2 lg:order-none">
            <ImageFrame className="relative mx-auto aspect-[4/3] w-full max-w-lg lg:max-w-none lg:translate-y-1">
              <Image
                src="/images/hero/jinim-hero-01.png"
                alt="오래 지닌 소품들이 정돈된 정물"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </ImageFrame>
          </div>
        </div>
      </section>

      {/* 2. 문제 제기 — 텍스트만, 전 구간 중앙 정렬 */}
      <section
        id="why"
        className="scroll-mt-20 border-b border-jinim-subtle/50 bg-[#F3EEE6]/90 px-5 py-20 sm:scroll-mt-24 sm:px-6 sm:py-24"
      >
        <div className={`${pageMax} flex justify-center`}>
          <div className="w-full max-w-xl text-center">
            <h2 className="font-serif text-xl font-semibold leading-snug text-jinim-deep sm:text-2xl">
              무엇이 진짜 나의 것일까요?
            </h2>
            <p className="mt-10 text-[0.95rem] leading-[1.75] text-jinim-text/90 sm:text-base">
              많은 것이 생성되고 복제되는 시대입니다.
            </p>
            <p className="mt-6 text-[0.95rem] leading-[1.75] text-jinim-text/90 sm:text-base">
              그럴수록 우리는 다시 묻게 됩니다.
              <br />
              무엇이 진짜 나의 것일까.
            </p>
            <p className="mt-6 text-[0.95rem] leading-[1.75] text-jinim-text/90 sm:text-base">
              지님은 그 질문에 대해,
              <br />
              실제로 지니고 살아온 물건에서 답을 찾습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 3. 지님이 하는 일 + 카드 샘플 */}
      <section
        id="what"
        className="scroll-mt-20 border-b border-jinim-subtle/50 bg-white/25 px-5 py-20 sm:scroll-mt-24 sm:px-6 sm:py-24"
      >
        <div className={pageMax}>
          <div className="max-w-2xl">
            <h2 className="font-serif text-xl font-semibold text-jinim-deep sm:text-2xl">
              물건이 이야기가 되는 과정
            </h2>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-jinim-text/90 sm:text-base">
              지님은 오래 지닌 물건을 하나의 카드로 기록합니다.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-jinim-text/90 sm:text-base">
              사진과 짧은 답변만으로, 그 물건에 담긴 이유와 시간을 정리할 수
              있습니다.
            </p>
          </div>

          <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
            {cardSamples.map((c) => (
              <li key={c.src} className="mx-auto w-full max-w-[12.5rem] sm:mx-0 sm:max-w-none">
                <ImageFrame className="relative aspect-[10/16] w-full shadow-[0_4px_18px_-12px_rgba(43,41,38,0.1)]">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 200px, 28vw"
                  />
                </ImageFrame>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. 사용 경험 + UI 프리뷰 */}
      <section
        id="experience"
        className="scroll-mt-20 border-b border-jinim-subtle/50 px-5 py-16 sm:scroll-mt-24 sm:px-6 sm:py-20"
      >
        <div className={pageMax}>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-5 lg:self-center">
              <h2 className="text-center font-serif text-xl font-semibold text-jinim-deep sm:text-left sm:text-2xl">
                하나의 물건에서, 하나의 이야기로
              </h2>

              <ol className="mt-8 space-y-4 sm:mt-10">
                {experienceSteps.map((text, i) => (
                  <li
                    key={text}
                    className="flex gap-4 text-[0.95rem] leading-relaxed text-jinim-text/90 sm:text-base"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-jinim-primary/45 bg-jinim-ivory text-xs font-semibold text-jinim-primary"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <span className="pt-1">{text}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 text-center text-[0.95rem] leading-relaxed text-jinim-text/85 sm:text-left sm:text-base">
                완성된 지님 카드는 저장하거나 공유할 수 있고,
                <br />
                소품함에는 물건마다의 이야기와 시간이 쌓입니다.
              </p>
            </div>

            <div className="flex flex-col justify-center lg:col-span-7">
              <ImageFrame className="relative mx-auto w-full max-w-xl overflow-hidden lg:max-w-xl">
                <Image
                  src="/images/ui/ui-preview-01.png"
                  alt="지님 기록하기 화면: 물건 등록부터 카드 미리보기까지의 흐름"
                  width={1200}
                  height={900}
                  className="h-auto w-full object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 36rem"
                />
              </ImageFrame>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 차별점 */}
      <section
        id="difference"
        className="scroll-mt-20 border-b border-jinim-subtle/50 bg-white/20 px-5 py-16 sm:scroll-mt-24 sm:px-6 sm:py-20"
      >
        <div className={pageMax}>
          <h2 className="font-serif text-xl font-semibold text-jinim-deep sm:text-2xl">
            무엇이 다른가요?
          </h2>
          <p className="mt-2 max-w-xl text-xs text-jinim-text/55">
            같은 물건을 두고도, 바라보는 초점만 달라집니다.
          </p>

          <div className="mt-10 overflow-x-auto pb-0.5 sm:overflow-visible sm:pb-0">
            <div className="min-w-[19rem] overflow-hidden rounded-[20px] border border-[#DDD2C4] bg-white/50 shadow-[0_4px_20px_-12px_rgba(43,41,38,0.1)] sm:min-w-0">
            <div className="grid grid-cols-2 border-b border-[#DDD2C4] bg-jinim-subtle/20 text-center">
              <div className="border-r border-[#DDD2C4] px-3 py-3.5 text-xs font-semibold tracking-wide text-jinim-text/70 sm:px-5 sm:py-4 sm:text-sm">
                기존 시선
              </div>
              <div className="px-3 py-3.5 text-xs font-semibold tracking-wide text-jinim-primary sm:px-5 sm:py-4 sm:text-sm">
                지님의 시선
              </div>
            </div>
            <ul>
              {differenceRows.map((row, i) => (
                <li
                  key={row.old}
                  className={`grid grid-cols-2 divide-x divide-[#DDD2C4]/90 ${i !== differenceRows.length - 1 ? "border-b border-[#DDD2C4]" : ""}`}
                >
                  <div className="px-4 py-5 text-left text-[0.875rem] leading-relaxed text-jinim-text/88 sm:px-6 sm:py-6 sm:text-[0.95rem]">
                    {row.old}
                  </div>
                  <div className="px-4 py-5 text-left text-[0.875rem] font-medium leading-relaxed text-jinim-deep sm:px-6 sm:py-6 sm:text-[0.95rem]">
                    {row.jinim}
                  </div>
                </li>
              ))}
            </ul>
            </div>
          </div>

          <p className="mt-10 text-sm leading-relaxed text-jinim-text/85 sm:text-[0.95rem]">
            지님은 소비를 부추기는 서비스가 아니라,
            <br />
            소유의 의미를 다시 묻는 서비스입니다.
          </p>
        </div>
      </section>

      {/* 6. 가치 */}
      <section
        id="values"
        className="scroll-mt-20 border-b border-jinim-subtle/50 px-5 py-16 sm:scroll-mt-24 sm:px-6 sm:py-20"
      >
        <div className={pageMax}>
          <h2 className="font-serif text-xl font-semibold text-jinim-deep sm:text-2xl">
            지님이 소중히 여기는 가치
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {values.map((v) => (
              <li
                key={v.title}
                className="flex min-h-[6.75rem] flex-col justify-center rounded-[18px] border border-[#DDD2C4]/90 bg-jinim-ivory/90 px-5 py-5 sm:min-h-[7.25rem] sm:px-6 sm:py-6"
              >
                <p className="font-serif text-sm font-semibold text-jinim-deep sm:text-[0.9375rem]">
                  {v.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-jinim-text/82 sm:text-sm sm:leading-relaxed">
                  {v.line}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. 질문들 */}
      <section
        id="questions"
        className="scroll-mt-20 border-b border-jinim-subtle/50 bg-white/25 px-5 py-20 sm:scroll-mt-24 sm:px-6 sm:py-24"
      >
        <div className={`${pageMax} max-w-2xl`}>
          <h2 className="font-serif text-xl font-semibold text-jinim-deep sm:text-2xl">
            지님이 묻는 질문들
          </h2>
          <ul className="mt-12 space-y-10 sm:space-y-12">
            {moreQuestions.map((q) => (
              <li
                key={q}
                className="border-l-2 border-jinim-primary/45 pl-5 text-[0.98rem] leading-[1.75] text-jinim-text/90 sm:pl-6 sm:text-[1.02rem]"
              >
                {q}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. 곧 만나실 경험 — 소품함·완성 예고, UI 1장만 */}
      <section
        id="next"
        className="scroll-mt-20 border-b border-jinim-subtle/50 px-5 py-14 sm:scroll-mt-24 sm:px-6 sm:py-20"
      >
        <div className={pageMax}>
          <h2 className="font-serif text-xl font-semibold text-jinim-deep sm:text-2xl">
            첫 버전에서 만날 수 있는 것
          </h2>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-jinim-text/88 sm:text-base">
            첫 버전은 커뮤니티보다,
            <br />
            나의 물건 하나를 기록하는 경험에서 시작합니다.
          </p>
          <ul className="mt-6 max-w-2xl list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-jinim-text/82 marker:text-jinim-primary/90 sm:text-[0.95rem]">
            {mvpBullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-center sm:items-start">
            <p className="mb-2 w-full text-center text-[11px] font-medium uppercase tracking-[0.12em] text-jinim-text/45 sm:text-left">
              나의 소품함
            </p>
            <ImageFrame className="relative w-full max-w-xl overflow-hidden shadow-[0_4px_18px_-12px_rgba(43,41,38,0.1)] sm:max-w-lg">
              <Image
                src="/images/ui/ui-preview-02.png"
                alt="나의 소품함: 완성된 지님 카드가 모이는 화면 예시"
                width={960}
                height={640}
                className="h-auto w-full object-cover object-top"
                sizes="(max-width: 768px) 100vw, 32rem"
              />
            </ImageFrame>
          </div>
        </div>
      </section>

      {/* 오픈 소식 */}
      <section
        id="open-news"
        className="scroll-mt-20 border-b border-jinim-subtle/50 bg-jinim-subtle/25 px-5 py-20 sm:scroll-mt-24 sm:px-6 sm:py-24"
      >
        <div className={pageMax}>
          <div className="mx-auto max-w-md text-center sm:max-w-lg">
          <h2 className="font-serif text-xl font-semibold text-jinim-deep sm:text-2xl">
            지님 오픈 소식
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-jinim-text/82 sm:mt-4 sm:text-[0.95rem]">
            지님의 첫 버전이 준비되면 소식을 보내드릴게요.
          </p>

          <div className="mx-auto mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-md">
            <label htmlFor="open-news-email" className="sr-only">
              이메일
            </label>
            <input
              id="open-news-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="이메일을 입력해주세요"
              disabled
              className="box-border h-12 w-full rounded-xl border border-[#DDD2C4] bg-white/90 px-4 text-sm text-jinim-text/90 leading-normal placeholder:text-jinim-text/45 disabled:cursor-not-allowed disabled:opacity-80"
            />
            <OpenNewsSubmitButton className="w-full" />
          </div>

          <p className="mt-6 text-xs leading-relaxed text-jinim-text/55">
            가볍게 소식을 전해드릴게요.
          </p>
          <p className="mt-8 text-xs text-jinim-text/45">준비 중 · v0.1.1</p>
          </div>
        </div>
      </section>

      {/* 9. 브랜드 선언 */}
      <section
        id="closing"
        className="jinim-paper-texture scroll-mt-20 px-5 py-20 sm:scroll-mt-24 sm:px-6 sm:py-28"
      >
        <div className={`${pageMax} max-w-xl text-center`}>
          <p className="font-serif text-xl font-semibold leading-snug text-jinim-deep sm:text-2xl md:text-[1.35rem] md:leading-snug">
            내가 살아온 시간은
            <br />
            여전히 나의 것입니다.
          </p>
          <p className="mt-10 text-sm tracking-wide text-jinim-primary sm:text-base">
            생성된 것보다 지녀온 것.
          </p>
        </div>
      </section>
    </main>
  );
}
