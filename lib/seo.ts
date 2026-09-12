import type { Metadata } from "next";
import { site } from "./site";
import seo from "../content/seo.json";

// Per-page indexing, set in the admin (SEO → Per-page indexing). A page
// listed there can be kept out of Google, or declared a copy of another
// page so the credit lands on one of them. A page not listed behaves the
// way it always has: indexed, canonical to itself.
type PageRule = { path: string; hide: boolean; canonical: string };
const pageRule = (path: string): PageRule | undefined =>
  (seo.pages as PageRule[]).find((p) => p.path === path);

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  /**
   * @deprecated meta keywords is ignored by every major search engine since
   * ~2009 and only leaks your target-keyword strategy to competitors who
   * read your HTML. The field is kept on the type so existing call sites
   * don't fail to compile, but the value is no longer emitted.
   */
  keywords?: string[];
};

const ABSOLUTE = (path: string) =>
  path.startsWith("http") ? path : `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/opengraph-image",
  noindex = false,
}: BuildMetadataInput): Metadata {
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  const url = ABSOLUTE(path);
  const ogImage = ABSOLUTE(image);
  const rule = pageRule(path);
  // A rule can only ADD noindex: the pages the code marks (the thank-you
  // page) stay out of Google whatever the admin says.
  const hidden = noindex || rule?.hide === true;
  const canonical = rule?.canonical?.trim() ? ABSOLUTE(rule.canonical.trim()) : url;

  return {
    // `absolute` opts out of the root layout's title template (which
    // appends " | Ona Restoration"). buildMetadata already composes the
    // final title above, so without `absolute` we get double-suffix:
    //   "Restoration Services | Ona Restoration | Ona Restoration"
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: hidden
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}
