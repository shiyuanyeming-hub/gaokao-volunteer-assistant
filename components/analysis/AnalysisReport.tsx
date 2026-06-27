"use client";

import { AnalysisCard } from "./AnalysisCard";
import { LoadingDots } from "@/components/shared/LoadingDots";
import { TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

interface Block {
  title: string;
  content: string;
}
interface Section {
  summary: string;
  tags: string[];
  blocks: Block[];
  roast: string;
}
export interface ReportData {
  situation?: Section;
  risk?: Section;
  advice?: Section;
}

interface AnalysisReportProps {
  data: ReportData | null;
  isLoading: boolean;
}

export function AnalysisReport({ data, isLoading }: AnalysisReportProps) {
  if (!data && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-white/30">
        <div className="mb-3 size-12 rounded-full bg-sprite/15 ring-1 ring-sprite/30 tex-bubbles" />
        <p className="text-sm">填写信息后点击「开始分析」，张老师来给你做诊断</p>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-white/35">
          今年的判断会提醒你核对省考试院、阳光高考、高校招生章程、选科要求和近三年位次；缺少位次时不会硬装「稳录」。
        </p>
      </div>
    );
  }

  if (!data && isLoading) {
    return <LoadingDots />;
  }

  return (
    <div className="space-y-5">
      {data?.situation && (
        <AnalysisCard
          title="情况分析"
          icon={<TrendingUp className="size-5 text-ice-bright" />}
          summary={data.situation.summary}
          tags={data.situation.tags}
          blocks={data.situation.blocks}
          roast={data.situation.roast}
        />
      )}
      {data?.risk && (
        <AnalysisCard
          title="风险评估"
          icon={<AlertTriangle className="size-5 text-xf-yellow-light" />}
          summary={data.risk.summary}
          tags={data.risk.tags}
          blocks={data.risk.blocks}
          roast={data.risk.roast}
        />
      )}
      {data?.advice && (
        <AnalysisCard
          title="志愿建议"
          icon={<Lightbulb className="size-5 text-sprite-bright" />}
          summary={data.advice.summary}
          tags={data.advice.tags}
          blocks={data.advice.blocks}
          roast={data.advice.roast}
        />
      )}
    </div>
  );
}
