import type { NextConfig } from "next";
import { site } from "./lib/site";
import seo from "./content/seo.json";
import { googleMeasurement, MEASUREMENT_HOSTS } from "./lib/measurement";

// Strict security headers are applied only to production builds. Applying HSTS
// or `upgrade-insecure-requests` to a localhost dev server causes Safari to
// cache an http→https redirect for localhost, which then refuses to load until
// the HSTS cache is cleared. Same goes for strict CSP on Next's hot-reload
// pipeline. Production gets the full set below; dev gets only the
// always-harmless ones.

const isProd = process.env.NODE_ENV === "production";

// Absolute URL for CSP violation reports. Headers are prod-only, so the
// canonical production host is the right base. Single source of truth in
// lib/site.ts so it never drifts from the rest of the app's URLs.
const cspReportEndpoint = `${site.url}/api/csp-report`;

const ContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  // 'self', not 'none': the visual editor (/admin) shows the site's own
  // pages in a frame. Other origins still cannot frame the site.
  "frame-ancestors 'self'",
  "object-src 'none'",
  // The /contact page embeds a Google Maps iframe via the official
  // /maps/embed endpoint (keyless, frames cleanly — unlike the plain
  // ?output=embed endpoint which sends X-Frame-Options). Without an
  // explicit frame-src the browser falls back to default-src 'self'
  // and blocks it, so we allow only the Google origins it loads from.
  "frame-src 'self' https://www.google.com https://maps.google.com",
  // Narrowed from a blanket `https:`. The site loads images only from its own
  // origin (Next Image is local-only — no remotePatterns), plus data:/blob:
  // for inline SVGs and the assistant's photo-upload previews. The Google Maps
  // embed is an <iframe> (frame-src), not an image, so it is unaffected.
  `img-src 'self' data: blob:${googleMeasurement ? " " + MEASUREMENT_HOSTS.img.join(" ") : ""}`,
  "font-src 'self' data:",
  // JSON-LD is inlined via dangerouslySetInnerHTML; Next.js also inlines small
  // runtime scripts. 'unsafe-inline' is acceptable here because there is no
  // user-generated HTML on the site.
  // Google Analytics / Tag Manager are added here ONLY while an ID is set
  // in the admin (SEO → Measurement). With the fields empty the policy is
  // exactly what it was before they existed.
  `script-src 'self' 'unsafe-inline' https://plausible.io${googleMeasurement ? " " + MEASUREMENT_HOSTS.script.join(" ") : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Supabase: REST (https) + realtime (wss) + storage on the project's
  // pinned subdomain. Plausible covers analytics.
  `connect-src 'self' https://plausible.io${googleMeasurement ? " " + MEASUREMENT_HOSTS.connect.join(" ") : ""}`,
  "manifest-src 'self'",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
  // Observability only — these directives do NOT block anything. Violations of
  // the policy above are POSTed to our own /api/csp-report, which logs a
  // bounded summary (visible in Vercel logs). report-to is the modern Reporting
  // API (the `csp-endpoint` group is declared in the Reporting-Endpoints header
  // below); report-uri is the legacy fallback Chromium still honors.
  "report-to csp-endpoint",
  `report-uri ${cspReportEndpoint}`,
].join("; ");

// The content admin (/admin) differs from the site policy in one place.
// "Sign in with Google" is a form whose response is a redirect to
// accounts.google.com, and Chrome applies form-action to redirects that
// follow a form submission — under the site's `form-action 'self'` the
// button would silently do nothing. Everything else stays exactly as strict
// as the public site: the admin reads and writes through its own server
// (GitHub is called server-side), so it needs no extra connect-src or
// img-src at all.
const AdminContentSecurityPolicy = ContentSecurityPolicy.replace(
  "form-action 'self'",
  "form-action 'self' https://accounts.google.com",
);

// /new — the standalone homepage concept served from public/new/index.html.
// It is one self-contained file, not a React page, and the only thing it
// loads from outside is Google Fonts. So it differs from the site policy in
// exactly two directives, and only on its own path; the rest of the site
// keeps "font-src 'self'" and never talks to Google's font servers.
const NewPageContentSecurityPolicy = ContentSecurityPolicy
  .replace("style-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com")
  .replace("font-src 'self' data:", "font-src 'self' data: https://fonts.gstatic.com");

const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()",
  },
];

const productionOnlyHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  // Declares the `csp-endpoint` reporting group referenced by `report-to`.
  { key: "Reporting-Endpoints", value: `csp-endpoint="${cspReportEndpoint}"` },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
];

const securityHeaders = isProd
  ? [...baseHeaders, ...productionOnlyHeaders]
  : baseHeaders;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Gallery photos are uploaded through a server action (app/admin/
    // actions.ts). The default 1 MB limit would refuse any real photo; the
    // action itself caps uploads at 10 MB.
    serverActions: { bodySizeLimit: "12mb" },
  },
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async rewrites() {
    // Files in public/ are served at their own path, so the concept lives at
    // /new/index.html; this makes the short address serve it too.
    return [{ source: "/new", destination: "/new/index.html" }];
  },
  async redirects() {
    // Added in the admin (SEO → Redirects) and checked here before Next
    // ever sees them: a redirect from an address that is not a path, to
    // nowhere, or to itself would break the site rather than help it. The
    // SEO screen reports the same problems before publishing.
    const custom = (seo.redirects as { from: string; to: string; permanent: boolean }[])
      .filter(
        (r) =>
          typeof r.from === "string" &&
          typeof r.to === "string" &&
          r.from.startsWith("/") &&
          !r.from.startsWith("//") &&
          (r.to.startsWith("/") || r.to.startsWith("https://")) &&
          r.from !== r.to,
      )
      .map((r) => ({ source: r.from, destination: r.to, permanent: r.permanent !== false }));

    return [
      ...custom,
      // Remodeling is a co-equal business line — surface it via a short
      // typable URL that mirrors how clients refer to the division.
      { source: "/remodeling", destination: "/services/remodeling", permanent: true },
      {
        source: "/remodeling/:path*",
        destination: "/services/remodeling/:path*",
        permanent: true,
      },
      // Mold is the third co-equal business line — same short-URL treatment.
      { source: "/mold", destination: "/services/mold-removal", permanent: true },
      {
        source: "/mold/:path*",
        destination: "/services/mold-removal/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Content admin and its sign-in endpoints: their own CSP (see
      // AdminContentSecurityPolicy) and a hard noindex. Must come AFTER the
      // `/:path*` rule so its CSP wins.
      ...["/admin", "/admin/:path*", "/api/auth/:path*"].map(
        (source) => ({
          source,
          headers: [
            ...(isProd
              ? [{ key: "Content-Security-Policy", value: AdminContentSecurityPolicy }]
              : []),
            { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          ],
        }),
      ),
      // The /new concept: Google Fonts allowed, and kept out of search while
      // it is a preview (the file carries a robots meta as well). After the
      // `/:path*` rule so this CSP wins.
      ...["/new", "/new/index.html"].map((source) => ({
        source,
        headers: [
          ...(isProd
            ? [{ key: "Content-Security-Policy", value: NewPageContentSecurityPolicy }]
            : []),
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      })),
      {
        // Project File pages are private client/claim records. Belt-and-
        // suspenders with the per-page `robots: noindex` metadata: a hard
        // X-Robots-Tag at the edge keeps them out of every crawler index
        // even for non-HTML responses or if a page ever forgets the meta.
        source: "/work/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
      // Production only. In dev, `immutable` makes the browser hold on to
      // chunks from a previous compile forever — after any rebuild the page
      // then dies with "Cannot read properties of undefined (reading 'call')"
      // and no amount of clearing .next fixes it, because the stale copy is
      // in the browser, not on disk. Prod filenames are content-hashed, so
      // the long TTL is safe there and pointless here.
      ...(isProd
        ? [
            {
              source: "/_next/static/:path*",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
            },
          ]
        : []),
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
