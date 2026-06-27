// 风险雷达图（纯 SVG，无新依赖）— 用于闯关游戏实时展示状态。

interface RadarAxis {
  label: string;
  value: number; // 0-100
}

interface RiskRadarProps {
  axes: RadarAxis[];
  size?: number;
}

export function RiskRadar({ axes, size = 180 }: RiskRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 30;
  const n = axes.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, radius: number): [number, number] => [
    cx + Math.cos(angle(i)) * radius,
    cy + Math.sin(angle(i)) * radius,
  ];

  const rings = [0.25, 0.5, 0.75, 1];
  const dataPts = axes.map((a, i) => pt(i, r * Math.max(0.04, a.value / 100)));
  const polygon = dataPts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* 网格环 */}
      {rings.map((ring, ri) => (
        <polygon
          key={ri}
          points={axes
            .map((_, i) => pt(i, r * ring).join(","))
            .join(" ")}
          fill="none"
          stroke="rgba(125, 211, 252, 0.15)"
          strokeWidth={1}
        />
      ))}
      {/* 轴线 */}
      {axes.map((a, i) => {
        const [x, y] = pt(i, r);
        const [lx, ly] = pt(i, r + 16);
        return (
          <g key={a.label}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(125, 211, 252, 0.12)" strokeWidth={1} />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-ice-bright/70"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {a.label}
            </text>
            <text
              x={lx}
              y={ly + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-mint"
              style={{ fontSize: 10 }}
            >
              {Math.round(a.value)}
            </text>
          </g>
        );
      })}
      {/* 数据多边形 */}
      <polygon
        points={polygon}
        fill="rgba(0, 179, 100, 0.28)"
        stroke="#1fd673"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* 数据点 */}
      {dataPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="#6ee7b7" />
      ))}
    </svg>
  );
}
