// Sentry — Node.js runtime (route handlers, server components, server
// actions). Captures unhandled errors and any Sentry.captureException()
// calls inside our API routes.

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
