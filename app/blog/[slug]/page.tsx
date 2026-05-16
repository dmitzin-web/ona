import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons/ServiceIcons";
import { findPost, posts, type PostSection } from "@/lib/posts";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

function renderSection(s: PostSection, i: number) {
  switch (s.kind) {
    case "h2":
      return (
        <h2
          key={i}
          className="mt-14 text-3xl font-light leading-tight tracking-tight text-charcoal sm:text-4xl"
        >
          {s.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={i}
          className="mt-10 text-xl font-medium tracking-tight text-charcoal"
        >
          {s.text}
        </h3>
      );
    case "p":
      return (
        <p
          key={i}
          className="mt-5 text-lg leading-relaxed text-charcoal/85"
        >
          {s.text}
        </p>
      );
    case "list":
      return (
        <ul
          key={i}
          className="mt-5 space-y-2 border-l border-charcoal/15 pl-5"
        >
          {s.items.map((item, j) => (
            <li key={j} className="text-base leading-relaxed text-charcoal/80">
              {item}
            </li>
          ))}
        </ul>
      );
    case "ordered":
      return (
        <ol
          key={i}
          className="mt-5 list-decimal space-y-2 pl-6 text-base leading-relaxed text-charcoal/80 marker:text-charcoal/40"
        >
          {s.items.map((item, j) => (
            <li key={j} className="pl-1">
              {item}
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <aside
          key={i}
          className="mt-8 border-l-2 border-charcoal bg-ivory-soft p-6 text-base leading-relaxed text-charcoal"
        >
          {s.text}
        </aside>
      );
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <article className="bg-ivory">
        <header className="mx-auto max-w-3xl px-6 pb-16 pt-12 lg:px-10">
          <p className="eyebrow text-charcoal/60">
            {post.category} · {post.readingMinutes} min read
          </p>
          <h1 className="mt-6 text-4xl font-light leading-[1.1] tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-charcoal/75">
            {post.excerpt}
          </p>
          <p className="mt-10 text-sm text-charcoal/60">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · By {post.author.name}
          </p>
        </header>

        <div className="mx-auto max-w-3xl px-6 pb-20 lg:px-10">
          <div className="border-t border-charcoal/15 pt-2">
            {post.sections.map(renderSection)}
          </div>
        </div>
      </article>

      {post.faqs && <FAQ items={post.faqs} title="Questions we hear" />}

      {others.length > 0 && (
        <section className="bg-ivory-soft">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
            <p className="eyebrow text-charcoal/60">More from the field</p>
            <ul className="mt-8 grid gap-px overflow-hidden border border-line-light bg-line-light sm:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/blog/${o.slug}`}
                    className="block bg-ivory p-6 transition hover:bg-charcoal hover:text-ivory"
                  >
                    <p className="eyebrow opacity-60">{o.category}</p>
                    <p className="mt-3 text-base font-medium tracking-tight">
                      {o.title}
                    </p>
                    <p className="mt-4 inline-flex items-center gap-2 eyebrow">
                      Read <ArrowIcon className="h-3 w-3 stroke-current" />
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CTA />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${site.url}/blog/${post.slug}#article`,
            headline: post.title,
            description: post.description,
            mainEntityOfPage: `${site.url}/blog/${post.slug}`,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt ?? post.publishedAt,
            author: {
              "@type": "Organization",
              name: post.author.name,
              "@id": `${site.url}/#business`,
            },
            publisher: { "@id": `${site.url}/#business` },
            articleSection: post.category,
            timeRequired: `PT${post.readingMinutes}M`,
            image: `${site.url}/opengraph-image`,
          },
          ...(post.howTo
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "HowTo",
                  name: post.howTo.name,
                  description: post.howTo.description,
                  totalTime: `PT${post.readingMinutes}M`,
                  step: post.howTo.steps.map((s, i) => ({
                    "@type": "HowToStep",
                    position: i + 1,
                    name: s.name,
                    text: s.text,
                  })),
                },
              ]
            : []),
          ...(post.faqs ? [faqJsonLd(post.faqs)] : []),
        ]}
      />
    </>
  );
}
