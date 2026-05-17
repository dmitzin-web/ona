# ONA Restoration — Next.js site

Production-ready marketing site for ONA Restoration (Vancouver, WA / Portland metro).

The Vvon™ AI claim-review SaaS that was originally built in this repo
was spun out in May 2026 and lives in its own repo and domain:
**[github.com/dmitzin-web/vvon](https://github.com/dmitzin-web/vvon)** → **[vvon.ai](https://vvon.ai)**.
Legacy `/vvon/*` and `/claimlens/*` paths on this site 308-redirect to
the corresponding URL on vvon.ai (see `next.config.ts`).

## Stack
- Next.js 15 (App Router, SSG)
- React 19
- Tailwind CSS v4 (PostCSS-only config)
- TypeScript strict
- `@anthropic-ai/sdk` for Ask ONA (the floating assistant) — mock fallback when key missing
- `react-markdown` for the assistant's message rendering

## Run locally
```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
npm start
```

## Edit the brand
All business data lives in **`lib/site.ts`** — phone, email, service area, certifications, ratings, social links. Change one file, the whole site updates.

Service copy lives in **`lib/services.ts`** — one entry per service, drives the service pages + index + programmatic city × service pages.

Local-area profiles (weather pattern, common losses, neighborhoods, drive-time-from-HQ) live in **`lib/areas.ts`** and feed the city pages plus the programmatic city × service landing pages.

## What's here

| Route group | Purpose |
| ----------- | ------- |
| `/`         | Marketing home |
| `/services`, `/services/[slug]` | Service catalog and per-service pages |
| `/services/[slug]/[area]` | **50 programmatic city × service pages** (water-damage-restoration-beaverton-or, etc.) — buy-intent local SEO |
| `/areas`, `/areas/[slug]` | City pages with weather pattern, common losses, neighborhoods |
| `/quote` | Quote form |
| `/about`, `/contact`, `/blog`, `/privacy`, `/terms` | Standard marketing surfaces |
| `/api/assistant` | Ask ONA chat (streamed Claude with prompt caching, mock fallback) |
| `/api/health` | Uptime monitor endpoint |
| `/llms.txt`, `/llms-full.txt` | Markdown indexes for AI/LLM crawlers |

## SEO features built in
- Per-page `<title>`, `<meta description>`, canonical URL, Open Graph and Twitter Card
- Dynamic OG image at `/opengraph-image` (Edge runtime)
- `sitemap.xml` and `robots.txt` generated from data
- JSON-LD: `LocalBusiness` + `ProfessionalService`, `WebSite`, `Service` per service page, `FAQPage`, `BreadcrumbList`
- Programmatic local SEO: 10 city pages and 50 service × city pages auto-generated
- Semantic HTML, single `<h1>` per page, skip link
- Security headers configured in `next.config.ts`

## Deploy
Deployed to Vercel at `https://www.onarestore.com`.

Set `ANTHROPIC_API_KEY` in your deploy environment to switch Ask ONA off mock mode.
