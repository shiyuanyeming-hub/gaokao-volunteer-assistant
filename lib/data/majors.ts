// 专业数据 — 16 大类
// 每条含就业方向、稳定性、考研必要性、城市依赖、AI 风险、家庭资源依赖、
// 锐评标签与理性建议。roastTags 是「玩梗锐评」，rationalAdvice 是「理性建议」，
// 二者并存（spec 要求：每条锐评必须配理性解释）。
// ⚠️ 评分为主观经验示意，非权威排名。

import type { MajorData } from "./types";

export const MAJORS: MajorData[] = [
  // —— 计算机类 ——
  {
    id: "cs", majorName: "计算机科学与技术", category: "计算机类",
    intro: "万金油工科：编程、算法、系统、软件全栈通吃，进可攻互联网大厂，退可考公考编。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["逻辑强", "能坐得住写代码", "愿意持续自学"], avoidFor: ["数学很差且抗拒", "以为玩过游戏就能学好", "完全不愿动手"],
    employmentDirection: ["后端/前端开发", "算法工程师", "测试/运维", "考公（信息岗）", "国企数字化"],
    stabilityScore: 3, salaryPotential: "high", postgraduateNeed: "mid", civilServiceFit: 3, cityDependency: 4, aiImpactRisk: "mid", familyDependency: 1,
    roastTags: ["你跑不过我", "分数不够时的万能止痛药", "Cursor 时代的饭碗"],
    rationalAdvice: "适合逻辑强、能持续学习、肯做项目和实习的人。普通院校更要靠项目、实习和城市机会弥补平台差距；别把它当「分数不够就无脑选」的兜底。",
  },
  {
    id: "se", majorName: "软件工程", category: "计算机类",
    intro: "偏工程实践，项目驱动，就业导向比 CS 更直接，学费通常略高。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["想做应用开发", "重实践轻理论", "想尽快就业"], avoidFor: ["抗拒团队协作", "以为软件=做网页"],
    employmentDirection: ["应用开发", "移动端", "产品/测试", "外包/驻场"],
    stabilityScore: 3, salaryPotential: "high", postgraduateNeed: "low", civilServiceFit: 3, cityDependency: 4, aiImpactRisk: "mid", familyDependency: 1,
    roastTags: ["代码即存款", "毕业即社畜"],
    rationalAdvice: "工程化训练扎实，本科就业率在工科里靠前；但行业周期明显，建议在校期间多攒项目、早实习，分散单一赛道的风险。",
  },

  // —— 电子信息类 ——
  {
    id: "ee", majorName: "电子信息工程", category: "电子信息类",
    intro: "软硬结合，从电路到信号到嵌入式，是「卡脖子」赛道，国家在砸钱。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["物理电学感兴趣", "能啃硬核课", "想进半导体/通信"], avoidFor: ["数学物理弱", "只想坐办公室"],
    employmentDirection: ["硬件工程师", "嵌入式", "通信/半导体", "芯片相关（需深造）"],
    stabilityScore: 4, salaryPotential: "mid", postgraduateNeed: "high", civilServiceFit: 2, cityDependency: 3, aiImpactRisk: "low", familyDependency: 1,
    roastTags: ["国家在替你氪金", "越老越值钱的硬核"],
    rationalAdvice: "半导体、通信是长期投入赛道，本科偏基础，想进研发岗基本要读研；适合能接受长线投入、对硬件真有兴趣的人。",
  },
  {
    id: "telecom", majorName: "通信工程", category: "电子信息类",
    intro: "5G/6G、运营商、设备商，三方+设备厂+运营商三选一。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["想进三大运营商", "数学不错"], avoidFor: ["抗拒数学信号类课"],
    employmentDirection: ["运营商（移动/电信/联通）", "设备商", "网络优化"],
    stabilityScore: 4, salaryPotential: "mid", postgraduateNeed: "mid", civilServiceFit: 3, cityDependency: 3, aiImpactRisk: "low", familyDependency: 2,
    roastTags: ["铁饭碗的亲戚", "进运营商=半个体质内"],
    rationalAdvice: "运营商稳定但天花板有限，进核心研发岗需深造+好学校；本科就业多走运维、网优、政企客户经理。",
  },

  // —— 自动化类 ——
  {
    id: "automation", majorName: "自动化", category: "自动化类",
    intro: "工科里的「万金油」，控制、电子、计算机都沾边，号称「什么都能干」。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["兴趣广泛没定方向", "动手能力强", "数学不错"], avoidFor: ["想一进校就专精某一方向"],
    employmentDirection: ["智能制造", "机器人", "工业控制", "读研转方向灵活"],
    stabilityScore: 4, salaryPotential: "mid", postgraduateNeed: "mid", civilServiceFit: 2, cityDependency: 3, aiImpactRisk: "low", familyDependency: 1,
    roastTags: ["万金油本油", "啥都会一点=啥都得再学"],
    rationalAdvice: "面广是优势也是坑——本科容易「博而不精」，建议大三前锁定细分方向（机器人/控制/嵌入式）并补项目经历。",
  },

  // —— 机械类 ——
  {
    id: "me", majorName: "机械设计制造及其自动化", category: "机械类",
    intro: "传统工科基本盘，下限稳、上限看方向（新能源汽车/高端制造有第二春）。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["动手能力强", "接受制造业环境", "想进新能源/车企"], avoidFor: ["只想吹空调坐写字楼", "抗拒车间"],
    employmentDirection: ["汽车/新能源", "装备制造", "结构设计", "工艺/质量"],
    stabilityScore: 4, salaryPotential: "mid", postgraduateNeed: "mid", civilServiceFit: 2, cityDependency: 2, aiImpactRisk: "low", familyDependency: 1,
    roastTags: ["油污与图纸齐飞", "新能源续了命"],
    rationalAdvice: "纯传统机械起薪一般，但挂上新能源汽车、机器人、高端装备就有溢价；优先行业强校 + 区域产业集群（长三角/珠三角）。",
  },

  // —— 土木建筑类 ——
  {
    id: "civil", majorName: "土木工程", category: "土木建筑类",
    intro: "曾经的香饽饽，当下周期下行；不是不能学，是要接受它的新常态。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["能接受工程现场", "走考证路线", "接受长周期项目制"], avoidFor: ["幻想写字楼白领", "抗拒出差驻场"],
    employmentDirection: ["中建/中铁/中交", "设计院", "施工单位", "考证（一建/岩土）"],
    stabilityScore: 3, salaryPotential: "mid", postgraduateNeed: "mid", civilServiceFit: 2, cityDependency: 2, aiImpactRisk: "low", familyDependency: 1,
    roastTags: ["提桶跑路", "安全帽是最好的朋友", "周期之痛"],
    rationalAdvice: "适合能接受工地、长期项目制、愿意考证的人。优先行业强校和区域就业资源；想转设计院基本要读研。行情下行但不会消失，关键是别高分低报。",
  },
  {
    id: "arch", majorName: "建筑学", category: "土木建筑类",
    intro: "五年制，设计与工程结合，受地产周期影响明显，熬夜画图是常态。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["有美术/设计底子", "能熬夜", "真爱建筑"], avoidFor: ["为了「建筑师」好听", "抗拒通宵出图"],
    employmentDirection: ["设计院", "地产（缩招）", "规划/景观", "转行室内/工业设计"],
    stabilityScore: 2, salaryPotential: "mid", postgraduateNeed: "mid", civilServiceFit: 2, cityDependency: 3, aiImpactRisk: "mid", familyDependency: 1,
    roastTags: ["通宵出图的浪漫", "地产寒冬的重灾区"],
    rationalAdvice: "地产下行期就业承压；纯热爱可学，但要预留转设计、城市更新的退路，并对五年学制和熬夜有心理准备。",
  },

  // —— 医学类 ——
  {
    id: "medicine", majorName: "临床医学", category: "医学类",
    intro: "长学制、高门槛、终生考；上限高（三甲主治）但投入周期极长。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["真能吃苦", "家境能等", "真心想当医生"], avoidFor: ["想毕业就赚钱", "抗拒值夜班", "等不起时间"],
    employmentDirection: ["三甲/二甲医院", "规培+专培", "考编进体制医院", "本科则多去基层"],
    stabilityScore: 5, salaryPotential: "mid", postgraduateNeed: "high", civilServiceFit: 4, cityDependency: 3, aiImpactRisk: "low", familyDependency: 2,
    roastTags: ["劝人学医天打雷劈", "5+3+3=你同学都当经理了"],
    rationalAdvice: "上限高、稳定、越老越值钱，但投入极长（5 年本科+规培+常需读研读博）。普通家庭要算清时间成本，且本科多流向基层，想进好医院基本要硕博。",
  },
  {
    id: "dentistry", majorName: "口腔医学", category: "医学类",
    intro: "医学里的「性价比之王」，相对不熬夜、医患风险低、可开诊所。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["手巧心细", "想自主执业", "看重工作生活平衡"], avoidFor: ["分不够硬报", "抗拒临床操作"],
    employmentDirection: ["医院口腔科", "连锁齿科", "自主开诊所", "义齿/正畸"],
    stabilityScore: 5, salaryPotential: "high", postgraduateNeed: "mid", civilServiceFit: 3, cityDependency: 3, aiImpactRisk: "low", familyDependency: 2,
    roastTags: ["牙医=印钞机（前提是熬出来）", "医学界的天花板选手"],
    rationalAdvice: "录取分高、竞争激烈，但熬出来后自主性强、收入可观；同样需要长学制投入，建议结合分数位次理性冲报。",
  },

  // —— 师范类 ——
  {
    id: "edu-math", majorName: "数学与应用数学（师范）", category: "师范类",
    intro: "考编进体制的黄金通道，稳定有寒暑假，但要看生源地教师招聘情况。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["想当老师", "追求稳定", "愿意考编"], avoidFor: ["抗拒公开讲话", "不喜欢重复教学"],
    employmentDirection: ["中小学教师（考编）", "教培", "考公", "读研进高校/教研"],
    stabilityScore: 5, salaryPotential: "low", postgraduateNeed: "mid", civilServiceFit: 5, cityDependency: 2, aiImpactRisk: "low", familyDependency: 1,
    roastTags: ["上岸神器", "寒暑假是真香"],
    rationalAdvice: "师范+主科是考编主力方向，稳定性强；但需关注「县管校聘」与出生率下降对编制的影响，建议优先部属/省属师范并锁定生源地。",
  },
  {
    id: "edu-chinese", majorName: "汉语言文学（师范）", category: "师范类",
    intro: "文科考编万金油，语文教师岗位需求量大，也兼做考公跳板。",
    requiredSubjects: [],
    recommendedFor: ["文笔好", "想考编/考公", "接受教师岗"], avoidFor: ["以为「中文」就是看小说"],
    employmentDirection: ["中小学语文教师", "考公（文秘岗）", "媒体/编辑", "教培"],
    stabilityScore: 5, salaryPotential: "low", postgraduateNeed: "mid", civilServiceFit: 5, cityDependency: 2, aiImpactRisk: "mid", familyDependency: 1,
    roastTags: ["考公考编双 buff", "文科里的就业优等生"],
    rationalAdvice: "就业面在文科中相对宽，编制路径清晰；但薪资天花板低，且写作类基础岗位受 AI 冲击，建议叠加教学技能或新媒体能力。",
  },

  // —— 财经类 ——
  {
    id: "finance", majorName: "金融学", category: "财经类",
    intro: "光环专业，本质拼资源、拼学校、拼城市，头部和尾部差距悬殊。",
    requiredSubjects: [],
    recommendedFor: ["能进顶尖院校", "数学好", "家里有金融口资源"], avoidFor: ["普通院校+无资源", "想躺平"],
    employmentDirection: ["券商/投行（头部院校）", "银行（柜员起步居多）", "基金/保险", "考公（财政金融岗）"],
    stabilityScore: 3, salaryPotential: "high", postgraduateNeed: "high", civilServiceFit: 3, cityDependency: 5, aiImpactRisk: "mid", familyDependency: 4,
    roastTags: ["你不是世界 500 强", "没资源的金融=银行柜员"],
    rationalAdvice: "金融高度依赖学校层次、城市与资源。普通家庭+普通院校大概率进银行基层岗，建议要么冲名校，要么早点准备考公/考证（CPA）。",
  },
  {
    id: "accounting", majorName: "会计学", category: "财经类",
    intro: "实用型财经，各行各业都要，靠证（CPA/初会）吃饭，稳定但易被自动化蚕食。",
    requiredSubjects: [],
    recommendedFor: ["细心耐心", "愿意考证", "求稳"], avoidFor: ["抗拒重复对账", "讨厌数字"],
    employmentDirection: ["企业财务", "事务所（四大/内资）", "考公（财税岗）", "审计"],
    stabilityScore: 4, salaryPotential: "mid", postgraduateNeed: "low", civilServiceFit: 4, cityDependency: 3, aiImpactRisk: "high", familyDependency: 2,
    roastTags: ["考证到老", "基础岗正在被 AI 接管"],
    rationalAdvice: "就业面广、门槛清晰（证），但基础核算岗受 AI/自动化冲击明显；出路是往管理会计、审计、税务或考公方向升级，别停留在记账。",
  },

  // —— 法学类 ——
  {
    id: "law", majorName: "法学", category: "法学类",
    intro: "精英化路线：法考是第一关，过了之后拼院校、拼资源、拼案源。",
    requiredSubjects: [],
    recommendedFor: ["逻辑与表达强", "能啃厚书", "想考公检法"], avoidFor: ["背不动法条", "以为法学=当律师剧主角"],
    employmentDirection: ["律所（需过法考+熬年资）", "公检法（考公）", "企业法务", "考公（法制岗）"],
    stabilityScore: 4, salaryPotential: "high", postgraduateNeed: "high", civilServiceFit: 5, cityDependency: 4, aiImpactRisk: "low", familyDependency: 3,
    roastTags: ["法考比砖头还厚", "五院四系的入场券"],
    rationalAdvice: "天花板高、考公契合度强（公检法岗多），但法考通过率有限、前期收入低。建议优先「五院四系」等强校，普通院校要走「考公+法务」务实路线。",
  },

  // —— 外语类 ——
  {
    id: "english", majorName: "英语", category: "外语类",
    intro: "纯语言专业红利消退，AI 翻译冲击大；出路是「外语+专业」复合能力。",
    requiredSubjects: [],
    recommendedFor: ["语言天赋强", "愿意叠加第二技能", "想考编/外贸"], avoidFor: ["只想靠「会英语」吃饭", "抗拒复合学习"],
    employmentDirection: ["教师（考编）", "外贸/跨境电商", "翻译（高端岗需资质）", "考公"],
    stabilityScore: 3, salaryPotential: "mid", postgraduateNeed: "mid", civilServiceFit: 4, cityDependency: 4, aiImpactRisk: "high", familyDependency: 1,
    roastTags: ["会一门外语不是护城河", "AI 时代的翻译刺客"],
    rationalAdvice: "纯语言已不是护城河，基础翻译、文案岗受 AI 冲击明显。建议叠加国际贸易、法律、传媒、数据分析或 AI 工具能力，走「语言+专业」复合路线。",
  },

  // —— 新闻传播类 ——
  {
    id: "journalism", majorName: "新闻学", category: "新闻传播类",
    intro: "传统媒体萎缩、新媒体不挑专业，夹在中间两头不靠，是争议最大的方向之一。",
    requiredSubjects: [],
    recommendedFor: ["真热爱且家里能兜底", "想做内容/自媒体", "目标考公（宣传岗）"], avoidFor: ["以为能当记者就稳了", "无资源求高薪"],
    employmentDirection: ["考公（宣传/网信岗）", "新媒体运营", "企业 PR", "自媒体"],
    stabilityScore: 2, salaryPotential: "mid", postgraduateNeed: "high", civilServiceFit: 3, cityDependency: 4, aiImpactRisk: "high", familyDependency: 2,
    roastTags: ["从专业目录闭眼摸一个都比新闻好", "新媒体不看专业看流量"],
    rationalAdvice: "不是说不能学，而是别用「能当记者」的旧认知去报。现在出路更多是考公宣传岗、企业 PR、自媒体，且对内容/数据能力要求高；普通院校性价比偏低。",
  },

  // —— 艺术类 ——
  {
    id: "animation", majorName: "动画", category: "艺术类",
    intro: "热爱导向，行业加班重、起薪低，头部与尾部差距极大，家境兜底很重要。",
    requiredSubjects: [],
    recommendedFor: ["真热爱且能吃苦", "有作品积累习惯", "家境能兜底"], avoidFor: ["只是觉得好玩", "无作品无基础", "普通家庭想速成高薪"],
    employmentDirection: ["游戏/影视美术", "动画/特效", "自由插画师", "教培"],
    stabilityScore: 2, salaryPotential: "mid", postgraduateNeed: "low", civilServiceFit: 1, cityDependency: 5, aiImpactRisk: "high", familyDependency: 4,
    roastTags: ["热爱到怀疑人生", "家里有矿再考虑"],
    rationalAdvice: "行业辛苦、AI 对基础美术岗冲击大。真热爱请在校期间持续积累作品集、走游戏/影视等相对高薪细分；普通家庭务必预留务实退路。",
  },

  // —— 农学类 ——
  {
    id: "agronomy", majorName: "农学", category: "农学类",
    intro: "常被调侃为「天坑」，实则考公考编（农业系统）有定向优势，就业冷门但稳定。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["能接受基层/实验", "想考农业系统编制", "对生物感兴趣"], avoidFor: ["追求都市白领生活", "抗拒下乡/实验"],
    employmentDirection: ["农业/林业系统（考公）", "种业/农资企业", "科研（需读研）", "基层农技"],
    stabilityScore: 4, salaryPotential: "low", postgraduateNeed: "high", civilServiceFit: 4, cityDependency: 1, aiImpactRisk: "low", familyDependency: 1,
    roastTags: ["生化环材+农林的天坑联动", "考编冷门赛道反而稳"],
    rationalAdvice: "本科就业冷门、起薪低，但农业系统考公岗位竞争小、有定向优势。想走科研必须读研读博；务实派可走考公/农资企业。",
  },

  // —— 管理类 ——
  {
    id: "admin", majorName: "行政管理", category: "管理类",
    intro: "偏文科的管理，对口考公考编（行政岗），但企业端「万金油」属性强、壁垒低。",
    requiredSubjects: [],
    recommendedFor: ["目标考公", "文笔尚可", "求稳"], avoidFor: ["指望毕业当管理层", "想高起薪"],
    employmentDirection: ["考公（行政/文秘岗）", "企业行政/人事", "事业单位", "考研转方向"],
    stabilityScore: 3, salaryPotential: "low", postgraduateNeed: "mid", civilServiceFit: 5, cityDependency: 3, aiImpactRisk: "mid", familyDependency: 2,
    roastTags: ["万金油=没壁垒", "考公才是正解"],
    rationalAdvice: "对口就业弱、企业端替代性强，核心价值是考公考编契合度高。建议在校期间锁定考公或辅修一技之长，别指望「管理」二字直接变现。",
  },

  // —— 护理类 ——
  {
    id: "nursing", majorName: "护理学", category: "护理类",
    intro: "就业率高、需求量大、能进医院编制，但辛苦、倒班、社会认同感偏低。",
    requiredSubjects: [],
    recommendedFor: ["细心有耐心", "能接受倒班", "求稳就业"], avoidFor: ["抗拒夜班/体力活", "身体较弱"],
    employmentDirection: ["医院护士（考编/合同）", "社区/基层医疗", "养老/康复", "出国（需语言）"],
    stabilityScore: 5, salaryPotential: "low", postgraduateNeed: "low", civilServiceFit: 4, cityDependency: 2, aiImpactRisk: "low", familyDependency: 1,
    roastTags: ["就业率天花板", "三班倒的真香与真累"],
    rationalAdvice: "就业几乎不愁、编制路径清晰，老龄化背景下需求增长；但要接受倒班和体力消耗，本科护理进三甲机会更大，建议读本科+考编。",
  },

  // —— 药学类 ——
  {
    id: "pharmacy", majorName: "药学", category: "药学类",
    intro: "医药交叉，比临床医学周期短、强度低，可进药企/医院药剂科/考公。",
    requiredSubjects: ["物理", "化学"],
    recommendedFor: ["化学好", "想进医药行业但不当医生", "能接受实验"], avoidFor: ["化学差", "抗拒实验/考证"],
    employmentDirection: ["药企（研发/销售/注册）", "医院药剂科", "考公（药监）", "执业药师"],
    stabilityScore: 4, salaryPotential: "mid", postgraduateNeed: "mid", civilServiceFit: 3, cityDependency: 3, aiImpactRisk: "low", familyDependency: 1,
    roastTags: ["不当医生的医学平替", "执业药师证=加薪券"],
    rationalAdvice: "比临床周期短，研发岗需读研，本科多走药企销售/注册、医院药剂科。考执业药师证是关键加分项；建议结合化学基础和职业规划选择。",
  },
];

export const MAJOR_CATEGORIES = [
  "计算机类", "电子信息类", "自动化类", "机械类", "土木建筑类", "医学类",
  "师范类", "财经类", "法学类", "外语类", "新闻传播类", "艺术类",
  "农学类", "管理类", "护理类", "药学类",
] as const;
