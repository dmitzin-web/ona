import "server-only";
import areas from "@/content/areas.json";
import chrome from "@/content/chrome.json";
import legal from "@/content/legal.json";
import pages_about from "@/content/pages/about.json";
import pages_area_page from "@/content/pages/area-page.json";
import pages_areas_index from "@/content/pages/areas-index.json";
import pages_blog_index from "@/content/pages/blog-index.json";
import pages_contact from "@/content/pages/contact.json";
import pages_home from "@/content/pages/home.json";
import pages_misc from "@/content/pages/misc.json";
import pages_mold_sections from "@/content/pages/mold-sections.json";
import pages_post_page from "@/content/pages/post-page.json";
import pages_quote from "@/content/pages/quote.json";
import pages_service_area_page from "@/content/pages/service-area-page.json";
import pages_service_page from "@/content/pages/service-page.json";
import pages_services_index from "@/content/pages/services-index.json";
import pages_spokane_fire from "@/content/pages/spokane-fire.json";
import pages_start_project from "@/content/pages/start-project.json";
import pages_work_page from "@/content/pages/work-page.json";
import reviews from "@/content/reviews.json";
import services from "@/content/services.json";
import site from "@/content/site.json";

// The content exactly as THIS deployment was built with it — which is what
// the site pages in the visual editor's preview are showing. The editor
// matches the page's text against these values; the latest version in the
// store can be newer (a publish still deploying) and is applied on top.
// Static imports: no fs, nothing for the file tracer to widen.
// `npm run check:content` fails if a section file is missing here.
export const DEPLOYED: Record<string, unknown> = {
  "content/areas.json": areas,
  "content/chrome.json": chrome,
  "content/legal.json": legal,
  "content/pages/about.json": pages_about,
  "content/pages/area-page.json": pages_area_page,
  "content/pages/areas-index.json": pages_areas_index,
  "content/pages/blog-index.json": pages_blog_index,
  "content/pages/contact.json": pages_contact,
  "content/pages/home.json": pages_home,
  "content/pages/misc.json": pages_misc,
  "content/pages/mold-sections.json": pages_mold_sections,
  "content/pages/post-page.json": pages_post_page,
  "content/pages/quote.json": pages_quote,
  "content/pages/service-area-page.json": pages_service_area_page,
  "content/pages/service-page.json": pages_service_page,
  "content/pages/services-index.json": pages_services_index,
  "content/pages/spokane-fire.json": pages_spokane_fire,
  "content/pages/start-project.json": pages_start_project,
  "content/pages/work-page.json": pages_work_page,
  "content/reviews.json": reviews,
  "content/services.json": services,
  "content/site.json": site,
};
