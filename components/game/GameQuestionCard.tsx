"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { GameStage, GameOption } from "@/lib/game";

interface GameQuestionCardProps {
  stage: GameStage;
  onSelect: (option: GameOption) => void;
}

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export function GameQuestionCard({ stage, onSelect }: GameQuestionCardProps) {
  return (
    <motion.div
      key={stage.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-xl font-extrabold text-white sm:text-2xl">
          {stage.title}
        </h2>
        <p className="mt-1 text-sm text-white/60">{stage.question}</p>
        {stage.helper && (
          <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-ice/20 bg-ice/5 px-3 py-2 text-xs text-ice-bright/80">
            <Lightbulb className="mt-px size-3.5 shrink-0" />
            <span>{stage.helper}</span>
          </p>
        )}
      </div>

      <div className="grid gap-2.5">
        {stage.options.map((opt, i) => (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onSelect(opt)}
            className="group flex items-start gap-3 rounded-xl border border-white/10 bg-xf-card px-4 py-3 text-left transition-colors hover:border-sprite/50 hover:bg-sprite/5"
          >
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-xs font-bold text-white/70 group-hover:bg-sprite group-hover:text-white">
              {LETTERS[i]}
            </span>
            <span className="text-sm font-medium text-white/90">{opt.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
