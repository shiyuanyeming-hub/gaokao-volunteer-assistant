// 录取线数据（mock）— 示意性往年录取门槛，用于冲稳保区间参考。
// ⚠️ 非真实录取数据。真实择校需查阅院校招生网/阳光高考的官方录取统计。

import type { AdmissionData } from "./types";

export const ADMISSIONS: AdmissionData[] = [
  { province: "北京", year: 2024, universityName: "清华大学", majorName: "计算机科学与技术", category: "综合", minScore: 698, minRank: 50, batch: "本科普通批", planCount: 8, note: "示意值，非官方" },
  { province: "北京", year: 2024, universityName: "北京邮电大学", majorName: "通信工程", category: "综合", minScore: 651, minRank: 2500, batch: "本科普通批", planCount: 60, note: "示意值，非官方" },
  { province: "江苏", year: 2024, universityName: "南京师范大学", majorName: "汉语言文学（师范）", category: "历史类", minScore: 588, minRank: 9000, batch: "本科普通批", planCount: 40, tuition: 5500, note: "示意值，非官方" },
  { province: "湖北", year: 2024, universityName: "华中科技大学", majorName: "计算机科学与技术", category: "物理类", minScore: 648, minRank: 3500, batch: "本科普通批", planCount: 120, note: "示意值，非官方" },
  { province: "广东", year: 2024, universityName: "中山大学", majorName: "临床医学", category: "物理类", minScore: 659, minRank: 2000, batch: "本科普通批", planCount: 30, note: "示意值，非官方" },
  { province: "四川", year: 2024, universityName: "四川大学", majorName: "口腔医学", category: "理科", minScore: 675, minRank: 800, batch: "本科一批", planCount: 15, note: "示意值，非官方" },
  { province: "浙江", year: 2024, universityName: "浙江大学", majorName: "自动化", category: "综合", minScore: 671, minRank: 1500, batch: "本科普通批", planCount: 50, note: "示意值，非官方" },
  { province: "陕西", year: 2024, universityName: "西安电子科技大学", majorName: "电子信息工程", category: "理科", minScore: 612, minRank: 6000, batch: "本科一批", planCount: 90, note: "示意值，非官方" },
  { province: "湖北", year: 2024, universityName: "湖北大学", majorName: "会计学", category: "物理类", minScore: 555, minRank: 35000, batch: "本科普通批", planCount: 50, tuition: 4500, note: "示意值，非官方" },
  { province: "江苏", year: 2024, universityName: "南京工业大学", majorName: "化学工程与工艺", category: "物理类", minScore: 548, minRank: 45000, batch: "本科普通批", planCount: 80, note: "示意值，非官方" },
  { province: "广东", year: 2024, universityName: "深圳职业技术大学", majorName: "电子信息工程技术", category: "物理类", minScore: 502, minRank: 120000, batch: "专科批", planCount: 200, note: "示意值，非官方" },
  { province: "江苏", year: 2024, universityName: "昆山杜克大学", majorName: "数据科学", category: "物理类", minScore: 560, minRank: 30000, batch: "本科普通批", tuition: 85000, note: "示意值，非官方，学费高" },
  { province: "河南", year: 2024, universityName: "武汉大学", majorName: "法学", category: "文科", minScore: 638, minRank: 800, batch: "本科一批", planCount: 25, note: "示意值，非官方" },
];

export function getAdmissionsByUniversity(name: string): AdmissionData[] {
  return ADMISSIONS.filter((a) => a.universityName === name);
}
