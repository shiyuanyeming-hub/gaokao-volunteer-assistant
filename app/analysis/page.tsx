"use client";

import { useState, useCallback } from "react";
import { AnalysisForm } from "@/components/analysis/AnalysisForm";
import { AnalysisReport, type ReportData } from "@/components/analysis/AnalysisReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredApiSettingsPayload } from "@/lib/api-settings";

export default function AnalysisPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = useCallback(
    async (formData: {
      province: string;
      score: number;
      rank?: number;
      subjects: string;
      batch?: string;
      budget?: string;
      acceptAdjustment?: string;
      major?: string;
      city?: string;
    }) => {
      setIsStreaming(true);
      setReport(null);

      try {
        const response = await fetch("/api/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            apiConfig: getStoredApiSettingsPayload(),
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "分析失败，请重试。");
        }

        const result = await response.json();
        if (result.json) {
          setReport(result.json);
        } else if (result.raw) {
          // Fallback: LLM 没输出合法 JSON，渲染清洗后的纯文本
          setReport({
            situation: {
              summary: "分析结果（LLM 返回了非 JSON 格式）",
              tags: ["AI 原始输出"],
              blocks: [
                {
                  title: "说明",
                  content:
                    result.raw.slice(0, 300) +
                    (result.raw.length > 300 ? "…（截断）" : ""),
                },
              ],
              roast: "",
            },
          });
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "分析暂时不可用，请稍后重试。";
        setReport({
          situation: {
            summary: `❌ ${errorMsg}`,
            tags: [],
            blocks: [],
            roast: "",
          },
        });
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">
            志愿分析
          </h1>
          <p className="text-sm text-white/50">
            填写你的信息，张老师给你做志愿诊断
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-2 bg-xf-card border-white/10 h-fit">
            <CardHeader>
              <CardTitle className="text-white text-lg">考生画像</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalysisForm
                onSubmit={handleSubmit}
                isLoading={isStreaming}
              />
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <AnalysisReport data={report} isLoading={isStreaming} />
          </div>
        </div>
      </div>
    </div>
  );
}
