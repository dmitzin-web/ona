import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { areaProfiles } from "@/lib/areas";
import { posts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/areas`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/quote`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/vvon`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/vvon/upload`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/vvon/report`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const serviceUrls: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Programmatic service × city pages — 5 services × 10 areas = 50 URLs.
  // Higher priority than generic city pages because these target
  // buy-intent queries directly ("water damage restoration beaverton").
  const serviceCityUrls: MetadataRoute.Sitemap = services.flatMap((s) =>
    areaProfiles.map((a) => ({
      url: `${site.url}/services/${s.slug}/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  );

  const areaUrls: MetadataRoute.Sitemap = areaProfiles.map((a) => ({
    url: `${site.url}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    ...staticUrls,
    ...serviceUrls,
    ...serviceCityUrls,
    ...areaUrls,
    ...postUrls,
  ];
}
