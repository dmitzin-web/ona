import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { areaProfiles } from "@/lib/areas";
import { posts } from "@/lib/posts";

// Static pages were last meaningfully restructured on this date. We don't use
// new Date() here — emitting "modified today" on every build day undermines
// the freshness signal because Google learns to discount it. Bump this date
// when a static page is genuinely edited (copy, schema, structure).
const STATIC_LAST_MODIFIED = new Date("2026-05-20");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly", priority: 1.0 },
    { url: `${site.url}/services`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/areas`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/about`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/quote`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/blog`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/privacy`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/terms`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
  ];

  const serviceUrls: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Programmatic service × city pages — 5 services × 10 areas = 50 URLs.
  // Same priority as hubs because these target buy-intent queries directly
  // ("water damage restoration beaverton") and convert to phone calls at
  // a higher rate than the broader service pages.
  const serviceCityUrls: MetadataRoute.Sitemap = services.flatMap((s) =>
    areaProfiles.map((a) => ({
      url: `${site.url}/services/${s.slug}/${a.slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  );

  const areaUrls: MetadataRoute.Sitemap = areaProfiles.map((a) => ({
    url: `${site.url}/areas/${a.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // Blog posts: monthly refresh keeps Google re-crawling for evergreen
  // updates; lastModified pulled from the actual post date so freshness
  // signal is real, not synthetic.
  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticUrls,
    ...serviceUrls,
    ...serviceCityUrls,
    ...areaUrls,
    ...postUrls,
  ];
}
