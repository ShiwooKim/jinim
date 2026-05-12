import Link from "next/link";

const base =
  "inline-flex min-h-12 items-center justify-center rounded-full border font-semibold text-jinim-ivory transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jinim-primary";

const leadClass =
  `${base} min-h-[3.25rem] border-jinim-deep/25 bg-jinim-deep px-8 text-base shadow-[0_6px_22px_-6px_rgba(43,41,38,0.32)] hover:-translate-y-0.5 hover:bg-jinim-deep/93 hover:shadow-[0_10px_28px_-8px_rgba(43,41,38,0.28)] active:translate-y-0`;

const footerClass =
  `${base} min-h-[3.25rem] border-jinim-deep/25 bg-jinim-deep px-8 text-[0.9375rem] shadow-[0_6px_22px_-6px_rgba(43,41,38,0.3)] hover:-translate-y-0.5 hover:bg-jinim-deep/93 hover:shadow-[0_10px_26px_-8px_rgba(43,41,38,0.26)] active:translate-y-0`;

type Props = {
  className?: string;
  /** Hero·오픈 소식에서 가장 또렷하게 */
  emphasis?: "hero" | "footer";
};

export function CtaOpenNews({ className = "", emphasis = "footer" }: Props) {
  const variant = emphasis === "hero" ? leadClass : footerClass;
  return (
    <Link href="#open-news" className={`${variant} ${className}`.trim()}>
      지님 오픈 소식 받기
    </Link>
  );
}
