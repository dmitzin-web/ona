import Link from "next/link";
import type { Service } from "@/lib/services";
import { serviceIcons } from "./icons/ServiceIcons";

// Compact variant of ServiceCard used in cross-link grids ("Other services").
// Kept as a separate component so styling of the two card variants stays
// independent — the full card has copy + CTA, the compact one is icon + title
// only, optimized for tight grids.
export function ServiceCardCompact({ service }: { service: Service }) {
  const Icon = serviceIcons[service.slug as keyof typeof serviceIcons];
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block bg-ivory p-6 transition hover:bg-charcoal hover:text-ivory"
    >
      {Icon && (
        <Icon className="h-8 w-8 stroke-current text-charcoal group-hover:text-ivory" />
      )}
      <p className="mt-6 text-lg font-medium tracking-tight">
        {service.shortName}
      </p>
    </Link>
  );
}
