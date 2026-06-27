import { createOpenAI } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import type { Advisor, ChatMessage } from "./types";
import { toErrorSafeTextStream } from "./stream-utils";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const openaiAdvisor: Advisor = {
  async chat(messages: ChatMessage[], options = {}) {
    const result = streamText({
      model: openai.chat(process.env.OPENAI_MODEL || "gpt-4o-mini"),
      messages,
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 2000,
    });
    return toErrorSafeTextStream(result);
  },

  async analyze(messages: ChatMessage[], options = {}) {
    const result = streamText({
      model: openai.chat(process.env.OPENAI_MODEL || "gpt-4o-mini"),
      messages,
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxOutputTokens ?? 3000,
    });
    return toErrorSafeTextStream(result);
  },

  async complete(messages: ChatMessage[], options = {}) {
    const result = await generateText({
      model: openai.chat(process.env.OPENAI_MODEL || "gpt-4o-mini"),
      messages,
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxOutputTokens ?? 1500,
    });
    return result.text;
  },
};
