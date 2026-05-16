# ONA Restoration — Next.js site

Production-ready marketing site for ONA Restoration (Vancouver, WA / Portland metro).

## Stack
- Next.js 15 (App Router, SSG)
- React 19
- Tailwind CSS v4 (PostCSS-only config)
- TypeScript strict

## Run locally
```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
npm start
```

> If you run `npm run build` while `npm run dev` is also running, both processes write to `.next/` and the dev server will start throwing `Cannot read properties of undefined (reading 'call')` from missing webpack chunks. Stop the dev server first (or build into a separate directory: `next build --distDir .next-prod`). To recover: stop dev, `rm -rf .next`, restart dev.

## Edit the brand
All business data lives in **`lib/site.ts`** — phone, email, service area, certifications, ratings, social links. Change one file, the whole site updates (header, footer, contact page, JSON-LD schema, all metadata).

Service copy lives in **`lib/services.ts`** — one entry per service, drives 4 service pages + index.

## SEO features built in
- Per-page `<title>`, `<meta description>`, canonical URL, Open Graph and Twitter Card
- Dynamic OG image at `/opengraph-image` (Edge runtime)
- `sitemap.xml` and `robots.txt` generated from data
- JSON-LD: `LocalBusiness` + `ProfessionalService`, `WebSite`, `Service` per service page, `FAQPage`, `BreadcrumbList`
- Programmatic local SEO: 10 city pages auto-generated from `site.serviceArea`
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, single `<h1>` per page, skip link
- Security headers configured in `next.config.ts`

## ClaimLens™ — AI claim review product

ClaimLens™ is a new AI-assisted product surface that lets a homeowner or contractor upload property-insurance claim documents and receive a structured report on possible missing scope, inconsistencies, and documentation gaps. **Informational only — never legal advice, public adjusting, or a guarantee of payment.**

Routes:
- `/claimlens` — landing page (hero, problem, how-it-works, features, categories, FAQ, CTA, JSON-LD)
- `/claimlens/upload` — upload form (drag-and-drop, per-file category, claim context, consent checkbox)
- `/claimlens/report` — report renderer; shows the sample report by default and an analysis result if one is in `sessionStorage`
- `POST /api/claimlens/analyze` — analyses the uploaded claim context and returns a typed `ClaimReport`. Uses Claude via `@anthropic-ai/sdk` with `cache_control: ephemeral` on the system prompt, identical pattern to `/api/triage`. Falls back to a deterministic mock when `ANTHROPIC_API_KEY` is missing.

Tweak product copy in **`lib/claimlens/config.ts`** (taxonomies, FAQs, hero, disclaimer string, severity scale, types). Tweak the AI behaviour in **`lib/claimlens/prompts.ts`**.

### Operations

- **Health check**: `GET /api/health` returns 200 with `{ ok, ai, supabase }`. Point Better Uptime / UptimeRobot at it.
- **Error tracking (optional)**: `@sentry/nextjs` is installed and wired into the heavier API paths (`/api/claimlens/analyze`, `/api/account/delete`). Set `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` in your environment to start receiving events. Without the DSN the SDK initialises to no-op and falls back to `console.error` + Vercel logs.
- **Per-claim deletion**: every report has a "Delete this claim" button. The `/account` page lists all claims with an inline Delete action. Cascades through `claim_files` and `claim_reports` via FK, then removes the matching storage prefix.
- **Account deletion**: `/account` has a danger-zone section that wipes auth user, all owned rows (FK cascade), and the user's storage folder.

### What's mock vs. production-ready (ClaimLens™)
- ✅ Landing page, upload UI, report UI, sitemap, navigation, JSON-LD, disclaimer copy, severity/confidence taxonomies, API route shape.
- ✅ Anthropic SDK integration (uses `claude-opus-4-7`, prompt caching, strict JSON parsing with validator).
- ⚠️ **No persistent storage.** Reports are passed from upload → report via `sessionStorage`. There is no DB or file store yet. For production, wire `lib/claimlens/config.ts` types (`ClaimReport`, `ClaimSnapshot`, etc.) into the schema your team prefers (Supabase / Postgres / Firebase). The data-model the brief calls for (`users`, `claims`, `claim_files`, `claim_reports`) maps cleanly onto those types.
- ⚠️ **No file parsing.** The upload form ships file metadata (name, size, mime, category) but not file bytes. PDF text extraction and OCR for scanned PDFs / images are stub work — the AI is instructed in `lib/claimlens/prompts.ts` to hedge accordingly and label findings `needs-verification` when evidence isn't available. To upgrade: add a server-side parser pipeline (e.g. `pdf-parse` or PDFium for text PDFs, `tesseract.js` or a hosted OCR for scans), pass extracted text + image base64 into the model with `cache_control` on the file blocks.
- ⚠️ **No virus scanning, no signed URLs.** When you add persistence, store files in private object storage and serve via signed URLs. Add a virus scan (`clamav` / hosted equivalent) before showing files back to other users.
- ⚠️ **ESX (Xactimate export) parsing** is listed as "coming soon" in the upload UI. A dedicated parser is the natural follow-up to unlock high-precision quantity/line-item analysis.

## Deploy
Anywhere that runs Next.js 15. Vercel is the easiest path.

Set `site.url` in `lib/site.ts` to your production origin before launch. Set `ANTHROPIC_API_KEY` in your deploy environment to switch the AI routes off mock mode.
