import type { streamText } from "ai";

/**
 * 把 streamText 包成 ReadableStream，LLM 失败时把错误信息塞进流尾。
 * 关键：toTextStreamResponse() 在 LLM 调用失败（key 无效/额度/网络）时会吞掉错误、返回空流，
 * 前端只收到 HTTP 200 + 空、毫无提示。v6 实测 textStream 在出错时也不抛错、静默结束，
 * 必须用 fullStream 拿 'error' part，把真实原因（如 "Authentication Fails ... is invalid"）塞进流尾。
 */
/** 从 AI SDK 错误里提取最详细的可读信息（优先 responseBody / data 里的 message，避免只看到 "Unauthorized"）。 */
export function extractApiError(error: unknown): string {
  const e = error as {
    message?: string;
    responseBody?: string;
    data?: { error?: { message?: string; code?: string } };
  };
  if (e?.data?.error?.message) {
    return e.data.error.code
      ? `${e.data.error.message}（${e.data.error.code}）`
      : e.data.error.message;
  }
  if (e?.responseBody) {
    try {
      const body = JSON.parse(e.responseBody);
      if (body?.message) return body.message;             // DashScope: {code, message}
      if (body?.error?.message) return body.error.message; // OpenAI-style: {error: {message}}
    } catch {
      /* ignore */
    }
  }
  return e?.message || "连接失败，请检查配置";
}

export function toErrorSafeTextStream(
  result: ReturnType<typeof streamText>
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const part of result.fullStream as AsyncIterable<{
          type: string;
          text?: string;
          textDelta?: string;
          delta?: string;
          error?: { message?: string };
        }>) {
          if (part.type === "error") {
            const msg = extractApiError(part.error);
            controller.enqueue(
              encoder.encode(
                `\n\n⚠️ 张老师掉线了：${msg}（检查 API 设置：Key / 模型名 / 网络）`
              )
            );
            controller.close();
            return;
          }
          if (part.type === "text-delta") {
            const text = part.text ?? part.textDelta ?? part.delta ?? "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        }
        controller.close();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "生成失败";
        controller.enqueue(
          encoder.encode(`\n\n⚠️ 张老师掉线了：${msg}（检查 API 设置）`)
        );
        controller.close();
      }
    },
  });
}
