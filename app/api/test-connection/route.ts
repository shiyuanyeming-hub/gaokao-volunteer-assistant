// API 测试连接 — 用当前配置发一个极小请求，验证 key/provider/baseURL 是否可用。
// 用于诊断「配了 key 还是用不了」：区分 key 无效、provider 选错、baseURL 错、网络问题。
// 始终返回 200 + { ok, ... }，由前端按 ok 字段判断（避免 fetch 层报错吞掉原因）。

import { NextRequest } from "next/server";
import { getAdvisor } from "@/lib/advisors/factory";
import { extractApiError } from "@/lib/advisors/stream-utils";
import type { ClientApiSettings } from "@/lib/api-settings";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request, { scope: "test-connection", limit: 10 });
    if (!limit.ok) return rateLimitResponse(limit.resetSeconds);

    const { apiConfig } = (await request.json()) as {
      apiConfig?: Partial<ClientApiSettings>;
    };

    const provider = apiConfig?.provider || "deepseek";
    const advisor = getAdvisor(provider, apiConfig);

    // 发一个极小请求，只要能拿到回包就说明 key + baseURL + provider 都对
    await advisor.complete(
      [
        { role: "system", content: "只回复两个字：在线" },
        { role: "user", content: "ping" },
      ],
      { temperature: 0, maxOutputTokens: 20 }
    );

    const stream = await advisor.chat(
      [
        { role: "system", content: "只回复两个字：在线" },
        { role: "user", content: "stream ping" },
      ],
      { temperature: 0, maxOutputTokens: 20 }
    );
    const streamedText = await readStreamText(stream);
    if (!streamedText.trim()) {
      return Response.json({
        ok: false,
        error: "Key 可以完成普通请求，但流式聊天没有返回内容；请检查模型是否支持 stream，或换一个模型。",
      });
    }

    return Response.json({
      ok: true,
      provider,
      model: apiConfig?.model,
    });
  } catch (error) {
    return Response.json({ ok: false, error: extractApiError(error) });
  }
}

async function readStreamText(stream: ReadableStream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
  }

  text += decoder.decode();
  return text;
}
