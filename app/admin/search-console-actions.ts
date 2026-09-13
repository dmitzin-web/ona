"use server";

import { createSign } from "node:crypto";
import { requireAdmin } from "@/lib/admin/session";
import { site } from "@/lib/site";
import { summarise, type Insights, type Row } from "@/lib/search-console";

// Google Search Console, read-only, through a service account.
//
// Why a service account rather than the editor's own Google sign-in: the
// numbers belong to the business, not to whoever is logged in, and an
// editor who can change the site should not also need permission to read
// the property. The key lives in Vercel and never leaves the server; the
// browser only ever sees the numbers.
//
// Setup (one time, by the owner):
//   1. Search Console → add the property and verify it (the HTML tag goes
//      in SEO → Verification codes).
//   2. Google Cloud → enable the Search Console API, create a service
//      account, download its JSON key.
//   3. Search Console → Settings → Users and permissions → add the service
//      account's e-mail as a Full or Restricted user.
//   4. Vercel → GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY (the whole key, \n and
//      all) and, if the property is a domain property, GSC_PROPERTY
//      (sc-domain:onarestore.com).
//
// Without those the screen says exactly this, and everything else in the
// admin carries on as before.

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://searchconsole.googleapis.com/webmasters/v3/sites";
const DAYS = 28;
// Search Console data lags by two to three days; asking for yesterday
// returns a row of zeros and looks like a fault.
const LAG_DAYS = 3;

export type SearchResult =
  | { ok: true; insights: Insights }
  | { ok: false; message: string; setup?: boolean };

const property = () => process.env.GSC_PROPERTY?.trim() || `${site.url}/`;
const day = (offset: number) => new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);
const b64url = (s: string | Buffer) => Buffer.from(s).toString("base64url");

/** A signed assertion for the service account, exchanged for an access token. */
async function accessToken(email: string, key: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, exp: now + 3600, iat: now }),
  );
  const signature = createSign("RSA-SHA256")
    .update(`${header}.${claim}`)
    // Vercel's environment editor keeps real newlines, a pasted one-liner
    // does not — accept both.
    .sign(key.includes("\\n") ? key.replace(/\\n/g, "\n") : key, "base64url");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${signature}`,
    }),
    cache: "no-store",
  });
  const json = (await res.json()) as { access_token?: string; error_description?: string; error?: string };
  if (!res.ok || !json.access_token) {
    throw new Error(json.error_description || json.error || "Google refused the key.");
  }
  return json.access_token;
}

async function query(token: string, body: Record<string, unknown>): Promise<Row[]> {
  const res = await fetch(`${API}/${encodeURIComponent(property())}/searchAnalytics/query`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ startDate: day(LAG_DAYS + DAYS), endDate: day(LAG_DAYS), type: "web", ...body }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 403) {
      throw new Error(`Google says this account cannot read ${property()}. Add its e-mail as a user in Search Console → Settings → Users and permissions.`);
    }
    if (res.status === 404) {
      throw new Error(`Google has no property called ${property()}. Check GSC_PROPERTY — a domain property is written sc-domain:onarestore.com.`);
    }
    throw new Error(`Google answered ${res.status}. ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { rows?: Row[] };
  return json.rows ?? [];
}

/** The last 28 complete days, by page and by page × search. */
export async function searchInsights(): Promise<SearchResult> {
  await requireAdmin();
  const email = process.env.GSC_CLIENT_EMAIL?.trim();
  const key = process.env.GSC_PRIVATE_KEY?.trim();
  if (!email || !key) {
    return {
      ok: false,
      setup: true,
      message: "Search Console is not connected yet.",
    };
  }
  try {
    const token = await accessToken(email, key);
    const [byPage, byPageQuery] = await Promise.all([
      query(token, { dimensions: ["page"], rowLimit: 1000 }),
      query(token, { dimensions: ["page", "query"], rowLimit: 5000 }),
    ]);
    return {
      ok: true,
      insights: summarise(byPage, byPageQuery, site.url, { from: day(LAG_DAYS + DAYS), to: day(LAG_DAYS) }),
    };
  } catch (err) {
    console.error("[admin] search console failed", err);
    return { ok: false, message: err instanceof Error ? err.message : "Google could not be reached." };
  }
}
