"use client";

import Link from "next/link";
import { BarChart3, Home, MessageCircle, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApiAccessControl } from "@/components/settings/ApiAccessControl";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 bg-xf-darker/90 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex size-7 items-center justify-center rounded-lg bg-sprite text-sm font-extrabold text-white tex-bubbles">
            雪
          </span>
          <span className="text-xl font-extrabold text-white">
            雪碧<span className="text-sprite-bright">志愿填报</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 gap-1.5"
            >
              <Home className="size-4" />
              <span className="hidden sm:inline">首页</span>
            </Button>
          </Link>
          <Link href="/chat">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 gap-1.5"
            >
              <MessageCircle className="size-4" />
              <span className="hidden sm:inline">聊天</span>
            </Button>
          </Link>
          <Link href="/analysis">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 gap-1.5"
            >
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">分析</span>
            </Button>
          </Link>
          <Link href="/challenge">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-xf-yellow hover:bg-xf-yellow/10 gap-1.5"
            >
              <Swords className="size-4" />
              <span className="hidden sm:inline">挑战</span>
            </Button>
          </Link>
          <a
            href="https://github.com/shiyuanyeming-hub/gaokao-volunteer-assistant"
            target="_blank"
            rel="noreferrer"
            aria-label="打开 GitHub 仓库"
          >
            <Button
              variant="ghost"
              size="sm"
              className="group/github gap-1.5 border border-white/10 bg-white/[0.03] text-white/70 shadow-[0_0_24px_rgba(78,205,196,0.08)] transition-all hover:-translate-y-0.5 hover:border-sprite/45 hover:bg-sprite/10 hover:text-white hover:shadow-[0_0_28px_rgba(78,205,196,0.18)]"
            >
              <GitHubMark className="size-4 transition-transform group-hover/github:rotate-[-8deg]" />
              <span className="hidden lg:inline">GitHub</span>
            </Button>
          </a>
          <ApiAccessControl />
        </nav>
      </div>
    </header>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}
