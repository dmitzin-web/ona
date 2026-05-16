"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

// Browser-side Supabase client. Uses the publishable / anon key, which
// Supabase explicitly says is safe to ship to clients (RLS protects data).
//
// One instance per browser context — calling createBrowserClient repeatedly
// in the same browser is fine; @supabase/ssr returns a cached instance.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
