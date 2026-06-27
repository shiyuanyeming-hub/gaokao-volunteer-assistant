// LLM 增强：在确定性引擎结果之上，用「张雪峰风格」LLM 生成更鲜活的锐评/家长版/学生版。
// 失败时返回 null，调用方回退到 zhangxuefengSkill 模板（保证永远有输出）。

import { getAdvisor } from "@/lib/advisors/factory";
import { XUEFENG_SYSTEM_PROMPT } from "@/lib/prompts/system-prompt";
import type { ClientApiSettings } from "@/lib/api-settings";
import type { RecommendInput, RecommendResult } from "./recommendationEngine";

export interface LLMAdvice {
  roast: string;
  parent: string;
  student: string;
}

/** 从可能含 ```json 代码块或多余文本的响应中提取首个 JSON 对象 */
function extractJSON(text: string): Record<string, string> | null {
  try {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const raw = fenced ? fenced[1] : text;
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

/** 过滤 LLM 可能输出的绝对化表述 */
function sanitize(text: string): string {
  return text
    .replace(/必[上录]/g, "大概率能")
    .replace(/百分百/g, "大概率")
    .replace(/包上岸/g, "更有把握")
    .replace(/稳录/g, "录取概率高")
    .replace(/绝对不能报/g, "需慎重");
}

export async function enhanceWithLLM(
  input: RecommendInput,
  result: RecommendResult,
  apiConfig?: Partial<ClientApiSettings>
): Promise<LLMAdvice | null> {
  const profile = {
    省份: result.provinceName,
    分数: input.score,
    位次: result.rank,
    分数层级: result.scoreBand,
    选科: input.subjectTrack,
    家庭预算: input.familyBudget,
    城市偏好: input.cityPreference,
    专业偏好: input.majorPreference,
    就业目标: input.careerGoal,
    风险偏好: input.riskPreference,
  };

  const engineContext = {
    主要矛盾: result.conflict,
    场景标签: result.scenarioHints,
    推荐专业: result.recommendedMajors.map((m) => m.major.majorName),
    回避专业: result.avoidMajors.map((m) => m.name),
    冲稳保院校层级: {
      冲: result.rushStableSafe.冲.院校类型,
      稳: result.rushStableSafe.稳.院校类型,
      保: result.rushStableSafe.保.院校类型,
    },
  };

  const system =
    XUEFENG_SYSTEM_PROMPT +
    "\n\n你是「雪碧报考助手」的锐评引擎，基于张雪峰风格输出，但**不冒充张雪峰本人**。" +
    "你只能润色文案、不得推翻引擎已得出的结构化结论。每条锐评后必须自带理性落脚点。" +
    "禁止输出「必上/稳录/百分百/绝对不能报」等绝对化表述。只输出 JSON。";

  const user = `考生画像：${JSON.stringify(profile, null, 0)}

引擎已得出的结构化分析（请基于此润色，不要推翻）：
${JSON.stringify(engineContext, null, 0)}

请严格输出如下 JSON（不要有任何额外文字）：
{"roast":"先一句雪峰味锐评直击要害，再一句金句收尾，合计 80-130 字","parent":"给家长看的话，务实、强调家庭与就业兜底，60-100 字","student":"给考生看的话，直接、强调自己查自己负责，60-100 字"}`;

  try {
    const text = await getAdvisor(apiConfig?.provider, apiConfig).complete(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { temperature: 0.75, maxOutputTokens: 800 }
    );
    const parsed = extractJSON(text);
    if (!parsed) return null;
    return {
      roast: sanitize(parsed.roast || result.roast),
      parent: sanitize(parsed.parent || result.parentAdvice),
      student: sanitize(parsed.student || result.studentAdvice),
    };
  } catch {
    return null;
  }
}
