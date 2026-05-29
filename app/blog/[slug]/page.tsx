import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons/ServiceIcons";
import { findPost, posts, type PostSection } from "@/lib/posts";
import { services } from "@/lib/services";
import { areaProfiles } from "@/lib/areas";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

// Map post category → primary service slug. Used to surface the right
// programmatic service×city pages in the "Get help near you" block at the
// end of each post. Insurance posts don't map to a single service so they
// surface water-damage (the most common loss type) as a default.
const CATEGORY_TO_SERVICE: Record<string, string> = {
  Water: "water-damage",
  Fire: "fire-damage",
  Mold: "mold-removal",
  Storm: "storm-damage",
  Insurance: "water-damage",
  Remodeling: "remodeling",
};

// Top-of-mind cities for the "Get help near you" block. Three cities surfaced
// per post — local-leaning so the user clicking from a Portland-focused post
// lands in the highest-intent programmatic page.
const HIGHLIGHT_CITIES = ["vancouver-wa", "portland-or", "camas-wa"];

// Parses markdown-style inline links: "...text [label](/url) more text..."
// Returns an array of strings and { text, href } objects for the renderer.
// Internal-link only (href must start with "/") — external links are kept as
// plain text to keep blog content unambiguously internal.
function parseInlineLinks(text: string) {
  const re = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  const out: Array<string | { text: string; href: string }> = [];
  let cursor = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > cursor) out.push(text.slice(cursor, idx));
    out.push({ text: m[1], href: m[2] });
    cursor = idx + m[0].length;
  }
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

function renderInline(text: string) {
  const parts = parseInlineLinks(text);
  if (parts.length === 1 && typeof parts[0] === "string") return parts[0];
  return parts.map((part, i) =>
    typeof part === "string" ? (
      <span key={i}>{part}</span>
    ) : (
      <Link
        key={i}
        href={part.href}
        className="underline decoration-charcoal/30 underline-offset-4 transition hover:decoration-charcoal"
      >
        {part.text}
      </Link>
    ),
  );
}

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
          className="mt-14 text-3xl font-light leading-tight tracking-tight text-ivory sm:text-4xl"
        >
          {s.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={i}
          className="mt-10 text-xl font-medium tracking-tight text-ivory"
        >
          {s.text}
        </h3>
      );
    case "p":
      return (
        <p
          key={i}
          className="mt-5 text-lg leading-relaxed text-ivory/85"
        >
          {renderInline(s.text)}
        </p>
      );
    case "list":
      return (
        <ul
          key={i}
          className="mt-5 space-y-2 border-l border-ivory/15 pl-5"
        >
          {s.items.map((item, j) => (
            <li key={j} className="text-base leading-relaxed text-ivory/80">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    case "ordered":
      return (
        <ol
          key={i}
          className="mt-5 list-decimal space-y-2 pl-6 text-base leading-relaxed text-ivory/80 marker:text-ivory/40"
        >
          {s.items.map((item, j) => (
            <li key={j} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <aside
          key={i}
          className="mt-8 border-l-2 border-ivory bg-charcoal-soft p-6 text-base leading-relaxed text-ivory"
        >
          {renderInline(s.text)}
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

  // Build the "Get help near you" block — three programmatic city×service
  // pages plus the parent service hub. Drives link juice from the blog post
  // (which earns external links from how-to searches) into the high-intent
  // programmatic landing pages that actually convert to phone calls.
  const serviceSlug = CATEGORY_TO_SERVICE[post.category] ?? "water-damage";
  const service = services.find((s) => s.slug === serviceSlug);
  const cityLinks = HIGHLIGHT_CITIES.map((slug) =>
    areaProfiles.find((a) => a.slug === slug),
  ).filter((a): a is NonNullable<typeof a> => a != null);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <article className="bg-charcoal">
        <header className="mx-auto max-w-3xl px-6 pb-16 pt-12 lg:px-10">
          <p className="eyebrow text-ivory/60">
            {post.category} · {post.readingMinutes} min read
          </p>
          <h1 className="mt-6 text-4xl font-light leading-[1.1] tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-ivory/75">
            {post.excerpt}
          </p>
          <p className="mt-10 text-sm text-ivory/60">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · By {post.author.name}
          </p>
        </header>

        <div className="mx-auto max-w-3xl px-6 pb-20 lg:px-10">
          <div className="border-t border-ivory/15 pt-2">
            {post.sections.map(renderSection)}
          </div>
        </div>
      </article>

      {service && (
        <section className="border-t border-ivory/10 bg-charcoal">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
            <p className="eyebrow text-ivory/60">Get help near you</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-light leading-tight tracking-tight sm:text-4xl">
              {service.shortName} in your part of the Portland metro.
            </h2>
            <ul className="mt-10 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
              {cityLinks.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/services/${service.slug}/${a.slug}`}
                    className="flex h-full flex-col justify-between gap-6 bg-charcoal p-6 transition hover:bg-ivory hover:text-charcoal"
                  >
                    <div>
                      <p className="eyebrow opacity-60">
                        {a.name}, {a.region}
                      </p>
                      <p className="mt-3 text-base font-medium tracking-tight">
                        {service.shortName} in {a.name}
                      </p>
                    </div>
                    <p className="inline-flex items-center gap-2 eyebrow">
                      Service area <ArrowIcon className="h-3 w-3 stroke-current" />
                    </p>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/services/${service.slug}`}
                  className="flex h-full flex-col justify-between gap-6 bg-charcoal p-6 text-ivory transition hover:bg-ivory-soft"
                >
                  <div>
                    <p className="eyebrow text-ivory/60">All locations</p>
                    <p className="mt-3 text-base font-medium tracking-tight">
                      Full {service.shortName.toLowerCase()} overview
                    </p>
                  </div>
                  <p className="inline-flex items-center gap-2 eyebrow">
                    Read more <ArrowIcon className="h-3 w-3 stroke-current" />
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        </section>
      )}

      {post.faqs && <FAQ items={post.faqs} title="Questions we hear" />}

      {others.length > 0 && (
        <section className="bg-charcoal-soft">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
            <p className="eyebrow text-ivory/60">More from the field</p>
            <ul className="mt-8 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/blog/${o.slug}`}
                    className="block bg-charcoal p-6 transition hover:bg-ivory hover:text-charcoal"
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
            author: post.author.name === site.name
              ? {
                  "@type": "Organization",
                  name: post.author.name,
                  "@id": `${site.url}/#business`,
                }
              : {
                  "@type": "Person",
                  "@id": `${site.url}/about#founder`,
                  name: post.author.name,
                  jobTitle: post.author.title,
                  worksFor: { "@id": `${site.url}/#business` },
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
