import type { NextRequest } from "next/server";

interface RateBucket {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  scope: string;
  limit?: number;
  windowMs?: number;
}

const buckets = new Map<string, RateBucket>();

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function getLimit(defaultLimit: number) {
  const configured = Number(process.env.PUBLIC_REQUESTS_PER_HOUR);
  return Number.isFinite(configured) && configured > 0 ? configured : defaultLimit;
}

export function checkRateLimit(
  request: NextRequest,
  { scope, limit = getLimit(60), windowMs = 60 * 60 * 1000 }: RateLimitOptions
) {
  const now = Date.now();
  const key = `${scope}:${getClientIp(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return {
      ok: true,
      remaining: Math.max(0, limit - 1),
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      resetSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return {
    ok: true,
    remaining: Math.max(0, limit - current.count),
    resetSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export function rateLimitResponse(resetSeconds: number) {
  return Response.json(
    {
      error: `今天张老师嗓子先歇会儿：访问太频繁了，请 ${resetSeconds} 秒后再试。`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(resetSeconds),
      },
    }
  );
}
