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
  if (/不想活|想死|活不下去|自杀|轻生|没希望|彻底完了|撑不住/.test(lower)) return "crisis";
  if (/志愿|冲稳保|滑档|退档|调剂|招生章程|专业组|一分一段|录取位次/.test(lower)) return "volunteer";
  if (/专业|学什么|选什么|哪个方向/.test(lower)) return "major";
  if (/学校|大学|学院|985|211|双一流|报考/.test(lower)) return "school";
  if (/分数|多少分|位次|排名|成绩/.test(lower)) return "score";
  if (/考研|研究生|硕士|博士/.test(lower)) return "postgraduate";
  if (/就业|工作|薪资|工资|前景|找工作/.test(lower)) return "career";
  if (/城市|去哪|北上广|一线|二线/.test(lower)) return "city";
  if (/家里|预算|学费|民办|中外合作|家庭|贷款|花费/.test(lower)) return "family";
  if (/官网|官方|教育考试院|阳光高考|数据|来源|可靠吗/.test(lower)) return "source";
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

  prompt += `\n\n请严格按系统要求返回结构化 JSON，不要输出 Markdown 标题、# 号、代码块或纯文本长文。

额外要求：把 2026 年报考核对点压缩进 JSON 的 blocks / tags / roast 中，明确提醒去阳光高考、所在省教育考试院和目标高校招生网核对招生章程、选科要求、近三年位次、调剂规则、体检/语种/单科限制、转专业规则与学费。缺少位次时必须提醒先查一分一段表，不能编造录取概率。`;

  return prompt;
}
