import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface XuefengAvatarProps {
  mood?: "normal" | "thinking" | "angry" | "happy";
  className?: string;
  size?: "sm" | "md" | "lg";
}

// mood 用品牌色底区分：normal=雪碧绿，thinking=冰蓝，angry=风险红，happy=巧乐兹棕
const moodConfig = {
  normal: { bg: "bg-sprite", ring: "ring-sprite/40", label: "张老师" },
  thinking: { bg: "bg-ice", ring: "ring-ice/40", label: "张老师·琢磨中" },
  angry: { bg: "bg-xf-red", ring: "ring-xf-red/50", label: "张老师·急了" },
  happy: { bg: "bg-choco", ring: "ring-choco/40", label: "张老师·乐了" },
} as const;

const sizeConfig = {
  sm: "size-10",
  md: "size-14",
  lg: "size-20",
} as const;

const iconConfig = {
  sm: "size-5",
  md: "size-6",
  lg: "size-9",
} as const;

export function XuefengAvatar({
  mood = "normal",
  className,
  size = "md",
}: XuefengAvatarProps) {
  const m = moodConfig[mood];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full ring-2 text-white",
        m.bg,
        m.ring,
        sizeConfig[size],
        className
      )}
      title={m.label}
      aria-label={m.label}
      role="img"
    >
      <Mic className={iconConfig[size]} />
    </div>
  );
}
