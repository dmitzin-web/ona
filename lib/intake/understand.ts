// What a visitor typed or said, turned into the few facts the intake needs.
//
// This is a rule-based stand-in for a model: whatever replaces it later must
// return the same `Understood` shape. `safety()` below is NOT part of that
// swap — it runs on every request, whatever produced the understanding, and
// it is deliberately in code (not content) so nobody can soften a "leave the
// building" instruction from the admin by accident.

export type Intent = "water" | "fire" | "mold" | "insurance" | "remodel" | "commercial" | "unsure";

export type Understood = {
  intent: Intent;
  commercial: boolean;
  areas: string | null;
  source: string | null;
  stopped: "yes" | "no" | "unknown";
  started: string | null;
  carrier: string | null;
  estimate: boolean;
  approved: boolean;
  observed: string | null;
  items: string | null;
  fireOut: boolean;
  sewage: boolean;
  property: string | null;
};

const CARRIERS: [string, string][] = [
  ["state farm", "State Farm"], ["usaa", "USAA"], ["allstate", "Allstate"], ["farmers", "Farmers"],
  ["liberty mutual", "Liberty Mutual"], ["pemco", "PEMCO"], ["nationwide", "Nationwide"], ["progressive", "Progressive"],
  ["travelers", "Travelers"], ["safeco", "Safeco"], ["american family", "American Family"], ["geico", "GEICO"], ["chubb", "Chubb"],
];
const ROOMS: [RegExp, string][] = [
  [/kitchen/, "kitchen"], [/dining/, "dining room"], [/living room/, "living room"], [/family room/, "family room"],
  [/bath(room)?\b|vanity|shower|\btub\b/, "bathroom"], [/bedroom/, "bedroom"], [/basement/, "basement"],
  [/crawl ?space/, "crawlspace"], [/attic/, "attic"], [/garage/, "garage"], [/laundry|washing machine|\bwasher\b/, "laundry"],
  [/hallway|\bhall\b/, "hallway"], [/closet/, "closet"],
];
const SOURCES: [RegExp, string][] = [
  [/(washing machine|\bwasher\b).*(hose|supply)|(hose|supply line).*(washing machine|washer)/, "Washing machine supply line"],
  [/washing machine|\bwasher\b/, "Washing machine"], [/water heater|hot water tank/, "Water heater"], [/dishwasher/, "Dishwasher"],
  [/toilet/, "Toilet"], [/fridge|refrigerator|ice maker/, "Refrigerator line"], [/sewer|sewage|backed up|backup/, "Sewer backup"],
  [/pipe/, "Pipe"], [/sink|faucet/, "Sink"], [/roof/, "Roof"], [/sump/, "Sump pump"], [/shower|\btub\b/, "Shower / tub"],
  [/sprinkler/, "Sprinkler line"], [/rain|storm|groundwater/, "Storm / groundwater"],
];
const ITEMS: [RegExp, string][] = [
  [/cabinet/, "cabinets"], [/counter/, "countertops"], [/backsplash/, "backsplash"], [/floor/, "flooring"], [/\btile/, "tile"],
  [/shower/, "shower"], [/\btub\b/, "tub"], [/vanity/, "vanity"], [/island/, "island"], [/light/, "lighting"],
  [/layout|open (it )?up|wall/, "layout"], [/paint/, "paint"], [/window/, "windows"], [/appliance/, "appliances"],
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const count = (re: RegExp, t: string) => (t.match(re) ?? []).length;
const norm = (s: string) => ` ${s.toLowerCase().replace(/[’]/g, "'")} `;

export function understand(text: string, hint: Intent | "" = ""): Understood {
  const t = norm(text);
  const s = {
    water: count(/\b(water|leak\w*|flood\w*|pipe|burst|overflow\w*|drip\w*|soaked|wet|sump|sprinkler|washing machine|washer|dishwasher|water heater|sewer|sewage)\b/g, t),
    fire: count(/\b(fire|smoke|soot|burn\w*|flames?|charred)\b/g, t),
    mold: count(/\b(mold\w*|mould\w*|mildew|musty|fung\w*|fuzzy)\b|\b(black|dark|green|white|grey|gray) (spots?|patch\w*|stuff|growth)/g, t),
    ins: count(/\b(insurance|insurer|claim|adjuster|approved|reconstruction|state farm|usaa|allstate|farmers|liberty mutual|pemco|nationwide|progressive|travelers|safeco|american family|geico|chubb)\b/g, t),
    rem: count(/\b(remodel\w*|renovat\w*|redo|update|upgrade|new kitchen|new bathroom|design|addition|cabinets?|counter\w*|backsplash|layout|refresh|moderni\w+|would like|want to|wanna)\b/g, t),
    com: count(/\b(commercial|office|store|shop|restaurant|warehouse|tenants?|apartment building|complex|property manager|business|retail|hoa|units)\b/g, t),
  };
  const waterStrong = /(leak|flood|burst|overflow|drip|soaked|\bwet\b|coming through|on the floor|everywhere|sump|sewage|backed up)/.test(t);
  const insStrong = /(approved|estimate|reconstruction|mitigation|already (dried|dry)|repairs|rebuild|scope|adjuster)/.test(t);

  let intent: Intent | null = null;
  if (s.ins && insStrong && !/(still|right now|won'?t stop)/.test(t)) intent = "insurance";
  else if (s.fire) intent = "fire";
  else if (s.mold) intent = "mold";
  else if (s.rem && !waterStrong) intent = "remodel";
  else if (s.water) intent = "water";
  else if (s.ins) intent = "insurance";
  else if (s.rem) intent = "remodel";
  let commercial = s.com > 0;
  if (!intent) intent = hint && hint !== "unsure" ? hint : commercial ? "commercial" : "unsure";
  if (intent === "commercial") commercial = true;

  const rooms: string[] = [];
  for (const [re, name] of ROOMS) if (re.test(t) && !rooms.includes(name)) rooms.push(name);
  if (/ceiling/.test(t)) rooms.push(/(below|downstairs|underneath|lower)/.test(t) ? "ceiling below" : "ceiling");

  const stopped = /(shut (the |it |my |our )?(water |main |valve )?off|turned (the |it |our )?(water |main )?off|shut ?off the (water|valve|main)|stopped (it|the)|it stopped|valve (is )?(closed|off)|water is (now )?off|not leaking anymore|no longer leaking|it'?s off)/.test(t);
  const active = /(still (leaking|running|coming|pouring|spraying|dripping|going)|won'?t stop|can'?t (stop|shut|turn)|keeps (leaking|coming|running)|spraying|pouring|gushing|actively|right now)/.test(t);
  const ago = t.match(/(\d+|a few|few|a couple of|a couple|couple|an|a|one|two|three|half an)\s*(minutes?|mins?|hours?|hrs?|days?|weeks?)\s*ago/);
  const when = t.match(/(this morning|last night|yesterday|this afternoon|overnight|over the weekend|this weekend|last week)/);
  let carrier: string | null = null;
  for (const [k, v] of CARRIERS) if (t.includes(k)) carrier = v;
  const observed: string[] = [];
  if (/(found|see|saw|black|green|white|spots?|stain|discolou?r\w*|fuzzy|growth|patch|visible)/.test(t)) observed.push("Visible discoloration");
  if (/(musty|smell|odou?r)/.test(t)) observed.push("Musty odor");
  const items: string[] = [];
  for (const [re, name] of ITEMS) if (re.test(t) && !items.includes(name)) items.push(name);
  const prop = t.match(/\b(office|store|shop|restaurant|warehouse|apartment building|apartment complex|complex|retail space|church|school|clinic)\b/);

  return {
    intent,
    commercial,
    areas: rooms.length ? cap(rooms.join(" + ")) : null,
    source: SOURCES.find(([re]) => re.test(t))?.[1] ?? null,
    stopped: stopped ? "yes" : active ? "no" : "unknown",
    started: ago ? `~${ago[0].trim()}` : when ? cap(when[1]) : null,
    carrier,
    estimate: /(estimate|xactimate|scope)/.test(t),
    approved: /approved/.test(t),
    observed: observed.length ? observed.join(" + ") : null,
    items: items.length ? cap(items.join(", ")) : null,
    fireOut: /(out now|is out|put (it )?out|extinguished|fire department|firefighters)/.test(t),
    sewage: /(sewer|sewage|backed up|backup)/.test(t),
    property: prop ? cap(prop[1]) : null,
  };
}

/* ── Safety: deterministic, always runs, never edited from the admin ── */
export type Hazard = { id: string; title: string; steps: string[] };
const HAZARDS: (Hazard & { re: RegExp; unless?: RegExp })[] = [
  { id: "gas", re: /(smell(s|ing)? (of |like )?gas|gas (smell|leak|odou?r)|propane|rotten eggs?)/, title: "Possible gas leak",
    steps: ["Leave the building now and take everyone with you.", "Don’t switch lights or appliances on or off, or use anything that could spark.", "Once outside, call 911 or your gas utility’s emergency line."] },
  { id: "fire", re: /(on fire|flames?|fire is (still )?(burning|going|spreading)|still burning|active fire)/, unless: /(fire is out|put (it )?out|extinguished|no flames|was out)/, title: "Active fire",
    steps: ["Get everyone out now.", "Call 911 from outside.", "Don’t go back in until the fire department says it’s safe."] },
  { id: "smoke", re: /(heavy smoke|thick smoke|smoke everywhere|can'?t breathe|filling (up )?with smoke|full of smoke)/, title: "Heavy smoke",
    steps: ["Get everyone out into fresh air.", "Call 911.", "Don’t go back in until the fire department says it’s safe."] },
  { id: "elec", re: /(spark\w*|arcing|electrical (panel|box)|breaker (box|panel)|\bpanel\b[^.]{0,40}(water|wet|drip|leak)|(water|wet|drip\w*|leak\w*)[^.]{0,40}(electrical panel|breaker|outlet|socket|light fixture|\bpanel\b)|(outlet|socket|light fixture)[^.]{0,30}(water|wet|drip\w*)|buzzing|burning smell)/, title: "Possible electrical hazard",
    steps: ["Stay away from the affected area and keep others out.", "Don’t touch wet fixtures, outlets or the electrical panel.", "If there are sparks, smoke or a burning smell, leave and call 911."] },
  { id: "ceiling", re: /(ceiling (is |has |started )?(collaps\w*|sagg\w*|caving|falling|bulg\w*|coming down)|ceiling (fell|came down)|part of the ceiling)/, title: "The ceiling may come down",
    steps: ["Get everyone out of the room below and keep them out.", "Don’t poke or drain a bulging ceiling yourself.", "Shut off the water if you can reach the valve safely."] },
  { id: "struct", re: /(foundation (is )?(moving|shifting|cracking)|house (is )?(shifting|moving)|floor (is )?(giving way|collapsing|sinking)|walls? (is |are )?(cracking|moving|leaning|buckling)|structural (damage|movement))/, title: "Possible structural movement",
    steps: ["Leave the building.", "Call 911 if anything is moving or cracking right now.", "Don’t go back in until someone qualified says it’s safe."] },
];

export function safety(text: string): Hazard[] {
  const t = norm(text);
  return HAZARDS.filter((h) => h.re.test(t) && !(h.unless && h.unless.test(t))).map(({ id, title, steps }) => ({ id, title, steps }));
}
