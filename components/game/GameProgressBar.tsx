// 闯关进度条 — 第 N / 共 M 关

interface GameProgressBarProps {
  current: number; // 1-based
  total: number;
}

export function GameProgressBar({ current, total }: GameProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-bold text-sprite-bright">
          第 {current} / {total} 章 · 攻略进度
        </span>
        <span className="text-white/40">{pct}%</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < current ? "bg-sprite" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
