import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="h-full overflow-hidden font-sans">{children}</body>
    </html>
  );
}
