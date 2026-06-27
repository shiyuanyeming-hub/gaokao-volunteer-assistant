"use client";

import { useState, useCallback } from "react";
import { PersonaSelector } from "@/components/chat/PersonaSelector";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import type { PersonaMode } from "@/lib/constants";
import { getStoredApiSettingsPayload } from "@/lib/api-settings";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [persona, setPersona] = useState<PersonaMode>("livestream");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string | undefined>();

  const handleSend = useCallback(
    async (content: string) => {
      const newMessage: Message = { role: "user", content };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setIsStreaming(true);
      setStreamingContent("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages,
            persona,
            apiConfig: getStoredApiSettingsPayload(),
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "出错了，再试试看。");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("无法读取响应流");

        // 后端用 AI SDK 的 toTextStreamResponse() 返回纯文本流，
        // 每个 chunk 就是原始 token 文本，直接累加即可（不是 SSE / data stream）。
        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          fullContent += decoder.decode(value, { stream: true });
          setStreamingContent(fullContent);
        }

        // Done streaming — add to messages
        if (fullContent) {
          setMessages((prev) => [...prev, { role: "assistant", content: fullContent }]);
        } else {
          // 流空兜底（key 有效但 LLM 无返回 / 网络中断 / key 失效）
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "❌ 张老师这次没接上话——可能是 API Key 失效或网络问题。去右上角「API」检查一下再重试。",
            },
          ]);
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "张老师暂时无法回答，请稍后再试。";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `❌ ${errorMsg}` },
        ]);
      } finally {
        setIsStreaming(false);
        setStreamingContent(undefined);
      }
    },
    [messages, persona]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      <PersonaSelector value={persona} onChange={setPersona} />
      <ChatContainer
        messages={messages}
        isStreaming={isStreaming}
        streamingContent={streamingContent}
      />
      <ChatInput onSend={handleSend} isLoading={isStreaming} />
    </div>
  );
}
