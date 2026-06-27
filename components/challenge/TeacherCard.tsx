"use client";

import { XuefengAvatar } from "@/components/shared/XuefengAvatar";
import type { GameState, TeacherMood } from "@/lib/game";

// mood → 文字 + 颜色
const MOOD_LABEL: Record<TeacherMood, { text: string; color: string }> = {
  冷静: { text: "冷静", color: "text-sprite-bright" },
  皱眉: { text: "皱眉", color: "text-ice-bright" },
  血压上升: { text: "血压上升", color: "text-xf-yellow-light" },
  战术喝水: { text: "战术喝水", color: "text-ice-bright" },
  开始锐评: { text: "开始锐评", color: "text-xf-red-bright" },
  被你气笑: { text: "被你气笑", color: "text-xf-red-bright" },
};

// mood → XuefengAvatar 表情（normal=sprite 绿 / thinking=ice / angry=红 / happy=choco）
const AVATAR_MOOD: Record<TeacherMood, "normal" | "thinking" | "angry" | "happy"> = {
  冷静: "normal",
  皱眉: "thinking",
  血压上升: "angry",
  战术喝水: "normal",
  开始锐评: "angry",
  被你气笑: "happy",
};

type StatKey = "teacherFavor" | "bloodPressure" | "clarity" | "fantasy" | "practicality";

const STATS: { key: StatKey; label: string; color: string }[] = [
  { key: "teacherFavor", label: "好感度", color: "bg-sprite" },
  { key: "bloodPressure", label: "血压值", color: "bg-xf-red" },
  { key: "clarity", label: "清醒值", color: "bg-ice" },
  { key: "fantasy", label: "幻想值", color: "bg-xf-yellow" },
  { key: "practicality", label: "现实度", color: "bg-choco" },
];

interface TeacherCardProps {
  state: GameState;
  mood: TeacherMood;
  /** 本回合数值变化（用于高亮），可选 */
  delta?: Partial<Record<StatKey, number>>;
}

export function TeacherCard({ state, mood, delta }: TeacherCardProps) {
  const moodInfo = MOOD_LABEL[mood];

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-xf-card p-4">
      {/* 立绘占位 + 表情 */}
      <div className="flex flex-col items-center gap-2 border-b border-white/10 pb-4">
        <XuefengAvatar mood={AVATAR_MOOD[mood]} size="lg" />
        <span className={`text-base font-extrabold ${moodInfo.color}`}>
          {moodInfo.text}
        </span>
        <span className="text-xs text-white/40">张老师 · 当前表情</span>
      </div>

      {/* 5 维数值条 */}
      <div className="space-y-3">
        {STATS.map((stat) => {
          const d = delta?.[stat.key];
          return (
            <div key={stat.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-white/60">{stat.label}</span>
                <span className="flex items-center gap-1.5">
                  {d !== undefined && d !== 0 && (
                    <span
                      className={`text-[10px] font-bold ${d > 0 ? "text-sprite-bright" : "text-xf-red-bright"}`}
                    >
                      {d > 0 ? `+${d}` : d}
                    </span>
                  )}
                  <span className="font-bold text-white/80">
                    {Math.round(state[stat.key])}
                  </span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${stat.color} transition-all duration-500`}
                  style={{ width: `${Math.max(0, Math.min(100, state[stat.key]))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
