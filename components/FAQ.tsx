export function FAQ({
  items,
  title = "Frequently asked questions",
}: {
  items: { q: string; a: string }[];
  title?: string;
}) {
  return (
    <section className="bg-ivory text-charcoal">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <p className="eyebrow text-charcoal/60">FAQ</p>
          <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            {title}
          </h2>
        </div>
        <dl className="lg:col-span-8">
          {items.map((item, i) => (
            <details
              key={item.q}
              className={`group border-charcoal/20 py-6 ${
                i === 0 ? "border-t" : ""
              } border-b [&[open]_[data-faq-toggle]]:rotate-45`}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium tracking-tight text-charcoal">
                <span>{item.q}</span>
                <span
                  data-faq-toggle
                  aria-hidden="true"
                  className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center text-2xl font-light leading-none text-charcoal transition-transform duration-200"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-charcoal/75">
                {item.a}
              </p>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
