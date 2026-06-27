export interface AdvisorConfig {
  apiKey: string;
  baseURL?: string;
  model: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AdvisorOptions {
  temperature?: number;
  maxOutputTokens?: number;
}

export interface Advisor {
  /** Generate a streaming chat response */
  chat(
    messages: ChatMessage[],
    options?: AdvisorOptions
  ): Promise<ReadableStream>;

  /** Generate a streaming analysis response */
  analyze(
    messages: ChatMessage[],
    options?: AdvisorOptions
  ): Promise<ReadableStream>;

  /** Generate a complete (non-streaming) text response — for structured JSON */
  complete(
    messages: ChatMessage[],
    options?: AdvisorOptions
  ): Promise<string>;
}
