import Link from "next/link";
import type { Service } from "@/lib/services";
import { serviceIcons, ArrowIcon } from "./icons/ServiceIcons";

export function ServiceCard({
  service,
  tone = "light",
}: {
  service: Service;
  tone?: "light" | "dark";
}) {
  const Icon = serviceIcons[service.slug as keyof typeof serviceIcons];
  const dark = tone === "dark";

  return (
    <Link
      href={`/services/${service.slug}`}
      className={`group relative block border p-8 transition ${
        dark
          ? "border-charcoal-mute bg-charcoal text-ivory hover:border-ivory/40"
          : "border-line-light bg-ivory text-charcoal hover:border-charcoal"
      }`}
    >
      {Icon && (
        <Icon
          className={`h-10 w-10 stroke-current ${
            dark ? "text-warm-gray-soft" : "text-charcoal"
          }`}
        />
      )}
      <h3
        className={`mt-8 text-xl font-medium tracking-tight ${
          dark ? "text-ivory" : "text-charcoal"
        }`}
      >
        {service.shortName}
      </h3>
      <p
        className={`mt-4 text-sm leading-relaxed ${
          dark ? "text-ivory/70" : "text-charcoal/70"
        }`}
      >
        {service.hero}
      </p>
      <span
        className={`mt-8 inline-flex items-center gap-2 eyebrow ${
          dark ? "text-ivory/80" : "text-charcoal/80"
        }`}
      >
        Learn more
        <ArrowIcon className="h-3 w-3 stroke-current transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
