// 志愿推荐 API — 运行确定性引擎 + 可选 LLM 锐评增强，返回结构化 JSON。
// 客户端也会本地运行引擎（即时渲染）；本路由主要用于叠加 LLM 雪峰味锐评。
// LLM 失败时返回引擎的模板文案（永远有输出）。

import { NextRequest } from "next/server";
import { recommend, type RecommendInput } from "@/lib/engine/recommendationEngine";
import { enhanceWithLLM } from "@/lib/engine/llmEnhance";
import type { ClientApiSettings } from "@/lib/api-settings";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request, { scope: "recommend", limit: 30 });
    if (!limit.ok) return rateLimitResponse(limit.resetSeconds);

    const { apiConfig, ...body } = (await request.json()) as RecommendInput & {
      apiConfig?: Partial<ClientApiSettings>;
    };

    // 基本校验
    if (!body.province || !body.score || !body.subjectTrack) {
      return Response.json(
        { error: "省份、分数、选科为必填项" },
        { status: 400 }
      );
    }
    if (body.score < 100 || body.score > 900) {
      return Response.json(
        { error: "分数需在 100-900 之间" },
        { status: 400 }
      );
    }

    // 1) 确定性引擎（结构化骨架 + 模板文案）
    const result = recommend(body);

    // 2) LLM 增强（可选，失败则保留模板）
    const enhanced = await enhanceWithLLM(body, result, apiConfig);
    if (enhanced) {
      result.roast = enhanced.roast;
      result.parentAdvice = enhanced.parent;
      result.studentAdvice = enhanced.student;
      result.llmEnhanced = true;
    }

    return Response.json(result);
  } catch (error) {
    console.error("Recommend API error:", error);
    const message =
      error instanceof Error ? error.message : "推荐服务暂时不可用，请稍后重试。";
    return Response.json({ error: message }, { status: 500 });
  }
}
