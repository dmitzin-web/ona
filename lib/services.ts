import servicesContent from "../content/services.json";

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  title: string;
  description: string;
  hero: string;
  intro: string;
  body: { heading: string; paragraphs: string[] }[];
  process: { step: string; text: string }[];
  signs: string[];
  /** Services this one links to, chosen in the admin. Empty = the others. */
  related?: string[];
  faqs: { q: string; a: string }[];
};

// The service pages' copy lives in content/services.json and is edited
// through the admin (/admin → Services). Static import — see lib/site.ts.
export const services: Service[] = servicesContent as Service[];

export const RESTORATION_SLUGS = [
  "water-damage",
  "fire-damage",
  "storm-damage",
] as const;
export const MOLD_SLUG = "mold-removal";
export const REMODELING_SLUG = "remodeling";

export const restorationServices = services.filter((s) =>
  RESTORATION_SLUGS.includes(s.slug as (typeof RESTORATION_SLUGS)[number]),
);
export const moldService = services.find((s) => s.slug === MOLD_SLUG)!;
export const remodelingService = services.find(
  (s) => s.slug === REMODELING_SLUG,
)!;

export const findService = (slug: string) =>
  services.find((s) => s.slug === slug);

// The services shown beside this one at the bottom of its city pages.
// Chosen in the admin (Services → Services linked from this one); with
// nothing chosen, the others in their usual order.
export function relatedServices(service: Service, count = 3): Service[] {
  const chosen = (service.related ?? [])
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => !!s && s.slug !== service.slug);
  return (chosen.length ? chosen : services.filter((s) => s.slug !== service.slug)).slice(0, count);
}
