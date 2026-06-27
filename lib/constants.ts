// 31 provinces with basic config
export const PROVINCES: { id: string; name: string; examMode: "3+3" | "3+1+2" | "文理分科" }[] = [
  { id: "beijing", name: "北京", examMode: "3+3" },
  { id: "tianjin", name: "天津", examMode: "3+3" },
  { id: "hebei", name: "河北", examMode: "3+1+2" },
  { id: "shanxi", name: "山西", examMode: "3+1+2" },
  { id: "neimenggu", name: "内蒙古", examMode: "3+1+2" },
  { id: "liaoning", name: "辽宁", examMode: "3+1+2" },
  { id: "jilin", name: "吉林", examMode: "3+1+2" },
  { id: "heilongjiang", name: "黑龙江", examMode: "3+1+2" },
  { id: "shanghai", name: "上海", examMode: "3+3" },
  { id: "jiangsu", name: "江苏", examMode: "3+1+2" },
  { id: "zhejiang", name: "浙江", examMode: "3+3" },
  { id: "anhui", name: "安徽", examMode: "3+1+2" },
  { id: "fujian", name: "福建", examMode: "3+1+2" },
  { id: "jiangxi", name: "江西", examMode: "3+1+2" },
  { id: "shandong", name: "山东", examMode: "3+3" },
  { id: "henan", name: "河南", examMode: "3+1+2" },
  { id: "hubei", name: "湖北", examMode: "3+1+2" },
  { id: "hunan", name: "湖南", examMode: "3+1+2" },
  { id: "guangdong", name: "广东", examMode: "3+1+2" },
  { id: "guangxi", name: "广西", examMode: "3+1+2" },
  { id: "hainan", name: "海南", examMode: "3+3" },
  { id: "chongqing", name: "重庆", examMode: "3+1+2" },
  { id: "sichuan", name: "四川", examMode: "3+1+2" },
  { id: "guizhou", name: "贵州", examMode: "3+1+2" },
  { id: "yunnan", name: "云南", examMode: "3+1+2" },
  { id: "xizang", name: "西藏", examMode: "文理分科" },
  { id: "shaanxi", name: "陕西", examMode: "3+1+2" },
  { id: "gansu", name: "甘肃", examMode: "3+1+2" },
  { id: "qinghai", name: "青海", examMode: "3+1+2" },
  { id: "ningxia", name: "宁夏", examMode: "3+1+2" },
  { id: "xinjiang", name: "新疆", examMode: "文理分科" },
];

export const SUBJECTS_3_3 = [
  "物理", "化学", "生物", "历史", "地理", "政治",
];

export const SUBJECTS_3_1_2 = {
  first: ["物理", "历史"],
  second: ["化学", "生物", "地理", "政治"],
};

export const SUBJECTS_WENLI = ["理科", "文科"];

export const MAJORS = [
  { id: "civil", name: "土木工程", category: "工学" },
  { id: "finance", name: "金融学", category: "经济学" },
  { id: "law", name: "法学", category: "法学" },
  { id: "medicine", name: "临床医学", category: "医学" },
  { id: "cs", name: "计算机科学与技术", category: "工学" },
  { id: "journalism", name: "新闻学", category: "文学" },
  { id: "animation", name: "动画", category: "艺术学" },
  { id: "biology", name: "生物科学", category: "理学" },
  { id: "philosophy", name: "哲学", category: "哲学" },
  { id: "chinese", name: "汉语言文学", category: "文学" },
];

export const MAJOR_NAMES: Record<string, string> = Object.fromEntries(
  MAJORS.map((m) => [m.id, m.name])
);

export const PERSONA_MODES = [
  { id: "livestream" as const, name: "直播间雪峰", dot: "bg-sprite", desc: "喜欢反问、喜欢举例、拆幻想、节奏轻松" },
  { id: "results-night" as const, name: "高考出分夜雪峰", dot: "bg-xf-yellow", desc: "开门见山、少废话、直接下结论" },
  { id: "angry" as const, name: "急眼雪峰", dot: "bg-xf-red", desc: "连续反问、节目效果拉满、锐评密度最高" },
];

export type PersonaMode = (typeof PERSONA_MODES)[number]["id"];
