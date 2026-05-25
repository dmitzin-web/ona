import { site } from "@/lib/site";
import { services } from "@/lib/services";

// llms-full.txt — verbose Markdown export of all primary content.
// Used by LLMs that prefer a single, dense source over crawling individual pages.

export const dynamic = "force-static";

export function GET() {
  const out: string[] = [];

  out.push(`# ${site.name} — Full Content Export\n`);
  out.push(`> ${site.tagline}\n`);
  out.push(`${site.shortDescription}\n`);
  out.push("");
  out.push(`Phone: ${site.phoneDisplay} · Email: ${site.email}`);
  out.push(`Based in ${site.address.locality}, ${site.address.region}. Service area: Portland metro (WA + OR).`);
  out.push("");

  out.push(`## Quick facts\n`);
  out.push(`- 24/7 emergency dispatch with a 60-minute on-site response target across the Portland metro.`);
  out.push(`- IICRC certifications: WRT (water), ASD (drying), AMRT (mold), FSRT (fire & smoke).`);
  out.push(`- Licensed, bonded and insured in both Washington and Oregon.`);
  out.push(`- Direct insurance billing — documentation in Xactimate format per IICRC S500/S520.`);
  out.push(`- Single contractor for mitigation + reconstruction (no second-handoff).`);
  out.push("");

  out.push(`## Brand values\n`);
  for (const v of site.values)
    out.push(`- **${v.title}** — ${v.body}`);
  out.push("");

  for (const s of services) {
    out.push(`\n---\n`);
    out.push(`## ${s.name}\n`);
    out.push(`URL: ${site.url}/services/${s.slug}\n`);
    out.push(`> ${s.hero}\n`);
    out.push(s.intro);
    out.push("");

    for (const b of s.body) {
      out.push(`### ${b.heading}\n`);
      for (const p of b.paragraphs) {
        out.push(p);
        out.push("");
      }
    }

    out.push(`### Process\n`);
    for (const p of s.process) out.push(`- ${p.step}: ${p.text}`);
    out.push("");

    out.push(`### Warning signs\n`);
    for (const sign of s.signs) out.push(`- ${sign}`);
    out.push("");

    out.push(`### FAQ\n`);
    for (const f of s.faqs) {
      out.push(`**Q: ${f.q}**`);
      out.push(`A: ${f.a}`);
      out.push("");
    }
  }

  out.push(`\n---\n`);
  out.push(`## Service area cities\n`);
  for (const a of site.serviceArea)
    out.push(`- ${a.name}, ${a.region} — ${site.url}/areas/${a.slug}`);

  return new Response(out.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
