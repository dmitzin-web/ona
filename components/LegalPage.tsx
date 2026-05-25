import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

type Section = { heading: string; body: string[] };

// Renders a legal/policy page. Optionally splits into two groups with a
// distinct section heading between them — used when a single policy URL
// needs to host two visually-distinct sections (e.g. company terms +
// website terms) without them blending into each other.
export function LegalPage({
  title,
  eyebrow,
  updated,
  sections,
  secondaryHeading,
  secondarySections,
  banner,
  breadcrumb,
}: {
  title: string;
  eyebrow: string;
  updated: string;
  sections: Section[];
  secondaryHeading?: string;
  secondarySections?: Section[];
  banner?: string;
  breadcrumb: { name: string; href: string }[];
}) {
  return (
    <>
      <Breadcrumbs items={breadcrumb} />
      <section className="bg-ivory">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-charcoal/60">{eyebrow}</p>
          <h1 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-sm text-charcoal/60">
            Last updated: {updated}
          </p>

          {banner && (
            <div className="mt-8 border-l-2 border-gold/60 bg-ivory-soft/60 px-5 py-4">
              <p className="eyebrow text-gold-deep">Draft</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                {banner}
              </p>
            </div>
          )}

          <div className="mt-12 space-y-12">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-2xl font-light tracking-tight">
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-charcoal/80">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {secondarySections && secondarySections.length > 0 && (
            <>
              <div className="mt-20 border-t border-charcoal/15 pt-12">
                {secondaryHeading && (
                  <p className="eyebrow text-gold-deep">{secondaryHeading}</p>
                )}
              </div>
              <div className="mt-8 space-y-12">
                {secondarySections.map((s) => (
                  <section key={s.heading}>
                    <h2 className="text-2xl font-light tracking-tight">
                      {s.heading}
                    </h2>
                    <div className="mt-4 space-y-4 text-base leading-relaxed text-charcoal/80">
                      {s.body.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <JsonLd
        data={breadcrumbJsonLd(
          breadcrumb.map((b) => ({ name: b.name, url: b.href })),
        )}
      />
    </>
  );
}
