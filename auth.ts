import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAllowedAdmin } from "@/lib/admin/allowlist";

// Sign-in for the content admin: Google only, and only the addresses in
// ADMIN_EMAILS (lib/admin/allowlist.ts). Anyone else who completes Google's
// screen is turned away here and lands back on /admin/sign-in with
// ?error=AccessDenied — no session is ever issued to them.
//
// Env (Vercel): AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET,
// ADMIN_EMAILS. Setup steps are in CLAUDE.md.
//
// The allowlist is checked AGAIN on every admin request and every save
// (lib/admin/session.ts), so removing an address locks that person out on
// their next click rather than when their session expires.

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      // Always show the account chooser: an editor signed into a personal
      // Google account should be able to pick the right one, not be
      // silently signed in as the wrong one and refused.
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  pages: { signIn: "/admin/sign-in", error: "/admin/sign-in" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  // Vercel terminates TLS in front of the function; the host header is
  // Vercel's, not the client's.
  trustHost: true,
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      // An unverified address on a Google account is just a string the
      // account holder typed — it proves nothing about owning it.
      if (!profile?.email_verified) return false;
      return isAllowedAdmin(profile.email);
    },
  },
});
