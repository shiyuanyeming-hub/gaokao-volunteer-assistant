// 闯关游戏状态层 — 纯数据，无副作用。
// Galgame 数值系统：teacherFavor / bloodPressure / clarity / fantasy / practicality（0-100）。
// GameState 由每一关的选择不可变地累加；结局由 teacherFavor 评级（evaluateFavor）。

export type ScoreLevel =
  | "高分"
  | "中高分"
  | "一本线上"
  | "本科线上"
  | "专科段"
  | "不确定";

export type SubjectTrack =
  | "物理"
  | "历史"
  | "文科"
  | "理科"
  | "综合"
  | "未定";

// 张老师表情状态（立绘 mood）
export type TeacherMood =
  | "冷静"
  | "皱眉"
  | "血压上升"
  | "战术喝水"
  | "开始锐评"
  | "被你气笑";

export interface GameState {
  province?: string;
  gender?: "男" | "女" | "不透露";
  scoreLevel: ScoreLevel;
  subjectTrack: SubjectTrack;
  familyBudget: "低" | "中" | "高" | "";
  cityPreference: string;
  majorPreference: string;
  careerGoal: string;
  riskPreference: "保守" | "稳妥" | "冲一冲" | "";
  // —— Galgame 数值（0-100）——
  /** 张老师好感度：选择是否符合现实报考逻辑 */
  teacherFavor: number;
  /** 血压值：选择有多离谱 */
  bloodPressure: number;
  /** 清醒值：是否理解分数/专业/城市/就业取舍 */
  clarity: number;
  /** 幻想值：是否什么都想要、不懂现实约束 */
  fantasy: number;
  /** 现实度：是否接受分数/预算/就业/调剂约束 */
  practicality: number;
  /** 触发的风险标记 */
  riskFlags: string[];
  /** 路线标签（驱动结局判定 + UI 标签云） */
  routeTags: string[];
}

export const initialGameState: GameState = {
  scoreLevel: "不确定",
  subjectTrack: "未定",
  familyBudget: "",
  cityPreference: "",
  majorPreference: "",
  careerGoal: "",
  riskPreference: "",
  teacherFavor: 50,
  bloodPressure: 25,
  clarity: 35,
  fantasy: 30,
  practicality: 35,
  riskFlags: [],
  routeTags: [],
};

/** 数组去重 push（不可变） */
export function pushUnique(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr : [...arr, v];
}

export function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

// 雷达轴（复用 RiskRadar，支持任意轴数）
export interface RadarAxis {
  label: string;
  value: number; // 0-100
}

/** 把 5 维数值映射成雷达轴（EndingCard 用） */
export function statsToRadar(s: GameState): RadarAxis[] {
  return [
    { label: "好感", value: Math.round(s.teacherFavor) },
    { label: "清醒", value: Math.round(s.clarity) },
    { label: "现实", value: Math.round(s.practicality) },
    { label: "幻想", value: Math.round(s.fantasy) },
    { label: "血压", value: Math.round(s.bloodPressure) },
  ];
}

export interface FavorGrade {
  grade: "S" | "A" | "B" | "C" | "D";
  label: string; // 攻略成功 / 心动 / 普通 / 失望 / 拉黑
  mood: TeacherMood;
  blurb: string; // 结语文案
}

/** 由好感度判定结局评级 */
export function evaluateFavor(s: GameState): FavorGrade {
  const f = s.teacherFavor;
  if (f >= 80)
    return {
      grade: "S",
      label: "攻略成功",
      mood: "冷静",
      blurb:
        "张老师拍拍你肩膀：你这志愿填得，我挑不出毛病。路线清楚、保底够厚、知道自己在干什么——行，我认你这个学生。",
    };
  if (f >= 60)
    return {
      grade: "A",
      label: "心动",
      mood: "冷静",
      blurb:
        "张老师点点头：有点东西。方向对、思路清，就是几步还得再收一收。按这个节奏填，差不了。",
    };
  if (f >= 40)
    return {
      grade: "B",
      label: "普通",
      mood: "皱眉",
      blurb:
        "张老师咂咂嘴：不算离谱，但也没到让我放心。专业、城市、保底——几个关键选择再想想，别都想要。",
    };
  if (f >= 20)
    return {
      grade: "C",
      label: "失望",
      mood: "开始锐评",
      blurb:
        "张老师叹口气：你这填的不是志愿，是许愿。幻想多、保底少，离谱的选择扎堆。回去把现实约束重新捋一遍。",
    };
  return {
    grade: "D",
    label: "拉黑",
    mood: "被你气笑",
    blurb:
      "张老师被气笑了：行，你赢了——我从没见过能把每个选项都往坑里跳的。建议重开，这次先想想「家里没矿」四个字。",
  };
}
