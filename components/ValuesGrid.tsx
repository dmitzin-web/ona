import { site } from "@/lib/site";
import { valueIcons } from "./icons/ServiceIcons";

export function ValuesGrid({
  tone = "dark",
}: {
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <section
      className={
        dark ? "bg-charcoal text-ivory" : "bg-charcoal text-ivory"
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <p
          className={`eyebrow ${dark ? "text-warm-gray-soft" : "text-ivory/60"}`}
        >
          Brand values
        </p>
        <h2 className="mt-6 max-w-2xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
          What guides every job.
        </h2>

        <ul
          className={`mt-16 grid grid-cols-1 gap-px overflow-hidden border md:grid-cols-3 lg:grid-cols-5 ${
            dark
              ? "border-ivory/15 bg-charcoal-mute"
              : "border-ivory/10 bg-charcoal/10"
          }`}
        >
          {site.values.map((v) => {
            const Icon = valueIcons[v.key as keyof typeof valueIcons];
            return (
              <li
                key={v.key}
                className={`flex flex-col gap-6 p-8 ${
                  dark ? "bg-charcoal" : "bg-charcoal"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`h-9 w-9 stroke-current ${
                      dark ? "text-warm-gray-soft" : "text-ivory"
                    }`}
                  />
                )}
                <div>
                  <h3 className="text-lg font-medium tracking-tight">
                    {v.title}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      dark ? "text-ivory/65" : "text-ivory/65"
                    }`}
                  >
                    {v.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
