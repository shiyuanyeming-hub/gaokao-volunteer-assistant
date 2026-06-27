// 闯关游戏结局 — 7 个，按完整 GameState 判定（不是原始选项）。
// 数组顺序即优先级：pickEnding 返回首个 matches 的，最后一个为兜底。

import type { GameState } from "./state";

export interface GameEnding {
  id: string;
  title: string;
  vibe: "清醒" | "幻想" | "悬崖" | "中庸";
  tags: string[];
  fitStrategy: string;
  avoidActions: string[];
  recommendedMajors: string[];
  recommendedLevels: string[];
  roast: string;
  rational: string;
  matches: (s: GameState) => boolean;
}

const has = (s: GameState, t: string) => s.routeTags.includes(t);

export const ENDINGS: GameEnding[] = [
  {
    id: "cliff",
    title: "冲刺悬崖型",
    vibe: "悬崖",
    tags: ["冲刺悬崖", "不留保底"],
    fitStrategy: "立刻补上保底档：至少 1/3 志愿填往年位次你稳超的院校，再谈冲刺。",
    avoidActions: ["全填冲刺不留保底", "不服从调剂还硬冲", "复读当唯一退路"],
    recommendedMajors: ["先保能就业的应用型专业", "服从调剂进校再谋转专业"],
    recommendedLevels: ["保底：省重点/普通本科", "冲刺：控制在 1-2 所"],
    roast: "你这不是冲志愿，是给招生办表演极限运动——全车人挂在悬崖边上，一个没抓稳就集体复读。志愿表不是彩票，不能全靠玄学。",
    rational: "冲可以，但「冲稳保」三档里保底必须够硬。把冲刺控制在 1-2 所，其余留给稳和保，并接受调剂，滑档概率才能压下去。",
    matches: (s) => has(s, "冲刺悬崖"),
  },
  {
    id: "fantasy",
    title: "专业幻想型",
    vibe: "幻想",
    tags: ["专业幻想", "听说赚钱"],
    fitStrategy: "先认清自己能学什么——按分数位次和选科反推真实可选的专业范围。",
    avoidActions: ["听说赚钱就报", "只看风口不看能力", "忽视选科硬要求"],
    recommendedMajors: ["结合选科与分数的务实方向", "计算机/电子信息（数学过关时）", "师范/护理（求稳兜底）"],
    recommendedLevels: ["与分数位次匹配的省属/普通本科"],
    roast: "你选的不是专业，是短视频评论区里的财富自由。等风口过去、滤镜褪色，你再看瓶子里面剩什么。",
    rational: "选专业要看三件事：你能学（选科+能力）、能就业（中位数去向）、能接受（城市与付出）。别把「听说赚钱」当决策依据。",
    matches: (s) => has(s, "专业幻想"),
  },
  {
    id: "city-lover",
    title: "城市恋爱脑型",
    vibe: "幻想",
    tags: ["网红城市", "城市优先"],
    fitStrategy: "把城市当变量，不是唯一目标——为城市让步可以，但要给专业和学校留底线。",
    avoidActions: ["为网红城市牺牲专业", "高分低报到一线城市普通校", "忽视当地生活成本"],
    recommendedMajors: ["当地支柱产业对口专业", "计算机/电子信息（大城市机会多）"],
    recommendedLevels: ["新一线强校优先于一线普通校"],
    roast: "你是去上大学，不是去拍城市宣传片。网红城市滤镜很美，但它要你多花的分和钱，没人替你出。",
    rational: "城市优先原则没错，但要算清溢价。优先有对口产业的城市（新一线往往性价比最高），别为了「一线」二字牺牲学校和专业。",
    matches: (s) => has(s, "网红城市") || (s.cityPreference === "一线" && s.fantasy >= 50),
  },
  {
    id: "parent",
    title: "家长遥控型",
    vibe: "中庸",
    tags: ["听妈的", "家长遥控"],
    fitStrategy: "把决策权拿回来——自己查招生章程、自己排优先级，家长意见只作参考。",
    avoidActions: ["全听亲戚群投票", "为家长面子选校", "不查官方数据盲报"],
    recommendedMajors: ["你真正愿意学四年的方向", "考公对口专业（若家庭求稳）"],
    recommendedLevels: ["与位次匹配的公办本科"],
    roast: "你这志愿表不像你的人生规划，像家族群投票结果。四年是你去读，不是你七大姑八大姨去读。",
    rational: "家长的经验可以听，但最终要为你自己的选择负责。去查官方招生章程和近三年录取位次，把「听说」变成「有数」。",
    matches: (s) => has(s, "听妈的") || has(s, "白嫖党"),
  },
  {
    id: "zhuanke",
    title: "专科逆袭型",
    vibe: "清醒",
    tags: ["专科段", "务实"],
    fitStrategy: "放下本科滤镜，走「技能 + 就业」路线，奔高职头部和区域就业强的院校。",
    avoidActions: ["硬冲冷门本科", "选万金油管理类", "忽视专升本路径"],
    recommendedMajors: ["护理", "口腔医学技术", "学前教育", "电气/机械技术"],
    recommendedLevels: ["高职头部（如深职大）", "本地就业认可度高的高职"],
    roast: "分数不高没事，怕的是分不高还非要活在本科滤镜里。专科走对技术路线，照样能站住——丢人的从来不是学历，是没手艺。",
    rational: "专科段拼的是技能和本地就业认可度。优先高职头部和区域强校的实用专业，规划好专升本或考证路线，一样能立住。",
    matches: (s) => s.scoreLevel === "专科段" && s.practicality >= 40,
  },
  {
    id: "awake",
    title: "人间清醒型",
    vibe: "清醒",
    tags: ["人间清醒"],
    fitStrategy: "保持「先保底再冲」的结构，按招生章程逐项核对位次与选科要求即可。",
    avoidActions: ["最后一关飘起来全填冲刺", "听信「包上岸」承诺", "忽视数据时效"],
    recommendedMajors: ["与你就业目标对口的务实方向", "考公/技能型兜底"],
    recommendedLevels: ["稳：省重点/双一流", "保：公办普通本科"],
    roast: "行吧，这次少骂你两句。你对自己的分数边界和选择成本是有数的，这比 90% 的人强。但别飘——想清楚和做对是两码事。",
    rational: "你具备清醒决策的基础，接下来就是执行：冲稳保分档、服从调剂、核对官方位次与选科要求。保持这个节奏，你就填得比大多数人明白。",
    matches: (s) => s.teacherFavor >= 70 && s.fantasy <= 35 && s.riskFlags.length === 0,
  },
  {
    id: "sleepwalk",
    title: "梦游报考型",
    vibe: "幻想",
    tags: ["梦游", "啥都想要"],
    fitStrategy: "先做减法——把「学校/专业/城市」排个优先级，只保一个最不能让步的。",
    avoidActions: ["既要又要还要", "不查数据盲报", "「先上了再说」"],
    recommendedMajors: ["先按就业目标反推", "求稳选师范/护理/考公对口"],
    recommendedLevels: ["保底为主：公办本科/高职头部"],
    roast: "你这不是报志愿，是许愿池批发业务。既要城市又要专业又要名气还要高薪，四个愿望一个都实现不了是常态。",
    rational: "成年人第一步是学会做减法。把愿望砍到一个最不能让步的，其余让步；用冲稳保排序，再去查官方数据——你离清醒就差这一步。",
    matches: () => true, // 兜底
  },
];

export function pickEnding(s: GameState): GameEnding {
  return ENDINGS.find((e) => e.matches(s)) ?? ENDINGS[ENDINGS.length - 1];
}
