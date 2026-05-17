import type { NextConfig } from "next";

// Strict security headers are applied only to production builds. Applying HSTS
// or `upgrade-insecure-requests` to a localhost dev server causes Safari to
// cache an http→https redirect for localhost, which then refuses to load until
// the HSTS cache is cleared. Same goes for strict CSP on Next's hot-reload
// pipeline. Production gets the full set below; dev gets only the
// always-harmless ones.

const isProd = process.env.NODE_ENV === "production";

const ContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob: https:",
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
  // Permanent redirects: the Vvon™ SaaS product was spun out of this
  // repo into github.com/dmitzin-web/vvon and lives at vvon.ai. We send
  // any inbound traffic to the legacy /vvon/* or /claimlens/* paths
  // (which Google may still have indexed from before the spin-out) to
  // the corresponding URL on the new domain. permanent: true issues a
  // 308 (method-preserving permanent redirect) so search engines
  // transfer ranking equity to vvon.ai.
  async redirects() {
    return [
      { source: "/vvon", destination: "https://vvon.ai", permanent: true },
      {
        source: "/vvon/:path*",
        destination: "https://vvon.ai/:path*",
        permanent: true,
      },
      {
        source: "/claimlens",
        destination: "https://vvon.ai",
        permanent: true,
      },
      {
        source: "/claimlens/:path*",
        destination: "https://vvon.ai/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
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
