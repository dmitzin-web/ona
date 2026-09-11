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
};

// City details live in content/areas.json and are edited through the
// admin (/admin → Cities). Static import — see lib/site.ts.
export const areaProfiles: AreaProfile[] = areasContent as AreaProfile[];

export const findAreaProfile = (slug: string) =>
  areaProfiles.find((a) => a.slug === slug);
