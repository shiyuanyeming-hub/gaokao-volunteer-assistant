"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ArrowRight } from "lucide-react";
import {
  GAME_STAGES,
  TOTAL_STAGES,
  initialGameState,
  applyChoice,
  evaluateFavor,
  pickReaction,
  type GameState,
  type GameOption,
  type TeacherMood,
  type FavorGrade,
  type Reaction,
} from "@/lib/game";
import { GameProgressBar } from "@/components/game/GameProgressBar";
import { GameQuestionCard } from "@/components/game/GameQuestionCard";
import { EndingCard } from "@/components/game/EndingCard";
import { TeacherCard } from "@/components/challenge/TeacherCard";
import { RoastBubble } from "@/components/challenge/RoastBubble";

type Phase = "intro" | "playing" | "reacting" | "ending";
type StatKey = "teacherFavor" | "bloodPressure" | "clarity" | "fantasy" | "practicality";

const STAT_KEYS: StatKey[] = [
  "teacherFavor",
  "bloodPressure",
  "clarity",
  "fantasy",
  "practicality",
];

const DELTA_LABELS: Record<StatKey, string> = {
  teacherFavor: "好感度",
  bloodPressure: "血压",
  clarity: "清醒",
  fantasy: "幻想",
  practicality: "现实",
};

function computeDelta(
  prev: GameState,
  next: GameState
): Partial<Record<StatKey, number>> {
  const d: Partial<Record<StatKey, number>> = {};
  STAT_KEYS.forEach((k) => {
    const diff = Math.round(next[k] - prev[k]);
    if (diff !== 0) d[k] = diff;
  });
  return d;
}

export function ChallengeContainer() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [state, setState] = useState<GameState>(initialGameState);
  const [stepIdx, setStepIdx] = useState(0);
  const [mood, setMood] = useState<TeacherMood>("冷静");
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [snapshot, setSnapshot] = useState<GameState | null>(null);
  const [delta, setDelta] = useState<Partial<Record<StatKey, number>>>({});
  const [grade, setGrade] = useState<FavorGrade | null>(null);

  const handleSelect = useCallback(
    (option: GameOption) => {
      const snap = state;
      const applied = applyChoice(state, option);
      const react = pickReaction(option, applied);
      setSnapshot(snap);
      setState(applied);
      setDelta(computeDelta(snap, applied));
      setReaction(react);
      setMood(react.mood);
      setPhase("reacting");
    },
    [state]
  );

  const handleRetry = useCallback(() => {
    if (snapshot) setState(snapshot);
    setReaction(null);
    setDelta({});
    setMood("冷静");
    setPhase("playing");
  }, [snapshot]);

  const handleNext = useCallback(() => {
    setReaction(null);
    setDelta({});
    setMood("冷静");
    if (stepIdx >= TOTAL_STAGES - 1) {
      setGrade(evaluateFavor(state));
      setPhase("ending");
    } else {
      setStepIdx((p) => p + 1);
      setPhase("playing");
    }
  }, [stepIdx, state]);

  const start = useCallback(() => {
    setState(initialGameState);
    setStepIdx(0);
    setMood("冷静");
    setReaction(null);
    setDelta({});
    setSnapshot(null);
    setGrade(null);
    setPhase("playing");
  }, []);

  // —— 引导页 ——
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-5"
        >
          <div className="mx-auto mb-1 h-1.5 w-12 rounded-full bg-choco" />
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
            恋与志愿
            <span className="block text-sprite-bright">能让他对你刮目相看吗？</span>
          </h1>
          <p className="text-sm leading-relaxed text-white/60">
            10 章志愿填报选择，每一选都会改变张老师对你的
            <span className="text-sprite-bright">好感度</span>、
            <span className="text-xf-red-bright">血压</span>和表情。选得现实，他冷静点头；
            选得离谱，他血压飙升、开始锐评。十章走完，看你能拿到什么结局。
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-white/40">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">10 章 · Galgame 攻略</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">好感度结局</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">每一章可重选</span>
          </div>
          <button
            onClick={start}
            className="rb-glow-button mt-2 inline-flex items-center gap-2 rounded-2xl bg-sprite px-8 py-4 text-base font-extrabold text-white transition-all hover:bg-sprite-bright"
          >
            开始攻略 <ArrowRight className="size-5" />
          </button>
          <p className="text-xs text-white/25">娱乐玩法，张老师的反应不构成正式志愿建议</p>
        </motion.div>
      </div>
    );
  }

  // —— 结局页 ——
  if (phase === "ending" && grade) {
    return (
      <div className="px-4 py-8">
        <EndingCard state={state} grade={grade} onRestart={start} />
      </div>
    );
  }

  // —— 攻略页（三栏）——
  const stage = GAME_STAGES[stepIdx];
  const isLast = stepIdx >= TOTAL_STAGES - 1;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      {/* 顶部：章节进度 */}
      <GameProgressBar current={stage.step} total={TOTAL_STAGES} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左栏：张老师角色卡（立绘 + 表情 + 数值） */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            <TeacherCard
              state={state}
              mood={mood}
              delta={phase === "reacting" ? delta : undefined}
            />
          </div>
        </aside>

        {/* 右栏：问题/选项 或 反应+操作 */}
        <div className="space-y-6 lg:col-span-2">
          {phase === "playing" && (
            <GameQuestionCard stage={stage} onSelect={handleSelect} />
          )}

          {phase === "reacting" && reaction && (
            <>
              <RoastBubble text={reaction.line} mood={reaction.mood} visible />

              {/* 数值变化汇总 */}
              <DeltaSummary delta={delta} />

              {/* 操作：重选 / 下一题 */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white/80 transition-colors hover:bg-white/10"
                >
                  <RotateCcw className="size-4" /> 重选这一章
                </button>
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sprite px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-sprite-bright"
                >
                  {isLast ? "查看结局" : "下一章"}
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DeltaSummary({ delta }: { delta: Partial<Record<StatKey, number>> }) {
  const entries = STAT_KEYS.filter((k) => delta[k] !== undefined) as StatKey[];
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {entries.map((k) => {
        const v = delta[k]!;
        const positive = k === "fantasy" || k === "bloodPressure" ? v < 0 : v > 0;
        // 幻想/血压：下降是好事（绿）；其余：上升是好事
        return (
          <span
            key={k}
            className={`rounded-full border px-3 py-1 text-xs font-bold ${
              positive
                ? "border-sprite/40 bg-sprite/10 text-sprite-bright"
                : "border-xf-red/40 bg-xf-red/10 text-xf-red-bright"
            }`}
          >
            {DELTA_LABELS[k]} {v > 0 ? `+${v}` : v}
          </span>
        );
      })}
    </div>
  );
}
