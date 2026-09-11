// Who may use the content admin.
//
// ADMIN_EMAILS is a comma-separated list of Google account addresses, set
// in Vercel — never in code: this repository is public, and the list is
// also the list of people worth phishing.
//
// FAILS CLOSED. Unset or empty means nobody gets in. Matching is exact
// after trimming and lowercasing; no Gmail dot/plus folding, because
// "close enough" is not a property an allowlist should have.

export function adminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(/[,\s]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAllowedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().has(email.trim().toLowerCase());
}
