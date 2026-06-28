export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    LLM_PROVIDER: process.env.LLM_PROVIDER || null,
    hasDeepseekKey: Boolean(process.env.DEEPSEEK_API_KEY?.trim()),
    deepseekKeyPrefix: process.env.DEEPSEEK_API_KEY
      ? process.env.DEEPSEEK_API_KEY.slice(0, 3)
      : null,
    DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL || null,
    hasBaseUrl: Boolean(process.env.DEEPSEEK_BASE_URL?.trim()),
    ALLOW_CLIENT_API_OVERRIDE: process.env.ALLOW_CLIENT_API_OVERRIDE || null,
  });
}
