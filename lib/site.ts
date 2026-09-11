import { areaProfiles } from "./areas";
import content from "../content/site.json";

// Company details. The editable part lives in content/site.json and is
// changed through the admin (/admin → Company details); this module adds the
// few values that are code, not content, and keeps the exported shape every
// consumer already uses.
//
// A static JSON import, not a filesystem read: this module is imported by
// client components (the header), and a static import is bundled into
// both sides. The notes that used to sit next to each field — why the phone
// is role-based, why `founded` must match state records, why there is no
// rating yet, why "bonded & insured" is gone — are now the field hints in
// lib/admin/sections.ts, where the person editing them will read them.

// Single source of truth for the city list lives in lib/areas.ts (areaProfiles).
// `site.serviceArea` is a slim, read-only derivation kept here so existing
// consumers (footer, JSON-LD, llms.txt, etc.) can stay declarative.
const derivedServiceArea = areaProfiles.map(({ slug, name, region }) => ({
  slug,
  name,
  region,
}));

export const site = {
  name: content.name,
  legalName: content.legalName,
  tagline: content.tagline,
  shortDescription: content.shortDescription,
  // Canonical host — code, not content. Production redirects apex
  // (onarestore.com) → www; JSON-LD @id, canonical tags, OG urls, sitemap
  // and the sign-in callback all depend on this exact value.
  url: "https://www.onarestore.com",
  locale: "en_US",
  phone: content.phone,
  phoneDisplay: content.phoneDisplay,
  email: content.email,
  founded: content.founded,
  priceRange: content.priceRange,
  address: content.address,
  geo: content.geo,
  hoursSpec: content.hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  serviceArea: derivedServiceArea,
  rating: content.rating as { value: number; count: number } | null,
  certifications: content.certifications,
  iicrcCertified: content.iicrcCertified,
  iicrcPending: content.iicrcPending as string[],
  values: content.values,
  social: content.social,
};

export type SiteConfig = typeof site;
