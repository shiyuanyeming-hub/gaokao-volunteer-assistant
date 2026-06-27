import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import type { ApiProvider, ClientApiSettings } from "@/lib/api-settings";
import { getProviderDefaults, normalizeApiSettings } from "@/lib/api-settings";
import type { Advisor, ChatMessage } from "./types";
import { deepseekAdvisor } from "./deepseek";
import { openaiAdvisor } from "./openai";
import { geminiAdvisor } from "./gemini";
import { qwenAdvisor } from "./qwen";
import { toErrorSafeTextStream } from "./stream-utils";
import {
  allowClientApiOverride,
  getServerProvider,
  hasServerApiKey,
  shouldUseServerApi,
} from "@/lib/server-api";

export type LLMProvider = "deepseek" | "openai" | "gemini" | "qwen";

const advisors: Record<LLMProvider, Advisor> = {
  deepseek: deepseekAdvisor,
  openai: openaiAdvisor,
  gemini: geminiAdvisor,
  qwen: qwenAdvisor,
};

export function getAdvisor(
  provider?: LLMProvider | ApiProvider,
  clientConfig?: Partial<ClientApiSettings>
): Advisor {
  const serverProvider = getServerProvider();
  const useServer = shouldUseServerApi();
  const runtimeConfig =
    useServer && !allowClientApiOverride()
      ? null
      : normalizeRuntimeConfig(provider, clientConfig);
  if (runtimeConfig?.apiKey) {
    return createRuntimeAdvisor(runtimeConfig);
  }

  const p =
    useServer
      ? serverProvider
      : (provider as LLMProvider) || (process.env.LLM_PROVIDER as LLMProvider) || "deepseek";
  const advisor = advisors[p];
  if (!advisor) {
    throw new Error(
      `Unknown LLM provider: ${p}. Supported: deepseek, openai, gemini, qwen`
    );
  }
  // 无 client key 时走环境变量配置的 advisor；若环境也没有 key，提前抛错——
  // 否则 streamText 会在流消费时才失败，route 已经返回 200，前端只收到空流、毫无提示。
  if (!hasEnvApiKey(p)) {
    throw new Error(
      "还没配置 API Key——点右上角「API」按钮填一个（DeepSeek / OpenAI / Qwen / Gemini 任选），保存后再来连麦。"
    );
  }
  return advisor;
}

export function getCurrentProvider(): LLMProvider {
  return getServerProvider();
}

const ENV_API_KEY: Record<LLMProvider, string> = {
  deepseek: "DEEPSEEK_API_KEY",
  openai: "OPENAI_API_KEY",
  gemini: "GEMINI_API_KEY",
  qwen: "QWEN_API_KEY",
};

/** 环境变量里是否配了该 provider 的 key（用于无 client key 时的预检） */
export function hasEnvApiKey(provider: LLMProvider): boolean {
  if (provider === getServerProvider()) return hasServerApiKey(provider);
  const key = ENV_API_KEY[provider];
  return Boolean(key && process.env[key]);
}

function normalizeRuntimeConfig(
  provider?: LLMProvider | ApiProvider,
  clientConfig?: Partial<ClientApiSettings>
): ClientApiSettings | null {
  if (!clientConfig?.apiKey) return null;
  return normalizeApiSettings({
    ...clientConfig,
    provider: (clientConfig.provider || provider || "deepseek") as ApiProvider,
  });
}

function createRuntimeAdvisor(config: ClientApiSettings): Advisor {
  if (config.provider === "gemini") {
    const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
    const modelId = config.model || getProviderDefaults("gemini").model;
    return buildAdvisor((messages, options) => ({
      model: google(modelId),
      messages,
      temperature: options.temperature,
      maxOutputTokens: options.maxOutputTokens,
    }));
  }

  const defaults = getProviderDefaults(config.provider);
  const baseURL = config.provider === "openai" ? undefined : config.baseURL || defaults.baseURL;
  if (config.provider === "custom" && !baseURL) {
    throw new Error("自定义 API 需要填写 Base URL。 ");
  }

  const openaiCompatible = createOpenAI({
    apiKey: config.apiKey,
    baseURL,
    name: config.provider,
  });
  const modelId = config.model || defaults.model;
  return buildAdvisor((messages, options) => ({
    model: openaiCompatible.chat(modelId),
    messages,
    temperature: options.temperature,
    maxOutputTokens: options.maxOutputTokens,
  }));
}

type BuildArgs = {
  model: Parameters<typeof streamText>[0]["model"];
  messages: ChatMessage[];
  temperature?: number;
  maxOutputTokens?: number;
};

function buildAdvisor(
  buildArgs: (messages: ChatMessage[], options: { temperature: number; maxOutputTokens: number }) => BuildArgs
): Advisor {
  return {
    async chat(messages, options = {}) {
      const result = streamText(
        buildArgs(messages, {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxOutputTokens ?? 2000,
        })
      );
      return toErrorSafeTextStream(result);
    },

    async analyze(messages, options = {}) {
      const result = streamText(
        buildArgs(messages, {
          temperature: options.temperature ?? 0.6,
          maxOutputTokens: options.maxOutputTokens ?? 3000,
        })
      );
      return toErrorSafeTextStream(result);
    },

    async complete(messages, options = {}) {
      const result = await generateText(
        buildArgs(messages, {
          temperature: options.temperature ?? 0.6,
          maxOutputTokens: options.maxOutputTokens ?? 1500,
        })
      );
      return result.text;
    },
  };
}
