import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Root middleware — runs on every matched path.
//
// What it does:
//   1. Refreshes the Supabase auth session cookie if it's near expiry.
//   2. Returns the response with updated cookies attached.
//
// We deliberately do NOT gate routes here. Auth-required pages do their
// own redirect via getUser() in the page itself. Putting auth checks in
// middleware would force every static page to be dynamic.
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Skip Next internals + static asset paths. Anything else (including
  // the ClaimLens routes and /api/*) goes through the middleware.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image|robots.txt|sitemap.xml|fonts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
