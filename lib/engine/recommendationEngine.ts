// 志愿推荐引擎（纯函数、确定性、零 API 依赖）
// 输入考生画像，输出结构化方案：分数层级 / 冲稳保 / 推荐专业 / 风险 / 策略 / 锐评。
// 文案层走 zhangxuefengSkill 模板；LLM 增强在 app/api/recommend 路由中可选叠加。
// ⚠️ 位次当前为估算，结果带 isSimulated 标记，UI 会提示「模拟推荐」。

import {
  getProvince,
  getAllMajors,
  levelsForScoreBand,
  scoreToRankEstimate,
  type ScoreBand,
  type ScoreCategory,
  type MajorData,
  type UniversityLevel,
  type ProvinceData,
} from "@/lib/data";
import {
  buildAdviceBundle,
  scoreRisk,
  classifyMajorRisk,
  DISCLAIMER,
  type RoastInput,
} from "@/lib/skill/zhangxuefengSkill";

// ============ 输入输出类型 ============

export interface RecommendInput {
  province: string; // province id（如 "hubei"）或省名
  score: number;
  rank?: number;
  subjectTrack: string; // 物理类/历史类/文科/理科/综合改革
  selectedSubjects?: string[];
  familyBudget: "low" | "mid" | "high";
  cityPreference: "一线" | "新一线" | "省会" | "离家近" | "无所谓";
  majorPreference: string; // MajorCategory 名称或 "不限"
  careerGoal: string; // 高薪/稳定/考公/考研/进体制/进大厂/回老家/出国/家里有人脉
  riskPreference: "保守" | "稳妥" | "冲一冲";
  acceptMinban?: boolean;
  acceptZhongwai?: boolean;
  acceptZhuanke?: boolean;
}

export interface TierAdvice {
  院校类型: string[];
  城市层级: string;
  专业方向: string[];
  风险提示: string;
  锐评: string;
}

export interface MajorAdvice {
  major: MajorData;
  推荐指数: number; // 0-100
  适合原因: string;
  风险分级: "低风险" | "中风险" | "高风险";
  风险原因: string;
  一句话锐评: string;
}

export interface RecommendResult {
  provinceName: string;
  scoreBand: ScoreBand;
  isSimulated: boolean;
  rank: number;
  rankNote: string;
  conflict: string; // 当前分数主要矛盾
  scenarioHints: string[];
  rushStableSafe: { 冲: TierAdvice; 稳: TierAdvice; 保: TierAdvice };
  recommendedMajors: MajorAdvice[];
  avoidMajors: { name: string; category: string; reason: string }[];
  schoolStrategy: string;
  majorStrategy: string;
  cityStrategy: string;
  riskProfile: ReturnType<typeof scoreRisk>;
  roast: string;
  rational: string;
  parentAdvice: string;
  studentAdvice: string;
  disclaimer: string;
  /** 锐评是否经过 LLM 增强（false = 模板文案） */
  llmEnhanced: boolean;
}

// ============ 内部工具 ============

function trackToCategory(track: string): ScoreCategory {
  if (track.includes("物理")) return "物理类";
  if (track.includes("历史")) return "历史类";
  if (track.includes("文科") || track.includes("文")) return "文科";
  if (track.includes("理科") || track.includes("理")) return "理科";
  return "综合";
}

function resolveProvince(input: RecommendInput): ProvinceData | undefined {
  return getProvince(input.province) ?? undefined;
}

function computeScoreBand(
  score: number,
  bl: { 本科线: number; 特控线?: number; 专科线?: number }
): ScoreBand {
  const tk = bl.特控线 ?? bl.本科线 + 70;
  if (score >= tk + 60) return "高分段";
  if (score >= tk) return "中高分段";
  if (score >= bl.本科线 + 30) return "一本线上";
  if (score >= bl.本科线) return "本科线上";
  return "专科段";
}

/** 选科是否满足专业硬性要求 */
function majorSelectable(
  major: MajorData,
  selected: string[] | undefined
): boolean {
  if (!major.requiredSubjects || major.requiredSubjects.length === 0) return true;
  if (!selected || selected.length === 0) return true; // 未填选科时不做硬卡
  return major.requiredSubjects.every((s) => selected.includes(s));
}

/** 专业与考生画像的契合评分 */
function scoreMajor(major: MajorData, input: RecommendInput): number {
  let s = 40;
  if (input.majorPreference && input.majorPreference !== "不限") {
    if (major.category === input.majorPreference) s += 22;
    else if (major.majorName.includes(input.majorPreference)) s += 10;
  }
  // 就业目标对齐
  switch (input.careerGoal) {
    case "考公":
    case "进体制":
      s += major.civilServiceFit * 4;
      break;
    case "稳定":
      s += major.stabilityScore * 4 + major.civilServiceFit * 2;
      break;
    case "高薪":
    case "进大厂":
      s += major.salaryPotential === "high" ? 15 : major.salaryPotential === "mid" ? 6 : 0;
      break;
    case "考研":
      s += major.postgraduateNeed === "high" ? 6 : 3;
      break;
    case "回老家":
      s += (5 - major.cityDependency) * 3;
      break;
  }
  // 家庭预算惩罚高家庭依赖
  if (input.familyBudget === "low") s -= major.familyDependency * 3;
  // 城市偏好与城市依赖
  if (input.cityPreference === "离家近" || input.cityPreference === "省会") {
    s -= (major.cityDependency - 2) * 2;
  }
  // AI 风险
  if (major.aiImpactRisk === "high" && (input.careerGoal === "稳定" || input.careerGoal === "考公")) {
    s -= 5;
  }
  return Math.max(0, Math.min(100, s));
}

/** 场景识别（驱动锐评选词） */
function detectHints(
  input: RecommendInput,
  band: ScoreBand,
  topMajor: MajorData | undefined
): string[] {
  const hints: string[] = [];

  // 既要又要
  const wantsAll =
    (input.careerGoal === "高薪" || input.careerGoal === "进大厂") &&
    input.cityPreference === "一线" &&
    input.riskPreference === "冲一冲";
  if (wantsAll) hints.push("既要又要");

  // 低分冲名校
  if (
    input.riskPreference === "冲一冲" &&
    (band === "本科线上" || band === "一本线上")
  )
    hints.push("低分冲名校");

  // 无资源选金融
  if (
    input.majorPreference === "财经类" &&
    input.familyBudget === "low"
  )
    hints.push("无资源选金融");

  // 分数段
  if (band === "本科线上") hints.push("本科线附近");
  else if (band === "专科段") hints.push("专科段");
  else if (band === "中高分段") hints.push("中分段最纠结");
  else if (band === "高分段") hints.push("高分盲选专业");

  // 城市偏好冲突
  if (input.cityPreference === "一线" && (band === "本科线上" || band === "专科段"))
    hints.push("网红城市");

  // 专业专属
  if (topMajor) {
    if (topMajor.category === "医学类") hints.push("劝学医");
    if (topMajor.category === "新闻传播类") hints.push("新闻学");
    if (
      topMajor.category === "农学类" ||
      topMajor.majorName.includes("生物")
    )
      hints.push("生化环材");
  }

  return hints;
}

// ============ 主函数 ============

export function recommend(input: RecommendInput): RecommendResult {
  const province = resolveProvince(input);
  const category = trackToCategory(input.subjectTrack);
  const bl =
    province?.batchLines[category] ??
    Object.values(province?.batchLines ?? {})[0] ?? { 本科线: 400 };

  const band = computeScoreBand(input.score, bl);

  // 位次
  const providedRank = typeof input.rank === "number" && input.rank > 0;
  const est = providedRank
    ? { rank: input.rank!, isEstimated: false, note: "你提供的位次" }
    : scoreToRankEstimate(province?.id ?? "", input.score, category);

  // 专业评分排序
  const allMajors = getAllMajors();
  const scored = allMajors
    .map((m) => ({ major: m, score: scoreMajor(m, input) }))
    .sort((a, b) => b.score - a.score);
  const topMajor = scored[0]?.major;

  const hints = detectHints(input, band, topMajor);

  const roastInput: RoastInput = {
    province: province?.provinceName,
    score: input.score,
    scoreBand: band,
    subjectTrack: input.subjectTrack,
    major: topMajor?.majorName,
    cityPreference: input.cityPreference,
    careerGoal: input.careerGoal,
    familyBudget: input.familyBudget,
    acceptMinban: input.acceptMinban,
    acceptZhongwai: input.acceptZhongwai,
    acceptZhuanke: input.acceptZhuanke,
    riskPreference: input.riskPreference,
    scenarioHints: hints,
  };
  const advice = buildAdviceBundle(roastInput);
  const riskProfile = scoreRisk(roastInput);

  // —— 冲稳保 ——
  const [rushLevels, stableLevels, safeLevels] = levelsForScoreBand(band);
  const prefMajorCats = topMajorsCategories(scored.slice(0, 4));

  const rushStableSafe = {
    冲: buildTier("冲", rushLevels, input, band, prefMajorCats),
    稳: buildTier("稳", stableLevels, input, band, prefMajorCats),
    保: buildTier("保", safeLevels, input, band, prefMajorCats),
  };

  // —— 推荐专业 ——
  const recommendedMajors: MajorAdvice[] = scored
    .slice(0, 4)
    .filter((x) => majorSelectable(x.major, input.selectedSubjects))
    .map(({ major, score }) => {
      const risk = classifyMajorRisk(major);
      return {
        major,
        推荐指数: score,
        适合原因: fitReason(major, input),
        风险分级: risk.level,
        风险原因: risk.reason,
        一句话锐评: major.roastTags[0] ?? "",
      };
    });

  // —— 回避专业 ——
  const avoidMajors = allMajors
    .map((m) => ({ major: m, risk: classifyMajorRisk(m) }))
    .filter((x) => {
      if (x.risk.level === "高风险") return true;
      if (x.major.familyDependency >= 4 && input.familyBudget === "low") return true;
      return false;
    })
    .slice(0, 3)
    .map((x) => ({
      name: x.major.majorName,
      category: x.major.category,
      reason:
        x.major.familyDependency >= 4 && input.familyBudget === "low"
          ? "家庭资源依赖度高，普通家庭试错成本大"
          : x.risk.reason,
    }));

  // —— 策略文本 ——
  const schoolStrategy = schoolStrategyText(band);
  const majorStrategy = majorStrategyText(input, topMajor);
  const cityStrategy = cityStrategyText(input, band);

  // —— 主要矛盾 ——
  const conflict = conflictText(band, input, hints);

  return {
    provinceName: province?.provinceName ?? input.province,
    scoreBand: band,
    isSimulated: est.isEstimated,
    rank: est.rank,
    rankNote: est.note,
    conflict,
    scenarioHints: hints,
    rushStableSafe,
    recommendedMajors,
    avoidMajors,
    schoolStrategy,
    majorStrategy,
    cityStrategy,
    riskProfile,
    roast: advice.roast,
    rational: advice.rational,
    parentAdvice: advice.parent,
    studentAdvice: advice.student,
    disclaimer: DISCLAIMER,
    llmEnhanced: false,
  };
}

// ============ 文本生成辅助 ============

function topMajorsCategories(
  scored: { major: MajorData; score: number }[]
): string[] {
  const cats: string[] = [];
  for (const s of scored) {
    if (!cats.includes(s.major.category)) cats.push(s.major.category);
    if (cats.length >= 3) break;
  }
  return cats;
}

function buildTier(
  tier: "冲" | "稳" | "保",
  levels: UniversityLevel[],
  input: RecommendInput,
  band: ScoreBand,
  prefCats: string[]
): TierAdvice {
  const cityTier =
    tier === "冲"
      ? input.cityPreference === "无所谓"
        ? "新一线优先（搏机会）"
        : `${input.cityPreference}（搏一搏）`
      : tier === "稳"
      ? input.cityPreference === "无所谓"
        ? "省会或新一线"
        : `${input.cityPreference}为主`
      : "省会 / 离家近（保底求稳）";

  const 风险提示 =
    tier === "冲"
      ? "冲刺有滑档风险，务必接受调剂，且保底要够硬。"
      : tier === "稳"
      ? "稳妥档应接近或略优于往年录取位次，关注招生计划变动。"
      : "保底档往年位次要明显低于你的位次，确保兜得住。";

  const 锐评 =
    tier === "冲"
      ? "冲可以冲，但不能全车人都挂在悬崖边上。"
      : tier === "稳"
      ? "稳的志愿才是基本盘，把这一档填明白比冲刺更重要。"
      : "保底不是丢人，是给你留一条不用复读的路。";

  return {
    院校类型: levels,
    城市层级: cityTier,
    专业方向: prefCats.length ? prefCats : [input.majorPreference || "未指定"],
    风险提示,
    锐评,
  };
}

function fitReason(major: MajorData, input: RecommendInput): string {
  const reasons: string[] = [];
  if (input.careerGoal === "考公" || input.careerGoal === "进体制") {
    if (major.civilServiceFit >= 4) reasons.push("考公考编契合度高");
  }
  if (input.careerGoal === "稳定") {
    if (major.stabilityScore >= 4) reasons.push("就业稳定性强");
  }
  if (input.careerGoal === "高薪" || input.careerGoal === "进大厂") {
    if (major.salaryPotential === "high") reasons.push("薪资潜力高");
  }
  if (input.familyBudget === "low" && major.familyDependency <= 2) {
    reasons.push("家庭资源依赖低，普通家庭友好");
  }
  if (input.cityPreference === "离家近" && major.cityDependency <= 2) {
    reasons.push("弱城市依赖，回老家也能就业");
  }
  if (reasons.length === 0) reasons.push(major.recommendedFor[0] ?? "综合匹配度尚可");
  return reasons.join("；");
}

function schoolStrategyText(band: ScoreBand): string {
  if (band === "高分段")
    return "你这个分段主要纠结「挑学校还是挑专业」——优先锁定强势专业 + 顶尖平台，别为了名气去冷门专业。";
  if (band === "中高分段")
    return "院校与专业要平衡，优先行业强校（两电一邮、五院四系等）的王牌方向，性价比最高。";
  if (band === "一本线上")
    return "院校层级（省重点/双一流）比名气实在，优先省属强校 + 生源地认可度高的学校。";
  if (band === "本科线上")
    return "先保住「能读、能就业」的本科，公办优先、专业优先，别在名气上死磕。";
  return "分数在专科段，走「技能 + 就业」路线，优先高职头部和本地就业认可度高的院校。";
}

function majorStrategyText(input: RecommendInput, top: MajorData | undefined): string {
  const base =
    input.majorPreference && input.majorPreference !== "不限"
      ? `你倾向「${input.majorPreference}」，这是好的起点——`
      : "你还没定专业方向，先按就业目标反推——";
  const tail = top
    ? `建议重点考察「${top.majorName}」等方向，但务必核对选科要求与历年位次。`
    : "建议从「能就业、能兜底」的方向入手。";
  return base + tail;
}

function cityStrategyText(input: RecommendInput, band: ScoreBand): string {
  if (input.cityPreference === "一线") {
    return band === "高分段" || band === "中高分段"
      ? "一线城市资源加成明显，分数够可以搏；但要算清生活成本。"
      : "一线城市分数成本高，你这个分段去一线可能要牺牲学校或专业，权衡清楚。";
  }
  if (input.cityPreference === "离家近")
    return "离家近务实，但要确认本地是否有对口产业和就业市场，别为了近牺牲专业。";
  return "城市优先原则没错，但别为「网红城市」的滤镜多付太多分。";
}

function conflictText(
  band: ScoreBand,
  input: RecommendInput,
  hints: string[]
): string {
  if (hints.includes("既要又要"))
    return "主要矛盾：学校、专业、城市「三角不可能」，你全都要，最后样样将就。";
  if (hints.includes("低分冲名校"))
    return "主要矛盾：分数不够还要冲名校，专业和城市大概率要大幅让步，且滑档风险高。";
  if (band === "本科线上")
    return "主要矛盾：不是能不能上本科，而是「专业和城市不能都要」——先保专业，再谈城市。";
  if (band === "中高分段")
    return "主要矛盾：不上不下最难选——院校和专业必须排个优先级，否则两头落空。";
  if (band === "专科段")
    return "主要矛盾：放下「本科滤镜」，聚焦一门能就业的技术，比硬冲冷门本科更实在。";
  if (hints.includes("无资源选金融"))
    return "主要矛盾：金融高度依赖资源与学校，普通家庭+普通院校大概率进银行基层。";
  return "主要矛盾：分数、选科、就业目标之间的取舍，需要你先排定优先级。";
}
