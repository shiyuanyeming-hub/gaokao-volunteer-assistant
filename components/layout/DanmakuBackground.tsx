"use client";

import { useRef, useMemo } from "react";

// 张老师金句弹幕 —— 纯文字，无 emoji。克制：数量少、慢、淡，只作背景氛围。
const DANMAKU_LINES = [
  "你考不过我你信嘛",
  "家里没矿别谈理想",
  "先谋生再谋爱",
  "我问你个问题",
  "选择比努力重要",
  "停停停你先别急",
  "就业 就业 就业",
  "社会就是个大筛子",
  "先站稳再登高",
  "方向错了跑再快也没用",
  "你拿什么跟985抢",
  "专业跟你一辈子",
  "谁告诉你的",
  "你去看看",
  "没有之一",
  "别用战术勤奋掩盖战略懒惰",
  "雪碧",
  "巧乐兹",
];

interface DanmakuItem {
  id: number;
  text: string;
  left: number; // percentage
  duration: number; // seconds
  delay: number; // seconds before appearing
  fontSize: number; // rem
}

// 确定性伪随机 in [0,1) —— 保持渲染纯净（无 Math.random），避免 SSR/CSR 水合不一致
function seeded(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function DanmakuBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => {
    const result: DanmakuItem[] = [];
    const count = 9; // 克制：从 25 降到 9，弱化「直播间」喧闹感
    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        text: DANMAKU_LINES[i % DANMAKU_LINES.length],
        left: seeded(i, 1) * 85,
        duration: 16 + seeded(i, 2) * 12, // 放慢
        delay: seeded(i, 3) * 14,
        fontSize: 0.85 + seeded(i, 4) * 0.5,
      });
    }
    return result;
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {items.map((item) => (
        <span
          key={item.id}
          className="danmaku"
          style={{
            left: `${item.left}%`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            fontSize: `${item.fontSize}rem`,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
