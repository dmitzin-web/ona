import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { PhoneIcon } from "@/components/icons/ServiceIcons";
import {
  EmailLink,
  PhoneLink,
  SmsLink,
} from "@/components/contact/ContactLinks";
import { QuoteForm } from "./QuoteForm";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Request a Restoration Quote",
  description:
    "Send us a description and photos of the damage. We respond within the hour during business hours, same morning otherwise. No obligation. Or call (360) 823-3196 24/7 for emergencies.",
  path: "/quote",
});

const quoteFaqs = [
  {
    q: "How fast will I hear back after I submit this form?",
    a: "During business hours (Mon-Sat) we respond within one hour. After hours, we respond the next morning. If your loss is active or you're worried about ongoing damage, call (360) 823-3196 instead — dispatch is 24/7.",
  },
  {
    q: "Is the quote free, and am I committing to anything by requesting one?",
    a: "Yes — preliminary quotes are free and there is no obligation to proceed. We'll review your description and photos and come back with a written scope range. If we need an on-site inspection to firm up the number, that's typically free for losses we end up working on.",
  },
  {
    q: "Do you bill insurance directly?",
    a: "Yes. We document the loss in Xactimate format (the same system every major carrier uses) and bill the insurer directly so you don't front the cost. We coordinate with your adjuster from first notice of loss through final invoice.",
  },
  {
    q: "Can I send photos with this form, or should I email them separately?",
    a: "Email is easiest for photos — send them to " +
      site.email +
      " with your address in the subject line. We can also accept photos via text to the dispatch number. Wide shots of every affected room, close-ups of the source, and any standing water with a ruler in frame are the most useful.",
  },
  {
    q: "Do you handle remodeling projects without a prior loss?",
    a: "Yes — kitchen, bath, whole-house, and addition projects come to us directly, not only as a follow-on to restoration work. The same documentation discipline and craftsmanship apply either way.",
  },
];

export default function QuotePage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Get a quote", href: "/quote" },
        ]}
      />
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:px-10">
          <aside className="lg:col-span-4">
            <p className="eyebrow text-charcoal/60">Quote request</p>
            <h1 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
              Tell us what happened.
            </h1>
            <p className="mt-8 text-base leading-relaxed text-charcoal/75">
              Not an emergency? Use the form — we&apos;ll come back with a
              preliminary scope and next steps. For active losses please call
              instead.
            </p>

            <div className="mt-10 space-y-4 border-t border-charcoal/15 pt-8">
              <PhoneLink className="flex items-center gap-3 text-base font-medium text-charcoal hover:text-charcoal/70">
                <PhoneIcon className="h-5 w-5 stroke-current" />
                {site.phoneDisplay} · 24/7 dispatch
              </PhoneLink>
              <SmsLink className="flex items-center gap-3 text-base font-medium text-charcoal hover:text-charcoal/70">
                <span aria-hidden="true">✆</span> Text dispatch
              </SmsLink>
              <EmailLink className="flex items-center gap-3 text-base font-medium text-charcoal hover:text-charcoal/70">
                <span aria-hidden="true">@</span> {site.email}
              </EmailLink>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="border border-charcoal/15 bg-ivory p-8 lg:p-10">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      {/* What to include */}
      <section className="border-t border-line-light bg-ivory-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-charcoal/60">What to include</p>
          <h2 className="mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            Five things that get you an accurate quote faster.
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden border border-line-light bg-line-light md:grid-cols-2 lg:grid-cols-5">
            {[
              {
                title: "Property address",
                text: "Including the unit, gate code, or any access notes if it's not a single-family home.",
              },
              {
                title: "What happened",
                text: "Two sentences. Pipe burst, fire, mold discovered behind drywall, storm damage — whatever it is.",
              },
              {
                title: "When it happened",
                text: "Approximate date or time. Helps us assess whether it's still a mitigation window or a remediation scope.",
              },
              {
                title: "Photos",
                text: "Wide shots of each affected room, close-ups of the source, standing water with a ruler in frame.",
              },
              {
                title: "Insurance status",
                text: "Filed a claim yet? Adjuster assigned? We work with every major carrier directly.",
              },
            ].map((item, i) => (
              <li key={item.title} className="bg-ivory p-8">
                <p className="eyebrow text-charcoal/40">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-lg font-medium tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What happens next */}
      <section className="border-t border-line-light bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-charcoal/60">After you submit</p>
          <h2 className="mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            What happens next.
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden border border-line-light bg-line-light md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Review",
                text: "We read every quote request the same business day. Active losses get reviewed within the hour during business hours.",
              },
              {
                step: "2",
                title: "Preliminary scope",
                text: "We come back with a written response — what we think you're looking at, the rough range, and what we need to firm it up.",
              },
              {
                step: "3",
                title: "On-site inspection (if needed)",
                text: "For larger losses or remodels, we schedule a free on-site visit to scope properly. Typically within 48 hours.",
              },
              {
                step: "4",
                title: "Fixed-scope agreement",
                text: "Written agreement with a fixed scope and price before work begins. Insurance billing handled directly if applicable.",
              },
            ].map((s) => (
              <li key={s.step} className="bg-ivory p-8">
                <p className="eyebrow text-charcoal/40">Step {s.step}</p>
                <h3 className="mt-4 text-lg font-medium tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  {s.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Response times */}
      <section className="border-t border-line-light bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-warm-gray-soft">Response times</p>
          <h2 className="mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            When you&apos;ll hear back.
          </h2>
          <dl className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
            <div>
              <dt className="eyebrow text-ivory/55">Emergency phone</dt>
              <dd className="mt-4 text-3xl font-light tracking-tight">
                Immediate
              </dd>
              <p className="mt-3 text-xs leading-relaxed text-ivory/55">
                Live technician answer 24/7. Crew dispatched in minutes,
                on-site target 60 minutes anywhere in the Portland metro.
              </p>
            </div>
            <div>
              <dt className="eyebrow text-ivory/55">Quote form, business hours</dt>
              <dd className="mt-4 text-3xl font-light tracking-tight">
                ≤ 1 hour
              </dd>
              <p className="mt-3 text-xs leading-relaxed text-ivory/55">
                Mon-Sat, daytime. We acknowledge the request and either
                respond with a preliminary scope or schedule the inspection.
              </p>
            </div>
            <div>
              <dt className="eyebrow text-ivory/55">Quote form, after hours</dt>
              <dd className="mt-4 text-3xl font-light tracking-tight">
                Next morning
              </dd>
              <p className="mt-3 text-xs leading-relaxed text-ivory/55">
                Evenings, Sundays. We work through the overnight queue at
                the start of the next business day.
              </p>
            </div>
          </dl>
        </div>
      </section>

      <FAQ items={quoteFaqs} title="Quote questions" />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Quote", url: "/quote" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: `${site.url}/quote`,
            mainEntity: { "@id": `${site.url}/#business` },
          },
          faqJsonLd(quoteFaqs),
        ]}
      />
    </>
  );
}
