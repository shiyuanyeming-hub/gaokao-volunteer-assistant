import { API_PROVIDER_OPTIONS, type ApiProvider } from "@/lib/api-settings";

export type ServerApiProvider = Exclude<ApiProvider, "custom">;

const SERVER_KEY_ENV: Record<ServerApiProvider, string> = {
  deepseek: "DEEPSEEK_API_KEY",
  openai: "OPENAI_API_KEY",
  qwen: "QWEN_API_KEY",
  gemini: "GEMINI_API_KEY",
};

export function getServerProvider(): ServerApiProvider {
  const raw = process.env.LLM_PROVIDER as ServerApiProvider | undefined;
  if (raw && raw in SERVER_KEY_ENV) return raw;
  return "deepseek";
}

export function hasServerApiKey(provider = getServerProvider()) {
  const envName = SERVER_KEY_ENV[provider];
  return Boolean(process.env[envName]?.trim());
}

export function shouldUseServerApi() {
  return hasServerApiKey();
}

export function allowClientApiOverride() {
  return process.env.ALLOW_CLIENT_API_OVERRIDE === "true";
}

export function getPublicServerApiStatus() {
  const provider = getServerProvider();
  const option = API_PROVIDER_OPTIONS.find((item) => item.provider === provider);
  const enabled = hasServerApiKey(provider);

  return {
    serverApiReady: enabled,
    provider,
    providerLabel: option?.label || provider,
    clientOverrideAllowed: allowClientApiOverride(),
  };
}
