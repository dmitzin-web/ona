import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Service-role Supabase client. **Bypasses RLS** — use only in server
// code that performs privileged operations on the user's behalf (file
// inserts after auth check, cleanup jobs, etc.). Never expose this to
// the client.
//
// We do not cache the instance because that would close over a single
// fetch / event loop — Next.js route handlers spin up many of these per
// minute and reuse is fine, but per-request creation is also free.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — Supabase admin client cannot be created.",
    );
  }
  return createSupabaseJsClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
