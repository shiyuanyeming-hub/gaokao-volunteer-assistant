import { createOpenAI } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import type { Advisor, ChatMessage } from "./types";
import { toErrorSafeTextStream } from "./stream-utils";

// DeepSeek is OpenAI-compatible
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
  name: "deepseek",
});

export const deepseekAdvisor: Advisor = {
  async chat(messages: ChatMessage[], options = {}) {
    const result = streamText({
      model: deepseek.chat(process.env.DEEPSEEK_MODEL || "deepseek-chat"),
      messages,
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 2000,
    });
    return toErrorSafeTextStream(result);
  },

  async analyze(messages: ChatMessage[], options = {}) {
    const result = streamText({
      model: deepseek.chat(process.env.DEEPSEEK_MODEL || "deepseek-chat"),
      messages,
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxOutputTokens ?? 3000,
    });
    return toErrorSafeTextStream(result);
  },

  async complete(messages: ChatMessage[], options = {}) {
    const result = await generateText({
      model: deepseek.chat(process.env.DEEPSEEK_MODEL || "deepseek-chat"),
      messages,
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxOutputTokens ?? 1500,
    });
    return result.text;
  },
};
