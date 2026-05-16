// Sentry — browser runtime.
//
// Initialized once per page load. No-ops when SENTRY_DSN is unset, which
// is the default in dev. In production we set NEXT_PUBLIC_SENTRY_DSN in
// Vercel and errors start flowing to the Sentry dashboard.

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
    // Sample everything by default — error rate is low (Sentry free tier
    // gives 5K events/mo). If we hit volume problems, drop this.
    tracesSampleRate: 0,
    // Replay is expensive on the bundle. Off until we actually need it.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // We render full-page error boundaries; no need for the dev overlay
    // in production builds.
    debug: false,
  });
}
