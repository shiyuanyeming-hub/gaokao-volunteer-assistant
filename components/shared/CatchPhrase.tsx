"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface CatchPhraseProps {
  text: string;
  show: boolean;
  onComplete?: () => void;
  className?: string;
}

export function CatchPhrase({
  text,
  show,
  onComplete,
  className,
}: CatchPhraseProps) {
  // `dismissed` is only ever set inside the async timeout callback (allowed),
  // never synchronously in the effect body. Visibility is derived from `show`.
  const [dismissed, setDismissed] = useState(false);
  const visible = show && !dismissed;

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      setDismissed(true);
      onComplete?.();
    }, 2500);
    return () => {
      clearTimeout(timer);
      setDismissed(false); // reset for the next show cycle
    };
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "fixed top-1/3 left-1/2 -translate-x-1/2 z-[100]",
            "bg-xf-red text-white",
            "px-6 py-4 rounded-2xl",
            "text-xl font-extrabold text-center max-w-md",
            "ring-1 ring-xf-red-bright/40",
            className
          )}
        >
          <span className="flex items-center gap-1 text-yellow-300 text-sm mb-1">
            <Quote className="size-3.5" /> 张老师金句
          </span>
          「{text}」
        </motion.div>
      )}
    </AnimatePresence>
  );
}
