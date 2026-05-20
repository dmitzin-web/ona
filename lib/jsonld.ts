import { site } from "./site";
import { services } from "./services";
import { reviews } from "./reviews";

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${site.url}/#business`,
    name: site.name,
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
    founder: {
      "@type": "Person",
      "@id": `${site.url}/about#founder`,
      name: "Dmitry Zinovyev",
      jobTitle: "Founder",
      worksFor: { "@id": `${site.url}/#business` },
    },
    knowsAbout: [
      "Water damage restoration",
      "Fire and smoke damage restoration",
      "Mold remediation",
      "Storm and wind damage restoration",
      "Structural drying",
      "Reconstruction and remodeling",
      "IICRC S500 water damage standard",
      "IICRC S520 mold remediation standard",
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
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
    memberOf: {
      "@type": "Organization",
      name: "Institute of Inspection, Cleaning and Restoration Certification (IICRC)",
      url: "https://www.iicrc.org",
    },
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
