# 雪碧报考助手 — 数据层说明

> ⚠️ **当前数据为示意/Mock，非权威。** 志愿填报请以官方招生计划、院校招生章程、专业选科要求与正式志愿填报咨询为准。

本目录描述 `lib/data/` 数据层的结构、来源与**未来如何替换为真实数据**。

## 数据结构（5 类）

定义见 [`lib/data/types.ts`](../lib/data/types.ts)：

| 结构 | 文件 | 说明 |
|------|------|------|
| `ProvinceData` | `lib/data/provinces.ts` | 31 省：高考类型、满分、批次线（本科/特控/专科）、选科规则 |
| `RankData` | `lib/data/rank.ts` | 一分一段表（当前为估算函数 `scoreToRankEstimate`） |
| `UniversityData` | `lib/data/universities.ts` | 院校：层级(985/211/双一流/省重点/普通本科/民办/中外合作/高职)、类型、强项专业 |
| `MajorData` | `lib/data/majors.ts` | 专业：16 大类、就业方向、稳定性、考研必要性、城市依赖、AI 风险、家庭资源依赖、锐评标签、理性建议 |
| `AdmissionData` | `lib/data/admission.ts` | 录取线：院校×专业×省份×类别的最低分/位次/计划数/学费 |

所有查询走 [`lib/data/access.ts`](../lib/data/access.ts)（`getProvince` / `getMajor` / `queryUniversities` / `getDataFreshness` 等）。

## 当前数据限制

- **批次线**：基于近年公开数据的**示意值**，未必精确到当年。
- **位次**：`scoreToRankEstimate` 是基于批次线的 sigmoid 估算，**非真实一分一段表**。
- **院校/录取线**：代表性 mock，仅用于方向性建议，**非完整名录**。
- 评分（稳定性/城市依赖等）为主观经验示意，非权威排名。
- UI 通过 `getDataFreshness()` 显示「数据更新时间」与「含模拟数据」提示。

## 数据来源（未来接入真实数据时）

1. **各省教育考试院** — 一分一段表、批次线、招生计划（权威）。
2. **阳光高考平台（教育部）** — 院校库、专业库、招生章程。
3. **各高校本科招生网** — 历年录取分数线、专业选科要求。
4. **各省《普通高校招生计划》大厚本** — 当年分省分专业计划。

## 如何更新数据

数据层被设计为可增量替换，无需改组件代码：

### 1. 省份批次线 / 位次表
将各省考试院公布的一分一段表导出为 JSON，替换 `lib/data/rank.ts` 的估算逻辑（或新增 `lib/data/rank-2024.json` 并在 `access.ts` 中加载）。

JSON 示例（一分一段表）：
```json
[
  { "province": "湖北", "year": 2024, "category": "物理类", "score": 600, "rank": 18500 }
]
```

### 2. 院校 / 专业
编辑 `lib/data/universities.ts`、`lib/data/majors.ts`，或新增对应的 JSON 文件并在 `access.ts` 加载。也可在 **数据更新面板**（Phase 2 的 `/admin` 页面）做 CSV/JSON 导入。

CSV 示例（录取线）：
```csv
province,year,universityName,majorName,category,minScore,minRank,batch,tuition
湖北,2024,华中科技大学,计算机科学与技术,物理类,648,3500,本科普通批,5850
```

### 3. 保持时效
更新数据后，同步修改 `lib/data/access.ts` 的 `getDataFreshness()`（`updatedAt` / `sourceNote` / `isMock`），让 UI 徽章反映最新状态。

## 免责声明

本工具是**娱乐化志愿辅助工具**，所有数据与建议仅供参考，不替代官方招生计划、院校章程、专业选科要求与正式志愿填报咨询。本工具不冒充任何个人，"雪峰味锐评"为风格化表达，非本人观点。
