"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const QUICK_PROMPTS = [
  "我考了500分，想学金融，行吗？",
  "文科生有哪些好就业的专业？",
  "普通家庭该选城市还是选学校？",
  "计算机现在还值得学吗？",
];

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showQuick, setShowQuick] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
    setShowQuick(false);
  };

  const handleQuick = (prompt: string) => {
    if (isLoading) return;
    onSend(prompt);
    setShowQuick(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="border-t border-white/10 bg-xf-darker/90 px-4 py-4">
      {/* Quick prompts */}
      {showQuick && !isLoading && (
        <div className="flex flex-wrap gap-2 mb-4 max-w-2xl mx-auto">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handleQuick(p)}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-3 max-w-2xl mx-auto">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="问张老师任何关于高考、志愿、专业、就业的问题..."
          className="min-h-[48px] max-h-[120px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-xf-red/50"
          rows={1}
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          size="icon"
          className={cn(
            "flex-shrink-0 size-12 rounded-xl transition-all",
            input.trim() && !isLoading
              ? "bg-sprite hover:bg-sprite-bright"
              : "bg-white/10"
          )}
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Send className="size-5" />
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-white/20 mt-2">
        张老师的建议仅供参考，志愿填报请以官方信息为准
      </p>
    </div>
  );
}
