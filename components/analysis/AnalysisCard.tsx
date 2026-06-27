"use client";

import type { ReactNode } from "react";
import { InfoBlock } from "./InfoBlock";
import { TagList } from "./TagList";
import { XuefengAvatar } from "@/components/shared/XuefengAvatar";

interface AnalysisCardProps {
  title: string;
  icon: ReactNode;
  summary: string;
  tags: string[];
  blocks: { title: string; content: string }[];
  roast?: string;
}

export function AnalysisCard({
  title,
  icon,
  summary,
  tags,
  blocks,
  roast,
}: AnalysisCardProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-xf-card p-5">
      {/* 标题 + 摘要 */}
      <div>
        <div className="mb-1 flex items-center gap-2">
          {icon}
          <h3 className="text-base font-extrabold text-white">{title}</h3>
        </div>
        <p className="text-sm text-white/60">{summary}</p>
      </div>

      {/* 标签 */}
      <TagList tags={tags} />

      {/* 信息块网格 */}
      {blocks.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <InfoBlock
              key={block.title}
              title={block.title}
              content={block.content}
            />
          ))}
        </div>
      )}

      {/* 张老师锐评气泡（和理性分析视觉区分） */}
      {roast && (
        <div className="flex items-start gap-3 rounded-xl border border-xf-red/30 bg-xf-red/10 p-3">
          <XuefengAvatar mood="angry" size="sm" />
          <p className="text-sm leading-relaxed text-white/85">{roast}</p>
        </div>
      )}
    </div>
  );
}
