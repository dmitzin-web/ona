#!/usr/bin/env node
// Migration runner for the ClaimLens™ Supabase schema.
//
// Reads every .sql file in supabase/migrations/, executes each one
// against the project's Postgres database in a single transaction, and
// reports success/failure. Idempotent — the SQL itself uses
// IF NOT EXISTS / DROP POLICY IF EXISTS / etc., so re-running is safe.
//
// Run with:
//   node scripts/migrate.mjs
//
// Requires SUPABASE_DB_URL in .env.local. Get it from Supabase dashboard:
//   Project Settings → Database → "Connection string" → URI tab → copy
//   the "Transaction" or "Session" pooler URL and replace [YOUR-PASSWORD]
//   with the database password you set when creating the project.

import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const migrationsDir = join(repoRoot, "supabase", "migrations");

// Minimal .env.local loader — we don't want to add `dotenv` as a runtime
// dep just for one script. Reads KEY=VALUE lines, skips comments and
// blanks. Does not handle quoted values with embedded equals signs.
async function loadEnvLocal() {
  try {
    const raw = await readFile(join(repoRoot, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    console.warn("[migrate] .env.local not found — relying on shell env");
  }
}

async function main() {
  await loadEnvLocal();

  const url = process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error(
      "\n[migrate] SUPABASE_DB_URL is not set.\n" +
        "Add it to .env.local. Get the value from Supabase dashboard:\n" +
        "  Project Settings → Database → Connection string → URI\n" +
        "Copy the URL and replace [YOUR-PASSWORD] with the database\n" +
        "password you set when you created the Supabase project.\n",
    );
    process.exit(1);
  }

  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort();
  if (files.length === 0) {
    console.warn("[migrate] No .sql files in supabase/migrations/");
    process.exit(0);
  }

  // SSL: Supabase requires TLS. We turn off CN verification because the
  // pooler hostname differs from the cert CN in some regions. Plain TLS
  // (encryption) is still on.
  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log(`[migrate] connected to ${redactUrl(url)}`);

  for (const file of files) {
    const sql = await readFile(join(migrationsDir, file), "utf8");
    console.log(`[migrate] running ${file} (${sql.length} bytes)`);
    try {
      // The migration files use idempotent DDL, so wrapping in a single
      // transaction is safe — if anything fails, nothing applies.
      await client.query("begin");
      await client.query(sql);
      await client.query("commit");
      console.log(`[migrate] ✅ ${file} applied`);
    } catch (err) {
      await client.query("rollback").catch(() => {});
      console.error(`[migrate] ❌ ${file} failed:\n${err.message}`);
      await client.end();
      process.exit(1);
    }
  }

  await client.end();
  console.log("[migrate] all migrations applied");
}

function redactUrl(url) {
  try {
    const u = new URL(url);
    if (u.password) u.password = "•••";
    return u.toString();
  } catch {
    return "<unparseable URL>";
  }
}

main().catch((err) => {
  console.error("[migrate] unexpected error:", err);
  process.exit(1);
});
