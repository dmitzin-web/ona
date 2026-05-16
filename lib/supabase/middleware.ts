import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

// Session refresh middleware. Runs on every matched request, calls
// supabase.auth.getUser() so the auth cookie is refreshed if it's close
// to expiring. Without this, sessions silently die between page loads.
//
// This file is imported from /middleware.ts at the project root.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: do not run any code between createServerClient() and
  // getUser() — the Supabase docs flag this exact ordering. Anything else
  // here breaks token refresh in subtle ways.
  await supabase.auth.getUser();

  return response;
}
