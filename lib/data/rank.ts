// 位次估算（mock 一分一段）
// ⚠️ 这是基于批次线的「示意估算」，非真实一分一段表。
//    生产环境应导入各省考试院公布的真实一分一段表（见 data/README.md）。
//    返回结果会带 isEstimated 标记，UI 显示「模拟位次」。

import type { ScoreCategory } from "./types";
import { getProvince } from "./access";

/** 各省高考人数示意值（万人级近似，用于估算位次量级） */
const CANDIDATE_COUNT: Record<string, number> = {
  henan: 1_360_000, shandong: 990_000, hebei: 860_000, guangdong: 760_000,
  sichuan: 800_000, hunan: 680_000, guangxi: 460_000, anhui: 650_000,
  jiangsu: 440_000, hubei: 520_000, zhejiang: 360_000, jiangxi: 600_000,
  guizhou: 490_000, beijing: 72_000, shanghai: 53_000, tianjin: 64_000,
  hainan: 70_000, liaoning: 250_000, chongqing: 350_000, fujian: 230_000,
};

const DEFAULT_CANDIDATES = 500_000;

export interface RankEstimate {
  rank: number;
  isEstimated: boolean;
  note: string;
}

/**
 * 由分数估算全省位次（示意）。
 * 使用以批次线为锚的 sigmoid 近似：分数越高、位次越小。
 */
export function scoreToRankEstimate(
  provinceId: string,
  score: number,
  category: ScoreCategory
): RankEstimate {
  const province = getProvince(provinceId);
  const total = CANDIDATE_COUNT[provinceId] ?? DEFAULT_CANDIDATES;

  if (!province) {
    return {
      rank: Math.max(1, Math.round(total * 0.5)),
      isEstimated: true,
      note: "省份未识别，使用默认估算",
    };
  }

  // 取该类别的批次线（找不到则取任一可用类别）
  const bl =
    province.batchLines[category] ??
    Object.values(province.batchLines)[0] ??
    { 本科线: 400 };

  const center = bl.本科线 + 50; // 本科线略上方位次约在中段
  const spread = 70;
  // sigmoid: score 远高于 center → frac 接近 0（位次靠前）；远低于 → frac 接近 1
  const frac = 1 / (1 + Math.exp((score - center) / spread));
  const rank = Math.max(1, Math.round(total * frac));

  return {
    rank,
    isEstimated: true,
    note: `基于${province.provinceName}近年数据的示意位次，非真实一分一段表`,
  };
}

/** 给定目标位次范围，反推大致分数（用于冲稳保区间说明） */
export function rankToScoreApprox(
  provinceId: string,
  targetRank: number,
  category: ScoreCategory
): number {
  const province = getProvince(provinceId);
  const total = CANDIDATE_COUNT[provinceId] ?? DEFAULT_CANDIDATES;
  if (!province) return 500;
  const bl =
    province.batchLines[category] ??
    Object.values(province.batchLines)[0] ??
    { 本科线: 400 };
  const center = bl.本科线 + 50;
  const spread = 70;
  const frac = Math.min(Math.max(targetRank / total, 0.0001), 0.9999);
  // 反解 sigmoid: score = center + spread * ln((1/frac - 1))
  return Math.round(center + spread * Math.log(1 / frac - 1));
}
