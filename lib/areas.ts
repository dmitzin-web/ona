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

export const areaProfiles: AreaProfile[] = [
  {
    slug: "vancouver-wa",
    name: "Vancouver",
    region: "WA",
    regionName: "Washington",
    county: "Clark County",
    population: "~196,000",
    driveMinutesFromHQ: 0,
    zips: ["98660", "98661", "98662", "98663", "98664", "98665", "98682", "98683", "98684", "98685"],
    neighborhoods: [
      "Downtown / Esther Short",
      "Uptown Village",
      "Fruit Valley",
      "Hazel Dell",
      "Cascade Park",
      "Fisher's Landing",
      "Felida",
    ],
    weatherPattern:
      "Cool, wet winters with prolonged saturation events; freezing rain and the occasional hard freeze drive burst-pipe losses every January.",
    commonLosses: [
      "Burst supply lines in unheated garages and crawlspaces after a January freeze",
      "Roof leaks during atmospheric river events",
      "Crawlspace moisture and mold from poor drainage in older Hazel Dell and Fruit Valley homes",
      "Sump-pump failures in basement remodels along the Columbia bluff",
    ],
    localNote:
      "We're headquartered in Vancouver, so this is our shortest dispatch — typically under 20 minutes anywhere in Clark County.",
  },
  {
    slug: "portland-or",
    name: "Portland",
    region: "OR",
    regionName: "Oregon",
    county: "Multnomah County",
    population: "~650,000",
    driveMinutesFromHQ: 20,
    zips: ["97201", "97202", "97203", "97204", "97205", "97209", "97210", "97211", "97212", "97213", "97214", "97215", "97216", "97217", "97218", "97219", "97220", "97221"],
    neighborhoods: [
      "Pearl District",
      "Northwest / Nob Hill",
      "Alphabet District",
      "Laurelhurst",
      "Irvington",
      "Sellwood-Moreland",
      "Hawthorne",
      "Mt. Tabor",
      "St. Johns",
      "Forest Park edge",
    ],
    weatherPattern:
      "Wet, mild winters; ice storms in the Columbia Gorge influence can hit east-side neighborhoods hard; summer wildfire smoke triggers HVAC and contents cleaning calls.",
    commonLosses: [
      "Frozen pipes in older Northwest and Northeast homes with inadequate insulation",
      "Sewer-line backups in flat sections of Sellwood and St. Johns during heavy rain",
      "Mold in mid-century daylight basements east of the Willamette",
      "Smoke and ash intrusion during wildfire season — particularly in older homes with leaky envelopes",
    ],
    localNote:
      "Crews cross the I-5 or I-205 bridge — we plan for bridge-lift delays during business hours and stage trucks accordingly.",
  },
  {
    slug: "beaverton-or",
    name: "Beaverton",
    region: "OR",
    regionName: "Oregon",
    county: "Washington County",
    population: "~97,000",
    driveMinutesFromHQ: 35,
    zips: ["97003", "97005", "97006", "97007", "97008", "97078"],
    neighborhoods: [
      "Central Beaverton",
      "Cedar Hills",
      "Cedar Mill",
      "Five Oaks",
      "Murray Hill",
      "Raleigh Hills",
      "South Beaverton",
    ],
    weatherPattern:
      "Tualatin Valley collects fog and standing humidity; mold pressure here is consistently higher than Portland proper.",
    commonLosses: [
      "Slow leaks in 1980s-era condo plumbing stacks",
      "Crawlspace mold in Cedar Mill ranches built on flat lots with marginal drainage",
      "Storm-driven tree impact in Forest Park-adjacent streets",
    ],
    localNote:
      "We handle a steady stream of HOA-managed condo and townhome claims here — we coordinate directly with property managers and HOA reserves.",
  },
  {
    slug: "hillsboro-or",
    name: "Hillsboro",
    region: "OR",
    regionName: "Oregon",
    county: "Washington County",
    population: "~107,000",
    driveMinutesFromHQ: 45,
    zips: ["97003", "97006", "97123", "97124"],
    neighborhoods: [
      "Tanasbourne",
      "Orenco Station",
      "Witch Hazel",
      "Reedville",
      "Downtown Hillsboro",
      "South Hillsboro",
    ],
    weatherPattern:
      "Heavier fog and frost pocket than Portland; January black-ice events drive ruptured-pipe losses in newer south Hillsboro builds.",
    commonLosses: [
      "Burst PEX lines in newer subdivisions after the first hard freeze",
      "Slab leaks in early-2000s tract homes",
      "Roof leaks from flat low-slope architecture in Orenco Station and Tanasbourne",
    ],
    localNote:
      "Many Hillsboro insureds are corporate-relocations and renters — we work with relocation management companies and corporate landlord portals when needed.",
  },
  {
    slug: "gresham-or",
    name: "Gresham",
    region: "OR",
    regionName: "Oregon",
    county: "Multnomah County",
    population: "~114,000",
    driveMinutesFromHQ: 35,
    zips: ["97030", "97080", "97233"],
    neighborhoods: [
      "Downtown Gresham",
      "Rockwood",
      "Centennial",
      "Mt. Hood Community area",
      "Pleasant Valley",
    ],
    weatherPattern:
      "East metro takes the brunt of Columbia Gorge wind and ice events — Gresham sees three to four major weather emergencies per winter.",
    commonLosses: [
      "Ice-storm tree-impact losses every January–February",
      "Wind-driven rain intrusion in older Rockwood-area rentals",
      "Frozen pipe ruptures during gorge wind events",
    ],
    localNote:
      "Gresham is the east-metro emergency zone during winter storms — we pre-stage trucks at the Gateway and 181st area when warnings issue.",
  },
  {
    slug: "tigard-or",
    name: "Tigard",
    region: "OR",
    regionName: "Oregon",
    county: "Washington County",
    population: "~55,000",
    driveMinutesFromHQ: 40,
    zips: ["97223", "97224"],
    neighborhoods: [
      "Downtown Tigard",
      "Bull Mountain",
      "Summerlake",
      "Metzger",
      "King City edge",
    ],
    weatherPattern:
      "Bull Mountain elevation sees freeze events that Tigard proper misses; runoff from the hill drives Fanno Creek flooding in extreme rain.",
    commonLosses: [
      "Hillside drainage failures and basement seepage on Bull Mountain",
      "Frozen-pipe ruptures in unheated garages along Walnut Street",
      "Aged galvanized-pipe failures in 1970s Summerlake homes",
    ],
    localNote:
      "Crews route via Highway 99W or I-5 depending on time of day; we monitor PortlandTraffic.com before dispatch.",
  },
  {
    slug: "lake-oswego-or",
    name: "Lake Oswego",
    region: "OR",
    regionName: "Oregon",
    county: "Clackamas County",
    population: "~40,000",
    driveMinutesFromHQ: 45,
    zips: ["97034", "97035"],
    neighborhoods: [
      "First Addition",
      "Lake Grove",
      "Westlake",
      "Old Town",
      "Mountain Park",
      "Lakeview Village",
    ],
    weatherPattern:
      "Lakefront humidity and dense tree canopy increase mold pressure year-round; tree-on-house impact during winter wind events is the dominant catastrophic loss.",
    commonLosses: [
      "Lakefront homes with chronic moisture intrusion in finished basements",
      "Catastrophic tree-impact losses in Mountain Park during November–February",
      "High-value contents claims — fine art, custom millwork, antiques",
    ],
    localNote:
      "Lake Oswego work calls for dedicated white-glove contents handling and on-site security protocols — these are our defaults here.",
  },
  {
    slug: "camas-wa",
    name: "Camas",
    region: "WA",
    regionName: "Washington",
    county: "Clark County",
    population: "~28,000",
    driveMinutesFromHQ: 20,
    zips: ["98607"],
    neighborhoods: [
      "Downtown Camas",
      "Prune Hill",
      "Grass Valley",
      "Lacamas Lake area",
      "Forest Home",
    ],
    weatherPattern:
      "Camas sits at the western edge of the Columbia Gorge — gorge-wind events here are more severe than anywhere else in Clark County.",
    commonLosses: [
      "Wind-driven roof and siding damage during east-wind events",
      "Tree-impact losses on Prune Hill",
      "Slab-leak detection in newer Grass Valley construction",
    ],
    localNote:
      "Camas is a 20-minute dispatch for us — a natural east-Clark coverage target with gorge-weather patterns we plan for in dispatch and equipment staging.",
  },
  {
    slug: "battle-ground-wa",
    name: "Battle Ground",
    region: "WA",
    regionName: "Washington",
    county: "Clark County",
    population: "~22,000",
    driveMinutesFromHQ: 30,
    zips: ["98604"],
    neighborhoods: [
      "Downtown Battle Ground",
      "Meadow Glade",
      "Lewisville",
      "Salmon Creek area",
      "Hockinson edge",
    ],
    weatherPattern:
      "Higher elevation than Vancouver — overnight freezes happen 5–10 nights more per winter, driving more frozen-pipe calls per capita.",
    commonLosses: [
      "Frozen pipes in rural property unheated outbuildings",
      "Well-system contamination after flooding",
      "Septic system backflow into finished basements",
    ],
    localNote:
      "Rural Battle Ground means well-and-septic systems — we coordinate with WA-licensed septic contractors when sewage backup is the loss.",
  },
  {
    slug: "salmon-creek-wa",
    name: "Salmon Creek",
    region: "WA",
    regionName: "Washington",
    county: "Clark County",
    population: "~22,000",
    driveMinutesFromHQ: 15,
    zips: ["98686"],
    neighborhoods: [
      "Salmon Creek",
      "Felida edge",
      "Cougar Creek",
      "Mountain View",
    ],
    weatherPattern:
      "North-Vancouver pocket — slightly cooler than downtown Vancouver, prone to flash-flooding on Salmon Creek and its tributaries during atmospheric river events.",
    commonLosses: [
      "Creek-flood losses in lower-lying properties during heavy rain",
      "Storm drainage backups during atmospheric river events",
      "Roof failures on 1990s-era subdivision builds reaching end of shingle life",
    ],
    localNote:
      "Salmon Creek is one of our shortest dispatches — crews can typically be on-site in 15 minutes from our Vancouver base.",
  },
];

export const findAreaProfile = (slug: string) =>
  areaProfiles.find((a) => a.slug === slug);
