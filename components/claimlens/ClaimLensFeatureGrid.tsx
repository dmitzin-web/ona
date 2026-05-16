import { features } from "@/lib/claimlens/config";

export function ClaimLensFeatureGrid() {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-charcoal/60">What it does</p>
            <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
              From confusing estimate to clear claim insight.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal/75">
              Carrier estimates often use complex line items, abbreviations,
              depreciation tables, and limited explanations. ClaimLens™
              organizes the information into a clear, evidence-based report so
              you can understand what was included, what may be missing, and
              what questions to ask next.
            </p>
          </div>

          <ul className="grid gap-px overflow-hidden border border-line-light bg-line-light lg:col-span-7 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f.title} className="bg-ivory p-7">
                <p className="text-base font-medium tracking-tight text-charcoal">
                  {f.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  {f.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
