import type { NextConfig } from "next";
import { site } from "./lib/site";

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
  "frame-ancestors 'none'",
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
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // JSON-LD is inlined via dangerouslySetInnerHTML; Next.js also inlines small
  // runtime scripts. 'unsafe-inline' is acceptable here because there is no
  // user-generated HTML on the site.
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  // Supabase: REST (https) + realtime (wss) + storage on the project's
  // pinned subdomain. Plausible covers analytics.
  "connect-src 'self' https://plausible.io",
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
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
];

const securityHeaders = isProd
  ? [...baseHeaders, ...productionOnlyHeaders]
  : baseHeaders;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
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
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
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
