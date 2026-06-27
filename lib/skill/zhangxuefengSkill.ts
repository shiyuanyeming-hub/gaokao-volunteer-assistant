// 张雪峰风格 skill 模块 — 基于 alchaincyf/zhangxuefeng-skill（MIT）
// 三层结构：
//   1) 决策逻辑（5 心智模型 + 8 启发式摘要）
//   2) 表达风格（短句/反问/金句/东北味）
//   3) 安全边界（不冒充本人/不绝对化/不歧视/不制造恐慌）
//
// 本文件提供「确定性模板生成器」：
//   - 作为 recommendationEngine 的文案层（结构化骨架的锐评/家长版/学生版）
//   - 作为 LLM 增强失败时的降级文案（保证永远有输出）
//   - 作为闯关游戏的反馈/结局文案层
//
// 重要：所有输出为「风格化锐评」，非张雪峰本人观点，且不替代官方数据。
// 每条锐评都搭配理性建议（spec 硬要求）。

import type { MajorData } from "@/lib/data";

// ============ 类型 ============

export interface RoastInput {
  province?: string;
  score?: number;
  scoreBand?: string;
  subjectTrack?: string;
  major?: string;
  cityPreference?: string;
  careerGoal?: string;
  familyBudget?: "low" | "mid" | "high";
  acceptMinban?: boolean;
  acceptZhongwai?: boolean;
  acceptZhuanke?: boolean;
  riskPreference?: "保守" | "稳妥" | "冲一冲";
  /** 引擎计算出的场景标签，驱动锐评选词 */
  scenarioHints?: string[];
}

export interface AdviceBundle {
  roast: string;
  parent: string;
  student: string;
  rational: string;
}

export interface GameRoastState {
  scoreLevel?: string;
  subjectTrack?: string;
  familyBudget?: string;
  cityPreference?: string;
  majorPreference?: string;
  careerGoal?: string;
  riskPreference?: string;
  fantasyLevel?: number;
  practicalityScore?: number;
  roastScore?: number;
  selfAwareness?: number;
  parentPressure?: number;
  riskFlags?: string[];
  routeTags?: string[];
}

// ============ 安全边界（第 3 层） ============

export const DISCLAIMER =
  "以上为 AI 生成的风格化锐评与方向建议，仅供娱乐和参考，不替代各省教育考试院官方数据、院校招生章程、专业选科要求与正式志愿填报咨询。本工具不冒充任何个人。";

/** 禁用表述（输出前过滤） */
const FORBIDDEN_PATTERNS: RegExp[] = [
  /必[上录]/g, /百分百/g, /包上岸/g, /必就业/g, /稳录/g,
  /绝对不能报/g, /一定考不上/g, /注定失败/g,
];

function sanitize(text: string): string {
  let out = text;
  for (const re of FORBIDDEN_PATTERNS) out = out.replace(re, "大概率不");
  return out;
}

// ============ 决策逻辑（第 1 层，摘要） ============

/** 5 心智模型（供 LLM prompt 与文档复用） */
export const MENTAL_MODELS = [
  "社会筛子论：社会是个大筛子，用学历筛孩子，用房子筛父母，用工作筛家庭。",
  "选择 > 努力：方向错了跑再快也白搭；但「有得选」的前提是你足够努力，而且——你得先活着。",
  "就业倒推法：别看最牛最差的，盯中间那 50% 的人——他们的去向才是你最可能的结局。",
  "阶层现实主义：家里没矿别谈理想，先谋生再谋爱，先站稳再登高。普通家庭容错率是零。",
  "争议即传播：把观点推到极端你才记得住——但记得区分「玩梗锐评」与「理性建议」。",
];

/** 8 启发式（摘要） */
export const HEURISTICS = [
  "灵魂追问法：分数？省份？家里做什么的？锁定范围再给判断。",
  "中位数原则：看中间 50% 的人去哪、拿多少、能不能养活自己。",
  "不可替代性检验：你的工资和你的不可替代性成正比。",
  "500 强测试：别听企业怎么说，看它去哪招人、招什么专业。",
  "家庭背景分流：同一个问题，有矿和没矿答案完全不同。",
  "城市优先原则：城市决定你的格局、资源和机会。",
  "10 年后压迫测试：你能接受十年后混得不如当年分数比你低的人吗？",
  "认态度不认事实：核心观点不让步，只调整表达方式。",
];

// ============ 表达风格（第 2 层）短语库 ============

const GOLD_QUOTES = [
  "社会就是个筛子，你得想办法让自己不被筛掉。",
  "你的工资，永远和你的不可替代性成正比。",
  "理工科选专业，文科选学校——记住这句话。",
  "选择比努力更重要，但有得选的前提，是你足够努力。",
  "先谋生，再谋爱。先站稳，再登高。",
  "梦可以做，志愿表不能这么填。",
  "志愿表不是彩票，不能全靠玄学。",
];

// 按场景的开场锐评
const SCENARIO_ROASTS: Record<string, string[]> = {
  "既要又要": [
    "你这个分数不是不能报好学校，是不能又要城市、又要专业、又要学校名气，还想毕业直接月薪两万。",
    "学校、专业、城市——这是三角不可能，你不能全占。成年人世界里，全占的那叫运气，不叫规划。",
  ],
  "低分冲名校": [
    "冲可以冲，但不能全车人都挂在悬崖边上。",
    "你看看世界 500 强在哪招人？清华北大、985、211。你不是 500 强，HR 的行动已经说明了一切。",
  ],
  "无资源选金融": [
    "金融是典型的「看起来光鲜，进去才知道是坑」。你大概率去的不是投行，是银行网点。",
    "家里没金融口资源，你拿什么跟 985、家里有矿的人抢？脸吗？",
  ],
  "高分盲选专业": [
    "你这个分段最大的问题不是能不能上，是「挑专业还是挑学校」——高分段最容易答错的就是这道题。",
  ],
  "中分段最纠结": [
    "这个分数段是最难的——不上不下，冲不上去，掉也掉不下来。但中间这 50% 的人才是大多数，你不是最差的。",
  ],
  "本科线附近": [
    "你现在最该想的不是面子，是先保住一个能读、能就业的专业，再谈学校牌子。别拿四年青春给一个校名做慈善。",
  ],
  "专科段": [
    "分数不高没事，怕的是分不高还非要活在本科滤镜里。专科走对技术路线，照样能站住。",
  ],
  "网红城市": [
    "你是去上大学，不是去拍城市宣传片。网红城市的滤镜很美，但你得算清它要你多花多少分。",
  ],
  "劝学医": [
    "劝人学医，天打雷劈——5 年本科+规培+常要读研读博。算算你几岁了？同学都当经理了你还在值夜班。",
  ],
  "新闻学": [
    "从中国本科专业目录里闭着眼睛摸一个都比新闻好——不是跟新闻有仇，是这行就业现状跟你想象的不一样。",
  ],
  "生化环材": [
    "生化环材四大天坑不是爬不出来，是爬出来的代价你得算清楚。本科想搞本专业，博士起步。",
  ],
  "信息差": [
    "你现在最大的敌人不是分数，是信息差——你都还没去查招生章程，就开始填志愿了。",
  ],
};

// ============ 工具：稳定选取（确定性，避免 Math.random） ============

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pickStable<T>(arr: T[], seed: string): T {
  if (arr.length === 0) return undefined as unknown as T;
  return arr[hashSeed(seed) % arr.length];
}

function hasHint(input: RoastInput, hint: string): boolean {
  return !!input.scenarioHints?.includes(hint);
}

// ============ 主函数 ============

/** 生成雪峰味锐评（先锐评、后接金句） */
export function generateRoast(input: RoastInput): string {
  const hints = input.scenarioHints ?? [];
  const seed = JSON.stringify(input);

  const lines: string[] = [];

  // 1) 场景锐评（取最多 2 个命中场景）
  const matched: string[] = [];
  for (const hint of hints) {
    const pool = SCENARIO_ROASTS[hint];
    if (pool) matched.push(pickStable(pool, seed + hint));
  }
  if (matched.length === 0) {
    matched.push(pickStable(SCENARIO_ROASTS["中分段最纠结"], seed));
  }
  lines.push(...matched.slice(0, 2));

  // 2) 金句收尾
  lines.push(pickStable(GOLD_QUOTES, seed + "q"));

  return sanitize(lines.join("  "));
}

/** 生成理性建议（锐评之后必须给的「那怎么办」） */
export function generateRationalAdvice(input: RoastInput): string {
  const parts: string[] = [];

  // 冲稳保结构建议
  parts.push("把志愿表分成「冲、稳、保」三档：冲的别超过 1/3，保的一定要够硬。");

  if (hasHint(input, "既要又要")) {
    parts.push("学校、专业、城市先排个优先级——你最不能让步的那一项排在最前，其它两项适当妥协。");
  }
  if (hasHint(input, "低分冲名校")) {
    parts.push("冲的志愿要接受「可能被调剂到冷门专业」，提前想好能不能接受；保底志愿务必明显优于往年录取线。");
  }
  if (input.familyBudget === "low" && input.acceptMinban === false) {
    parts.push("预算有限又不接受民办/中外合作，城市和专业就得让步——优先省属公办 + 生源地周边。");
  }
  parts.push("最重要的一步：去查目标院校当年的招生章程、专业选科要求、近三年录取位次，再下决定。");

  return parts.join(" ");
}

/** 家长版话术：更务实，强调家庭/就业/兜底 */
export function generateParentVersion(input: RoastInput): string {
  const budget = input.familyBudget === "low" ? "预算有限，更要把钱花在能让孩子站住的方向上" : "家里条件允许，可以适当让孩子试错，但保底不能丢";
  return sanitize(
    `家长先稳住：${budget}。这阶段别被「名校光环」和亲戚群里「我家孩子上了某某大学」带节奏——` +
      `孩子四年后靠什么吃饭，比校名好不好听重要得多。先把「能读、能就业、能兜底」的专业和院校摸清，` +
      `冲的留给梦想，保的留给现实。有任何拿不准的，去查学校官方招生章程，别只听直播间的。`
  );
}

/** 学生版话术：更直接，强调兴趣要跟现实对齐、别被裹挟 */
export function generateStudentVersion(input: RoastInput): string {
  const hook =
    input.major && input.major !== "不限"
      ? `你说想报「${input.major}」，先别急——`
      : "你还没定方向？正常，先别急——";
  return sanitize(
    `${hook}兴趣当然重要，但兴趣要能当饭吃才算数。先把分数、位次、选科能报什么搞清楚，` +
      `再去想「我想去哪座城市、过什么生活」。别全听爸妈的，也别全凭感觉——` +
      `志愿是你自己的人生规划第一步，自己查、自己想、自己负责。冲可以，但保底必须是你自己也能接受的路。`
  );
}

/** 风险评分（0-100） + 分级 + 原因 */
export function scoreRisk(input: RoastInput): {
  score: number;
  level: "低" | "中" | "高";
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 30; // 基础分

  const hints = input.scenarioHints ?? [];
  score += hints.length * 9;
  for (const h of hints) reasons.push(`触发风险信号：${h}`);

  if (input.riskPreference === "冲一冲") {
    score += 18;
    reasons.push("风险偏好「冲一冲」，波动大");
  } else if (input.riskPreference === "保守") {
    score -= 10;
    reasons.push("风险偏好「保守」，相对求稳");
  }

  if (input.familyBudget === "low" && input.acceptMinban === false) {
    score += 8;
    reasons.push("预算低且不接受民办，选择面收窄");
  }
  if (input.scoreBand === "本科线上" || input.scoreBand === "专科段") {
    score += 10;
    reasons.push("分数处于批次线附近，滑档风险高");
  }
  if (input.scoreBand === "高分段" || input.scoreBand === "中高分段") {
    score -= 6;
    reasons.push("分数段较高，选择余地大");
  }

  score = Math.max(5, Math.min(96, score));
  const level: "低" | "中" | "高" = score < 40 ? "低" : score < 70 ? "中" : "高";
  return { score: Math.round(score), level, reasons: reasons.slice(0, 5) };
}

/** 专业风险分级（基于 MajorData 字段） */
export function classifyMajorRisk(major: MajorData): {
  level: "低风险" | "中风险" | "高风险";
  reason: string;
} {
  let risk = 0;
  const reasons: string[] = [];
  if (major.aiImpactRisk === "high") { risk += 3; reasons.push("AI 冲击风险高"); }
  else if (major.aiImpactRisk === "mid") { risk += 1; reasons.push("AI 冲击风险中等"); }
  if (major.stabilityScore <= 2) { risk += 2; reasons.push("就业稳定性偏低"); }
  if (major.familyDependency >= 4) { risk += 2; reasons.push("家庭资源依赖度高"); }
  if (major.cityDependency >= 4) { risk += 1; reasons.push("强依赖一线城市资源"); }
  if (major.postgraduateNeed === "high") { risk += 1; reasons.push("本科就业需读研才有竞争力"); }

  const level = risk >= 5 ? "高风险" : risk >= 2 ? "中风险" : "低风险";
  return {
    level,
    reason: reasons.length ? reasons.join("；") : "整体风险可控，仍需结合分数位次与选科要求判断",
  };
}

/** 一键生成完整建议包 */
export function buildAdviceBundle(input: RoastInput): AdviceBundle {
  return {
    roast: generateRoast(input),
    rational: generateRationalAdvice(input),
    parent: generateParentVersion(input),
    student: generateStudentVersion(input),
  };
}

// ============ 闯关游戏文案 ============

/**
 * 闯关即时反馈：根据 state + 选择标签，返回锐评 + 风格。
 * 游戏的 stages 多数会自定义更精细的文案，这里提供通用上下文化锐评。
 */
export function generateGameFeedback(
  state: GameRoastState,
  choiceTag: string
): { text: string; style: "反问" | "举例" | "拆幻想" | "下结论" | "连珠炮" } {
  const fantasyHigh = (state.fantasyLevel ?? 0) >= 3;
  const aware = (state.selfAwareness ?? 0) >= 2;

  if (choiceTag === "我全都要") {
    return {
      text: "我全都要？这是成年人世界最贵的四个字。学校、专业、城市是三角不可能——你都想要，最后多半是样样将就。",
      style: "拆幻想",
    };
  }
  if (choiceTag === "听说赚钱选哪个") {
    return {
      text: "你选的不是专业，是短视频评论区里的财富自由。等风过去了你再看，剩的是什么。",
      style: "连珠炮",
    };
  }
  if (choiceTag === "我不接受失败") {
    return {
      text: "不接受失败？志愿表不是你证明骨气的地方。全填冲刺不留保底，那不叫勇敢，叫给招生办表演极限运动。",
      style: "拆幻想",
    };
  }
  if (choiceTag === "不知道/听妈的") {
    return {
      text: "你妈说都能报，你妈给你查过招生章程吗？你这志愿表不像你的人生规划，像家族群投票结果。",
      style: "反问",
    };
  }
  if (aware && !fantasyHigh) {
    return {
      text: "可以，这步想得挺实在。继续保持，别到最后一关突然飘起来。",
      style: "下结论",
    };
  }
  if (fantasyHigh) {
    return {
      text: "分还没出，梦已经做到清北门口了，可以，精神提前录取。但志愿表得照着现实填。",
      style: "连珠炮",
    };
  }
  return {
    text: "记下你这一步的选择——后面会发现，每一关都在给你的人生做减法。",
    style: "举例",
  };
}

/** 结局锐评 + 理性总结（由游戏 endings 调用） */
export function generateEnding(
  state: GameRoastState,
  meta: { title: string; vibe: "清醒" | "幻想" | "悬崖" | "中庸" }
): { roast: string; rational: string } {
  switch (meta.vibe) {
    case "清醒":
      return {
        roast: "行吧，这次少骂你两句。你对自己的分数边界和选择成本是有数的，这比 90% 的人强。但别飘——想清楚和做对是两码事。",
        rational: "保持「先保底再冲」的结构，按招生章程逐项核对位次与选科要求，你就比大多数填得明白。",
      };
    case "幻想":
      return {
        roast: "你这不是报志愿，是许愿池批发业务。既要城市又要专业又要名气还要高薪，四个愿望一个都实现不了是常态。",
        rational: "把四个愿望砍到一个最不能让步的，其余让步；用「冲稳保」给愿望排个序，志愿表才不像彩票。",
      };
    case "悬崖":
      return {
        roast: "你这是给招生办表演极限运动——全填冲刺，悬崖边挂满人。冲的不是志愿，是运气。",
        rational: "至少留 1/3 明显保底志愿（往年位次你稳超的），再谈冲刺。不接受调剂就更要留足安全垫。",
      };
    case "中庸":
    default:
      return {
        roast: "既不算清醒也不算离谱，卡在「差不多」地带。但「差不多」最容易在出结果那天变成「差很多」。",
        rational: "补上信息差：去查近三年录取位次和当年招生计划，把「差不多」变成「有数」。",
      };
  }
}
