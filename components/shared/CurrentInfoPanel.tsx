"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";
import {
  CURRENT_GAOKAO_YEAR,
  GAOKAO_2026_KNOWLEDGE,
  GAOKAO_2026_SOURCES,
} from "@/lib/data/gaokao-2026";
import { cn } from "@/lib/utils";

interface CurrentInfoPanelProps {
  compact?: boolean;
  className?: string;
}

export function CurrentInfoPanel({ compact = false, className }: CurrentInfoPanelProps) {
  const sources = compact ? GAOKAO_2026_SOURCES.slice(0, 3) : GAOKAO_2026_SOURCES;
  const knowledge = compact ? GAOKAO_2026_KNOWLEDGE.slice(0, 3) : GAOKAO_2026_KNOWLEDGE;

  if (compact) {
    return (
      <section
        className={cn(
          "rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3",
          className
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white/75">
            <ShieldCheck className="size-4 text-ice-bright" />
            {CURRENT_GAOKAO_YEAR} 报考依据
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map((source) => (
              <a
                key={source.title}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-ice/20 bg-ice/10 px-3 py-1 text-xs font-semibold text-ice-bright transition-colors hover:border-ice/45 hover:bg-ice/15"
              >
                {source.title}
                <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-xf-card p-4",
        className
      )}
    >
      <div className="mb-3 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ice/15 text-ice-bright">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">
            {CURRENT_GAOKAO_YEAR} 报考信息依据
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-white/45">
            风格和决策框架参考开源张雪峰 skill；事实判断优先回到阳光高考、省教育考试院、高校招生网和当年本科专业目录。
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((source) => (
          <a
            key={source.title}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-white/10 bg-white/[0.035] p-3 transition-colors hover:border-ice/40 hover:bg-ice/10"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="rounded-full border border-ice/25 bg-ice/10 px-2 py-0.5 text-[10px] font-bold text-ice-bright">
                {source.tag}
              </span>
              <ExternalLink className="size-3.5 text-white/35 group-hover:text-ice-bright" />
            </div>
            <div className="text-sm font-bold text-white">{source.title}</div>
            <div className="mt-0.5 text-[11px] text-white/35">{source.owner}</div>
            {!compact && (
              <p className="mt-2 text-xs leading-relaxed text-white/50">{source.note}</p>
            )}
          </a>
        ))}
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {knowledge.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-xs leading-relaxed text-white/55"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
