// 数据层类型定义 — 雪碧报考助手
// 结构清晰，支持后续替换为官方数据源（省考试院 / 阳光高考 / 院校招生网）。
// 所有数值当前为示意/mock，UI 会标注"含模拟数据，以官方招生计划为准"。

export type ExamType = "3+3" | "3+1+2" | "文理分科";

export type ScoreCategory =
  | "物理类"
  | "历史类"
  | "综合"
  | "文科"
  | "理科";

export type UniversityLevel =
  | "985"
  | "211"
  | "双一流"
  | "省重点"
  | "普通本科"
  | "民办本科"
  | "中外合作"
  | "高职专科";

export type UniversityType =
  | "综合"
  | "理工"
  | "财经"
  | "师范"
  | "医药"
  | "政法"
  | "农林"
  | "艺术"
  | "体育"
  | "语言"
  | "民族";

export type MajorCategory =
  | "计算机类"
  | "电子信息类"
  | "自动化类"
  | "机械类"
  | "土木建筑类"
  | "医学类"
  | "师范类"
  | "财经类"
  | "法学类"
  | "外语类"
  | "新闻传播类"
  | "艺术类"
  | "农学类"
  | "管理类"
  | "护理类"
  | "药学类";

export type Level3 = "low" | "mid" | "high";

/** 单个类别（物理类/历史类/综合...）的批次线 */
export interface BatchLine {
  本科线: number;
  /** 特殊类型招生控制线（原一本参考线 / 强基参考） */
  特控线?: number;
  专科线?: number;
}

/** 省份数据 */
export interface ProvinceData {
  id: string;
  provinceName: string;
  examType: ExamType;
  /** 高考满分（多数省份 750；上海 660；海南 900） */
  scoreTotal: number;
  /** 按类别分的批次线 */
  batchLines: Partial<Record<ScoreCategory, BatchLine>>;
  /** 选科规则简述 */
  subjectRules: string;
  updatedAt: string;
  sourceNote: string;
}

/** 位次数据（一分一段表条目） */
export interface RankData {
  province: string;
  year: number;
  score: number;
  rank: number;
  category: ScoreCategory;
  updatedAt: string;
}

/** 院校数据 */
export interface UniversityData {
  id: string;
  universityName: string;
  province: string;
  city: string;
  level: UniversityLevel;
  type: UniversityType;
  tags: string[];
  strongMajors: string[];
  employmentRegion: string;
  riskNote: string;
}

/** 专业数据 */
export interface MajorData {
  id: string;
  majorName: string;
  category: MajorCategory;
  intro: string;
  requiredSubjects: string[];
  recommendedFor: string[];
  avoidFor: string[];
  employmentDirection: string[];
  /** 就业稳定性 1-5 */
  stabilityScore: number;
  /** 薪资潜力 */
  salaryPotential: Level3;
  /** 考研必要性 */
  postgraduateNeed: Level3;
  /** 考公/编制契合度 1-5 */
  civilServiceFit: number;
  /** 城市依赖度 1-5（越依赖一线城市资源） */
  cityDependency: number;
  /** AI 冲击风险 */
  aiImpactRisk: Level3;
  /** 家庭资源依赖度 1-5 */
  familyDependency: number;
  roastTags: string[];
  rationalAdvice: string;
}

/** 录取线数据 */
export interface AdmissionData {
  province: string;
  year: number;
  universityName: string;
  majorName: string;
  category: ScoreCategory;
  minScore: number;
  minRank: number;
  avgScore?: number;
  batch: string;
  planCount?: number;
  tuition?: number;
  note: string;
}

/** 数据时效信息（供 DataFreshnessBadge 使用） */
export interface DataFreshness {
  updatedAt: string;
  sourceNote: string;
  /** 是否包含模拟/示意数据 */
  isMock: boolean;
}
