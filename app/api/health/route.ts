// Liveness check for uptime monitors (Better Uptime, UptimeRobot, etc.).
// Returns 200 with a short JSON body when the Next.js server is up and
// can resolve env vars. We do NOT hit Supabase or Anthropic here —
// that would charge an API call and tie our health signal to two
// third-party services. A separate `/api/health/deep` could do that
// if we ever need it.

export const runtime = "nodejs";
// Edge-cache safe: this endpoint is hit every ~30s by monitors, no need
// to log every invocation, but also don't let a stale body get cached.
export const dynamic = "force-dynamic";

// Public liveness only. We intentionally do NOT expose whether the AI
// key or Supabase are configured — that's reconnaissance an attacker can
// use to fingerprint the backend. Deploy-time misconfig checks should
// read server logs or an authenticated internal endpoint instead.
export function GET() {
  return Response.json(
    {
      ok: true,
      service: "onarestore",
      time: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
