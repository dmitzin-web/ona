import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Sign-out endpoint. POST is preferred for state-changing actions but we
// also accept GET so a plain <a href="/auth/signout"> works (handy for
// the header sign-out link).
async function handler(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url));
}

export const GET = handler;
export const POST = handler;
