"use client";

import Link from "next/link";
import { MessageCircle, BarChart3, Swords, Home } from "lucide-react";
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
          <ApiAccessControl />
        </nav>
      </div>
    </header>
  );
}
