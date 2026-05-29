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

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400 },
    );
  }

  console.log("[start-project] submission", {
    receivedAt: new Date().toISOString(),
    ...body,
  });

  return NextResponse.json({ ok: true });
}
