import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import type { Advisor, ChatMessage } from "./types";
import { toErrorSafeTextStream } from "./stream-utils";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const geminiAdvisor: Advisor = {
  async chat(messages: ChatMessage[], options = {}) {
    const result = streamText({
      model: google(process.env.GEMINI_MODEL || "gemini-2.0-flash"),
      messages,
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 2000,
    });
    return toErrorSafeTextStream(result);
  },

  async analyze(messages: ChatMessage[], options = {}) {
    const result = streamText({
      model: google(process.env.GEMINI_MODEL || "gemini-2.0-flash"),
      messages,
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxOutputTokens ?? 3000,
    });
    return toErrorSafeTextStream(result);
  },

  async complete(messages: ChatMessage[], options = {}) {
    const result = await generateText({
      model: google(process.env.GEMINI_MODEL || "gemini-2.0-flash"),
      messages,
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxOutputTokens ?? 1500,
    });
    return result.text;
  },
};
