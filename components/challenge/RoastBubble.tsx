"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XuefengAvatar } from "@/components/shared/XuefengAvatar";
import { cn } from "@/lib/utils";
import type { TeacherMood } from "@/lib/game";

// mood → XuefengAvatar 表情
const AVATAR_MOOD: Record<TeacherMood, "normal" | "thinking" | "angry" | "happy"> = {
  冷静: "normal",
  皱眉: "thinking",
  血压上升: "angry",
  战术喝水: "normal",
  开始锐评: "angry",
  被你气笑: "happy",
};

interface RoastBubbleProps {
  text: string;
  mood: TeacherMood;
  visible: boolean;
}

/** 选择后的反应气泡（持续显示，由父组件控制 visible，不自动消失） */
export function RoastBubble({ text, mood, visible }: RoastBubbleProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="mx-auto flex max-w-lg items-start gap-4"
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.2 }}
          >
            <XuefengAvatar mood={AVATAR_MOOD[mood]} size="md" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className={cn(
              "relative flex-1 rounded-2xl rounded-tl-sm p-5",
              "bg-xf-red/90 border border-xf-red-bright/30"
            )}
          >
            <div className="absolute -top-3 left-4 rounded-full bg-xf-yellow px-2 py-0.5 text-xs font-bold text-black">
              {mood}
            </div>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-white">
              {text}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
