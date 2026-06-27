import { cn } from "@/lib/utils";
import { XuefengAvatar } from "@/components/shared/XuefengAvatar";
import { User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-4 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="flex-shrink-0 size-9 rounded-full bg-slate-600 flex items-center justify-center ring-2 ring-white/10">
          <User className="size-5 text-slate-300" />
        </div>
      ) : (
        <XuefengAvatar mood="normal" size="sm" />
      )}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-xf-red/80 text-white rounded-tr-sm"
            : "bg-xf-card text-white/90 rounded-tl-sm border border-white/10"
        )}
      >
        <div className="whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-xf-red-bright animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}
