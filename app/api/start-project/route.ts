import { NextResponse } from "next/server";

// Thin intake handler for the /start-project form.
//
// Why this is permissive (always 200 on a parseable body):
//   The /start-project flow is intentionally low-friction —
//   homeowners answer 4 quick questions and we always want a 200
//   back so the client doesn't fall through to a panicked mailto.
//
// This route just logs to console for now. Production already has
// a strict /api/lead-or-quote handler with Supabase + rate
// limiting; if we later want /start-project submissions persisted
// the same way, we can wire it through there or add a permissive
// Supabase write here (we'd need to npm-install @supabase/supabase-js
// first — the dep is not currently in the production package.json).
//
// Worst-case fallback (route returns 500 / is unreachable): the
// client component opens a mailto: with the same fields. Either
// path delivers the lead.

// Hard caps so a hostile client can't flood our logs or memory with a
// giant payload. The form only ever sends a handful of short fields.
const MAX_BODY_BYTES = 16 * 1024; // 16 KB is generous for 4 short answers
const MAX_FIELDS = 25;
const MAX_FIELD_LEN = 2_000;

export async function POST(req: Request) {
  // Reject oversized bodies before parsing. We check the declared
  // Content-Length first (cheap), then re-check the actual text length
  // after reading, since Content-Length can be spoofed or absent.
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "payload too large" },
      { status: 413 },
    );
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json({ ok: false, error: "unreadable" }, { status: 400 });
  }
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "payload too large" },
      { status: 413 },
    );
  }

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400 },
    );
  }

  // Build a sanitized, bounded record for logging. We do NOT spread the
  // raw body into the log line — an attacker could otherwise inject
  // newlines / fake log entries or dump huge values. Keys are capped in
  // count, values coerced to truncated strings.
  const safe: Record<string, string> = {};
  let count = 0;
  for (const [key, value] of Object.entries(body)) {
    if (count >= MAX_FIELDS) break;
    count++;
    const k = String(key).slice(0, 80).replace(/[\r\n]+/g, " ");
    const v = (typeof value === "string" ? value : JSON.stringify(value) ?? "")
      .slice(0, MAX_FIELD_LEN)
      .replace(/[\r\n]+/g, " ");
    safe[k] = v;
  }

  console.log("[start-project] submission", {
    receivedAt: new Date().toISOString(),
    fields: safe,
  });

  return NextResponse.json({ ok: true });
}
