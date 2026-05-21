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
  name: "ONA Restoration",
  legalName: "ONA Restoration LLC",
  tagline: "Precision. Restoration. Built to Last.",
  shortDescription:
    "High-end property restoration and remodeling in Vancouver, WA and Portland, OR. IICRC-certified water, fire, mold and storm damage restoration plus premium kitchen, bath and whole-house remodeling — insurance-grade documentation throughout.",
  // Canonical host. Production redirects apex (onarestore.com) → www
  // (308 permanent). Keep this aligned with www so JSON-LD @id, canonical
  // tags, OG urls, sitemap entries and assistant URLs all match the served
  // URL — otherwise Google sees two URLs for every page.
  url: "https://www.onarestore.com",
  locale: "en_US",
  phone: "+13608233196",
  phoneDisplay: "(360) 823-3196",
  // Use a role-based dispatch mailbox, not a personal address. Personal
  // emails on a public site invite spam and look unprofessional for a
  // premium brand. The dispatch@ mailbox should forward to whoever is on
  // call (currently the founder).
  email: "dispatch@onarestore.com",
  founded: "2018",
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
  rating: {
    value: 4.9,
    count: 187,
  },
  certifications: [
    "IICRC Water Damage Restoration (WRT)",
    "IICRC Applied Structural Drying (ASD)",
    "IICRC Applied Microbial Remediation (AMRT)",
    "IICRC Fire & Smoke Restoration (FSRT)",
    "Licensed, bonded & insured in WA and OR",
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
  // PLACEHOLDER URLs follow standard profile naming — replace with the real
  // URL of each profile once it is claimed/created. Removing a key removes it
  // from the JSON-LD; do not leave 404ing URLs live long-term.
  social: {
    facebook: "https://www.facebook.com/onarestoration",
    instagram: "https://www.instagram.com/onarestoration",
    google: "https://g.page/ona-restoration",
    yelp: "https://www.yelp.com/biz/ona-restoration-vancouver",
    bbb: "https://www.bbb.org/us/wa/vancouver/profile/restoration-services/ona-restoration",
    angi: "https://www.angi.com/companylist/us/wa/vancouver/ona-restoration.htm",
    houzz: "https://www.houzz.com/pro/ona-restoration",
    nextdoor: "https://nextdoor.com/pages/ona-restoration-vancouver-wa",
    linkedin: "https://www.linkedin.com/company/ona-restoration",
  },
} as const;

export type SiteConfig = typeof site;
