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
  url: "https://onarestore.com",
  locale: "en_US",
  phone: "+13608233196",
  phoneDisplay: "(360) 823-3196",
  email: "dmitry@onarestore.com",
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
  social: {
    facebook: "https://www.facebook.com/onarestoration",
    instagram: "https://www.instagram.com/onarestoration",
    google: "https://g.page/ona-restoration",
  },
} as const;

export type SiteConfig = typeof site;
