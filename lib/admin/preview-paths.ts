// Where each section can be seen, for "Find text" and the dashboard: a
// page that shows it. {slug} is the collection item's slug; {firstPost} the
// newest blog post.
export const PREVIEW_PATHS: Record<string, string> = {
  home: "/",
  about: "/about",
  contact: "/contact",
  "services-index": "/services",
  "areas-index": "/areas",
  "blog-index": "/blog",
  misc: "/quote/thanks",
  "spokane-fire": "/services/fire-damage/spokane-wa",
  "service-page": "/services/water-damage",
  "mold-sections": "/services/mold-removal",
  "area-page": "/areas/vancouver-wa",
  "service-area-page": "/services/water-damage/vancouver-wa",
  chrome: "/",
  "start-project": "/start-project",
  quote: "/quote",
  "work-page": "/work/sample",
  "post-page": "/blog/{firstPost}",
  site: "/contact",
  services: "/services/{slug}",
  areas: "/areas/{slug}",
  legal: "/privacy",
};
