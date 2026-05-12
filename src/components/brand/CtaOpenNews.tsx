import Link from "next/link";

const base =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full border font-semibold text-jinim-ivory transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jinim-primary sm:w-auto";

const leadClass =
  `${base} min-h-[3.25rem] border-jinim-deep/25 bg-jinim-deep px-8 text-base shadow-[0_6px_22px_-6px_rgba(43,41,38,0.32)] hover:-translate-y-0.5 hover:bg-jinim-deep/93 hover:shadow-[0_10px_28px_-8px_rgba(43,41,38,0.28)] active:translate-y-0`;

/** 오픈 소식 블록: Hero와 같은 계열, 섹션에서 가장 또렷하게 */
const blockClass =
  `${base} box-border h-12 min-h-12 border-jinim-deep/20 bg-jinim-deep px-6 text-base shadow-[0_8px_28px_-6px_rgba(43,41,38,0.38)] hover:-translate-y-0.5 hover:bg-jinim-deep/93 hover:shadow-[0_12px_32px_-8px_rgba(43,41,38,0.3)] active:translate-y-0`;

const blockButtonClass =
  `${blockClass} cursor-not-allowed opacity-95 hover:translate-y-0 hover:shadow-[0_8px_28px_-6px_rgba(43,41,38,0.38)]`;

type Props = {
  className?: string;
  label?: string;
};

export function CtaOpenNews({
  className = "",
  label = "지님 오픈 소식 받기",
}: Props) {
  return (
    <Link href="#open-news" className={`${leadClass} ${className}`.trim()}>
      {label}
    </Link>
  );
}

/** 폼 제출은 아직 연결 전 — 시각적으로 CTA 블록과 동일 계열 */
export function OpenNewsSubmitButton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled
      className={`${blockButtonClass} ${className}`.trim()}
      aria-disabled="true"
      title="이메일 접수는 곧 열립니다"
    >
      오픈 소식 받기
    </button>
  );
}
