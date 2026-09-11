// Node module hooks so scripts can import the site's TypeScript directly
// (Node 23.6+ strips types itself): resolve the "@/" alias and extensionless
// imports the way Next's bundler does, and import JSON without an attribute.
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();

export async function resolve(spec, ctx, next) {
  if (spec.startsWith("@/")) spec = pathToFileURL(`${ROOT}/${spec.slice(2)}`).href;
  try {
    return await next(spec, ctx);
  } catch (e) {
    if (/^(\.|\/|file:)/.test(spec) && !/\.(ts|tsx|js|mjs|json)$/.test(spec)) {
      for (const ext of [".ts", ".tsx", "/index.ts"]) {
        try {
          return await next(spec + ext, ctx);
        } catch {}
      }
    }
    throw e;
  }
}

export async function load(url, ctx, next) {
  if (url.endsWith(".json")) return next(url, { ...ctx, importAttributes: { ...ctx.importAttributes, type: "json" } });
  return next(url, ctx);
}
