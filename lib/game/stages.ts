// 闯关游戏关卡定义 — 10 章，Galgame 攻略张老师。
// 数值设计：几乎全部选项扣好感/涨血压。只在极少数现实选择（高分/务实专业/付费意识/调剂/稳妥保底）给微量好感。
// 顺序：性别 → 分数 → 文理 → 专业 → 看重什么 → 城市 → 毕业目标 → 预算 → 调剂 → 冲失败。

import type { GameState } from "./state";
import { pushUnique, clamp } from "./state";

export interface GameOption {
  id: string;
  label: string;
  apply: (s: GameState) => GameState;
}

export interface GameStage {
  id: string;
  step: number;
  title: string;
  question: string;
  helper?: string;
  options: GameOption[];
}

type StatDelta = Partial<
  Pick<GameState, "teacherFavor" | "bloodPressure" | "clarity" | "fantasy" | "practicality">
>;

function adjust(s: GameState, d: StatDelta): GameState {
  return {
    ...s,
    teacherFavor: clamp(s.teacherFavor + (d.teacherFavor ?? 0)),
    bloodPressure: clamp(s.bloodPressure + (d.bloodPressure ?? 0)),
    clarity: clamp(s.clarity + (d.clarity ?? 0)),
    fantasy: clamp(s.fantasy + (d.fantasy ?? 0)),
    practicality: clamp(s.practicality + (d.practicality ?? 0)),
  };
}

export const GAME_STAGES: GameStage[] = [
  // —— 第 1 章 · 性别 ——
  {
    id: "gender",
    step: 1,
    title: "第 1 章 · 先报个性别",
    question: "别紧张——这影响张老师待会儿用什么表情看你。",
    options: [
      { id: "ge-male", label: "男", apply: (s) => adjust({ ...s, gender: "男" }, { teacherFavor: -2, bloodPressure: 3 }) },
      { id: "ge-female", label: "女", apply: (s) => adjust({ ...s, gender: "女" }, { teacherFavor: -2, bloodPressure: 3 }) },
      { id: "ge-secret", label: "不透露", apply: (s) => adjust({ ...s, gender: "不透露" }, { teacherFavor: -5, bloodPressure: 5 }) },
      {
        id: "ge-mom",
        label: "我妈替我填",
        apply: (s) =>
          adjust(
            { ...s, gender: "不透露", routeTags: pushUnique(s.routeTags, "听妈的") },
            { teacherFavor: -18, bloodPressure: 15, fantasy: 5 }
          ),
      },
    ],
  },

  // —— 第 2 章 · 分数段 ——
  {
    id: "score",
    step: 2,
    title: "第 2 章 · 你是什么分数段？",
    question: "别藏着掖着，先把自己摆在哪个段位说清楚。",
    options: [
      { id: "s-high", label: "高分段，学校专业都想要", apply: (s) => adjust({ ...s, scoreLevel: "高分" }, { teacherFavor: 3, clarity: 4, bloodPressure: 2 }) },
      { id: "s-midhigh", label: "中高分，想冲好学校", apply: (s) => adjust({ ...s, scoreLevel: "中高分" }, { teacherFavor: -2, bloodPressure: 5, clarity: 2 }) },
      { id: "s-yiben", label: "一本线附近，想体面一点", apply: (s) => adjust({ ...s, scoreLevel: "一本线上" }, { teacherFavor: -4, bloodPressure: 6, practicality: 3 }) },
      { id: "s-benke", label: "本科线附近，先上本科", apply: (s) => adjust({ ...s, scoreLevel: "本科线上" }, { teacherFavor: -10, bloodPressure: 8, practicality: 3 }) },
      { id: "s-zhuanke", label: "专科段，但不想被看不起", apply: (s) => adjust({ ...s, scoreLevel: "专科段" }, { teacherFavor: -15, bloodPressure: 14, practicality: 4 }) },
      {
        id: "s-dream",
        label: "还没出分，先做梦",
        apply: (s) =>
          adjust(
            { ...s, scoreLevel: "不确定", routeTags: pushUnique(s.routeTags, "做梦型") },
            { teacherFavor: -22, bloodPressure: 18, fantasy: 12 }
          ),
      },
    ],
  },

  // —— 第 3 章 · 文理 / 选科 ——
  {
    id: "subject",
    step: 3,
    title: "第 3 章 · 你选科 / 文理是什么？",
    question: "选科决定你能报什么、不能报什么。别小看这一步。",
    options: [
      { id: "sub-physics", label: "物理类", apply: (s) => adjust({ ...s, subjectTrack: "物理" }, { teacherFavor: -2, bloodPressure: 3, clarity: 3 }) },
      { id: "sub-history", label: "历史类", apply: (s) => adjust({ ...s, subjectTrack: "历史" }, { teacherFavor: -8, bloodPressure: 6, clarity: 2 }) },
      { id: "sub-wen", label: "文科", apply: (s) => adjust({ ...s, subjectTrack: "文科" }, { teacherFavor: -12, bloodPressure: 10 }) },
      { id: "sub-li", label: "理科", apply: (s) => adjust({ ...s, subjectTrack: "理科" }, { teacherFavor: -2, bloodPressure: 4, practicality: 2 }) },
      { id: "sub-zong", label: "综合改革", apply: (s) => adjust({ ...s, subjectTrack: "综合" }, { teacherFavor: -3, bloodPressure: 4, clarity: 2 }) },
      {
        id: "sub-dunno",
        label: "不知道，反正我妈说都能报",
        apply: (s) =>
          adjust(
            { ...s, subjectTrack: "未定", routeTags: pushUnique(s.routeTags, "听妈的") },
            { teacherFavor: -16, bloodPressure: 12, fantasy: 5 }
          ),
      },
    ],
  },

  // —— 第 4 章 · 想学什么专业 ——
  {
    id: "major",
    step: 4,
    title: "第 4 章 · 你想学什么专业？",
    question: "听说哪个赚钱选哪个？那你选的不是专业，是短视频评论区。",
    options: [
      { id: "m-cs", label: "计算机 / 软件", apply: (s) => adjust({ ...s, majorPreference: "计算机类" }, { teacherFavor: -3, bloodPressure: 5, clarity: 2 }) },
      { id: "m-elec", label: "电子信息 / 自动化", apply: (s) => adjust({ ...s, majorPreference: "电子信息类" }, { teacherFavor: 1, bloodPressure: 3, practicality: 3 }) },
      { id: "m-med", label: "医学", apply: (s) => adjust({ ...s, majorPreference: "医学类" }, { teacherFavor: -4, bloodPressure: 6, practicality: 2 }) },
      { id: "m-edu", label: "师范", apply: (s) => adjust({ ...s, majorPreference: "师范类" }, { teacherFavor: 2, bloodPressure: 3, practicality: 3 }) },
      { id: "m-fin", label: "财经 / 法学", apply: (s) => adjust({ ...s, majorPreference: "财经类" }, { teacherFavor: -8, bloodPressure: 8 }) },
      { id: "m-civil", label: "土木 / 建筑", apply: (s) => adjust({ ...s, majorPreference: "土木建筑类" }, { teacherFavor: -10, bloodPressure: 10, practicality: 3 }) },
      { id: "m-music", label: "音乐 / 表演", apply: (s) => adjust({ ...s, majorPreference: "音乐类" }, { teacherFavor: -25, fantasy: 14, bloodPressure: 22 }) },
      { id: "m-art", label: "艺术 / 传媒", apply: (s) => adjust({ ...s, majorPreference: "艺术类" }, { teacherFavor: -22, fantasy: 12, bloodPressure: 20 }) },
      {
        id: "m-money",
        label: "不知道，听说哪个赚钱选哪个",
        apply: (s) =>
          adjust(
            { ...s, majorPreference: "", routeTags: pushUnique(s.routeTags, "专业幻想") },
            { teacherFavor: -20, fantasy: 15, bloodPressure: 16 }
          ),
      },
    ],
  },

  // —— 第 5 章 · 最看重什么（含「白嫖咨询」梗） ——
  {
    id: "priority",
    step: 5,
    title: "第 5 章 · 你最看重什么？",
    question: "成年人世界最贵的四个字，叫「我全都要」。",
    options: [
      { id: "p-school", label: "学校名气", apply: (s) => adjust({ ...s, routeTags: pushUnique(s.routeTags, "名校控") }, { teacherFavor: -8, bloodPressure: 5, fantasy: 3 }) },
      { id: "p-major", label: "专业就业", apply: (s) => adjust(s, { teacherFavor: 3, bloodPressure: 2, practicality: 4, clarity: 3 }) },
      { id: "p-city", label: "城市", apply: (s) => adjust({ ...s, routeTags: pushUnique(s.routeTags, "城市优先") }, { teacherFavor: -5, bloodPressure: 5, clarity: 1 }) },
      { id: "p-near", label: "离家近", apply: (s) => adjust(s, { teacherFavor: -3, bloodPressure: 4, practicality: 3 }) },
      { id: "p-cheap", label: "学费低", apply: (s) => adjust({ ...s, familyBudget: "低" }, { teacherFavor: 2, bloodPressure: 3, practicality: 4 }) },
      {
        id: "p-all",
        label: "我全都要",
        apply: (s) =>
          adjust(
            { ...s, routeTags: pushUnique(s.routeTags, "既要又要") },
            { teacherFavor: -22, bloodPressure: 18, fantasy: 12 }
          ),
      },
      {
        id: "p-free",
        label: "能白嫖就白嫖，咨询费免谈",
        apply: (s) =>
          adjust(
            { ...s, routeTags: pushUnique(s.routeTags, "白嫖党") },
            { teacherFavor: -25, bloodPressure: 22, fantasy: 4 }
          ),
      },
    ],
  },

  // —— 第 6 章 · 城市 ——
  {
    id: "city",
    step: 6,
    title: "第 6 章 · 你想去什么城市？",
    question: "你是去上大学，不是去拍城市宣传片。",
    options: [
      { id: "c-tier1", label: "北上广深", apply: (s) => adjust({ ...s, cityPreference: "一线" }, { teacherFavor: -3, bloodPressure: 5, clarity: 2 }) },
      { id: "c-new1", label: "新一线", apply: (s) => adjust({ ...s, cityPreference: "新一线" }, { teacherFavor: -1, bloodPressure: 3, practicality: 3 }) },
      { id: "c-cap", label: "省会", apply: (s) => adjust({ ...s, cityPreference: "省会" }, { teacherFavor: 1, bloodPressure: 3, practicality: 4 }) },
      { id: "c-near", label: "离家近", apply: (s) => adjust({ ...s, cityPreference: "离家近" }, { teacherFavor: -2, bloodPressure: 4, practicality: 3 }) },
      { id: "c-any", label: "哪都行，只要专业好", apply: (s) => adjust(s, { teacherFavor: 2, bloodPressure: 2, practicality: 4, clarity: 2 }) },
      {
        id: "c-wanghong",
        label: "我想去网红城市",
        apply: (s) =>
          adjust(
            { ...s, cityPreference: "网红", routeTags: pushUnique(s.routeTags, "网红城市") },
            { teacherFavor: -14, bloodPressure: 12, fantasy: 8 }
          ),
      },
    ],
  },

  // —— 第 7 章 · 毕业目标 ——
  {
    id: "career",
    step: 7,
    title: "第 7 章 · 你毕业想干什么？",
    question: "专业和目标要对得上，对不上就是给自己埋雷。",
    options: [
      { id: "g-bigtech", label: "进大厂", apply: (s) => adjust({ ...s, careerGoal: "进大厂" }, { teacherFavor: -4, bloodPressure: 6, clarity: 1 }) },
      { id: "g-civil", label: "考公考编", apply: (s) => adjust({ ...s, careerGoal: "考公" }, { teacherFavor: 2, bloodPressure: 3, practicality: 4 }) },
      { id: "g-postgrad", label: "考研深造", apply: (s) => adjust({ ...s, careerGoal: "考研" }, { teacherFavor: -5, bloodPressure: 6, clarity: 1 }) },
      { id: "g-home", label: "回老家稳定就业", apply: (s) => adjust({ ...s, careerGoal: "回老家" }, { teacherFavor: -1, bloodPressure: 4, practicality: 4 }) },
      { id: "g-abroad", label: "出国", apply: (s) => adjust({ ...s, careerGoal: "出国" }, { teacherFavor: -10, bloodPressure: 8, fantasy: 3 }) },
      {
        id: "g-idle",
        label: "先上大学再说",
        apply: (s) =>
          adjust(
            { ...s, careerGoal: "迷茫", routeTags: pushUnique(s.routeTags, "迷茫") },
            { teacherFavor: -16, bloodPressure: 14, fantasy: 6 }
          ),
      },
    ],
  },

  // —— 第 8 章 · 预算 ——
  {
    id: "budget",
    step: 8,
    title: "第 8 章 · 家里预算怎么样？",
    question: "选志愿前，先把钱的事摆到桌面上。",
    options: [
      { id: "b-high", label: "学费生活费压力不大", apply: (s) => adjust({ ...s, familyBudget: "高" }, { teacherFavor: -2, bloodPressure: 3 }) },
      { id: "b-mid", label: "普通家庭，能省就省", apply: (s) => adjust({ ...s, familyBudget: "中" }, { teacherFavor: -1, bloodPressure: 3, practicality: 3 }) },
      { id: "b-low", label: "不接受高学费", apply: (s) => adjust({ ...s, familyBudget: "低" }, { teacherFavor: 1, bloodPressure: 3, practicality: 4 }) },
      { id: "b-zw", label: "可以考虑中外合作", apply: (s) => adjust({ ...s, routeTags: pushUnique(s.routeTags, "中外合作") }, { teacherFavor: -6, bloodPressure: 6, fantasy: 3 }) },
      { id: "b-minban", label: "民办也能接受", apply: (s) => adjust({ ...s, routeTags: pushUnique(s.routeTags, "民办") }, { teacherFavor: -9, bloodPressure: 8 }) },
      { id: "b-any", label: "只要有学上都行", apply: (s) => adjust({ ...s, familyBudget: "低" }, { teacherFavor: -4, bloodPressure: 6, practicality: 3 }) },
    ],
  },

  // —— 第 9 章 · 服从调剂 ——
  {
    id: "adjust",
    step: 9,
    title: "第 9 章 · 你愿意服从调剂吗？",
    question: "服从调剂这四个字，每年救活也坑死一批人。",
    helper: "服从调剂 = 你的分数够学校但不够专业时，学校把你分到其他未满专业。",
    options: [
      { id: "a-yes", label: "愿意，先保学校", apply: (s) => adjust(s, { teacherFavor: 3, bloodPressure: -3, practicality: 5 }) },
      { id: "a-no", label: "不愿意，专业优先", apply: (s) => adjust({ ...s, riskFlags: pushUnique(s.riskFlags, "不服从调剂") }, { teacherFavor: -14, bloodPressure: 15 }) },
      { id: "a-see", label: "看学校", apply: (s) => adjust(s, { teacherFavor: 1, bloodPressure: 3, practicality: 3 }) },
      {
        id: "a-dunno",
        label: "我不知道服从调剂是啥",
        apply: (s) =>
          adjust(
            { ...s, riskFlags: pushUnique(s.riskFlags, "不懂调剂") },
            { teacherFavor: -12, bloodPressure: 12, fantasy: 4 }
          ),
      },
    ],
  },

  // —— 第 10 章 · 冲失败怎么办 ——
  {
    id: "fallback",
    step: 10,
    title: "第 10 章 · 如果冲失败怎么办？",
    question: "接受失败的能力，比冲刺的勇气更值钱。",
    options: [
      { id: "f-safe", label: "接受稳妥学校", apply: (s) => adjust({ ...s, riskPreference: "稳妥" }, { teacherFavor: 5, bloodPressure: -3, practicality: 5 }) },
      { id: "f-city", label: "接受普通城市", apply: (s) => adjust(s, { teacherFavor: -2, bloodPressure: 5, practicality: 3 }) },
      { id: "f-major", label: "接受冷门专业", apply: (s) => adjust(s, { teacherFavor: -3, bloodPressure: 6, practicality: 3 }) },
      { id: "f-repeat", label: "复读", apply: (s) => adjust({ ...s, routeTags: pushUnique(s.routeTags, "复读") }, { teacherFavor: -10, bloodPressure: 8 }) },
      {
        id: "f-nofail",
        label: "我不接受失败",
        apply: (s) =>
          adjust(
            {
              ...s,
              riskPreference: "冲一冲",
              routeTags: pushUnique(s.routeTags, "冲刺悬崖"),
              riskFlags: pushUnique(s.riskFlags, "冲刺悬崖"),
            },
            { teacherFavor: -25, bloodPressure: 25, fantasy: 10 }
          ),
      },
    ],
  },
];

export const TOTAL_STAGES = GAME_STAGES.length;
