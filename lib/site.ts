import { areaProfiles } from "./areas";

// Single source of truth for the city list lives in lib/areas.ts (areaProfiles).
// `site.serviceArea` is a slim, read-only derivation kept here so existing
// consumers (footer, JSON-LD, llms.txt, etc.) can stay declarative.
const derivedServiceArea = areaProfiles.map(({ slug, name, region }) => ({
  slug,
  name,
  region,
}));

export const site = {
  // `name` is the public DBA / trade name — what customers see, what's
  // on the GBP listing, what's on trucks and uniforms. Keep this short.
  name: "ONA Restoration",
  // Legal entity name exactly as filed with WA Secretary of State.
  // UBI 606 225 235, formation date 2026-05-13. The LLC name differs
  // from the DBA — Google GBP and structured data need both:
  //   - schema.org `name` field uses the DBA
  //   - schema.org `legalName` field uses the LLC name
  // and `alternateName` (rendered in lib/jsonld.ts) carries the full
  // legal display so Google's reviewer can match either string when
  // cross-checking WA SOS state filings.
  legalName: "ONA Restoration & Remodeling LLC",
  tagline: "Precision. Restoration. Built to Last.",
  shortDescription:
    "Restoration, reconstruction, and remodeling in Vancouver, WA and the Portland metro. Water, fire, mold and storm damage restoration plus kitchen, bath and whole-house remodeling. 24/7 emergency dispatch. Insurance billed direct. Fixed-scope agreement before any work.",
  // Canonical host. Production redirects apex (onarestore.com) → www
  // (308 permanent). Keep this aligned with www so JSON-LD @id, canonical
  // tags, OG urls, sitemap entries and assistant URLs all match the served
  // URL — otherwise Google sees two URLs for every page.
  url: "https://www.onarestore.com",
  locale: "en_US",
  phone: "+13605532138",
  phoneDisplay: "(360) 553-2138",
  // Use a role-based dispatch mailbox, not a personal address. Personal
  // emails on a public site invite spam and look unprofessional. The
  // dispatch@ mailbox should forward to whoever is on call (currently
  // the founder).
  email: "dispatch@onarestore.com",
  // Legal entity formation date (WA SOS — 2026-05-13). The founder's
  // personal restoration experience pre-dates this; surface that in the
  // /about copy if/when the founder confirms specifics. Do NOT inflate
  // this field — it is cross-checked against state records during GBP
  // verification.
  founded: "2026",
  priceRange: "$$$",
  address: {
    locality: "Vancouver",
    region: "WA",
    regionName: "Washington",
    country: "US",
    countryName: "United States",
  },
  geo: {
    latitude: 45.6387,
    longitude: -122.6615,
  },
  hoursSpec: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  serviceArea: derivedServiceArea,
  // Rating: intentionally absent until the GBP profile is verified and
  // accumulates real Google reviews. Emitting an AggregateRating without
  // backing reviews is a synthetic-signal flag for Google's review
  // detection and works against GBP verification. When real reviews
  // exist, re-add { value, count } here and the JSON-LD will fill in.
  rating: null as { value: number; count: number } | null,
  // `certifications` lists ONLY credentials we actually hold today. The
  // four IICRC technician certs (WRT/ASD/AMRT/FSRT) are NOT listed here
  // because they are not yet issued — listing them (in copy or JSON-LD)
  // would be a false credential claim and a structured-data verification
  // risk. They are expected in 2026; when the certificates are in hand,
  // re-add them to this array and flip `iicrcCertified` to true below —
  // the JSON-LD hasCredential and any "in progress" copy update from
  // these two values.
  certifications: [
    // WA L&I contractor registration — verifiable at
    // https://secure.lni.wa.gov/verify/. Issued 2026-05-28.
    "WA L&I Contractor Registration ONARER*748K8",
    "Licensed, bonded & insured in WA and OR",
  ],
  // Flip to true ONLY when the IICRC certificates are actually issued.
  // Drives whether we assert the certs as held vs. "in progress".
  iicrcCertified: false,
  // IICRC technician certs we are pursuing — surfaced as "in progress",
  // never as held, until `iicrcCertified` is true.
  iicrcPending: [
    "IICRC Water Damage Restoration (WRT)",
    "IICRC Applied Structural Drying (ASD)",
    "IICRC Applied Microbial Remediation (AMRT)",
    "IICRC Fire & Smoke Restoration (FSRT)",
  ],
  values: [
    {
      key: "precision",
      title: "Precision",
      body: "We execute with accuracy and expertise.",
    },
    {
      key: "integrity",
      title: "Integrity",
      body: "Honest communication is our foundation.",
    },
    {
      key: "craftsmanship",
      title: "Craftsmanship",
      body: "Quality workmanship. No compromises.",
    },
    {
      key: "accountability",
      title: "Accountability",
      body: "We take ownership of every detail.",
    },
    {
      key: "respect",
      title: "Respect",
      body: "For our clients, our teams, and the process.",
    },
  ] as const,
  // Social/profile URLs surfaced as schema.org/sameAs in LocalBusiness JSON-LD.
  // Only list profiles that actually exist and resolve to active pages.
  // Dead/404 sameAs entries are picked up by crawlers and used as
  // negative trust signals — keep this list narrow until profiles are
  // claimed and verified one-by-one.
  social: {
    facebook: "https://www.facebook.com/onarestoration",
    instagram: "https://www.instagram.com/onarestoration",
  },
} as const;

export type SiteConfig = typeof site;
