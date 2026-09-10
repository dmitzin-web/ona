import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

// Admin backend: in development it reads and writes content/ on disk; in
// production it handles GitHub sign-in and proxies the editor's commits.
//
// GUARDED. In GitHub mode `makeRouteHandler` throws at import time when its
// credentials are missing — and Next imports every route while collecting
// page data, so a missing admin key failed the ENTIRE production build.
// The public site's ability to deploy must never depend on the admin being
// set up. Until the four KEYSTATIC_* variables exist in Vercel (see
// CLAUDE.md), the admin answers 503 with instructions and the site builds.
//
// Adding the variables in Vercel needs a redeploy to take effect — env vars
// are read when the function is built, like everywhere else on Vercel.

export const dynamic = "force-dynamic";

const configured =
  process.env.NODE_ENV === "development" ||
  Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
      process.env.KEYSTATIC_SECRET,
  );

function notConfigured() {
  return new Response(
    "The content admin is not connected to GitHub yet. Set KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET and NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG in Vercel, then redeploy.",
    { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}

export const { GET, POST } = configured
  ? makeRouteHandler({ config })
  : { GET: notConfigured, POST: notConfigured };
