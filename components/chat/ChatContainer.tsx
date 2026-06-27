"use client";

import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { LoadingDots } from "@/components/shared/LoadingDots";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatContainerProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent?: string;
}

export function ChatContainer({
  messages,
  isStreaming,
  streamingContent,
}: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-1">
      {messages.length === 0 && !isStreaming && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 py-20">
          <div className="mb-4 size-16 rounded-full bg-sprite/15 ring-1 ring-sprite/30 tex-bubbles" />
          <h3 className="text-lg font-bold text-white mb-2">
            张老师直播间已开播
          </h3>
          <p className="text-sm text-white/40 max-w-sm">
            有什么想问的？可以直接打字，也可以点下面的快捷提问。
            张老师会反问、会拆幻想，但最后一定给你实在建议。
          </p>
        </div>
      )}

      {messages.map((msg, i) => (
        <ChatMessage key={i} role={msg.role} content={msg.content} />
      ))}

      {isStreaming && streamingContent !== undefined && (
        <ChatMessage
          role="assistant"
          content={streamingContent}
          isStreaming
        />
      )}

      {isStreaming && streamingContent === undefined && <LoadingDots />}

      <div ref={bottomRef} />
    </div>
  );
}
