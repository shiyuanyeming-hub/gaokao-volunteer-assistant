import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DanmakuBackground } from "@/components/layout/DanmakuBackground";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "雪碧志愿填报助手 · 张老师帮你填志愿",
  description:
    "一个真正懂张雪峰老师的 AI 志愿助手。不是套了个皮肤的普通 AI——它会反问、会拆幻想、会给你实在的建议。来试试，看你能不能不被张老师锐评。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground relative">
        <DanmakuBackground />
        <Header />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
        <Toaster richColors />
      </body>
    </html>
  );
}
