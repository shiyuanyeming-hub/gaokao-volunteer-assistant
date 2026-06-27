"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Copy, RotateCcw, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import type { GameState, FavorGrade, TeacherMood } from "@/lib/game";
import { statsToRadar } from "@/lib/game";
import { XuefengAvatar } from "@/components/shared/XuefengAvatar";
import { RiskRadar } from "./RiskRadar";

const GRADE_COLOR: Record<FavorGrade["grade"], string> = {
  S: "text-sprite-bright",
  A: "text-sprite",
  B: "text-ice-bright",
  C: "text-xf-yellow-light",
  D: "text-xf-red-bright",
};

const GRADE_RING: Record<FavorGrade["grade"], string> = {
  S: "border-sprite/40",
  A: "border-sprite/30",
  B: "border-ice/30",
  C: "border-xf-yellow/30",
  D: "border-xf-red/30",
};

const MOOD_TO_AVATAR: Record<TeacherMood, "normal" | "thinking" | "angry" | "happy"> = {
  冷静: "normal",
  皱眉: "thinking",
  血压上升: "angry",
  战术喝水: "normal",
  开始锐评: "angry",
  被你气笑: "happy",
};

interface EndingCardProps {
  state: GameState;
  grade: FavorGrade;
  onRestart: () => void;
}

export function EndingCard({ state, grade, onRestart }: EndingCardProps) {
  const radar = statsToRadar(state);

  const copyEnding = async () => {
    const text = `【${grade.label} · ${grade.grade}】好感度 ${Math.round(state.teacherFavor)}
清醒 ${Math.round(state.clarity)} · 现实 ${Math.round(state.practicality)} · 幻想 ${Math.round(state.fantasy)} · 血压 ${Math.round(state.bloodPressure)}

${grade.blurb}

——雪碧报考助手·恋与志愿（娱乐化工具，结果仅供参考）`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("战绩已复制，去晒一晒");
    } catch {
      toast.error("复制失败，请手动选中");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className="mx-auto max-w-2xl space-y-5"
    >
      {/* 标题 */}
      <div className="text-center">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
          攻略结果
        </div>
        <h2 className={`text-3xl font-extrabold ${GRADE_COLOR[grade.grade]}`}>
          《{grade.label}》{" "}
          <span className="text-2xl text-white/40">{grade.grade}</span>
        </h2>
      </div>

      {/* 雷达 + 好感度 + 数值 */}
      <div
        className={`flex items-center justify-center gap-6 rounded-2xl border bg-xf-card/60 p-4 ${GRADE_RING[grade.grade]}`}
      >
        <RiskRadar axes={radar} size={150} />
        <div className="space-y-3">
          <div>
            <div className={`text-3xl font-extrabold ${GRADE_COLOR[grade.grade]}`}>
              {Math.round(state.teacherFavor)}
            </div>
            <div className="text-xs text-white/50">最终好感度</div>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
            <Stat label="清醒" value={state.clarity} />
            <Stat label="现实" value={state.practicality} />
            <Stat label="幻想" value={state.fantasy} />
            <Stat label="血压" value={state.bloodPressure} />
          </div>
        </div>
      </div>

      {/* 结语 */}
      <div className="flex gap-3">
        <XuefengAvatar mood={MOOD_TO_AVATAR[grade.mood]} size="md" />
        <div className="relative flex-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.03] p-4">
          <span className="absolute -top-2.5 left-3 rounded-full bg-xf-yellow px-2 py-0.5 text-[10px] font-bold text-black">
            张老师结语
          </span>
          <p className="mt-1 text-sm leading-relaxed text-white/90">{grade.blurb}</p>
        </div>
      </div>

      {/* 操作 */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={copyEnding}
          className="inline-flex items-center gap-1.5 rounded-xl border border-ice/40 bg-ice/10 px-4 py-2.5 text-sm font-bold text-ice-bright transition-colors hover:bg-ice/20"
        >
          <Copy className="size-4" /> 复制战绩
        </button>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
        >
          <RotateCcw className="size-4" /> 重新攻略
        </button>
        <Link
          href="/analysis"
          className="inline-flex items-center gap-1.5 rounded-xl bg-sprite px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-sprite-bright"
        >
          <BarChart3 className="size-4" /> 进志愿推荐
        </Link>
      </div>

      <p className="text-center text-xs text-white/30">
        闯关结果为娱乐化模拟，仅供参考，不替代官方数据与正式志愿填报。
      </p>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <>
      <span className="text-white/40">{label}</span>
      <span className="text-right font-bold text-white/80">{Math.round(value)}</span>
    </>
  );
}
