# Deploy ClaimLens / ONA Restoration to Vercel

This is a one-time checklist that takes the project from "works on
localhost" to "live on the public internet at onarestore.com". Follow
top to bottom — the steps are ordered by dependencies.

Throughout, **YOU** = the project owner doing dashboard work, and
**WE** = the engineer running terminal commands. Keep an open terminal
in `/Users/mag2/onarestore/` for the WE steps.

---

## Phase A — Accounts & prerequisites

Make sure each is in place before continuing.

- [ ] **GitHub account** with permission to create repos under your
      personal account or a relevant organisation. Free tier is fine.
- [ ] **Vercel account** at https://vercel.com. Sign in with the same
      GitHub account so the connect step is one click. Free Hobby tier
      is fine — gives 60-second serverless function timeouts which is
      what we need.
- [ ] **Anthropic API key** already in `.env.local` and verified working
      (`/api/health` returns `"ai":"live"`).
- [ ] **Supabase project** already provisioned with the schema applied
      (`profiles`, `claims`, `claim_files`, `claim_reports` tables
      visible in Table Editor).
- [ ] **Current DNS state for onarestore.com** documented somewhere.
      Run `dig onarestore.com +short` from any terminal — note the IP /
      target. You'll need to know what to undo if the cutover goes
      wrong.

---

## Phase B — Local git → GitHub

### B1 (WE) — Initialise git locally

```bash
cd /Users/mag2/onarestore
git init -b main
git add .
git status   # sanity check — should NOT list .env.local
git commit -m "Initial commit: ONA Restoration + ClaimLens™"
```

If `git status` lists `.env.local`, **stop immediately** — secrets
would leak to GitHub. Check `.gitignore` covers `.env` patterns and
re-stage.

### B2 (YOU) — Create the GitHub repo

1. Open https://github.com/new
2. Repository name: `onarestore` (or whatever you prefer)
3. **Private**. Do not make this public.
4. Skip "Add README / .gitignore / license" — we already have them.
5. Click **Create repository**
6. Copy the SSH or HTTPS URL from the next screen.

### B3 (WE) — Push

Replace `<URL>` with what you copied:

```bash
git remote add origin <URL>
git push -u origin main
```

If `git push` asks for credentials and you don't have SSH keys set up,
use the HTTPS URL form and create a [personal access token](https://github.com/settings/tokens?type=beta)
scoped to this single repo.

---

## Phase C — Vercel project

### C1 (YOU) — Import the repo

1. Open https://vercel.com/new
2. Find your `onarestore` repo in the list and click **Import**
3. Vercel auto-detects Next.js — leave framework preset alone
4. **Do NOT click Deploy yet** — we need env vars first

### C2 (YOU) — Environment variables

In the same import screen, expand the **Environment Variables** section.
Add the following. Mark **Production** + **Preview** for each (Development
is your local `.env.local`, not Vercel).

| Variable                          | Where to find it                                      |
| --------------------------------- | ----------------------------------------------------- |
| `ANTHROPIC_API_KEY`               | Same as `.env.local` (your active Anthropic key)      |
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase dashboard → Settings → General → Project ID  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Same as `.env.local` (publishable key)                |
| `SUPABASE_SERVICE_ROLE_KEY`       | Same as `.env.local` (secret key)                     |

Optional but recommended:

| Variable                          | Notes                                                          |
| --------------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`    | `onarestore.com` once you set up Plausible; skip otherwise     |
| `SENTRY_DSN`                      | From a new Sentry project (sentry.io → Create Project → Next.js) |
| `NEXT_PUBLIC_SENTRY_DSN`          | Same value as `SENTRY_DSN`                                     |

**Do NOT add `SUPABASE_DB_URL`.** That's only used by `npm run migrate`
locally — not by the running app.

Click **Deploy** when done.

### C3 — First deploy

Vercel will build for ~2 minutes. When it finishes you get a preview
URL like `onarestore-abc123.vercel.app`.

### C4 (WE) — Smoke-test the preview URL

```bash
# replace with your actual preview URL
PREV=https://onarestore-abc123.vercel.app

curl -s -o /dev/null -w "%{http_code}\n" $PREV/
curl -s -o /dev/null -w "%{http_code}\n" $PREV/claimlens
curl -s $PREV/api/health
```

Expected:
- `/` → 200
- `/claimlens` → 200
- `/api/health` → `{"ok":true,"ai":"live","supabase":"configured",...}`

If `ai` is `mock`, the Anthropic key didn't land — check env vars in
Vercel project settings. If `supabase` is `missing`, Supabase env vars
are wrong.

---

## Phase D — Supabase production config

### D1 (YOU) — Add the Vercel URLs to Supabase Auth

Auth → URL Configuration in your Supabase dashboard:

- **Site URL**: temporarily keep `http://localhost:3000` so you can
  still develop. We'll switch this to `https://onarestore.com` after
  DNS cutover.
- **Redirect URLs**: add **all four** of these so magic-link emails
  redirect correctly from any environment:
  - `http://localhost:3000/auth/callback`
  - `https://onarestore.com/auth/callback`
  - `https://onarestore-*.vercel.app/auth/callback` (wildcard for previews)
  - Your specific preview URL with `/auth/callback`

Click **Save**.

### D2 (YOU) — Paste the magic-link email template

1. Supabase → Authentication → Email Templates → **Magic Link**
2. Subject: `Sign in to ClaimLens™`
3. Open `supabase/email-templates/magic-link.html` in any text editor,
   select all, copy, paste into the Message Body field
4. Save

### D3 (WE) — Smoke-test sign-in from the preview URL

In a private/incognito browser window:

1. Open `$PREV/login` (your preview URL + /login)
2. Enter your email → submit
3. Email should arrive within 1 minute. Click the magic link.
4. You should be redirected to `$PREV/claimlens/upload` signed in.

If the magic link redirects to `localhost`, you forgot D1.

---

## Phase E — Custom domain

Skip if you're happy with the `*.vercel.app` URL for now.

### E1 (YOU) — Document your current DNS

Take a screenshot of your DNS records at the current host (whoever
manages onarestore.com — Cloudflare, GoDaddy, Namecheap, Squarespace,
etc.). You'll want this if you need to roll back.

### E2 (YOU) — Add the domain in Vercel

1. Vercel project → Settings → Domains
2. Add `onarestore.com` and `www.onarestore.com`
3. Vercel shows the records to add at your DNS provider. Typically:
   - `A` record for `onarestore.com` → `76.76.21.21`
   - `CNAME` for `www` → `cname.vercel-dns.com`
   - (Specific values may differ — copy what Vercel shows you.)

### E3 (YOU) — Update DNS at your current provider

Replace the existing records with the Vercel-provided ones. DNS
propagation is usually under 30 minutes, sometimes faster.

### E4 (WE) — Verify

```bash
dig onarestore.com +short
dig www.onarestore.com +short
curl -s -o /dev/null -w "%{http_code}\n" https://onarestore.com
```

When `dig` shows the Vercel IP and `curl` returns 200, you're live.

### E5 (YOU) — Update Supabase Site URL

Now that DNS points to Vercel:

1. Supabase → Auth → URL Configuration
2. **Site URL**: change from `http://localhost:3000` to
   `https://onarestore.com`
3. **Redirect URLs**: keep all four. Don't remove localhost — that
   keeps local dev working.

---

## Phase F — Post-deploy

### F1 (YOU) — Submit to Google

1. https://search.google.com/search-console
2. Add property `https://onarestore.com`
3. Verify via the DNS TXT record method (least fragile)
4. Submit sitemap: `https://onarestore.com/sitemap.xml`

### F2 (WE) — Watch the first 24 hours

```bash
# tail Vercel logs from the CLI if you install it; or use the dashboard
# at vercel.com/<your-team>/onarestore/logs
```

Common things to keep an eye on:
- `/api/claimlens/analyze` errors → Sentry if configured, otherwise
  Vercel Function Logs
- `/api/health` should be 200 every minute (if you wired up an uptime
  monitor like Better Uptime)
- First real claim runs: open Supabase → Table Editor → `claim_reports`
  to verify rows are being written

### F3 (YOU) — Uptime monitor

Optional. Sign up for https://uptimerobot.com (free, 50 monitors) or
https://betteruptime.com (free tier). Add a single HTTP monitor on
`https://onarestore.com/api/health` with 60-second interval. You'll
get an email + SMS if the site goes down for 2+ minutes.

---

## Rollback

If something breaks badly and you can't fix it in 5 minutes:

1. Vercel project → Deployments → find the last green production
   deploy → **... menu → Promote to Production**. Live in 30 seconds.
2. If the domain itself is broken (DNS mistakes): your screenshot from
   E1 has the original records — restore them. DNS propagation again
   ~30 minutes.

---

## What's NOT in this checklist

These are deferred until after first launch:

- **Counsel review of /privacy and /terms** — required before any
  marketing pushes a public link to the site. Until then the draft
  banner makes the legal posture clear.
- **Eval set for the Claude prompt** — needs real anonymised claims.
- **Per-user token usage tracking** — for AI cost monitoring.
- **Email notifications for completed reports** — currently sync.
- **iOS app or PWA** — separate scope decision.

Tackle these once the first 10 real users have run a claim through.
