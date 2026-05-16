import { analysisCategories } from "@/lib/claimlens/config";

export function ClaimLensCategories() {
  return (
    <section className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-gold-soft">Analysis categories</p>
            <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
              What ClaimLens™ looks at.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/70">
              Every uploaded document is read against four lenses — the
              repair scope, the mitigation scope, the estimate logic, and the
              claim documents themselves.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-charcoal-mute bg-charcoal-mute lg:col-span-8 sm:grid-cols-2">
            {analysisCategories.map((cat) => (
              <div key={cat.key} className="bg-charcoal p-7">
                <p className="eyebrow text-ivory/50">{cat.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                  {cat.blurb}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="border border-ivory/15 px-2.5 py-1 text-xs text-ivory/80"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
