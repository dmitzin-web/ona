// For every section in lib/admin/sections.ts: the file on disk must be exactly
// what the admin would write back after validating it (byte-stable saves),
// and should contain no legal-guard findings (an editor can publish past the
// guard after acknowledging it — a FAIL here means: go and read that text).
// npm run check:content
import fs from "node:fs";
const root = process.cwd();
const { SECTIONS } = await import(root + "/lib/admin/sections.ts");
const { validateBySchema, serializeContent } = await import(root + "/lib/admin/schema.ts");
const { legalFindings } = await import(root + "/lib/admin/legal-guard.ts");
let fail = 0;
for (const s of SECTIONS) {
  const text = fs.readFileSync(root + "/" + s.file, "utf8");
  const data = JSON.parse(text);
  let out, errs = [];
  if (s.kind === "single") {
    const v = validateBySchema(s.schema, data);
    if (!v.ok) errs = v.errors; else out = serializeContent(v.value);
  } else {
    const items = data.map((it) => {
      const v = validateBySchema(s.schema, it);
      if (!v.ok) errs.push(...v.errors.map((e) => `${it.slug}: ${e}`));
      return v.ok ? { slug: it.slug, ...v.value } : it;
    });
    out = serializeContent(items);
  }
  const lf = legalFindings(data);
  const same = out === text;
  if (errs.length || !same || lf.length) fail++;
  console.log(`${errs.length || !same || lf.length ? "FAIL" : "PASS"}  ${s.id.padEnd(16)} ${s.file}` +
    (errs.length ? `\n   invalid: ${errs.slice(0, 5).join(" | ")}` : "") +
    (!errs.length && !same ? "\n   file differs from what the admin would save (key order / missing keys / trailing whitespace)" : "") +
    (lf.length ? `\n   legal: ${lf.map((f) => f.excerpt).join(" | ")}` : ""));
}
process.exit(fail ? 1 : 0);
