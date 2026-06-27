export type ApiProvider = "deepseek" | "openai" | "qwen" | "gemini" | "custom";

export interface ClientApiSettings {
  provider: ApiProvider;
  apiKey: string;
  model: string;
  baseURL?: string;
}

export const API_SETTINGS_STORAGE_KEY = "xuefeng-api-settings";

export const API_PROVIDER_OPTIONS: Array<{
  provider: ApiProvider;
  label: string;
  model: string;
  models: string[];
  baseURL?: string;
  note: string;
}> = [
  {
    provider: "deepseek",
    label: "DeepSeek",
    model: "deepseek-chat",
    models: ["deepseek-chat", "deepseek-reasoner"],
    baseURL: "https://api.deepseek.com/v1",
    note: "使用 DeepSeek 平台 API Key。deepseek-chat 适合聊天，deepseek-reasoner 更慢但推理更强。",
  },
  {
    provider: "openai",
    label: "OpenAI",
    model: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1"],
    note: "官方 OpenAI Key，默认无需填写 Base URL。",
  },
  {
    provider: "qwen",
    label: "通义千问 Qwen",
    model: "qwen-plus",
    models: ["qwen-plus", "qwen-turbo", "qwen-max", "qwen-long"],
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    note: "使用 DashScope / 阿里云百炼的模型服务 API Key，不是阿里云 RAM AccessKey。",
  },
  {
    provider: "gemini",
    label: "Google Gemini",
    model: "gemini-2.0-flash",
    models: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"],
    note: "使用 Google AI Studio / Gemini API Key。",
  },
  {
    provider: "custom",
    label: "自定义兼容 API",
    model: "gpt-4o-mini",
    models: ["gpt-4o-mini", "deepseek-chat", "qwen-plus"],
    baseURL: "https://api.example.com/v1",
    note: "适合 OpenAI-compatible 网关或聚合平台。",
  },
];

export function getProviderDefaults(provider: ApiProvider) {
  return (
    API_PROVIDER_OPTIONS.find((item) => item.provider === provider) ||
    API_PROVIDER_OPTIONS[0]
  );
}

export function normalizeApiSettings(
  settings: Partial<ClientApiSettings> | null | undefined
): ClientApiSettings {
  const provider = settings?.provider || "deepseek";
  const defaults = getProviderDefaults(provider);
  return {
    provider,
    apiKey: normalizeApiKey(settings?.apiKey),
    model: String(settings?.model || defaults.model).trim(),
    baseURL: normalizeBaseURL(settings?.baseURL || defaults.baseURL),
  };
}

export function normalizeApiKey(apiKey: unknown) {
  return String(apiKey || "")
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, "")
    .trim()
    .replace(/^Bearer\s+/i, "")
    .trim();
}

export function normalizeBaseURL(baseURL: unknown) {
  const cleaned = String(baseURL || "")
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/chat\/completions$/i, "")
    .replace(/\/responses$/i, "");

  return cleaned || undefined;
}

export function loadStoredApiSettings(): ClientApiSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(API_SETTINGS_STORAGE_KEY);
    if (!raw) return null;
    return normalizeApiSettings(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveStoredApiSettings(settings: ClientApiSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    API_SETTINGS_STORAGE_KEY,
    JSON.stringify(normalizeApiSettings(settings))
  );
}

export function clearStoredApiSettings() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(API_SETTINGS_STORAGE_KEY);
}

export function getStoredApiSettingsPayload(): ClientApiSettings | undefined {
  const settings = loadStoredApiSettings();
  return settings?.apiKey ? settings : undefined;
}

export function maskApiKey(apiKey: string) {
  const cleaned = apiKey.trim();
  if (!cleaned) return "未设置";
  if (cleaned.length <= 8) return "已设置";
  return `${cleaned.slice(0, 4)}...${cleaned.slice(-4)}`;
}
