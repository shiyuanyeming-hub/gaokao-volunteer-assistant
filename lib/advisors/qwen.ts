import { createOpenAI } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import type { Advisor, ChatMessage } from "./types";
import { toErrorSafeTextStream } from "./stream-utils";

// Qwen via DashScope is OpenAI-compatible
const qwen = createOpenAI({
  apiKey: process.env.QWEN_API_KEY!,
  baseURL: process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1",
  name: "qwen",
});

export const qwenAdvisor: Advisor = {
  async chat(messages: ChatMessage[], options = {}) {
    const result = streamText({
      model: qwen.chat(process.env.QWEN_MODEL || "qwen-plus"),
      messages,
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 2000,
    });
    return toErrorSafeTextStream(result);
  },

  async analyze(messages: ChatMessage[], options = {}) {
    const result = streamText({
      model: qwen.chat(process.env.QWEN_MODEL || "qwen-plus"),
      messages,
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxOutputTokens ?? 3000,
    });
    return toErrorSafeTextStream(result);
  },

  async complete(messages: ChatMessage[], options = {}) {
    const result = await generateText({
      model: qwen.chat(process.env.QWEN_MODEL || "qwen-plus"),
      messages,
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxOutputTokens ?? 1500,
    });
    return result.text;
  },
};
