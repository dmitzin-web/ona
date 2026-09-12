// The admin's SEO screen works out every page's title and description from
// the content alone (lib/seo-pages.ts) — it cannot load 91 pages to look.
// This checks that what it works out is what the site actually ships: it
// reads the HTML `next build` wrote for every route and compares.
//
// Run it after touching lib/seo-pages.ts or any page's generateMetadata:
//   npm run build && npm run check:seo
// With a dev server running instead of a build, point it at that:
//   npm run check:seo -- http://localhost:3100
import fs from "node:fs";

const root = process.cwd();
const base = process.argv[2]?.replace(/\/$/, "") ?? null;
const { sitePages } = await import(root + "/lib/seo-pages.ts");
const { SECTIONS } = await import(root + "/lib/admin/sections.ts");
const { posts } = await import(root + "/lib/posts.ts");
const { site } = await import(root + "/lib/site.ts");

const OUT = root + "/.next/server/app";
if (!base && !fs.existsSync(OUT)) {
  console.log("No build output. Run `npm run build` first, or pass the address of a running server.");
  process.exit(1);
}

const values = Object.fromEntries(
  SECTIONS.map((s) => [s.id, JSON.parse(fs.readFileSync(root + "/" + s.file, "utf8"))]),
);
const pages = sitePages(values, {
  siteName: site.name,
  siteUrl: site.url,
  posts: posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    words: JSON.stringify(p.sections).split(/\s+/).length,
  })),
});

// Next writes each prerendered route as <route>.html ("/" is index.html); a
// running server is asked for it instead.
const htmlFor = async (path) => {
  if (base) {
    const res = await fetch(base + path);
    return res.ok ? await res.text() : null;
  }
  const file = path === "/" ? "/index" : path.replace(/\/$/, "");
  for (const candidate of [`${OUT}${file}.html`, `${OUT}${file}/index.html`]) {
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate, "utf8");
  }
  return null;
};

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));

const titleOf = (html) => {
  const m = /<title>([\s\S]*?)<\/title>/i.exec(html);
  return m ? decode(m[1]).trim() : "";
};
const descriptionOf = (html) => {
  const m = /<meta name="description" content="([\s\S]*?)"\/?>/i.exec(html);
  return m ? decode(m[1]).trim() : "";
};
const headingOf = (html) => {
  const m = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  return m ? decode(m[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").replace(/\s+\./g, ".").trim() : "";
};

let fail = 0;
let missing = 0;
for (const p of pages) {
  const html = await htmlFor(p.path);
  if (!html) {
    // Blog posts and other routes rendered on demand have no prerendered
    // file; nothing to compare against, so say so rather than passing.
    missing++;
    continue;
  }
  const real = { title: titleOf(html), description: descriptionOf(html), heading: headingOf(html) };
  const wrong = [];
  if (real.title !== p.title) wrong.push(`title\n    site : ${real.title}\n    admin: ${p.title}`);
  if (real.description !== p.description) wrong.push(`description\n    site : ${real.description}\n    admin: ${p.description}`);
  // The heading is read for context only, and the site splits it across
  // elements — compare loosely, and only report a real divergence.
  const loose = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  if (real.heading && loose(real.heading) !== loose(p.heading)) {
    wrong.push(`heading\n    site : ${real.heading}\n    admin: ${p.heading}`);
  }
  if (wrong.length) {
    fail++;
    console.log(`FAIL  ${p.path}\n  ${wrong.join("\n  ")}`);
  }
}

console.log(
  `\n${pages.length - missing} of ${pages.length} pages compared against the built HTML; ${fail} disagree` +
    (missing ? `, ${missing} not prerendered` : "") +
    ".",
);
process.exit(fail ? 1 : 0);
