import type { Metadata } from "next";
import { ServicePausedOverlay } from "@/components/brand/ServicePausedOverlay";
import { SERVICE_PAUSED } from "@/lib/service-paused";
import "@/styles/globals.css";

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
    <html lang="ko" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col bg-jinim-ivory font-sans text-jinim-text">
        {SERVICE_PAUSED ? <ServicePausedOverlay /> : null}
        {SERVICE_PAUSED ? (
          <div inert className="select-none">
            {children}
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
