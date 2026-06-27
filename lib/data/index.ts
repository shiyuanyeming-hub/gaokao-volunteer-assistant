// 数据层统一出口 — 组件与引擎从此处导入。
// 未来替换数据源时，只需修改 ./access.ts 与各 data 文件，下游无感。

export * from "./types";
export * from "./provinces";
export * from "./majors";
export * from "./universities";
export * from "./admission";
export {
  getProvince,
  getProvinceByName,
  getAllProvinces,
  getMajor,
  getMajorsByCategory,
  getAllMajors,
  getAllMajorCategories,
  getUniversity,
  getAllUniversities,
  queryUniversities,
  levelsForScoreBand,
  getDataFreshness,
  type UniversityFilter,
  type ScoreBand,
  type ScoreCategory,
} from "./access";
export { scoreToRankEstimate, rankToScoreApprox, type RankEstimate } from "./rank";
