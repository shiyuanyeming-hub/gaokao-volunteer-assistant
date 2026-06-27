// 数据访问器 — 所有查询函数集中在此，组件/引擎统一从这里取数据。
// 这样未来替换数据源（CSV/JSON/数据库）时，只改这里与 *_data 文件。

import type {
  ProvinceData,
  UniversityData,
  MajorData,
  MajorCategory,
  UniversityLevel,
  UniversityType,
  DataFreshness,
  ScoreCategory,
} from "./types";
import { PROVINCES } from "./provinces";
import { UNIVERSITIES } from "./universities";
import { MAJORS, MAJOR_CATEGORIES } from "./majors";

// —— 省份 ——
export function getProvince(id: string): ProvinceData | undefined {
  return PROVINCES.find((p) => p.id === id);
}
export function getProvinceByName(name: string): ProvinceData | undefined {
  return PROVINCES.find((p) => p.provinceName === name);
}
export function getAllProvinces(): ProvinceData[] {
  return PROVINCES;
}

// —— 专业 ——
export function getMajor(id: string): MajorData | undefined {
  return MAJORS.find((m) => m.id === id);
}
export function getMajorsByCategory(category: MajorCategory): MajorData[] {
  return MAJORS.filter((m) => m.category === category);
}
export function getAllMajors(): MajorData[] {
  return MAJORS;
}
export function getAllMajorCategories(): readonly MajorCategory[] {
  return MAJOR_CATEGORIES;
}

// —— 院校 ——
export function getUniversity(id: string): UniversityData | undefined {
  return UNIVERSITIES.find((u) => u.id === id);
}
export function getAllUniversities(): UniversityData[] {
  return UNIVERSITIES;
}
export interface UniversityFilter {
  level?: UniversityLevel | UniversityLevel[];
  type?: UniversityType | UniversityType[];
  province?: string;
  city?: string;
}
export function queryUniversities(filter: UniversityFilter = {}): UniversityData[] {
  return UNIVERSITIES.filter((u) => {
    if (filter.level) {
      const levels = Array.isArray(filter.level) ? filter.level : [filter.level];
      if (!levels.includes(u.level)) return false;
    }
    if (filter.type) {
      const types = Array.isArray(filter.type) ? filter.type : [filter.type];
      if (!types.includes(u.type)) return false;
    }
    if (filter.province && u.province !== filter.province) return false;
    if (filter.city && u.city !== filter.city) return false;
    return true;
  });
}

// —— 按分数段匹配院校层级（用于冲稳保的院校类型建议） ——
export function levelsForScoreBand(band: ScoreBand): UniversityLevel[][] {
  // [冲, 稳, 保] 各自建议的院校层级集合
  switch (band) {
    case "高分段":
      return [["985"], ["985", "211"], ["211", "双一流"]];
    case "中高分段":
      return [["985", "211"], ["211", "双一流"], ["双一流", "省重点"]];
    case "一本线上":
      return [["211", "双一流"], ["双一流", "省重点"], ["省重点", "普通本科"]];
    case "本科线上":
      return [["省重点", "普通本科"], ["普通本科", "民办本科"], ["民办本科", "高职专科"]];
    case "专科段":
      return [["普通本科", "高职专科"], ["高职专科"], ["高职专科"]];
    default:
      return [["省重点"], ["普通本科"], ["民办本科"]];
  }
}
export type ScoreBand =
  | "高分段"
  | "中高分段"
  | "一本线上"
  | "本科线上"
  | "专科段"
  | "不确定";

// —— 数据时效 ——
export function getDataFreshness(): DataFreshness {
  return {
    updatedAt: "2024",
    sourceNote:
      "批次线为近年公开数据示意值；院校/录取/位次含模拟数据。具体以各省考试院、阳光高考及院校招生章程为准。",
    isMock: true,
  };
}

// 重导出 ScoreCategory 类型方便下游使用
export type { ScoreCategory };
