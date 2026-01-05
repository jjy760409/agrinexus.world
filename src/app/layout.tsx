import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "AgriNexus World OS | 초지능 스마트팜 운영체제",
  description: "전세계 최초 500+ 초지능 에이전트 기반 완전 자동화 스마트팜 운영체제. 실시간 협업, 자가 진화, 글로벌 최적화.",
  keywords: ["스마트팜", "AI", "IoT", "자동화", "농업기술", "초지능", "AGI", "에이전트"],
  authors: [{ name: "AgriNexus Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${orbitron.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
