// Sink for Content-Security-Policy violation reports (see the `report-uri` /
// `report-to` directives in next.config.ts). Purely observational — the CSP is
// still enforced by the browser; this endpoint just records what tripped it so
// real anomalies (an unexpected external script/resource, a misbehaving third
// party, or an injection attempt) surface in the server logs.
//
// Two wire formats arrive here depending on the browser:
//   * legacy report-uri:  Content-Type: application/csp-report
//       { "csp-report": { "document-uri", "violated-directive", "blocked-uri", ... } }
//   * modern report-to:   Content-Type: application/reports+json
//       [ { "type": "csp-violation", "body": { "documentURL", "effectiveDirective", "blockedURL", ... } } ]

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CSP reports are tiny; cap hard so a hostile client can't flood logs/memory.
const MAX_BODY_BYTES = 16 * 1024; // 16 KB
const MAX_REPORTS = 10;

// Coerce to a short, single-line, bounded string — defends against log
// injection (newlines / fake entries) and oversized values.
function clean(value: unknown): string {
  if (value == null) return "";
  return String(value).slice(0, 300).replace(/[\r\n]+/g, " ");
}

// Pull the interesting fields out of either wire format.
function summarize(report: unknown): Record<string, string> | null {
  if (typeof report !== "object" || report === null) return null;
  const r = report as Record<string, unknown>;

  // Modern Reporting API entry: { type, body: {...} }
  if (r.type && typeof r.body === "object" && r.body !== null) {
    const b = r.body as Record<string, unknown>;
    return {
      directive: clean(b.effectiveDirective ?? b.violatedDirective),
      blocked: clean(b.blockedURL ?? b.blockedURI),
      document: clean(b.documentURL ?? b.documentURI),
    };
  }

  // Legacy report-uri entry: { "csp-report": {...} }
  const legacy = r["csp-report"];
  if (typeof legacy === "object" && legacy !== null) {
    const b = legacy as Record<string, unknown>;
    return {
      directive: clean(b["effective-directive"] ?? b["violated-directive"]),
      blocked: clean(b["blocked-uri"]),
      document: clean(b["document-uri"]),
    };
  }
  return null;
}

export async function POST(req: Request) {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return new Response(null, { status: 400 });
  }
  if (raw.length > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }

  // Both formats normalize to an array of report entries.
  const entries = Array.isArray(parsed) ? parsed : [parsed];
  const summaries = entries
    .slice(0, MAX_REPORTS)
    .map(summarize)
    .filter((s): s is Record<string, string> => s !== null);

  if (summaries.length > 0) {
    console.warn("[csp-report]", {
      ip: clean(req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip")),
      reports: summaries,
    });
  }

  // 204: nothing to return; the browser doesn't read the body.
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
