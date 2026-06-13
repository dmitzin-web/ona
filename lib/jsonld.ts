import { site } from "./site";
import { services } from "./services";
import { reviews } from "./reviews";

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${site.url}/#business`,
    name: site.name,
    // `alternateName` carries the legal entity name minus the corporate
    // suffix — gives Google's GBP reviewer a second string to match the
    // listing against the WA SOS Certificate of Formation. The DBA
    // 'ONA Restoration' is the public-facing name; the LLC is the
    // registered entity. Both should resolve to the same business.
    alternateName: "ONA Restoration & Remodeling",
    legalName: site.legalName,
    slogan: site.tagline,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/opengraph-image`,
    logo: `${site.url}/icon.png`,
    priceRange: site.priceRange,
    description: site.shortDescription,
    foundingDate: site.founded,
    // Founder Person intentionally omitted for now (founder's name hidden
    // site-wide — see SHOW_FOUNDER in app/about/page.tsx). Restore this
    // block alongside that flag.
    knowsAbout: [
      "Water damage restoration",
      "Fire and smoke damage restoration",
      "Mold remediation",
      "Storm and wind damage restoration",
      "Structural drying",
      "Reconstruction and remodeling",
      "IICRC S500 water damage standard",
      "IICRC S520 mold remediation standard",
      "IICRC S700 fire and smoke damage standard",
      "Xactimate insurance estimating",
      "Insurance claim documentation",
      "Thermal imaging moisture mapping",
      "HEPA filtration and containment",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    areaServed: site.serviceArea.map((a) => ({
      "@type": "City",
      name: `${a.name}, ${a.region}`,
    })),
    openingHoursSpecification: site.hoursSpec,
    // Both aggregateRating and review[] are emitted only when there are
    // real reviews backing them. A new LLC with fabricated rating values
    // is detectable by Google's review-quality systems and risks a
    // synthetic-signal flag during GBP verification. When reviews arrive,
    // populate lib/reviews.ts and set site.rating.
    ...(site.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: site.rating.value,
            reviewCount: site.rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(reviews.length > 0 && {
      review: reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        datePublished: r.datePublished,
        reviewBody: r.reviewBody,
        itemReviewed: { "@id": `${site.url}/#business` },
      })),
    }),
    hasCredential: site.certifications.map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      name: cert,
      credentialCategory:
        cert.toLowerCase().includes("licens") ||
        cert.toLowerCase().includes("bond")
          ? "license"
          : "certification",
    })),
    // IICRC technician certs (WRT/ASD/AMRT/FSRT) are emitted via
    // hasCredential above (they're in site.certifications). We still omit a
    // `memberOf: IICRC` org-membership claim — holding technician certs is
    // not the same as a firm-level membership, so don't assert it.
    sameAs: Object.values(site.social),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Restoration Services",
      itemListElement: services.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: s.name,
          url: `${site.url}/services/${s.slug}`,
        },
      })),
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": `${site.url}/#business` },
    inLanguage: "en-US",
  };
}

export function serviceJsonLd(slug: string) {
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}/services/${service.slug}#service`,
    serviceType: service.name,
    name: service.name,
    description: service.description,
    provider: { "@id": `${site.url}/#business` },
    areaServed: site.serviceArea.map((a) => `${a.name}, ${a.region}`),
    url: `${site.url}/services/${service.slug}`,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${site.url}${item.url}`,
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["summary", "details > p"],
    },
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// Emits schema.org/HowTo from a service's process steps.
export function serviceProcessHowToJsonLd(slug: string) {
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${service.name} — process`,
    description: service.description,
    step: service.process.map((p, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: p.step.replace(/^\d+\.\s*/, ""),
      text: p.text,
    })),
  };
}
