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

## Content admin (/admin)
- **/admin is the visual editor**; the schema-driven forms live at
  `/admin/content` and are the fallback. The editor loads the real site in
  an iframe and ties each piece of text on the page back to the field it
  came from by MATCHING the rendered text against the content this
  deployment was built with (`lib/admin/deployed.ts`), so the site's own
  code knows nothing about the editor and the built HTML is untouched —
  no markers, no stega characters. Template strings ({area}, {service})
  are matched as regex patterns and keep their placeholders when edited.
  See `components/admin/visual/binder.ts`; the editor's own docs are the
  comments there and in `VisualEditor.tsx`.
- Rules that keep the matching working: **every piece of copy must render
  from a content field as its own JSX expression** (React gives each one
  its own text node). Don't concatenate a field with literal text in one
  expression (`{`${t.a}.`}`), don't `.toUpperCase()` in JS (use CSS), and
  keep JSON free of HTML. Anything the page computes (numbers, dates) is
  not editable and should not pretend to be.
- The frame needs `frame-ancestors 'self'` and `X-Frame-Options:
  SAMEORIGIN` (next.config.ts). Both are same-origin only.
- Publishing is one commit for all changed files, then the editor follows
  the Vercel commit status until the new version is live. `store.commit()`
  returns the commit SHA for that; `store.history/commitFiles/deployStatus`
  back the history panel and its "undo this change" (a path-level revert
  applied on top of whatever was published after it — `lib/admin/json-path.ts`).
- **Photos** are fields of kind `image`: the value is a path under
  `/photos`. The picker lists every image in `public/photos` (via
  `store.listMedia`) and can add one: the browser resizes it to 2400px and
  re-encodes it to WebP — which also drops the camera's EXIF, GPS
  included — then `uploadPhoto` commits it to `public/photos/library/`.
  An uploaded photo is only on the site after the next deploy, so the
  editor previews the local copy until then.
- **Appearance** (`content/theme.json`, `lib/theme.ts`): the eight colour
  roles and the corner radius. globals.css defines each themed token as
  `var(--ona-<role>, <designed value>)`, so a role left alone emits NO
  override (pages stay byte-identical) and a changed one also carries its
  tints, because Tailwind compiles `bg-teal/10` to a color-mix over the
  variable rather than a baked literal. Never replace those `var(--ona-…)`
  fallbacks with plain hex values. Chromium keeps the old colour on
  elements with a CSS transition when a variable changes, so the editor
  disables transitions for one frame after writing the theme.
- **"Say what to change"** (`app/admin/ai-actions.ts`): the editor's
  sentence plus the fields of the page they are on go to Claude, which
  returns field edits; they land in the draft (preview updates, undo
  works) and still go through validation and the legal guard on publish.
  Needs `ANTHROPIC_API_KEY`; without it the bar says so and changes
  nothing.
- Admin UI language: English or Russian (`components/admin/visual/i18n.tsx`);
  field labels are translated by English source string in
  `lib/admin/i18n/fields-ru.ts`. Add a label → add its translation.
- Blog posts → `content/posts/<slug>.json`; remodeling gallery →
  `content/work/<slug>.json` + `public/photos/projects/<slug>/image.*`.
  `lib/posts.ts` and `lib/work.ts` read them at build time. The file format
  lives in `lib/content-format.ts` and nowhere else — the build and the
  admin both use it. Keep it byte-stable (2-space JSON, raw UTF-8, empty
  dates omitted) so admin saves produce minimal diffs.
- **Sign-in:** Google only (Auth.js, `auth.ts`), and only the addresses in
  `ADMIN_EMAILS`. Fails closed: empty list = nobody. The allowlist is
  re-checked on every request, so removing an address locks that person
  out on their next click.
- **Every server action calls `requireAdmin()` first.** Actions are plain
  POST endpoints; the layout's check does not protect them. Keep it that
  way for any new action.
- **Writes:** in production the server commits to `main` through the
  GitHub API with one token (`GITHUB_CONTENT_TOKEN`); editors never need
  GitHub. Each save is one atomic commit (JSON + image together), which
  deploys. Saves carry the file's SHA from when the form opened and are
  refused if it changed since — never remove that check. Read GitHub by
  commit SHA, never by branch name: its API caches branch-keyed responses
  for 60 s (see `lib/admin/store.ts`).
- **File tracing — this has already failed a deploy.** Any `fs` call whose
  path is `process.cwd()` + something the tracer can't read statically
  (a variable, an imported constant) makes it pack the WHOLE project —
  `.git`, `node_modules` — into every function that imports it. The admin
  function hit 383 MB against Vercel's 250 MB limit. Rules: `fs` paths are
  `process.cwd()` + a string literal (`lib/posts.ts`, `lib/work.ts`); the
  local store lives in `lib/admin/store-local.ts` and is only ever reached
  through the dev-only dynamic import in `getStore()` — never import it
  statically. After touching any of this, build and check that no
  `.next/server/**/*.nft.json` lists `.git/HEAD`.
- **Local:** `npm run dev` edits the files on disk. `ADMIN_DEV_BYPASS=1`
  skips Google sign-in in development only — it is compiled out of
  production builds. `ADMIN_STORAGE=github` + `ADMIN_CONTENT_BRANCH=<test
  branch>` exercises the GitHub path without touching `main`.
- **Site content sections** (company details, services, cities, privacy &
  terms, reviews, and all page copy — see below) are described once in
  `lib/admin/sections.ts`; the form (`SchemaForm`) and the server
  validation (`validateBySchema`) both come from that description. Each lives in one JSON file under `content/`,
  imported statically by `lib/site.ts`, `lib/services.ts`, `lib/areas.ts`,
  `lib/legal.ts`, `lib/reviews.ts` — whose exports did not change. Static
  imports because `lib/site.ts` is used by client components. Adding a
  field = add it to the schema and the JSON, then read it in the lib module.
- **Legal guard** (`lib/admin/legal-guard.ts`) runs on every admin save and
  stops text that breaks the legal rules below until the editor explicitly
  acknowledges it; acknowledged saves say so in the commit message. It
  must report zero findings on existing copy — keep it that way when
  changing rules or copy.
- Privacy/terms text uses `{phone}`, `{email}`, `{legalName}` …
  placeholders filled from company details (`lib/placeholders.ts`).
- **All page copy is in the admin.** Every page, page template, the header,
  footer and shared blocks read their text from `content/pages/*.json` /
  `content/chrome.json`; each has a schema in `lib/admin/pages/<id>.ts`
  registered in `SECTIONS`. Pages: `const t = fillPlaceholdersDeep(json)`;
  templates (service, city, city × service, gallery project, post) use
  `fillVarsDeep(json, { service, area, … })` — the placeholders each one
  accepts are listed in its section description. **Changing copy = edit the
  JSON (or use the admin), never re-hardcode it in JSX**, or the admin
  silently stops controlling that text. New copy = add a field to the
  schema and the JSON. No HTML/markdown in JSON: a sentence with a link is
  split into before/link/after fields.
- What deliberately stays in code: the sample data inside demo mockups
  (project page demo, phone feed), route structure and hrefs of navigation,
  icons, and anything computed from data.
- After any change to content files or schemas: `npm run check:content`.
  Each file must equal what the admin would write back (`serializeContent`
  of `validateBySchema`), or the next admin save produces a noisy diff; it
  also lists legal-guard findings (an editor may have published one after
  acknowledging the warning — review those).

### Admin environment (Vercel → Settings → Environment Variables)
| Variable | What |
|---|---|
| `AUTH_SECRET` | random; `openssl rand -base64 33` |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Google Cloud OAuth client (Web). Redirect URI: `https://www.onarestore.com/api/auth/callback/google` |
| `ADMIN_EMAILS` | comma-separated Google addresses allowed in. Never in code — the repo is public |
| `GITHUB_CONTENT_TOKEN` | fine-grained PAT, repository `dmitzin-web/ona` only, **Contents: Read and write** |

Adding or removing an editor = editing `ADMIN_EMAILS` and redeploying.
Without these the admin says it is not set up; the site still builds.

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
  `/admin` differs only in `form-action`, which must allow
  accounts.google.com for the sign-in redirect.
