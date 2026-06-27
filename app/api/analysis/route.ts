import { NextRequest } from "next/server";
import { getAdvisor } from "@/lib/advisors/factory";
import {
  buildAnalysisSystemPrompt,
  buildAnalysisUserPrompt,
} from "@/lib/prompts/prompt-utils";
import type { ClientApiSettings } from "@/lib/api-settings";
import { extractAnalysisJson } from "@/lib/prompts/analysis-prompt";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      province,
      score,
      rank,
      subjects,
      batch,
      budget,
      acceptAdjustment,
      major,
      city,
      apiConfig,
    } = body as {
      province: string;
      score: number;
      rank?: number;
      subjects: string;
      batch?: string;
      budget?: string;
      acceptAdjustment?: string;
      major?: string;
      city?: string;
      apiConfig?: Partial<ClientApiSettings>;
    };

    // Validate required inputs
    if (!province || !score || !subjects) {
      return Response.json(
        { error: "省份、分数、选科为必填项" },
        { status: 400 }
      );
    }

    if (score < 100 || score > 750) {
      return Response.json(
        { error: "分数需在 100-750 之间" },
        { status: 400 }
      );
    }

    const systemContent = buildAnalysisSystemPrompt("livestream");
    const userContent = buildAnalysisUserPrompt({
      province,
      score,
      rank,
      subjects,
      batch,
      budget,
      acceptAdjustment,
      major,
      city,
    });

    const messages = [
      { role: "system" as const, content: systemContent },
      { role: "user" as const, content: userContent },
    ];

    const advisor = getAdvisor(apiConfig?.provider, apiConfig);

    // 用 complete() 非流式请求，LLM 按 prompt 返回 JSON
    const text = await advisor.complete(messages, {
      temperature: 0.6,
      maxOutputTokens: 2000,
    });

    const structured = extractAnalysisJson(text);
    if (structured) {
      return Response.json({ json: structured, raw: text });
    }

    // 回退：LLM 没输出合法 JSON，返回清洗后的纯文本
    const cleaned = text
      .replace(/\*\*/g, "")
      .replace(/^#+\s?/gm, "")
      .replace(/^\s*[-*]\s+/gm, "")
      .trim();
    return Response.json({ json: null, raw: cleaned });
  } catch (error) {
    console.error("Analysis API error:", error);
    const message =
      error instanceof Error ? error.message : "分析服务暂时不可用，请稍后重试。";
    return Response.json({ error: message }, { status: 500 });
  }
}
