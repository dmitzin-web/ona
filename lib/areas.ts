import areasContent from "../content/areas.json";

// Local profiles for each service-area city.
// These give every /areas/[slug] page genuinely unique content — neighborhoods,
// ZIP codes, county, weather pattern, common loss drivers — instead of a
// templated wall of text. This is what keeps Google from treating them as
// doorway pages.

export type AreaProfile = {
  slug: string;
  name: string;
  region: "WA" | "OR";
  regionName: string;
  county: string;
  population: string;
  driveMinutesFromHQ: number;
  zips: string[];
  neighborhoods: string[];
  weatherPattern: string;
  commonLosses: string[];
  localNote: string;
  /** Cities this one links to, chosen in the admin. Empty = the nearest. */
  nearby?: string[];
};

// City details live in content/areas.json and are edited through the
// admin (/admin → Cities). Static import — see lib/site.ts.
export const areaProfiles: AreaProfile[] = areasContent as AreaProfile[];

export const findAreaProfile = (slug: string) =>
  areaProfiles.find((a) => a.slug === slug);

// Which cities a city's pages link to at the bottom. The admin picks them
// (Cities → Cities linked from this one) and the order is the order they
// were picked; with nothing picked we fall back to the cities closest by
// drive time, which is what a person would choose anyway — and is at least
// a reason, unlike "the first three in the file".
export function nearbyCities(area: AreaProfile, count = 3): AreaProfile[] {
  const chosen = (area.nearby ?? [])
    .map((slug) => areaProfiles.find((a) => a.slug === slug))
    .filter((a): a is AreaProfile => !!a && a.slug !== area.slug);
  if (chosen.length) return chosen.slice(0, count);
  return [...areaProfiles]
    .filter((a) => a.slug !== area.slug)
    .sort(
      (x, y) =>
        Math.abs(x.driveMinutesFromHQ - area.driveMinutesFromHQ) -
          Math.abs(y.driveMinutesFromHQ - area.driveMinutesFromHQ) || x.name.localeCompare(y.name),
    )
    .slice(0, count);
}
