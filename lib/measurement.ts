import seo from "../content/seo.json";

// Google Analytics 4 and Tag Manager, switched on by pasting an ID in the
// admin (SEO → Measurement). Nothing is loaded while the fields are empty.
//
// The IDs are checked against these patterns everywhere they are used —
// in the page (components/Analytics.tsx) and in the Content-Security-Policy
// (next.config.ts). An ID ends up inside a script URL, so a value that is
// not exactly one of these shapes is treated as no ID at all rather than
// trusted: a stray character must never be able to point the page at
// somebody else's script.
const GA4 = /^G-[A-Z0-9]{4,20}$/;
const GTM = /^GTM-[A-Z0-9]{4,20}$/;

const clean = (v: unknown, re: RegExp) => {
  const s = typeof v === "string" ? v.trim().toUpperCase() : "";
  return re.test(s) ? s : "";
};

export const ga4Id = clean(seo.analytics?.ga4, GA4);
export const gtmId = clean(seo.analytics?.gtm, GTM);
export const googleMeasurement = Boolean(ga4Id || gtmId);

// The hosts those two scripts need. Added to the policy only when one of
// them is actually configured, so the site's default policy stays as tight
// as it is today.
export const MEASUREMENT_HOSTS = {
  script: ["https://www.googletagmanager.com"],
  connect: [
    "https://www.googletagmanager.com",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
  ],
  img: ["https://www.googletagmanager.com", "https://*.google-analytics.com"],
};
