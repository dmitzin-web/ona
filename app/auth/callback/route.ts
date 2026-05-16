import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Magic-link callback. Supabase redirects the user here after they click
// the link in their email. The URL carries a `code` param that we trade
// for a session cookie, then we forward the user to `next` (or to a
// sensible default).
//
// Mounted at /auth/callback because that's the URL we register in
// Supabase's "Redirect URLs" allow-list.
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/claimlens/upload";

  // Never let an open redirector through. `next` must be a same-origin path.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/claimlens/upload";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing-code", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[/auth/callback] exchange error", error.message);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
