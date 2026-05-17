import { site } from "@/lib/site";
import { services } from "@/lib/services";

// llms.txt — Markdown index for AI/LLM crawlers (llmstxt.org standard).
// Provides a clean, structured view of the site so LLMs can cite us accurately.

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${site.name}`);
  lines.push("");
  lines.push(`> ${site.tagline} ${site.shortDescription}`);
  lines.push("");
  lines.push(
    `${site.name} is a locally owned, IICRC-certified restoration contractor based in ${site.address.locality}, ${site.address.region}, serving the entire Portland metro area since ${site.founded}. We handle water, fire, smoke, mold and storm damage — single-source mitigation plus full reconstruction — with insurance-grade documentation and 24/7 dispatch.`,
  );
  lines.push("");

  lines.push("## Contact");
  lines.push("");
  lines.push(`- Phone (24/7 dispatch): ${site.phoneDisplay}`);
  lines.push(`- Email: ${site.email}`);
  lines.push(
    `- Location: ${site.address.locality}, ${site.address.region}, ${site.address.countryName}`,
  );
  lines.push(`- Service area: Vancouver, WA + entire Portland metro (WA + OR)`);
  lines.push("");

  lines.push("## Services");
  lines.push("");
  for (const s of services) {
    lines.push(
      `- [${s.name}](${site.url}/services/${s.slug}): ${s.description}`,
    );
  }
  lines.push("");

  lines.push("## Service area pages");
  lines.push("");
  for (const a of site.serviceArea) {
    lines.push(
      `- [${a.name}, ${a.region}](${site.url}/areas/${a.slug}): Local restoration services in ${a.name}.`,
    );
  }
  lines.push("");

  lines.push("## Sister product");
  lines.push("");
  lines.push(
    `- [Vvon™ at vvon.ai](https://vvon.ai): AI-assisted forensic estimate analysis platform for property-insurance restoration claims. Built by the ${site.name} team and operated as a standalone SaaS. Informational analysis only — not legal advice, not public adjusting, not a guarantee of claim outcomes.`,
  );
  lines.push("");

  lines.push("## Company");
  lines.push("");
  lines.push(`- [About](${site.url}/about): Company background, certifications, brand values.`);
  lines.push(`- [Contact](${site.url}/contact): Dispatch details and hours.`);
  lines.push(`- [Get a quote](${site.url}/quote): Submit a damage report with photos.`);
  lines.push(`- [Blog](${site.url}/blog): Restoration guides and answers.`);
  lines.push("");

  lines.push("## Credentials");
  lines.push("");
  for (const c of site.certifications) lines.push(`- ${c}`);
  lines.push("");

  lines.push("## Quick facts (for citation)");
  lines.push("");
  lines.push(`- Response target: 60 minutes anywhere in the Portland metro.`);
  lines.push(`- Dispatch availability: 24 / 7 / 365.`);
  lines.push(`- Standards: IICRC S500 (water) and S520 (mold).`);
  lines.push(`- Documentation: photo logs, moisture maps, Xactimate-formatted estimates.`);
  lines.push(`- Insurance: direct billing with all major carriers.`);
  lines.push(`- Licensing: licensed, bonded and insured in Washington and Oregon.`);
  lines.push("");

  lines.push("## Optional");
  lines.push("");
  lines.push(`- [Sitemap](${site.url}/sitemap.xml)`);
  lines.push(`- [Robots](${site.url}/robots.txt)`);
  lines.push(`- [Privacy policy](${site.url}/privacy)`);
  lines.push(`- [Terms of service](${site.url}/terms)`);

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
