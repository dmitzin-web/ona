import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { adminEmails, isAllowedAdmin } from "./allowlist";

export type AdminUser = { email: string; name: string };

// Local development without Google credentials. `NODE_ENV` is inlined at
// build time, so in a production build this is the constant `false` and the
// branch does not exist — it cannot be switched on from Vercel.
function devBypass(): boolean {
  return (
    process.env.NODE_ENV === "development" && process.env.ADMIN_DEV_BYPASS === "1"
  );
}

export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_SECRET &&
      process.env.AUTH_GOOGLE_ID &&
      process.env.AUTH_GOOGLE_SECRET &&
      adminEmails().size > 0,
  );
}

// The gate. Every admin page AND every server action calls this first —
// a layout check alone is not enough, because a server action is a plain
// POST endpoint that can be called without ever rendering the page.
//
// Re-checks the allowlist on every call rather than trusting the session:
// taking an address out of ADMIN_EMAILS locks that person out immediately.
export async function requireAdmin(): Promise<AdminUser> {
  if (devBypass()) return { email: "dev@localhost", name: "Local developer" };
  if (!isAuthConfigured()) redirect("/admin/sign-in?error=Configuration");
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !isAllowedAdmin(email)) redirect("/admin/sign-in");
  return { email, name: session?.user?.name || email.split("@")[0] };
}

// For the sign-in page: who, if anyone, is signed in — without redirecting.
export async function currentAdmin(): Promise<
  { state: "none" } | { state: "allowed"; user: AdminUser } | { state: "refused"; email: string }
> {
  if (devBypass()) return { state: "allowed", user: { email: "dev@localhost", name: "Local developer" } };
  if (!isAuthConfigured()) return { state: "none" };
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { state: "none" };
  if (!isAllowedAdmin(email)) return { state: "refused", email };
  return { state: "allowed", user: { email, name: session?.user?.name || email } };
}
