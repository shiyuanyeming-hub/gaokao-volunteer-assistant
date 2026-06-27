// 院校数据 — 各层级代表性院校（mock，非完整名录）
// 用于推荐引擎给出「院校层级/类型/强项专业」方向建议，而非精确择校。
// ⚠️ 真实择校需结合当年招生计划与录取位次，见 data/README.md。

import type { UniversityData } from "./types";

export const UNIVERSITIES: UniversityData[] = [
  // —— 985 ——
  { id: "thu", universityName: "清华大学", province: "北京", city: "北京", level: "985", type: "综合",
    tags: ["顶尖", "理工极强", "北京"], strongMajors: ["计算机", "电子信息", "自动化", "建筑"], employmentRegion: "全国/海外", riskNote: "录取位次极高，仅建议顶级分数段冲" },
  { id: "pku", universityName: "北京大学", province: "北京", city: "北京", level: "985", type: "综合",
    tags: ["顶尖", "文理医强", "北京"], strongMajors: ["数学", "法学", "经济", "临床医学"], employmentRegion: "全国/海外", riskNote: "文科与理科双顶，竞争极激烈" },
  { id: "zju", universityName: "浙江大学", province: "浙江", city: "杭州", level: "985", type: "综合",
    tags: ["工科强", "杭州", "互联网近"], strongMajors: ["计算机", "控制科学", "农学"], employmentRegion: "长三角", riskNote: "杭州互联网资源加成明显" },
  { id: "sjtu", universityName: "上海交通大学", province: "上海", city: "上海", level: "985", type: "综合",
    tags: ["工科/医学强", "上海"], strongMajors: ["船舶", "机械", "临床医学", "计算机"], employmentRegion: "长三角", riskNote: "医学与工科顶尖，分数门槛高" },
  { id: "whu", universityName: "武汉大学", province: "湖北", city: "武汉", level: "985", type: "综合",
    tags: ["性价比985", "武汉"], strongMajors: ["测绘", "法学", "新闻", "马克思主义"], employmentRegion: "华中/全国", riskNote: "强势专业分布广，注意分流" },
  { id: "hust", universityName: "华中科技大学", province: "湖北", city: "武汉", level: "985", type: "综合",
    tags: ["工科强", "武汉", "光电"], strongMajors: ["机械", "光电", "计算机", "公共卫生"], employmentRegion: "华中/珠三角", riskNote: "工科就业强，珠三角认可度高" },
  { id: "scu", universityName: "四川大学", province: "四川", city: "成都", level: "985", type: "综合",
    tags: ["西南龙头", "成都", "医学强"], strongMajors: ["口腔医学", "临床医学", "中国语言"], employmentRegion: "西南/全国", riskNote: "华西口腔全国顶尖" },
  { id: "sysu", universityName: "中山大学", province: "广东", city: "广州", level: "985", type: "综合",
    tags: ["华南龙头", "广州", "医学/经管"], strongMajors: ["临床医学", "工商管理", "生物学"], employmentRegion: "华南", riskNote: "大湾区就业资源强" },

  // —— 211 / 行业强校 ——
  { id: "bupt", universityName: "北京邮电大学", province: "北京", city: "北京", level: "211", type: "理工",
    tags: ["两电一邮", "信息强校", "北京"], strongMajors: ["通信工程", "计算机", "电子科学与技术"], employmentRegion: "全国/北京", riskNote: "信息类就业强势，分数接近985" },
  { id: "xidian", universityName: "西安电子科技大学", province: "陕西", city: "西安", level: "211", type: "理工",
    tags: ["两电一邮", "性价比", "西安"], strongMajors: ["电子科学与技术", "通信", "计算机"], employmentRegion: "全国", riskNote: "信息类性价比高，适合中高分段" },
  { id: "zuel", universityName: "中南财经政法大学", province: "湖北", city: "武汉", level: "211", type: "财经",
    tags: ["财经/政法", "武汉"], strongMajors: ["法学", "会计学", "金融学"], employmentRegion: "全国", riskNote: "金融法学就业看资源与考证" },
  { id: "ccnu", universityName: "华中师范大学", province: "湖北", city: "武汉", level: "211", type: "师范",
    tags: ["部属师范", "武汉"], strongMajors: ["教育学", "汉语言", "数学"], employmentRegion: "全国", riskNote: "师范考编主力，需关注生源地政策" },
  { id: "swjtu-sci", universityName: "苏州大学", province: "江苏", city: "苏州", level: "211", type: "综合",
    tags: ["双一流", "苏州", "区位好"], strongMajors: ["材料", "纺织", "医学"], employmentRegion: "长三角", riskNote: "区位与产业资源是主要溢价" },

  // —— 双一流 / 省重点 ——
  { id: "njust", universityName: "南京师范大学", province: "江苏", city: "南京", level: "双一流", type: "师范",
    tags: ["省属师范", "南京"], strongMajors: ["教育学", "地理学", "中国语言"], employmentRegion: "江苏", riskNote: "江苏本地教师就业认可度高" },
  { id: "hnu", universityName: "湖南大学", province: "湖南", city: "长沙", level: "985", type: "综合",
    tags: ["985", "长沙", "网红城市"], strongMajors: ["土木", "机械", "金融"], employmentRegion: "华中/全国", riskNote: "土木金融受周期影响" },
  { id: "scut", universityName: "华南理工大学", province: "广东", city: "广州", level: "985", type: "理工",
    tags: ["985", "广州", "轻工/建筑强"], strongMajors: ["轻工", "建筑", "材料", "食品"], employmentRegion: "华南", riskNote: "部分强势专业属传统行业" },

  // —— 普通本科 / 省重点 ——
  { id: "hbu", universityName: "湖北大学", province: "湖北", city: "武汉", level: "省重点", type: "综合",
    tags: ["省属", "武汉", "性价比"], strongMajors: ["材料", "生物学", "中国语言"], employmentRegion: "湖北", riskNote: "省属综合，适合一本线附近稳报" },
  { id: "njtech", universityName: "南京工业大学", province: "江苏", city: "南京", level: "省重点", type: "理工",
    tags: ["省属", "化工强", "南京"], strongMajors: ["化学工程", "材料", "安全工程"], employmentRegion: "长三角", riskNote: "化工材料强但属传统行业" },

  // —— 民办 / 中外合作 ——
  { id: "wkj", universityName: "武昌首义学院", province: "湖北", city: "武汉", level: "民办本科", type: "综合",
    tags: ["民办", "学费较高"], strongMajors: ["机械", "电气", "土木"], employmentRegion: "湖北", riskNote: "民办学费高，需评估家庭预算" },
  { id: "duke-kunshan", universityName: "昆山杜克大学", province: "江苏", city: "苏州", level: "中外合作", type: "综合",
    tags: ["中外合作", "学费高", "出国友好"], strongMajors: ["全球健康", "数据科学", "环境"], employmentRegion: "全国/海外", riskNote: "学费高昂，适合预算高+计划出国" },

  // —— 高职专科 ——
  { id: "szpt", universityName: "深圳职业技术大学", province: "广东", city: "深圳", level: "高职专科", type: "综合",
    tags: ["高职头部", "深圳", "就业强"], strongMajors: ["电子信息", "计算机", "通信"], employmentRegion: "深圳/珠三角", riskNote: "高职头部，本地就业认可度高" },
  { id: "jyp", universityName: "金华职业技术学院", province: "浙江", city: "金华", level: "高职专科", type: "综合",
    tags: ["高职", "浙江"], strongMajors: ["机械", "护理", "学前教育"], employmentRegion: "浙江", riskNote: "技能就业导向，适合务实路线" },
];
