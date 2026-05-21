import type { Metadata } from "next";
import { site } from "./site";

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

  return {
    // `absolute` opts out of the root layout's title template (which
    // appends " | ONA Restoration"). buildMetadata already composes the
    // final title above, so without `absolute` we get double-suffix:
    //   "Restoration Services | ONA Restoration | ONA Restoration"
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
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
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}
