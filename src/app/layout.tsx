import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "@/styles/globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-kr",
  display: "swap",
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif-kr",
  display: "swap",
});

const siteDescription =
  "오래 지닌 물건에 담긴 시간과 의미를 기록하는 취향 아카이브, 지님.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jinim.kr"),
  title: "지님(Jinim) — 오래 지닌 물건의 시간을 기록하는 취향 아카이브",
  description: siteDescription,
  openGraph: {
    title: "지님(Jinim) — 오래 지닌 물건의 시간을 기록하는 취향 아카이브",
    description: siteDescription,
    locale: "ko_KR",
    type: "website",
    url: "https://jinim.kr",
    images: [{ url: "/jinim-logo.png", alt: "지님" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "지님(Jinim)",
    description: siteDescription,
    images: ["/jinim-logo.png"],
  },
  icons: {
    icon: "/jinim-logo.png",
    apple: "/jinim-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${notoSerifKr.variable} h-full scroll-smooth antialiased`}
    >
      <body
        className={`${notoSansKr.className} flex min-h-full flex-col bg-jinim-ivory text-jinim-text`}
      >
        {children}
      </body>
    </html>
  );
}
