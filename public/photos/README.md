# Photos

This directory is where final restoration photography drops in. Each filename
below has a known consumer in the codebase — replace the placeholder, keep
the filename, and the image goes live without further code changes.

## Filename map

| File | Used by | Component prop |
| --- | --- | --- |
| `hero.svg` | `app/page.tsx` Hero | `<Hero image={{src,alt}} />` |

## What to replace (and how)

1. **Hero (`hero.svg`)** — currently an abstract architectural SVG.
   Replace with a wide landscape JPG/AVIF (3000×1688 minimum, dark/moody to
   keep light text legible over it). Then in [app/page.tsx](../../app/page.tsx)
   change the Hero call to point at the new file and update the alt text. The
   Hero component automatically applies `next/image` `fill` + `priority` (LCP)
   + a charcoal gradient overlay.

## Future drop slots (not yet wired)

Drop these in when ready; ask the assistant to wire them up:

- `founder-dmitry.jpg` — `/about` founder section portrait (square crop, 800px)
- `team-truck.jpg` — `/about` "by the numbers" or hero trust strip
- `iicrc-cert-wrt.jpg`, `iicrc-cert-asd.jpg`, etc. — `/about` credentials card
- `before-after/<service>-<city>-N.jpg` — `/services/<slug>` hub & city pages
- `equipment-thermal.jpg`, `equipment-air-mover.jpg`, `equipment-dehu.jpg`
  — `/services/water-damage` hub

## Image SEO requirements

- Descriptive alt text containing service + city + outcome word
  (e.g. `alt="Before and after water damage restoration in Vancouver WA
  basement — ONA Restoration"`)
- Explicit width/height attributes (no CLS)
- WebP or AVIF format preferred; next/image converts on the fly
- File size under 400 KB for hero, under 200 KB for inline content shots
