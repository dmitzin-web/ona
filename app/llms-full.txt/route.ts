import { site } from "@/lib/site";
import { services } from "@/lib/services";
import {
  analysisCategories,
  claimLens,
  faqs as claimLensFaqs,
  features as claimLensFeatures,
  howItWorks,
} from "@/lib/claimlens/config";

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

  // ----- ClaimLens™ product section -----
  out.push(`\n---\n`);
  out.push(`## ${claimLens.name}${claimLens.symbol} — AI claim review product\n`);
  out.push(`URL: ${site.url}/claimlens\n`);
  out.push(`> ${claimLens.tagline}\n`);
  out.push(`${claimLens.shortDescription}\n`);
  out.push("");
  out.push(`### Important — what ${claimLens.name}${claimLens.symbol} is NOT\n`);
  out.push(claimLens.disclaimer);
  out.push("");
  out.push(
    `${claimLens.name}${claimLens.symbol} is not a public adjuster, not an attorney, not a substitute for licensed professionals. It does not interpret policy language as applied to a specific case, does not negotiate with insurers on the user's behalf, and does not guarantee any claim outcome.`,
  );
  out.push("");

  out.push(`### How it works\n`);
  for (const step of howItWorks) out.push(`- **${step.n} — ${step.title}**: ${step.body}`);
  out.push("");

  out.push(`### Features\n`);
  for (const f of claimLensFeatures) out.push(`- **${f.title}**: ${f.body}`);
  out.push("");

  out.push(`### Analysis categories\n`);
  for (const cat of analysisCategories) {
    out.push(`- **${cat.title}** — ${cat.blurb} Includes: ${cat.items.join(", ")}.`);
  }
  out.push("");

  out.push(`### Sub-processors\n`);
  out.push(`- Supabase Inc. — authentication, Postgres database, private file storage (region: AWS us-west-2 / Oregon).`);
  out.push(`- Anthropic PBC — AI document analysis via the Claude API. Per Anthropic's commercial API policies, inputs and outputs are not used to train Anthropic's models.`);
  out.push(`- Vercel Inc. — application hosting.`);
  out.push("");

  out.push(`### Data handling\n`);
  out.push(`- All transit is TLS. Data at rest is encrypted by the storage provider.`);
  out.push(`- Documents are stored in a private object-storage bucket with per-user folder policies — files are not accessible to other users.`);
  out.push(`- Users can delete their account and all associated documents by emailing ${site.email}.`);
  out.push(`- The product does not require Social Security numbers, account numbers, or other sensitive identifiers; users are asked to redact these before upload.`);
  out.push("");

  out.push(`### Rate limits\n`);
  out.push(`- 10 analyses per 24-hour period per user. Counts all attempts including drafts/errors.`);
  out.push("");

  out.push(`### FAQ\n`);
  for (const f of claimLensFaqs) {
    out.push(`**Q: ${f.q}**`);
    out.push(`A: ${f.a}`);
    out.push("");
  }

  return new Response(out.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
