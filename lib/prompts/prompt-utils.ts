import type { PersonaMode } from "../constants";
import {
  XUEFENG_SYSTEM_PROMPT,
  getHeuristicsForIntent,
} from "./system-prompt";
import { PERSONA_PROMPTS } from "./persona-modes";
import { ANALYSIS_PROMPT } from "./analysis-prompt";
import { GAOKAO_2026_PROMPT_CONTEXT } from "@/lib/data/gaokao-2026";

// Detect query intent for heuristic injection
function detectIntent(message: string): string {
  const lower = message.toLowerCase();
  if (/专业|学什么|选什么|哪个方向/.test(lower)) return "major";
  if (/学校|大学|学院|985|211|双一流|报考/.test(lower)) return "school";
  if (/分数|多少分|位次|排名|成绩/.test(lower)) return "score";
  if (/考研|研究生|硕士|博士/.test(lower)) return "postgraduate";
  if (/就业|工作|薪资|工资|前景|找工作/.test(lower)) return "career";
  if (/城市|去哪|北上广|一线|二线/.test(lower)) return "city";
  return "default";
}

// Build full system prompt for chat mode
export function buildChatSystemPrompt(
  persona: PersonaMode,
  userMessage?: string
): string {
  const parts: string[] = [
    XUEFENG_SYSTEM_PROMPT,
    GAOKAO_2026_PROMPT_CONTEXT,
    PERSONA_PROMPTS[persona],
  ];

  // Inject relevant heuristics based on user query
  if (userMessage) {
    const intent = detectIntent(userMessage);
    const heuristics = getHeuristicsForIntent(intent);
    parts.push(heuristics.join("\n\n"));
  }

  return parts.join("\n\n---\n\n");
}

// Build full system prompt for analysis mode
export function buildAnalysisSystemPrompt(persona: PersonaMode): string {
  return [
    XUEFENG_SYSTEM_PROMPT,
    GAOKAO_2026_PROMPT_CONTEXT,
    PERSONA_PROMPTS[persona],
    ANALYSIS_PROMPT,
  ].join("\n\n---\n\n");
}

// Build user prompt with profile context for analysis
export function buildAnalysisUserPrompt(profile: {
  province: string;
  score: number;
  rank?: number;
  subjects: string;
  batch?: string;
  budget?: string;
  acceptAdjustment?: string;
  major?: string;
  city?: string;
}): string {
  let prompt = `来分析一个志愿填报方案：

省份：${profile.province}
分数：${profile.score}分
全省位次：${profile.rank ? profile.rank : "用户未提供，请提醒先查一分一段表"}
选科：${profile.subjects}`;

  if (profile.batch) {
    prompt += `\n报考批次：${profile.batch}`;
  }
  if (profile.budget) {
    prompt += `\n预算倾向：${profile.budget}`;
  }
  if (profile.acceptAdjustment) {
    prompt += `\n服从调剂：${profile.acceptAdjustment}`;
  }

  if (profile.major) {
    prompt += `\n目标专业：${profile.major}`;
  }
  if (profile.city) {
    prompt += `\n目标城市：${profile.city}`;
  }

  prompt += `\n\n严格按这四个 markdown 二级标题输出（标题一字不差，按顺序）：## 情况分析 → ## 风险评估 → ## 志愿建议 → ## 张老师锐评。锐评段必须用一句截图级金句收尾。

额外要求：请把 2026 年报考核对点说清楚，明确提醒去阳光高考、所在省教育考试院和目标高校招生网核对招生章程、选科要求、近三年位次、调剂规则与学费。`;

  return prompt;
}
