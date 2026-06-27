import { NextRequest } from "next/server";
import { getAdvisor } from "@/lib/advisors/factory";
import { buildChatSystemPrompt } from "@/lib/prompts/prompt-utils";
import type { PersonaMode } from "@/lib/constants";
import type { ClientApiSettings } from "@/lib/api-settings";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request, { scope: "chat" });
    if (!limit.ok) return rateLimitResponse(limit.resetSeconds);

    const body = await request.json();
    const { messages, persona, apiConfig } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      persona: PersonaMode;
      apiConfig?: Partial<ClientApiSettings>;
    };

    if (!messages?.length) {
      return Response.json({ error: "至少需要一条消息" }, { status: 400 });
    }

    const mode = persona || "livestream";
    const lastUserMessage =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";

    // Build system prompt with persona + heuristics
    const systemContent = buildChatSystemPrompt(mode, lastUserMessage);

    const chatMessages = [
      { role: "system" as const, content: systemContent },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const advisor = getAdvisor(apiConfig?.provider, apiConfig);
    const stream = await advisor.chat(chatMessages, {
      temperature: 0.7,
      maxOutputTokens: 2000,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "张老师暂时不在线，请稍后再来连麦。";
    return Response.json({ error: message }, { status: 500 });
  }
}
