import type { Metadata, Viewport } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import GlobalWidgets from "@/components/GlobalWidgets";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#00ff88",
};

export const metadata: Metadata = {
  title: "AgriNexus World OS | 초지능 스마트팜 운영체제",
  description: "전세계 최초 500+ 초지능 에이전트 기반 완전 자동화 스마트팜 운영체제. 실시간 협업, 자가 진화, 글로벌 최적화.",
  keywords: ["스마트팜", "AI", "IoT", "자동화", "농업기술", "초지능", "AGI", "에이전트"],
  authors: [{ name: "AgriNexus Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AgriNexus",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${orbitron.variable} ${inter.variable} antialiased`}
      >
        {children}
        {/* 글로벌 위젯 (AI 어시스턴트, 음성 제어) */}
        <GlobalWidgets />
      </body>
    </html>
  );
}


