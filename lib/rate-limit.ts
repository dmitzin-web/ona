import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Sliding-window IP rate limiting for public, unauthenticated API routes.
//
// Why: /api/assistant calls a paid Claude model on every POST with no auth.
// Without a throttle, a script can run up the Anthropic bill or exhaust
// serverless concurrency (a financial / availability DoS). This caps how
// fast any single IP can hit the model.
//
// Fail-open by design: when the Upstash env vars are unset (local dev, or a
// preview deploy without the integration), the limiter is disabled and
// requests pass through — the same philosophy as the ANTHROPIC_API_KEY mock
// in /api/assistant, so the UI stays exercisable without external infra.
// In production we log a loud warning so a missing binding is noticed.
//
// Setup (Vercel → Upstash integration, or manual):
//   UPSTASH_REDIS_REST_URL   = https://<db>.upstash.io
//   UPSTASH_REDIS_REST_TOKEN = <rest token>

// `undefined` = not yet resolved; `null` = resolved-but-disabled. The tri-state
// lets us build the limiter exactly once per server instance (lazy singleton).
let limiter: Ratelimit | null | undefined;

function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN unset — /api/assistant is UNTHROTTLED in production. Wire the Upstash integration to enable per-IP limits.",
      );
    }
    limiter = null;
    return null;
  }

  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    // 15 requests / minute / IP. Generous for a human chatting with the
    // assistant, hostile to a script hammering the model. Sliding window
    // smooths out bursts at the minute boundary.
    limiter: Ratelimit.slidingWindow(15, "60 s"),
    prefix: "rl:assistant",
    // Skip the extra analytics round-trip — we only need the verdict.
    analytics: false,
  });
  return limiter;
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  /** Epoch ms at which the window resets (for Retry-After / X-RateLimit-Reset). */
  reset: number;
};

// Returns the limit verdict, or null when rate limiting is disabled
// (env unset) — callers treat null as "allow".
export async function checkRateLimit(
  identifier: string,
): Promise<RateLimitResult | null> {
  const l = getLimiter();
  if (!l) return null;
  const { success, limit, remaining, reset } = await l.limit(identifier);
  return { success, limit, remaining, reset };
}

// Best-effort client IP from proxy headers. On Vercel, x-forwarded-for is set
// by the edge and its first hop is the real client. Falls back to x-real-ip,
// then a constant so a missing header buckets all such requests together
// rather than bypassing the limit per-request.
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
