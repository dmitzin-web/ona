import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons/ServiceIcons";
import { posts } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import blogIndexContent from "@/content/pages/blog-index.json";
import { fillPlaceholdersDeep } from "@/lib/placeholders";

// The page's own copy lives in content/pages/blog-index.json and is edited
// through the admin (/admin → Blog list page). Each article's title,
// category, reading time and excerpt come from the post; the date format is
// code.
const t = fillPlaceholdersDeep(blogIndexContent);

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/blog",
});

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: t.seo.breadcrumb, href: "/blog" },
        ]}
      />
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/72">{t.hero.eyebrow}</p>
          <h1 className="text-ivory mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/85">
            {t.hero.body}
          </p>

          <ul className="mt-16 divide-y divide-ivory/15 border-y border-ivory/15">
            {sorted.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group grid gap-6 py-8 lg:grid-cols-12"
                >
                  <div className="lg:col-span-3">
                    <p className="eyebrow text-ivory/72">
                      {p.category} · {p.readingMinutes} {t.list.minRead}
                    </p>
                    <p className="mt-3 text-sm text-ivory/72">
                      {new Date(p.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="lg:col-span-9">
                    <h2 className="text-2xl font-light leading-tight tracking-tight text-ivory sm:text-3xl">
                      {p.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-ivory/85">
                      {p.excerpt}
                    </p>
                    <p className="mt-6 inline-flex items-center gap-2 eyebrow text-ivory transition group-hover:gap-3">
                      {t.list.readMore}
                      <ArrowIcon className="h-3 w-3 stroke-current" />
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CTA />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: t.seo.breadcrumb, url: "/blog" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${site.url}/blog#blog`,
            url: `${site.url}/blog`,
            name: t.seo.blogName,
            publisher: { "@id": `${site.url}/#business` },
            blogPost: sorted.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `${site.url}/blog/${p.slug}`,
              datePublished: p.publishedAt,
            })),
          },
        ]}
      />
    </>
  );
}
