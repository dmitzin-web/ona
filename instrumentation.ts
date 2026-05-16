// Next.js instrumentation hook. Runs once when the server starts and
// re-routes runtime-specific Sentry init. Without this file the three
// sentry.*.config.ts files are never loaded.
//
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Capture errors thrown during request handling. Without this, Sentry
// only sees errors we explicitly `captureException()` and unhandled
// rejections — server-render exceptions slip through.
export const onRequestError = Sentry.captureRequestError;
