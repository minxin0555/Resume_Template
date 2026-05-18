import type { Metadata } from "next";
import { Noto_Serif_SC, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-serif-cjk",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-jb",
  display: "swap",
});

export const metadata: Metadata = {
  title: "在线简历生成器",
  description: "基于 Typst 的在线中文简历生成器",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`h-full antialiased ${notoSerifSC.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="h-full overflow-hidden font-sans bg-paper-bg text-ink text-[13px] leading-[1.5]">
        {children}
      </body>
    </html>
  );
}
