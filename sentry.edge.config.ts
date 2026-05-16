// Sentry — Edge runtime (middleware, OpenGraph images, edge route
// handlers). Smaller surface than Node — no `fs`, no `process`.

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? "development",
    tracesSampleRate: 0,
    debug: false,
  });
}
