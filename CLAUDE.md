# Ona Restoration — onarestore.com

Marketing site for Ona Restoration & Remodeling LLC (Vancouver, WA / Portland
metro). Next.js 15 App Router, React 19, Tailwind v4, TypeScript strict, SSG.
See README.md for stack and setup; this file is the rules that are easy to
break without knowing them.

## Ship
- `npm run dev` → localhost:3100. `npm run build` must pass before any push.
- Push to `main` deploys to production on Vercel (~1 min). There is no
  staging. After pushing, check the live site, not just the local build.
- `npm run build` overwrites `.next`; a running dev server then fails with
  missing chunks. Stop dev, `rm -rf .next`, restart.
- If a dev page dies with `Cannot read properties of undefined (reading
  'call')`, the browser is holding stale chunks for that port. Use a fresh
  port rather than clearing `.next` again.

## Content admin (/keystatic)
- Blog posts → `content/posts/<slug>.json`; remodeling gallery →
  `content/work/<slug>.json` + `public/photos/projects/<slug>/image.*`.
  `lib/posts.ts` and `lib/work.ts` read them at build time. The `Post` type
  and the `posts` / `findPost` exports are the contract — pages depend on
  them, not on the files.
- Editing those files by hand is fine; keep Keystatic's format (2-space
  JSON, raw UTF-8, empty dates omitted rather than null) so the next admin
  save doesn't produce a noisy diff.
- Dev uses local storage (no login). Production uses GitHub mode: editors
  sign in with GitHub and need write access to the repo; each save is a
  commit to `main`, which deploys.
- The API route (`app/api/keystatic/…`) is guarded: without its credentials
  it returns 503 instead of throwing. Keystatic throws at import time when
  GitHub credentials are missing, which used to fail the whole build.
  Keep the guard.
- **Deliberately not in the admin:** `lib/site.ts`, `lib/services.ts`,
  `lib/areas.ts`, and anything else carrying a legal claim (see below).

### Connecting the admin to GitHub (one time)
1. `KEYSTATIC_STORAGE=github npm run dev`, open localhost:3100/keystatic,
   follow "Create GitHub App" (owner account: `dmitzin-web`, repo `ona`).
2. The wizard writes four variables to `.env` (gitignored):
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
   `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
3. Add all four in Vercel → Project → Settings → Environment Variables
   (Production), then redeploy. Add each editor as a repo collaborator.
4. Editors who shouldn't need GitHub accounts: switch production storage to
   Keystatic Cloud in `keystatic.config.ts` (free up to 3 users).

## Legal — do not edit these away
Washington contractor rules and FTC substantiation. Each has bitten before.
- **Oregon:** the CCB registration is PENDING. Nothing may say we are
  licensed, registered or bonded in Oregon until the number is issued.
- **"Bonded and insured"** may not be advertised (RCW 18.27.100(4)). Use the
  WA registration number instead — it is required in advertising anyway
  (RCW 18.27.100(3)): `ONARER*748K8`, verifiable at secure.lni.wa.gov/verify.
- **Deductibles:** never offer to absorb or waive one (RCW 48.30.230).
  "You pay your deductible, nothing more" is the approved line.
- **No unsubstantiated claims:** no response-time promises we can't keep
  (e.g. Spokane is ~350 miles away), no invented review counts, project
  counts, client names, casualty or structure figures.
- **Photos:** only our own completed work — never stock, never another
  contractor's. Captions describe only what is visible in the frame: no
  materials, brands, sizes, timelines, budgets, places or clients.
- The header of `components/services/SpokaneFireDeployment.tsx` lists the
  constraints for that page. Read it before touching the page.

## Design system
- Token names are inverted from the old dark site; read by role:
  `ivory` = ink (#172124), `charcoal` = ground (#fff),
  `charcoal-soft` = mist section band, `gold` = the teal accent. Renaming
  them would touch ~1100 classes for no gain — don't.
- Coral (`coral`) is for the Call action only. Teal is for links, UI and
  status. Deep teal (`brand`) is a full-bleed surface, one or two per page.
  No opacity masks on ink (`text-ivory/85` etc.) — use `warm-gray`.
- Radius `rounded-[2px]`. Satoshi for everything; mono (`.eyebrow`) only
  for small labels, dates, credentials.
- Logo (`components/Logo.tsx`): the wordmark is **ONA in capitals with a
  chevron as the letter A** — per the brand book. It only works in caps.
  Running copy, titles and metadata say "Ona Restoration" (pronounced
  OH-nuh). Geometry is derived from type size; don't hand-tune numbers.
- `--chrome-h` in `globals.css` is the sticky strip + header height, used by
  the mobile drawer. If anything in the header changes size, measure it in
  the browser at 375px and 900px and update it. Never estimate it.
- CSP is strict (`next.config.ts`). New third-party hosts need adding there;
  the admin has its own, looser policy scoped to `/keystatic`.
