import Image from "next/image";
import { CtaOpenNews } from "@/components/brand/CtaOpenNews";

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
  { old: "이 물건은 얼마일까요?", jinim: "나에게 어떤 의미일까요?" },
  { old: "어떤 브랜드일까요?", jinim: "왜 이 물건을 선택하셨을까요?" },
  { old: "새로 산 물건인가요?", jinim: "앞으로도 계속 지니고 싶으신가요?" },
] as const;

const experienceSteps = [
  "오래 지닌 물건을 고릅니다.",
  "그 물건에 담긴 이야기를 남깁니다.",
  "나만의 지님 카드가 만들어집니다.",
  "소품함에 기록이 쌓입니다.",
] as const;

const values = [
  { title: "소유보다 의미", line: "무엇을 갖고 계신가보다, 왜 지니시는지부터 묻습니다." },
  { title: "자랑보다 이야기", line: "눈에 띄는 인증보다, 그 물건과 보낸 시간을 글로 남깁니다." },
  { title: "구매보다 발견", line: "더 사시라고 재촉하지 않고, 나다운 물건을 찾으실 수 있게 돕습니다." },
  { title: "컬렉션보다 태도", line: "많이 모으시는 일보다, 선택과 삶의 방식을 함께 봅니다." },
  { title: "생성보다 지녀온 시간", line: "생성된 결과보다, 직접 겪어 오신 시간을 먼저 둡니다." },
] as const;

const moreQuestions = [
  "왜 이 물건을 선택하셨을까요?",
  "왜 비싸지 않아도 소중하신가요?",
  "앞으로도 계속 지니고 싶으신가요?",
] as const;

const mvpBullets = [
  "지님 등록(사진·이름·카테고리·함께한 시간)",
  "지님 질문에 답하며 이야기를 꺼내는 흐름",
  "답을 바탕으로 만드는 나만의 지님 카드",
  "모든 기록이 모이는 나의 소품함",
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
              AI가 무엇이든 만들어내는 시대에도, 우리가 오래 지녀온 물건에는
              나만의 시간이 남아 있습니다.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 lg:items-start">
              <CtaOpenNews emphasis="hero" />
              <p className="max-w-xs text-center text-xs leading-relaxed text-jinim-text/55 lg:text-left">
                정식 오픈·알림 연결은 곧 이어질 예정입니다.
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

      {/* 2. 문제 제기 */}
      <section
        id="why"
        className="scroll-mt-20 border-b border-jinim-subtle/50 px-5 py-16 sm:scroll-mt-24 sm:px-6 sm:py-20"
      >
        <div className={`${pageMax} grid gap-10 md:grid-cols-2 md:items-center md:gap-14`}>
          <div className="mx-auto w-full max-w-[17.5rem] sm:max-w-xs md:mx-0 md:max-w-none">
            <ImageFrame className="relative aspect-[5/4] w-full opacity-[0.88] shadow-[0_4px_18px_-12px_rgba(43,41,38,0.1)]">
              <Image
                src="/images/hero/jinim-hero-02.png"
                alt="지녀온 물건들의 질감과 시간"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </ImageFrame>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-jinim-deep sm:text-2xl">
              무엇이 진짜 나의 것일까요?
            </h2>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-jinim-text/90 sm:text-base">
              많은 것이 생성되고 복제되는 시대에, 우리는 다시 묻게 됩니다.
              무엇이 진짜 나의 것일까요? 지님은 그 질문에{" "}
              <strong className="font-medium text-jinim-deep">
                실제로 지니고 살아온 물건
              </strong>
              이라는 방향으로 답을 찾게 됩니다. 오래 차고 계신 시계, 매일 쓰시는
              지갑처럼—시장 가격과는 다른,{" "}
              <strong className="font-medium text-jinim-deep">
                개인의 시간
              </strong>
              이 그 안에 있습니다.
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
              오래 지니신 물건을 통해, 나의 시간과 취향, 정체성을 기록해 드리는
              서비스입니다.
            </p>
            <p className="mt-5 border-l-2 border-jinim-primary/50 pl-4 text-[0.95rem] leading-relaxed text-jinim-text/85 sm:text-base">
              사람이 오래 지닌 물건에 담긴 시간과 의미를 기록하고, 각자 삶의
              가치를 다시 발견하실 수 있도록 돕습니다.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-jinim-text/75 sm:text-[0.95rem]">
              더 많이 사시도록 부추기는 서비스가 아니라, 이미 지니고 계시거나
              앞으로 오래 지니고 싶은 물건의{" "}
              <strong className="text-jinim-deep">의미를 발견</strong>하실 수
              있도록 곁에 서는 서비스입니다.
            </p>
          </div>

          <p className="mt-12 text-center text-xs font-medium tracking-wide text-jinim-text/55">
            예시 지님 카드
          </p>
          <ul className="mx-auto mt-3 grid max-w-3xl grid-cols-1 gap-4 sm:mt-4 sm:grid-cols-3 sm:gap-5">
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
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="lg:col-span-5">
              <p className="text-center font-serif text-sm font-medium tracking-wide text-jinim-primary sm:text-left sm:text-base">
                오래 지닌 물건에는 이유가 있습니다.
              </p>
              <h2 className="mt-3 text-center font-serif text-xl font-semibold text-jinim-deep sm:text-left sm:text-2xl">
                하나의 물건에서, 하나의 이야기로
              </h2>
              <p className="mt-5 text-center text-[0.95rem] leading-relaxed text-jinim-text/88 sm:text-left sm:text-base">
                오래 지니신 물건 하나를 골라 보세요. 지님은 몇 가지 질문을 통해,
                그 물건에 담긴 시간을 함께 정리해 드립니다.
              </p>

              <ol className="mt-10 space-y-4">
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
            </div>

            <div className="lg:col-span-7">
              <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-jinim-text/45 sm:text-left">
                지님 기록하기
              </p>
              <ImageFrame className="relative mx-auto w-full max-w-3xl overflow-hidden lg:mx-0 lg:max-w-none">
                <Image
                  src="/images/ui/ui-preview-01.png"
                  alt="지님 기록하기 화면: 물건 등록부터 카드 미리보기까지의 흐름"
                  width={1200}
                  height={900}
                  className="h-auto w-full object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 58vw"
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

          <div className="mt-10 overflow-hidden rounded-[20px] border border-[#DDD2C4] bg-white/50 shadow-[0_4px_20px_-12px_rgba(43,41,38,0.1)]">
            <div className="grid grid-cols-2 border-b border-[#DDD2C4] bg-jinim-subtle/20 text-center">
              <div className="border-r border-[#DDD2C4] px-3 py-3.5 text-xs font-semibold tracking-wide text-jinim-text/70 sm:px-5 sm:py-4 sm:text-sm">
                기존의 시선
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

          <p className="mt-10 text-sm leading-relaxed text-jinim-text/85 sm:text-[0.95rem]">
            지님은 소비를 부추기는 서비스가 아니라,{" "}
            <strong className="text-jinim-deep">소유의 의미를 다시 묻는</strong>{" "}
            서비스입니다.
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
                className="flex min-h-[7.5rem] flex-col justify-center rounded-[18px] border border-[#DDD2C4]/90 bg-jinim-ivory/90 px-5 py-5 sm:min-h-[8rem] sm:px-6 sm:py-6"
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
        className="scroll-mt-20 border-b border-jinim-subtle/50 bg-white/25 px-5 py-16 sm:scroll-mt-24 sm:px-6 sm:py-20"
      >
        <div className={`${pageMax} max-w-2xl`}>
          <h2 className="font-serif text-xl font-semibold text-jinim-deep sm:text-2xl">
            지님이 묻는 질문들
          </h2>
          <ul className="mt-10 space-y-6">
            {moreQuestions.map((q) => (
              <li
                key={q}
                className="border-l-2 border-jinim-primary/45 pl-5 text-[0.98rem] italic leading-[1.65] text-jinim-text/90 sm:pl-6 sm:text-[1.02rem]"
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
        className="scroll-mt-20 border-b border-jinim-subtle/50 px-5 py-16 sm:scroll-mt-24 sm:px-6 sm:py-20"
      >
        <div className={pageMax}>
          <h2 className="font-serif text-xl font-semibold text-jinim-deep sm:text-2xl">
            첫 버전에서 만날 수 있는 것
          </h2>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-jinim-text/88 sm:text-base">
            첫 버전은 커뮤니티보다,{" "}
            <strong className="font-medium text-jinim-deep">나의 지님 카드</strong>
            에 집중합니다. 기록이 모이면{" "}
            <strong className="font-medium text-jinim-deep">나의 소품함</strong>
            에서 한눈에 이어집니다. 위에서 보신 예시 카드들이 이렇게 모일 수
            있고, 이후에는 공개와 정리 기능도 덧붙일 예정입니다.
          </p>
          <ul className="mt-5 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-jinim-text/82 marker:text-jinim-primary/90 sm:text-[0.95rem]">
            {mvpBullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mb-2 mt-8 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-jinim-text/45 sm:mt-10 sm:text-left">
            나의 소품함
          </p>
          <ImageFrame className="relative mx-auto mt-1 max-w-2xl overflow-hidden shadow-[0_4px_18px_-12px_rgba(43,41,38,0.1)]">
            <Image
              src="/images/ui/ui-preview-02.png"
              alt="나의 소품함: 완성된 지님 카드가 모이는 화면 예시"
              width={960}
              height={640}
              className="h-auto w-full object-cover object-top"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </ImageFrame>
        </div>
      </section>

      {/* 오픈 소식 */}
      <section
        id="open-news"
        className="scroll-mt-20 border-b border-jinim-subtle/50 bg-jinim-subtle/20 px-5 py-20 sm:scroll-mt-24 sm:px-6 sm:py-24"
      >
        <div className={`${pageMax} max-w-lg text-center`}>
          <h2 className="font-serif text-lg font-semibold text-jinim-deep sm:text-xl">
            지님 오픈 소식
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-jinim-text/80 sm:text-[0.95rem]">
            지님이 열리면 가장 먼저 알려드릴게요.
          </p>

          <div className="mx-auto mt-8 max-w-sm text-left">
            <p className="mb-2 text-xs font-medium text-jinim-text/60">
              이메일 (준비 중)
            </p>
            <div
              className="rounded-xl border border-[#DDD2C4] bg-white/70 px-4 py-3.5 text-sm text-jinim-text/45"
              role="note"
            >
              이메일 주소를 남기실 수 있게 곧 열립니다.
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <CtaOpenNews emphasis="footer" />
          </div>
          <p className="mt-4 text-xs text-jinim-text/50">준비 중 · v0.1</p>
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
