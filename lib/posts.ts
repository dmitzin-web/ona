// Blog post catalog. Add new posts here — pages, sitemap, blog index and
// llms-full.txt all pick them up automatically.

export type PostSection =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "ordered"; items: string[] }
  | { kind: "callout"; text: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: "Water" | "Fire" | "Mold" | "Storm" | "Insurance";
  readingMinutes: number;
  publishedAt: string; // ISO date
  updatedAt?: string;
  author: { name: string; title: string };
  sections: PostSection[];
  faqs?: { q: string; a: string }[];
  // If the post is structured as a step-by-step guide, populate this to emit
  // schema.org/HowTo JSON-LD.
  howTo?: { name: string; description: string; steps: { name: string; text: string }[] };
};

export const posts: Post[] = [
  {
    slug: "atmospheric-river-prep-checklist-vancouver-wa",
    title:
      "Atmospheric River Prep Checklist for Vancouver, WA Homeowners",
    description:
      "An IICRC-certified restoration contractor's prep playbook for the 24 hours before an atmospheric river hits Vancouver, WA and the Portland metro — the seven things that matter, and the four that don't.",
    excerpt:
      "We see the same three losses every January and February: roof intrusion at the same valleys, basement seepage in the same neighborhoods, and downspout failures at the same five-foot setback. The forecast gives you 48-72 hours of warning. Here's what to actually do with it.",
    category: "Storm",
    readingMinutes: 8,
    publishedAt: "2026-05-16",
    author: { name: "Dmitry Zinovyev", title: "Founder, ONA Restoration" },
    sections: [
      {
        kind: "p",
        text: "Atmospheric rivers are now the dominant winter weather event in the Pacific Northwest. We get four to seven per season, and the worst of them deliver three to six inches of rain in 24 hours on saturated ground. The damage profile we see after each event is almost identical: same valleys leaking, same basements seeping, same downspouts overwhelmed. Most of it is preventable in the day before the event with two hours of work. This is the checklist we send our own clients when the forecast lights up.",
      },
      {
        kind: "callout",
        text: "If a flood watch or warning is already in effect for Clark or Multnomah county, focus on the first three items below — the rest matters less once water is actively landing. If the event is still 48-72 hours out, do everything.",
      },
      { kind: "h2", text: "What to do in the 48 hours before" },
      { kind: "h3", text: "1. Clear every gutter and downspout" },
      {
        kind: "p",
        text: "The number-one cause of roof intrusion we see is a clogged downspout. Water backs up in the gutter, overflows behind the fascia, runs down the wall cavity, and shows up in the ceiling below two days later — long after the homeowner blames the storm. A two-hour gutter clean before a forecast event prevents this entirely. Pay particular attention to gutters under deciduous trees (fir-needle pileup at the elbow is the most common failure point in this region) and to valley downspouts on multi-pitch roofs.",
      },
      { kind: "h3", text: "2. Check every downspout discharge point" },
      {
        kind: "p",
        text: "Downspouts that discharge within five feet of the foundation are the number-one cause of basement and crawlspace water intrusion in the Portland metro. A six-foot flexible extension at each downspout, aimed away from the foundation and pitched downhill, costs $30 and prevents the most common basement-water call we run.",
      },
      { kind: "h3", text: "3. Walk the perimeter and identify the low spots" },
      {
        kind: "p",
        text: "Look at the ground next to your foundation. If it slopes toward the house anywhere, water will pool there and find a path inside. You don't need to regrade in 24 hours — but you do need to know where the puddles will form so you can place sandbags or temporary diversion before they get critical. Pay attention to window wells, basement entries, and any cellar door.",
      },
      { kind: "h3", text: "4. Inspect roof penetrations and valleys" },
      {
        kind: "p",
        text: "Vent boots, skylights, chimney flashing, and the valleys between roof pitches are where roof intrusion starts. From the ground with binoculars (don't climb a wet roof) check for visible flashing damage, lifted shingles, or dark patches that suggest existing moisture. If you can see daylight where you shouldn't, call a roofer that day — emergency tarping is much cheaper than the rebuild after three inches of water gets inside.",
      },
      { kind: "h3", text: "5. Test the sump pump and battery backup" },
      {
        kind: "p",
        text: "Pour a five-gallon bucket of water into the sump pit and verify the pump cycles on and discharges. If you have a battery backup (you should, in this region), confirm it activates when you disconnect mains power. Forty percent of the basement-flood calls we run during major events trace back to a sump pump that wasn't tested before the season started.",
      },
      { kind: "h3", text: "6. Pull anything valuable off basement floors" },
      {
        kind: "p",
        text: "Books, electronics, family photos, art, anything porous and irreplaceable — get it onto shelves, off the floor, or out of the basement entirely. Even a half-inch of intrusion is enough to total a stack of stored boxes that sat in standing water for six hours.",
      },
      { kind: "h3", text: "7. Document everything before the storm" },
      {
        kind: "p",
        text: "Walk through your property with your phone camera and shoot the interior of every room, the exterior of every wall, the basement, the garage, and the yard. If a claim comes out of the event, this is your before-state evidence. It takes ten minutes and it has saved insurance claims for several of our clients when the adjuster questioned the pre-existing condition of a damaged item.",
      },
      { kind: "h2", text: "What not to bother with" },
      {
        kind: "p",
        text: "Some prep advice gets repeated every winter that doesn't actually change outcomes much in this region. Skip these unless you have unusual exposure:",
      },
      {
        kind: "list",
        items: [
          "Boarding up windows. Pacific Northwest atmospheric rivers don't produce the wind-driven debris that justifies window protection. Skip unless you're in a wildland edge where falling-branch risk is real.",
          "Stocking sandbags for whole-house perimeters. Sandbags are point solutions for known leak paths (basement entries, low garages, identified low-grade sections). A perimeter of sandbags around a slab-on-grade house does nothing.",
          "Filling the bathtub for drinking water. We do not lose municipal water to atmospheric river events in this region. Save the prep time for actual loss-reduction work.",
          "Generators for a 24-hour outage. Most atmospheric river outages in the metro are under 24 hours; refrigerator and freezer contents survive that without intervention. Reserve generator prep for genuinely long-duration outages like the 2024 ice storm.",
        ],
      },
      { kind: "h2", text: "What to do during the event" },
      {
        kind: "p",
        text: "Once the rain is falling hard, your work has shifted from prevention to monitoring. Walk the basement and crawlspace every two hours. Watch the lowest spots in the yard. If you see standing water near the foundation, an active leak inside the envelope, or your sump pump running continuously without keeping up, that's the threshold for emergency response.",
      },
      {
        kind: "p",
        text: "Document any intrusion immediately with photos and video. The faster you document, the cleaner the insurance claim. Don't disturb materials yet — wet drywall, soaked carpet, and saturated framing all need to be assessed before anyone starts cutting and bagging.",
      },
      { kind: "h2", text: "When to call us" },
      {
        kind: "p",
        text: "Standing water of any depth in a finished space, active intrusion through ceiling, wall, or foundation, or a sump pump that has been running continuously for more than four hours — all of those are restoration calls, not later-this-week calls. We dispatch 24/7 across Vancouver, WA and the Portland metro with a 60-minute on-site target. We tarp, extract, dry, and document — and we coordinate with your insurance carrier from the first hour.",
      },
    ],
    howTo: {
      name: "Prepare a Pacific Northwest home for an atmospheric river event",
      description:
        "A seven-step prep checklist for the 48 hours before a major rain event in Vancouver, WA and the Portland metro.",
      steps: [
        {
          name: "Clear gutters and downspouts",
          text: "Fir-needle pileup at the elbow is the most common failure point in this region. A clogged downspout is the leading cause of roof-cavity intrusion.",
        },
        {
          name: "Extend downspout discharge points 5+ feet from foundation",
          text: "Discharges within five feet are the leading cause of basement and crawlspace water intrusion. Flexible extensions cost $30 each.",
        },
        {
          name: "Walk the perimeter and identify low spots",
          text: "Look for slope toward the foundation, pooled water locations, window wells and basement entries. Sandbag the known leak paths only.",
        },
        {
          name: "Inspect roof penetrations and valleys from the ground",
          text: "Vent boots, skylights, chimney flashing, valley intersections. Don't climb a wet roof; call a roofer for emergency tarping if needed.",
        },
        {
          name: "Test the sump pump and battery backup",
          text: "Pour a five-gallon bucket into the sump pit. Verify pump cycles and battery backup activates. 40% of major-event basement floods trace to untested sumps.",
        },
        {
          name: "Pull valuables off basement floors",
          text: "Books, photos, electronics, art — onto shelves, out of harm's way. Even half an inch of standing water totals porous items in hours.",
        },
        {
          name: "Document property condition before the storm",
          text: "Wide shots of every room, exterior wall, basement, yard. Ten-minute walk-through that becomes evidence if a claim is filed afterward.",
        },
      ],
    },
    faqs: [
      {
        q: "How much warning do we usually get for an atmospheric river?",
        a: "Atmospheric rivers are forecast 5-10 days out by NOAA's Climate Prediction Center, with high-confidence positioning typically 48-72 hours before landfall. The local NWS office (portland.weather.gov) issues flood watches when the forecast crosses thresholds for your county. Sign up for Clark or Multnomah county emergency alerts for hyper-local timing.",
      },
      {
        q: "Will my homeowners insurance cover water that comes in during a storm?",
        a: "Wind-driven rain entering through a damaged building element (lifted shingle, broken window, breached siding) is generally covered under standard HO-3 policies. Surface water rising up from the ground or groundwater seeping in is generally not covered without separate NFIP flood insurance. The cause documentation determines coverage, which is why photographing the entry path matters.",
      },
      {
        q: "Should I file an insurance claim if the damage is small?",
        a: "Calculate your deductible. If the documented mitigation + rebuild cost is below your deductible, filing a claim only hurts your future premium for no benefit. If it's above, file. We can give you a no-obligation scope range before you make the decision.",
      },
      {
        q: "What's the worst atmospheric river the Portland metro has had?",
        a: "The November 2021 event delivered approximately 6 inches in 72 hours across parts of Clark and Multnomah counties and produced the highest restoration-call volume we've ever logged. Damage was concentrated in older daylight basements and homes with deferred roof maintenance. The lesson: regular maintenance does more to reduce loss than any in-storm response.",
      },
      {
        q: "Do I need flood insurance in Vancouver or Portland?",
        a: "Standard homeowners policies do not cover flood. NFIP flood insurance is available for any address and is required by lenders in designated high-risk zones. Many homeowners in the Portland metro carry it voluntarily because atmospheric river runoff can produce ground-water intrusion even in non-floodplain locations. A $300-$700 annual NFIP policy is cheap compared to a $40,000 finished-basement flood.",
      },
    ],
  },
  {
    slug: "iicrc-s500-explained-for-homeowners",
    title:
      "IICRC S500 Explained for Vancouver, WA Homeowners",
    description:
      "The industry standard that governs every legitimate water-damage restoration project in the US — what S500 actually requires, why it determines your insurance claim outcome, and how to verify your contractor follows it.",
    excerpt:
      "Most homeowners have never heard of IICRC S500, and most contractors don't volunteer it. But it's the standard your insurance adjuster judges the work against, and the difference between a job done to S500 and a job done to whatever the contractor felt like is usually thousands of dollars on your final claim.",
    category: "Water",
    readingMinutes: 9,
    publishedAt: "2026-05-15",
    author: { name: "Dmitry Zinovyev", title: "Founder, ONA Restoration" },
    sections: [
      {
        kind: "p",
        text: "If you have water damage and an insurance claim, the work done in your house is being measured against IICRC S500 whether you know it or not. The Institute of Inspection, Cleaning and Restoration Certification's Standard and Reference Guide for Professional Water Damage Restoration is the document every adjuster, every claims supervisor, and every halfway-competent restoration contractor in North America works from. Knowing what it requires gives you the same vocabulary they have — and it lets you spot a job that won't survive review.",
      },
      { kind: "h2", text: "What S500 is, and isn't" },
      {
        kind: "p",
        text: "S500 is a consensus standard published and updated by the IICRC, an industry-wide certification body. It defines the categories of water loss, the classes of damage, the methods of mitigation, the documentation required, and the criteria for completion. It is not a law — there is no S500 inspector who will fine your contractor for skipping a step. But every major insurance carrier references S500 in their claim handling, every IICRC-certified contractor commits to it, and most disputes between adjusters and contractors get resolved by reference to it.",
      },
      {
        kind: "p",
        text: "When we say we run jobs to S500, that means specific things — categorization, monitoring cadence, drying targets, documentation. Here's the homeowner version.",
      },
      { kind: "h2", text: "Categories: how dirty is the water" },
      { kind: "h3", text: "Category 1 — clean water" },
      {
        kind: "p",
        text: "Water from a sanitary source — a supply line, a melted ice maker, rainwater that hasn't contacted surfaces. Category 1 losses can be mitigated and dried without replacing porous materials in most cases, provided drying starts within 24-48 hours before the water deteriorates to Category 2.",
      },
      { kind: "h3", text: "Category 2 — gray water" },
      {
        kind: "p",
        text: "Water with significant contamination — dishwasher overflow, washing machine discharge, toilet overflow with urine but no feces, hydrostatic seepage through unsealed foundation. Porous materials that absorbed Category 2 water (drywall, insulation, carpet pad) generally must be removed. Wood framing can usually be cleaned, dried, and treated with antimicrobial.",
      },
      { kind: "h3", text: "Category 3 — black water" },
      {
        kind: "p",
        text: "Water with grossly unsanitary contamination — sewage backup, flood water from outside the structure, toilet overflow with feces, standing water that has been sitting long enough to grow bacterial colonies. All porous materials in contact with Category 3 water must be removed and disposed of as contaminated waste. Containment, PPE, and EPA-registered antimicrobial protocols apply. The cost and timeline of a Category 3 job are dramatically higher than Categories 1 or 2.",
      },
      {
        kind: "p",
        text: "Water can degrade between categories with time. Category 1 becomes Category 2 within 24-48 hours; Category 2 becomes Category 3 within 72 hours. This is the single most important reason restoration response time matters: every hour of delay potentially upgrades the category and the cost.",
      },
      { kind: "h2", text: "Classes: how much got wet" },
      {
        kind: "p",
        text: "Where Category measures contamination, Class measures scope. Class 1 is small — a part of one room, mostly minimal absorption. Class 4 is a whole-house event with deep saturation of low-permeance materials (hardwood, plaster, masonry). The class determines drying equipment quantity and duration; a Class 4 job needs aggressive equipment (multiple commercial dehumidifiers, dozens of air movers, possibly desiccant systems) and may take two to four weeks to dry to standard. The wrong equipment count on a Class 3 or 4 job is the single most common reason \"finished\" restorations come back with mold growth weeks later.",
      },
      { kind: "h2", text: "What S500 requires during a job" },
      { kind: "h3", text: "Initial inspection and moisture mapping" },
      {
        kind: "p",
        text: "A documented inspection within hours of arrival, including thermal imaging, penetrating moisture meters, and a written assessment of the category and class. This isn't optional — without it, the rest of the work has no baseline.",
      },
      { kind: "h3", text: "Documented daily monitoring" },
      {
        kind: "p",
        text: "Daily moisture readings on every affected material, recorded on a moisture log that an adjuster can audit. Equipment adjustments tracked. Photos of progress on each visit. If your contractor isn't showing you moisture readings, they're not running to S500.",
      },
      { kind: "h3", text: "Drying to standard, not to deadline" },
      {
        kind: "p",
        text: "Materials are considered dry when their moisture content matches an unaffected reference sample of the same material in the same building. Not \"feels dry,\" not \"looks dry,\" not \"the seven-day timeline is up.\" If the reference reads 11% and the affected wall reads 14%, drying continues. This is the single biggest variable in restoration quality.",
      },
      { kind: "h3", text: "Antimicrobial application matched to category" },
      {
        kind: "p",
        text: "EPA-registered antimicrobials approved for each category of water. Application rate, contact time, and personal protective equipment all defined. Generic spray-bottle treatment doesn't qualify.",
      },
      { kind: "h3", text: "Documented completion" },
      {
        kind: "p",
        text: "Final moisture readings on every affected material, dated and signed. A completion certificate. This is the document your insurance carrier needs to close the claim cleanly and the document you need if a related issue surfaces months later.",
      },
      { kind: "h2", text: "How to verify your contractor actually follows S500" },
      {
        kind: "p",
        text: "Five questions to ask any restoration contractor in the first phone call:",
      },
      {
        kind: "ordered",
        items: [
          "Are your technicians IICRC WRT or ASD certified? (Water Damage Restoration Technician, Applied Structural Drying.) The certificate names should be specific.",
          "Will you provide a written moisture map with the initial inspection? (Yes is the only correct answer.)",
          "How often will you take and record moisture readings? (Daily is the standard during active drying.)",
          "What dry standard will you target? (\"Reference sample matching\" is the right answer. \"Until the meter reads under 15%\" is acceptable. \"Until it feels dry\" is not.)",
          "Will I receive a completion certificate with the final moisture readings? (Yes is required.)",
        ],
      },
      {
        kind: "p",
        text: "A contractor who can answer these five questions clearly is running to S500. One who deflects or substitutes \"we know what we're doing\" probably isn't.",
      },
      { kind: "h2", text: "Where ONA fits in" },
      {
        kind: "p",
        text: "Our crews carry IICRC WRT, ASD, and AMRT certifications, and we run every water-damage job to S500 from the first hour. The documentation that S500 requires happens to be the same documentation your insurance adjuster wants and the same documentation that overturns denied claims on appeal — so it's not extra work, it's the work. If you'd like a second opinion on a job in progress that you suspect isn't being run to standard, we do free document reviews for losses we don't end up working on.",
      },
    ],
    faqs: [
      {
        q: "Is IICRC S500 a law or a regulation?",
        a: "No. S500 is a consensus industry standard, not a government regulation. There is no licensing body that requires it. But every major insurance carrier uses it as the reference standard for water-damage claims, and most disputes resolve by reference to it. Following S500 is what professional restoration looks like in 2026; not following it is what gets a contractor flagged on appeal.",
      },
      {
        q: "How long does IICRC certification take, and what does WRT vs ASD mean?",
        a: "WRT (Water Damage Restoration Technician) is a 19-hour foundational certification. ASD (Applied Structural Drying) is a follow-on 28-hour advanced certification focused on drying science. AMRT (Applied Microbial Remediation Technician) covers mold remediation under S520. A senior restoration technician typically holds all three.",
      },
      {
        q: "Do all restoration contractors follow S500?",
        a: "No. IICRC certification is voluntary, and many smaller or franchise contractors hold the credential but don't run jobs to the standard day-to-day. The difference shows up in the documentation — a job run to S500 produces a moisture map, daily logs, and a completion certificate. A job run to convenience produces an invoice and a hope-for-the-best.",
      },
      {
        q: "What is Category 3 water and why does it cost so much more?",
        a: "Category 3 (black water) is grossly unsanitary — sewage, outside flood water, or water that has degraded over time. S500 requires removal of all porous materials in contact with Category 3 water (drywall, insulation, carpet pad, sometimes subfloor), full containment with HEPA filtration, certified-technician protocols, and EPA-registered antimicrobial. A Category 1 job dries in place; a Category 3 job demolishes and reconstructs. The cost difference is typically 3-5x for the same square footage.",
      },
      {
        q: "Can I refuse demolition that my contractor recommends?",
        a: "Yes — you control the work in your own house. But if the contractor is recommending demolition because S500 requires it for the category and class assessed, refusing usually means the carrier won't honor a future claim related to growth or odor in the materials that should have been removed. The right path is to ask for the S500-referenced reasoning in writing, then make an informed decision. Competent contractors will provide it.",
      },
    ],
  },
  {
    slug: "usaa-water-damage-claim-playbook",
    title:
      "USAA Water Damage Claim Playbook for Pacific Northwest Losses",
    description:
      "An IICRC-certified restoration contractor's guide to filing and winning a USAA water-damage claim in Washington and Oregon — what USAA's claim process looks like from inside, what they pay quickly, and what they push back on.",
    excerpt:
      "USAA generally pays clean water-damage claims faster than any other major carrier we work with. But there are three specific places USAA pushes back where the same claim with State Farm or Allstate would pay in full — and three places they're more generous than peers. Knowing which is which gets you a full settlement in a fraction of the time.",
    category: "Insurance",
    readingMinutes: 8,
    publishedAt: "2026-05-14",
    author: { name: "Dmitry Zinovyev", title: "Founder, ONA Restoration" },
    sections: [
      {
        kind: "p",
        text: "We run a steady volume of USAA-insured losses across the Portland metro — Pearl District condo bursts, Lake Oswego daylight basements, military retirees in Camas with twenty-year USAA tenure. USAA is one of the better insurance experiences a homeowner can have on a water loss, but there are still three patterns in their claim handling that catch policyholders off guard. This is what we tell our own USAA clients during the first-on-site briefing.",
      },
      {
        kind: "callout",
        text: "If your loss is active right now, call USAA at 1-800-531-USAA (8722) to file the first notice of loss before anything else. They open 24/7. The phone tree gets you to a property adjuster faster than the app.",
      },
      { kind: "h2", text: "What USAA does well" },
      { kind: "h3", text: "Fast first-notice response" },
      {
        kind: "p",
        text: "USAA typically dispatches an adjuster within 24 hours on a residential water loss, which is among the fastest in the industry. For commonly-cited losses (burst supply line, water heater rupture, dishwasher hose), the initial advance payment to start mitigation is often authorized over the phone the same day. We've started work the morning after the loss with the advance check in hand more times than we can count.",
      },
      { kind: "h3", text: "Direct payment to contractor on request" },
      {
        kind: "p",
        text: "USAA will pay directly to the restoration contractor with a homeowner authorization, which keeps the cash-flow burden off the policyholder. Not every carrier offers this; State Farm, for instance, defaults to paying the homeowner. With USAA the form takes five minutes and removes a major friction point.",
      },
      { kind: "h3", text: "Reasonable on Xactimate pricing" },
      {
        kind: "p",
        text: "USAA's pricing database tracks the regional Xactimate price publication closely, and their adjusters rarely push back hard on standard line items. Compare to carriers with proprietary modifiers that often produce contested estimates below the regional Xactimate baseline. If your contractor's scope matches Xactimate format and pricing, the negotiation with USAA is usually minimal.",
      },
      { kind: "h2", text: "Three places USAA pushes back" },
      { kind: "h3", text: "1. \"Was this sudden?\" — the seepage question" },
      {
        kind: "p",
        text: "Like every carrier, USAA's first filter on a water claim is whether the loss was sudden and accidental versus continuous seepage. They are more thorough than most about asking when the homeowner first noticed the leak, how long the previous-month water bill differed, and whether neighbors or other residents reported anything. If the adjuster believes the loss has been progressing for weeks or months, the claim is denied as excluded long-term seepage. Mitigation: document the discovery moment carefully and have the contractor's cause-and-origin opinion explicitly address why this was sudden, not chronic.",
      },
      { kind: "h3", text: "2. Mold sublimit" },
      {
        kind: "p",
        text: "USAA in Washington and Oregon typically writes a $5,000 mold sublimit on standard HO-3 policies, with optional buy-up to $10,000-$25,000 that most policyholders don't take. If mold appears alongside the water damage, the mold remediation portion is capped at the sublimit regardless of the underlying water loss being covered. This catches people by surprise because the water portion may pay $30,000 while the mold portion is capped at $5,000. Mitigation: check your sublimit when you renew, not when you have a loss.",
      },
      { kind: "h3", text: "3. Content depreciation on ACV-only items" },
      {
        kind: "p",
        text: "USAA's contents settlement uses moderate depreciation curves on electronics, furniture, and rugs. For items where the policy pays ACV (Actual Cash Value) rather than RCV (Replacement Cost Value), the settlement can feel low — a five-year-old leather sofa might depreciate to 50% of its original price, even if the replacement cost today is similar. Some USAA policies pay RCV after the homeowner replaces and submits receipts; verify your policy language before assuming the first check is the final settlement.",
      },
      { kind: "h2", text: "What to tell USAA on the first call" },
      {
        kind: "p",
        text: "When you file the first notice of loss, USAA's intake script asks a specific set of questions. Have the answers ready:",
      },
      {
        kind: "ordered",
        items: [
          "Date and time of discovery. (Not \"sometime this week\" — name the day.)",
          "Source of water. (Specific component: burst angle stop under master bath sink, ruptured supply line at washing machine, etc.)",
          "Rooms and approximate square footage affected. (You don't need to be precise — \"master bath, master bedroom, hallway, downstairs ceiling — roughly 400 sq ft\" is enough.)",
          "Whether you have already engaged a restoration contractor. (If yes, name the contractor. USAA will not push you toward their preferred vendor if you've already engaged a qualified contractor.)",
          "Whether anyone is displaced. (Loss of use coverage kicks in if you need to relocate.)",
        ],
      },
      {
        kind: "p",
        text: "The adjuster's first decision is whether to approve emergency mitigation immediately or wait for the on-site visit. The cleaner your initial story, the faster that decision goes the right way.",
      },
      { kind: "h2", text: "How we work with USAA losses" },
      {
        kind: "p",
        text: "Every USAA-insured loss we run gets the same package: thermal imaging on the first visit, daily moisture logs, Xactimate-formatted scope on day two, direct billing to USAA if the homeowner authorizes, and a closing packet with completion certificates and final photos. We've had USAA close mid-five-figure claims in under three weeks when the documentation is right. If you're a USAA member with an active water loss in the Portland metro, call us first — we'll have the scope to your adjuster before they're back at their desk.",
      },
    ],
    faqs: [
      {
        q: "Does USAA require me to use their preferred restoration vendor?",
        a: "No. USAA's Preferred Contractor Network (PCN) is offered as a convenience, not a requirement. You have the right to choose any qualified restoration contractor, and your settlement is the same either way. The PCN's main advantage is paperwork simplicity for USAA, not better outcomes for you. Independent IICRC-certified contractors typically produce more thorough documentation than franchise PCN vendors.",
      },
      {
        q: "Will filing a USAA water-damage claim raise my premium?",
        a: "USAA, like most carriers, considers loss history at renewal. A single water-damage claim in a multi-year tenure typically has minimal premium impact. Multiple water claims within a short period (especially seepage-style claims) can result in non-renewal at term end. The threshold is closer to three water claims in five years than one, but verify with your USAA agent.",
      },
      {
        q: "How long do I have to file a USAA water-damage claim?",
        a: "USAA requires prompt notice of loss, which they generally interpret as within days of discovery, not weeks or months. The policy itself sets a one-year limitation on filing suit on the claim, but the practical filing window is much shorter. File the first notice the same day you discover the loss, even if you haven't decided what to do next — the FNOL only opens the claim, it doesn't commit you to anything.",
      },
      {
        q: "Will USAA pay for temporary housing during restoration?",
        a: "Yes — Additional Living Expense (ALE) or Loss of Use coverage typically pays reasonable additional housing costs if your home is uninhabitable during restoration. The 'reasonable' threshold is the cost above your normal living expense, not the full hotel bill. Keep receipts, save grocery receipts (since you can't cook), and submit a clean expense report with the final claim.",
      },
      {
        q: "What if USAA denies my water-damage claim?",
        a: "Same path as any carrier denial: request the claim file, get an independent contractor's inspection and Xactimate scope, file a written appeal citing specific policy language and presenting new documentation, then escalate to the Washington OIC or Oregon DCBS if the appeal is denied. Our blog post on appealing State Farm denials (which applies equally to USAA and other carriers) walks through the process.",
      },
    ],
  },
  {
    slug: "mold-behind-drywall-5-steps",
    title:
      "Found Mold Behind Drywall? Five Steps Before You Call Anyone",
    description:
      "An IICRC AMRT-certified contractor explains exactly what to do in the first hour after discovering mold inside a wall — and the three things that turn a $3,000 remediation into a $20,000 one.",
    excerpt:
      "Most homeowners discover mold the same way: they pulled a baseboard, opened a closet, or kicked a hole in soft drywall. What happens in the next hour decides whether you're looking at a contained remediation or a whole-home decontamination.",
    category: "Mold",
    readingMinutes: 7,
    publishedAt: "2026-05-19",
    author: { name: "Dmitry Zinovyev", title: "Founder, ONA Restoration" },
    sections: [
      {
        kind: "p",
        text: "It always starts the same way. A homeowner is replacing a baseboard, chasing a stain on a closet ceiling, or pulling out a vanity that has rocked since they moved in — and they see it. Black, green, or white growth on the back of the drywall, sometimes spreading across the insulation, sometimes blooming on the framing behind. The instinct is to grab a bottle of bleach and start scrubbing. That instinct will cost you four to ten thousand dollars on average. Here is the sequence we walk our own clients through when they call from the hallway floor with a hole in the wall and a phone full of photos.",
      },
      {
        kind: "callout",
        text: "If you have respiratory symptoms, an immunocompromised household member, or visible growth larger than about ten square feet, stop reading and call a remediation contractor. The IICRC S520 standard considers that scope a containment-required job and DIY response is not appropriate.",
      },
      { kind: "h2", text: "Step one: stop disturbing the area" },
      {
        kind: "p",
        text: "The single biggest mistake we see is the homeowner cutting more drywall to \"see how far it goes.\" Mold spores are inert when they sit on a saturated substrate; they aerosolize the moment you disturb the material. Every cut, every push on a soft section of drywall, every attempt to peel back insulation releases millions of spores into the air handler, the closet, the master bedroom. By the time we arrive, the contamination footprint is now ten times the original.",
      },
      {
        kind: "p",
        text: "Close the door to the affected room if you can. Turn off the HVAC at the thermostat. Don't run any fans. Don't open the window — that creates a pressure differential that pulls air across the contaminated surface and into the rest of the house. Leave the room exactly as you found it.",
      },
      { kind: "h2", text: "Step two: find the moisture source" },
      {
        kind: "h3", text: "Why the moisture, not the mold, is the problem" },
      {
        kind: "p",
        text: "Mold is a moisture problem. The growth is a symptom; the leak, the condensation, the seepage is the cause. Remediation without solving the moisture source is a guarantee that the mold will return within four to twelve weeks. The first thing a competent remediation contractor will do is find the water — and if you can find it before you call, you save yourself an hour and your contractor saves you money.",
      },
      { kind: "h3", text: "Where to look" },
      {
        kind: "list",
        items: [
          "Plumbing penetration above or behind the wall: angle stops, supply lines, drain lines, dishwasher and washing-machine connections.",
          "Roof intersection above the wall: valleys, vent boots, chimney flashing, parapet caps. Look for water staining on the ceiling in the room above.",
          "Window or door flashing: water intrusion at the head, sill, or jamb. Look for paint bubbles, rust on the framing nails, or rotted trim.",
          "Foundation seepage on basement and crawlspace walls: especially common in older Portland homes built on clay soil.",
          "HVAC condensate line or AC unit above the wall: failed condensate pump, clogged primary drain, or saturated insulation around ductwork.",
          "Bathroom waterproofing failure: shower-pan leaks, failed grout, or a tile floor pitched away from the drain.",
        ],
      },
      {
        kind: "p",
        text: "Take photos of every candidate. Don't fix anything yet — your insurance claim will hinge on the documentation of the cause.",
      },
      { kind: "h2", text: "Step three: photograph everything before you call" },
      {
        kind: "p",
        text: "Open your phone's camera and shoot:",
      },
      {
        kind: "list",
        items: [
          "Wide shots of the affected room and the wall with the growth visible.",
          "Close-ups of the growth itself, in good light. Include a coin, a ruler, or your hand for scale.",
          "The moisture source if you found one — the leaking valve, the failed flashing, the wet spot above.",
          "The HVAC return closest to the affected room (this matters for cross-contamination assessment).",
          "Any visible water damage in surrounding rooms — staining on ceilings, warping baseboards, rust on door frames.",
          "The exterior of the structure on the side of the affected wall, especially if the moisture source is roof or foundation.",
        ],
      },
      {
        kind: "p",
        text: "These photos serve three purposes: they let a remediation contractor scope the job before driving out, they document the cause for your insurance carrier, and they create a permanent record in case something changes between your discovery and the inspection.",
      },
      { kind: "h2", text: "Step four: decide whether to test before remediating" },
      {
        kind: "p",
        text: "For small visible growth (under ten square feet) caused by an identified moisture source, you don't need a third-party test — a competent remediation contractor can scope the job from the visible damage. But there are three situations where you should hire an independent Indoor Environmental Professional (IEP) before any remediation work begins.",
      },
      { kind: "h3", text: "When to test first" },
      {
        kind: "list",
        items: [
          "The visible growth is larger than ten square feet or spans multiple rooms.",
          "Someone in the household has respiratory symptoms, allergies, or is immunocompromised — you need air sampling to establish what is actually airborne.",
          "Your insurance claim is in dispute — independent third-party documentation strengthens an appeal and removes the contractor-incentive question.",
        ],
      },
      {
        kind: "p",
        text: "An IEP test costs $400 to $900 in the Portland metro and includes both air sampling and surface sampling, plus a written remediation protocol that ties the scope to the findings. The same IEP returns at the end of the job to verify clearance independently. We coordinate this on most jobs above the small-loss threshold; you do not need to find an IEP yourself if you call us first.",
      },
      { kind: "h2", text: "Step five: call a remediation contractor (not a maid service)" },
      {
        kind: "p",
        text: "The biggest mistake on a moderate-size mold loss is calling a general cleaning company, a handyman, or worse, a friend with a wet vacuum. Mold remediation is governed by the IICRC S520 standard and requires:",
      },
      {
        kind: "list",
        items: [
          "Poly-sheeting containment with negative-air HEPA filtration so spores don't escape into the rest of the house.",
          "AMRT-certified technicians who know substrate-specific protocols (drywall vs framing vs insulation vs porous contents).",
          "Decontamination chambers for technicians entering and exiting the contained area.",
          "EPA-registered antimicrobial application matched to the contamination level.",
          "Documented moisture remediation — the source has to be solved before reconstruction.",
          "Third-party clearance verification when the job is anything beyond very small scale.",
        ],
      },
      {
        kind: "p",
        text: "A general contractor without IICRC AMRT certification will skip most of these. They'll cut out drywall, throw it in the dumpster, spray something visible, and rebuild. The mold will return within months because the moisture source wasn't solved and the air didn't get filtered. That's the $20,000 second job we get called for after the first contractor disappears.",
      },
      { kind: "h2", text: "What you should expect when you call us" },
      {
        kind: "p",
        text: "We'll ask for the photos, the address, and a thirty-second description. For small visible growth from an identified moisture source, we can usually quote the work over the phone and have a crew on site within 48 hours. For anything larger, we schedule a free on-site inspection within 24-48 hours and produce a written protocol with a fixed-scope estimate before any demolition. Insurance billing is direct to the carrier; you do not front the cost.",
      },
      {
        kind: "p",
        text: "If you're in Vancouver, WA or anywhere in the Portland metro and you're reading this with a hole in your wall and a phone full of photos, the number is at the top of the page. We answer 24/7.",
      },
    ],
    howTo: {
      name: "Respond to mold discovered behind drywall",
      description:
        "A five-step homeowner playbook from an IICRC AMRT-certified remediation contractor — what to do in the first hour after finding mold inside a wall.",
      steps: [
        {
          name: "Stop disturbing the area",
          text: "Close the door to the affected room, turn off the HVAC, don't run fans or open windows. Every disturbance aerosolizes spores into the rest of the house.",
        },
        {
          name: "Find and document the moisture source",
          text: "Mold is a moisture problem. Check plumbing penetrations, roof intersections, window flashing, foundation seepage, HVAC condensate, and bathroom waterproofing. Photograph candidates without fixing anything.",
        },
        {
          name: "Photograph everything before calling for help",
          text: "Wide shots of the room, close-ups of the growth with scale, the moisture source if found, the nearest HVAC return, and the exterior wall.",
        },
        {
          name: "Decide whether to hire an independent IEP test",
          text: "Test first if the growth is over 10 sq ft, anyone in the household has respiratory symptoms, or the insurance claim is in dispute. Otherwise scope from visible damage.",
        },
        {
          name: "Call an IICRC AMRT-certified remediation contractor",
          text: "Not a maid service, not a general handyman. Containment, HEPA filtration, certified technicians, EPA-registered antimicrobial, moisture-source repair, and clearance verification — that's the IICRC S520 standard.",
        },
      ],
    },
    faqs: [
      {
        q: "Is bleach enough to kill mold on drywall?",
        a: "No. Bleach addresses surface coloration on non-porous materials, but drywall is porous and the mold colonies inside the paper liner survive surface treatment. Bleach also doesn't solve the underlying moisture source, which is what allowed growth in the first place. Improper DIY treatment usually makes the eventual remediation more expensive.",
      },
      {
        q: "How long after a water leak does mold start growing?",
        a: "Mold can begin growing on wet drywall, insulation and other porous materials within 24-48 hours of saturation. After 72 hours of continuous moisture, mold growth becomes very likely. After two weeks, the contamination is usually well-established and the loss has moved from water mitigation to mold remediation.",
      },
      {
        q: "Will my homeowners insurance cover mold remediation?",
        a: "It depends on the policy and the cause. Mold from a sudden, covered water loss (burst pipe, appliance failure) is often covered up to a sublimit — typically $5,000-$10,000 in Washington and Oregon. Mold from long-term seepage or maintenance neglect is generally excluded. The cause documentation is what determines coverage, which is why photographing the moisture source matters.",
      },
      {
        q: "How much does mold remediation cost in the Portland metro?",
        a: "Small contained jobs (single wall, identified source, no air-quality issues) run $1,500-$4,000. Mid-size jobs with containment, HEPA filtration, and third-party clearance typically run $4,000-$12,000. Whole-house decontamination or jobs requiring HVAC remediation run $15,000-$40,000+. The single biggest cost driver is whether the contamination escaped to other rooms before remediation began.",
      },
      {
        q: "Do I need to leave the house during remediation?",
        a: "For small contained jobs in a non-bedroom area, usually no. For jobs that involve the HVAC, multiple rooms, or anyone in the household with respiratory sensitivity, we recommend relocating during the active demolition and filtration phases (typically 2-5 days). Most homeowner policies include additional-living-expenses coverage for displacement during covered remediation.",
      },
    ],
  },
  {
    slug: "pacific-northwest-mold-season",
    title:
      "Pacific Northwest Mold Season: When Humidity Hits the Danger Zone",
    description:
      "When mold growth actually accelerates in the Portland metro, why it isn't when most homeowners think, and the four indoor environments that fail every Pacific Northwest winter.",
    excerpt:
      "Most homeowners assume mold is a summer problem because that's when it's hottest. In the Pacific Northwest, the opposite is true. The most aggressive mold growth happens between November and March — and there are specific reasons your house gets vulnerable in the rainy season.",
    category: "Mold",
    readingMinutes: 8,
    publishedAt: "2026-05-18",
    author: { name: "Dmitry Zinovyev", title: "Founder, ONA Restoration" },
    sections: [
      {
        kind: "p",
        text: "Mold has two requirements: a food source (anything containing cellulose — drywall paper, framing, insulation, fabrics, paper, dust) and moisture. The food source is in every house. What changes seasonally in the Pacific Northwest is the moisture, and unlike the rest of the country, our high-moisture months are not summer. They run from late October through March, and the way they hit a house is specific enough that you can predict where the growth will appear before you find it.",
      },
      { kind: "h2", text: "Why the Pacific Northwest is a mold microclimate" },
      {
        kind: "p",
        text: "Three factors compound here that don't compound the same way in other US regions:",
      },
      {
        kind: "list",
        items: [
          "Outdoor relative humidity above 80% for five consecutive months. Most of the country gets short humidity spikes; we get a sustained one.",
          "Mild winter temperatures (45-55°F outside, 60-68°F inside) that are inside mold's optimal growth range. Colder climates freeze mold out for half the year; we don't.",
          "Older housing stock with marginal envelope sealing — Portland and Vancouver have a significant share of pre-1960 homes where insulation is uneven, vapor barriers are missing, and crawlspace ventilation is inadequate.",
        ],
      },
      {
        kind: "p",
        text: "Add atmospheric rivers, persistent fog in the Tualatin and Willamette valleys, and a regional preference for tightly-sealed energy-efficient remodels without matching ventilation upgrades, and you have the conditions that produce more mold remediation work per capita than almost any other US metro.",
      },
      { kind: "h2", text: "When the danger window actually opens" },
      {
        kind: "p",
        text: "We see the first mold remediation call volumes spike in mid-November and peak in late February — about three to four months after the first sustained wet weather. That lag is the time it takes for accumulated indoor humidity to migrate through wall cavities, condense in cooler interior surfaces, and produce visible growth.",
      },
      {
        kind: "p",
        text: "The mistake homeowners make is treating mold as an acute event — \"there's a stain, I should clean it.\" In the Pacific Northwest, by the time you see surface staining, the growth has been progressing for weeks behind paint or drywall. Address the underlying moisture problem early in the season and you prevent the visible problem entirely.",
      },
      { kind: "h2", text: "The four indoor environments that fail every winter" },
      { kind: "h3", text: "1. Crawlspaces with poor drainage" },
      {
        kind: "p",
        text: "Pacific Northwest crawlspaces are usually unconditioned, partially vented, and built on clay or compacted soil that holds water during the wet season. The combination of high relative humidity, cool ground temperatures, and exposed wood framing creates ideal mold growth conditions on the underside of subfloors and joists. Most homeowners never look in their crawlspace; the mold has often been growing for three to five years before it's discovered during a real estate inspection or a flooring replacement.",
      },
      {
        kind: "p",
        text: "The fix is encapsulation: a sealed vapor barrier on the soil, sealed crawlspace vents, and a dehumidifier sized for the volume. Cost range is $4,000-$9,000 in the Portland metro depending on crawlspace size and existing condition.",
      },
      { kind: "h3", text: "2. Bathrooms without adequate ventilation" },
      {
        kind: "p",
        text: "A shower releases 1-2 pints of water as vapor in a typical use. If the bathroom fan isn't sized correctly (50 CFM minimum, 80 CFM for larger bathrooms) and isn't actually vented to the exterior (not just into the attic, which is a common older-construction shortcut), that vapor condenses on cool exterior walls and behind the cold-water side of the plumbing. Growth shows up on the ceiling behind the shower head, on the wall behind the toilet tank, and in the upper corners of the room.",
      },
      {
        kind: "p",
        text: "Verify your fan is vented through the roof or sidewall, not into the attic. Run it during every shower and for 15-20 minutes afterward. If you have visible staining starting, the fan is undersized or improperly vented.",
      },
      { kind: "h3", text: "3. Window frames and headers without flashing" },
      {
        kind: "p",
        text: "Mid-century homes (1940s-1970s) in the Portland metro often have window assemblies that predate modern flashing standards. Water drives into the head and jamb during atmospheric river events, runs down inside the wall cavity, and saturates the framing. The growth appears below the window six to twelve months later as a dark stain or as bubbling paint on the wall below.",
      },
      {
        kind: "p",
        text: "Check window headers from the outside during heavy rain. Look for water streaks emerging below windows on the interior side. If you find either, the window needs to be reinstalled with proper flashing and the saturated framing needs to be assessed for rot and growth before you patch the symptom.",
      },
      { kind: "h3", text: "4. Daylight basements on the east side of the Willamette" },
      {
        kind: "p",
        text: "Mid-century daylight basements — finished living spaces below grade on the downhill side — are one of the highest mold-volume calls we run in Portland east of the Willamette. The combination of below-grade concrete (always cold, always cooler than the dew point of interior air), aging waterproofing membranes, and finished wall assemblies built tight to the concrete creates condensation behind the drywall every winter. Growth appears as a musty smell first, then as discoloration along the base of the wall, then as visible colonies if it's ignored long enough.",
      },
      {
        kind: "p",
        text: "The right fix depends on the specific construction. Sometimes it's exterior waterproofing and drainage; sometimes it's a redesigned interior wall assembly with a proper drainage plane and a dehumidifier. Almost never is it just bleach and paint.",
      },
      { kind: "h2", text: "Five things you can do before October" },
      {
        kind: "ordered",
        items: [
          "Run a hygrometer in the spaces you care about. Indoor relative humidity should stay below 50% year-round. Anything chronically above 60% is producing mold growth somewhere you can't see.",
          "Inspect the crawlspace before the rains start. If you can see moisture on the underside of the subfloor or smell a musty odor, you have growth that needs assessment now, not in February.",
          "Verify bath fans are vented to exterior, not the attic. Five-minute check that prevents a $5,000 ceiling remediation.",
          "Look at every window head from the outside during the first heavy rain of the season. Any visible water intrusion needs flashing repair before more saturation occurs.",
          "Walk the basement after the first atmospheric river. Look for damp spots at the base of walls, behind the lowest course of furniture, and around any below-grade penetration. Address them before the December freeze locks the cycle in.",
        ],
      },
      { kind: "h2", text: "When to call us proactively" },
      {
        kind: "p",
        text: "If you have any of the conditions above and you're reading this between October and March, an inspection now is far cheaper than remediation in March. We do crawlspace, bathroom, and basement moisture inspections across Vancouver, WA and the Portland metro. For chronic conditions we'll write an assessment and a recommended scope; for active growth we'll remediate and rebuild on a single contract.",
      },
    ],
    faqs: [
      {
        q: "Why does my house only smell musty in winter?",
        a: "Indoor relative humidity in Pacific Northwest homes routinely climbs above 60% from November through March because outdoor humidity is so persistently high and we run heating without matching ventilation. The musty smell is volatile organic compounds released by growing mold colonies; it appears in winter because that's when growth accelerates. The fix is not air freshener — it's identifying the moisture source and reducing indoor RH.",
      },
      {
        q: "What's the safe indoor humidity range in Portland and Vancouver?",
        a: "Aim for 40-50% relative humidity year-round. Below 30% is uncomfortably dry; above 60% accelerates mold growth and dust mite populations. A $15 digital hygrometer at the local hardware store will tell you what you're actually running.",
      },
      {
        q: "Is a dehumidifier alone enough to stop a mold problem?",
        a: "Sometimes — if the moisture source is condensation from elevated indoor humidity and there's no active intrusion. If there's a leak, a flashing failure, a crawlspace water issue, or a foundation seepage problem, a dehumidifier just runs constantly and your power bill spikes. Fix the source first; use the dehumidifier to manage residual humidity.",
      },
      {
        q: "Does encapsulating my crawlspace actually pay off?",
        a: "In the Pacific Northwest, yes — crawlspace encapsulation typically pays back through avoided mold remediation, reduced heating costs, and improved indoor air quality within 7-10 years for an average single-family home. The bigger value is that it prevents the structural problems (subfloor rot, sill plate degradation, joist failure) that uncontained crawlspace moisture eventually produces.",
      },
      {
        q: "Can I test my own air for mold with a hardware store kit?",
        a: "Those kits produce data you can't interpret. They measure what grows on a petri dish in your kitchen, not what's airborne in your respiratory zone, and they don't reference indoor vs outdoor baseline. If you need to know what's actually airborne, hire an Indoor Environmental Professional with air-pump sampling — typically $400-$800 for a residential test with a written report.",
      },
    ],
  },
  {
    slug: "why-portland-basements-flood",
    title:
      "Why Portland Basements Flood: Clay Soil and the Drainage Problem No One Talks About",
    description:
      "Portland basements flood at a higher rate than almost any other US metro — and the cause isn't atmospheric rivers, it's what's under the foundation. An IICRC-certified water restoration contractor explains the clay-soil mechanism and what actually fixes it.",
    excerpt:
      "If you bought a house in Portland and it has a basement, there's a chance the basement is wet right now and you don't know it. The reason isn't your roof or your gutters. It's the dirt your house is sitting on — and the drainage assumptions that worked in 1925 don't work for the rainfall this region gets in 2026.",
    category: "Water",
    readingMinutes: 9,
    publishedAt: "2026-05-17",
    author: { name: "Dmitry Zinovyev", title: "Founder, ONA Restoration" },
    sections: [
      {
        kind: "p",
        text: "Every January, we run a wave of basement water-intrusion calls from the same neighborhoods: Laurelhurst, Irvington, Mt. Tabor, Sellwood, Eastmoreland, the old streets of Sellwood-Moreland, and a long list of similar mid-century east-side blocks. Different houses, different owners, different finish levels — same flooded basement, same wet daylight wall, same musty smell. The cause is structural to the region, and it has almost nothing to do with the weather event the homeowner blames.",
      },
      { kind: "h2", text: "The geology under your foundation" },
      {
        kind: "p",
        text: "Most of the Portland metro east of the Willamette sits on Missoula Flood deposits and Boring Lava soil profiles capped by silt and clay. The top three to ten feet of soil under most Portland homes is fine-grained, slow-draining, and rich in clay. When the rains start in October, this layer absorbs water at a rate of about a quarter-inch per hour. When sustained rain delivers two inches per hour during an atmospheric river event, the absorption rate falls far short of the delivery rate and the soil saturates. Once saturated, the soil acts like a sponge that has reached capacity — water no longer percolates downward, it perches at the soil-foundation interface and starts looking for a path of least resistance.",
      },
      {
        kind: "p",
        text: "That path is your foundation wall, your foundation slab, and any below-grade penetration in either. This is hydrostatic pressure. It is the dominant water-intrusion mechanism in Portland basements, and it is fundamentally different from a roof leak or a plumbing failure because the water is coming from the dirt, not from above.",
      },
      { kind: "h2", text: "Why pre-1970 foundations are particularly vulnerable" },
      {
        kind: "p",
        text: "Foundation waterproofing wasn't a meaningful construction standard in the Portland metro until the 1970s. Homes built before then typically have:",
      },
      {
        kind: "list",
        items: [
          "Unwaterproofed exterior foundation walls — bare concrete or block in direct soil contact.",
          "No exterior drainage plane (no dimple mat, no rigid drainage board).",
          "No perimeter drain (no perforated pipe in gravel at the footing).",
          "Foundation walls poured in single-pour increments with cold joints between sections where water seeps preferentially.",
          "Below-grade penetrations (sewer, water, gas) sealed with packing and mortar rather than modern hydraulic-cement sealant.",
        ],
      },
      {
        kind: "p",
        text: "Add a daylight basement (a finished living space below grade on the downhill side, common in east Portland mid-century homes) and you have a structure that is functionally a swimming pool with a leaky liner. The water doesn't need a dramatic event to enter — it just needs the soil outside to saturate.",
      },
      { kind: "h2", text: "Three flooding patterns we see, and what each one means" },
      { kind: "h3", text: "Pattern A: water along the base of one wall, after a heavy rain" },
      {
        kind: "p",
        text: "Most common. Indicates surface water from improperly-pitched grading, a downspout discharging too close to the foundation, or a window-well drain that has failed. The intrusion is local — confined to one section of wall — and it appears within hours of the rain event. Fix is exterior: regrading, downspout extensions, window-well repair, surface drainage redirection. Cost $1,500-$6,000 depending on scope.",
      },
      { kind: "h3", text: "Pattern B: damp wall and floor, sustained, in winter" },
      {
        kind: "p",
        text: "Hydrostatic seepage. Saturated soil pressing against unsealed concrete. Appears as chronic dampness rather than acute flooding; the basement feels humid, the carpet edge along the wall feels cool, and growth begins on the lowest courses of drywall. Fix is interior or exterior depending on access — interior involves an interior perimeter drain at the slab edge, a sump pump, and a vapor barrier; exterior involves excavation, waterproofing membrane, exterior drainage plane, and a perimeter drain. Cost $8,000-$30,000 depending on scope and access.",
      },
      { kind: "h3", text: "Pattern C: sudden water through a wall crack or floor crack" },
      {
        kind: "p",
        text: "Foundation movement. The crack is structural — settlement, frost heave, or hydrostatic-pressure-induced cracking — and it has opened a direct path for groundwater. This is the kind of event that produces an emergency call because the volume can be substantial. Mitigation first (extraction, drying, antimicrobial), structural repair second (crack injection, possible underpinning), waterproofing third (the work in Pattern B). Don't skip the structural step — patching the crack without addressing what caused it guarantees recurrence.",
      },
      { kind: "h2", text: "What does not work (no matter what the basement guy says)" },
      {
        kind: "p",
        text: "There is a category of products and services that gets marketed aggressively in the Portland metro for basement waterproofing. Most of them don't address the underlying cause and are easy to identify by what they claim:",
      },
      {
        kind: "list",
        items: [
          "Interior crystalline sealers — they reduce vapor permeability but do not stop liquid water under pressure. Useful as part of a system, useless on their own.",
          "Drylok-style interior paint — actively counter-productive on a foundation with sustained hydrostatic pressure. Traps water in the wall, accelerates spalling, makes future remediation harder.",
          "Spray-on exterior elastomeric coatings without a drainage plane — they fail at the seam between the wall and the footing, which is where 80% of water entry happens.",
          "French drain installations on the wrong side of the slab — interior drains are useful when paired with a sump, but installed without a sump or installed at the wrong elevation, they just relocate the wet spot.",
        ],
      },
      { kind: "h2", text: "What actually works" },
      {
        kind: "p",
        text: "There is no single answer, because the right fix depends on the specific failure mode. But for Pattern B (the most common Portland scenario), an effective waterproofing system has four components in this order:",
      },
      {
        kind: "ordered",
        items: [
          "Identify and correct exterior grading and downspout discharge first. Many basements that appear to need waterproofing actually need landscaping. This step alone resolves about 40% of intrusion problems and costs a fraction of a full waterproofing system.",
          "Install a perimeter drain — perforated pipe in clean gravel at the footing, sloped to daylight or to a sump.",
          "Add a sump pump with battery backup if the perimeter drain cannot daylight. The battery backup is non-negotiable in this region; power loss during an atmospheric river is the most common cause of total-loss basement flooding we mitigate.",
          "Waterproof the interior or exterior face of the foundation with a membrane that is rated for hydrostatic pressure, paired with a drainage plane that gives any incident water a path to the perimeter drain.",
        ],
      },
      {
        kind: "p",
        text: "If you have an active wet basement, the order of operations is: extract and dry first (this is our department), then identify the failure pattern with a proper inspection, then commission the waterproofing scope appropriate to the pattern, then reconstruct the finished space. Skipping or reordering these steps is the most common reason waterproofing projects fail.",
      },
      { kind: "h2", text: "What we do when you call" },
      {
        kind: "p",
        text: "We handle the first half: mitigation, drying, mold prevention, structural assessment, and the reconstruction of the finished basement once waterproofing is complete. For the waterproofing scope itself we coordinate with specialty contractors who do nothing else — we've worked with most of them in the Portland metro and can recommend the right one for the failure mode you have. The point is to address the cause once, not to keep mitigating the same loss every winter.",
      },
      {
        kind: "p",
        text: "If you're reading this in October before the rains start and you've had basement intrusion in past winters, an off-season inspection is the cheapest way to get ahead of it. If you're reading this in February with water on the floor, the number is at the top of the page — we're 24/7.",
      },
    ],
    faqs: [
      {
        q: "Will my homeowners insurance cover a flooded basement?",
        a: "Generally no, when the cause is groundwater seepage or hydrostatic pressure — these are classified as flood under most policies and require separate NFIP coverage. Yes, when the cause is a sudden interior failure (burst pipe, water heater rupture, washing machine hose). The diagnosis matters: documenting whether the water came from inside or outside the structure determines coverage. We document the cause as part of every basement water mitigation we run.",
      },
      {
        q: "How much does it cost to waterproof a Portland basement?",
        a: "Range is wide because the failure mode varies. Exterior grading and drainage corrections run $1,500-$6,000. Interior perimeter drain plus sump pump runs $6,000-$15,000. Full exterior excavation plus waterproofing membrane plus drainage plane plus perimeter drain runs $15,000-$45,000 depending on access, depth, and finish replacement. The right scope is determined by the diagnosis, not by the contractor's package pricing.",
      },
      {
        q: "Is a sump pump enough on its own?",
        a: "Only if there's a drainage system feeding it. A sump pump by itself in an unmodified basement is a Band-Aid — it lowers the water table in the sump well but doesn't capture water entering through the walls. Paired with an interior or exterior perimeter drain that channels water to the sump, it becomes part of a functional system. Battery backup is essential in this region because the worst intrusion events coincide with windstorm power outages.",
      },
      {
        q: "Why does my basement smell musty even when it's dry?",
        a: "Two reasons most often. First: the basement has cycled wet-and-dry for years and there's established mold growth in wall cavities or behind finished surfaces, releasing volatile compounds even when the air feels dry. Second: indoor relative humidity is chronically above 60% because the concrete is acting as a vapor source and the basement air exchange rate is low. The fix is a hygrometer, an inspection, and likely both growth remediation and dehumidification.",
      },
      {
        q: "My basement only floods during big storms. Do I really need to do anything?",
        a: "Yes — even episodic flooding is producing slow structural damage. Every wetting event soaks framing and subfloors that take weeks to fully dry; over decades that produces sill plate rot, joist degradation, and progressive concrete spalling. The cost curve goes up steeply once structural materials start failing. Episodic flooding is a leading indicator, not a manageable condition.",
      },
    ],
  },
  {
    slug: "state-farm-denied-water-damage-claim",
    title:
      "State Farm Denied Your Water Damage Claim — What to Do Next",
    description:
      "An IICRC-certified restoration contractor's playbook for appealing a denied water-damage claim. The five reasons State Farm cites most often, the documentation that overturns each one, and when to escalate to the state insurance commissioner.",
    excerpt:
      "About one in three water-damage claims gets denied or paid short on the first pass. The denial letter is almost never the final answer — if you know which clause the adjuster cited and what evidence rebuts it, most decisions can be reversed within thirty days.",
    category: "Insurance",
    readingMinutes: 9,
    publishedAt: "2026-05-20",
    author: { name: "Dmitry Zinovyev", title: "Founder, ONA Restoration" },
    sections: [
      {
        kind: "p",
        text: "We see a denial letter on the kitchen counter at least once a month. Sometimes the claim was never going to be paid — long-term seepage that was always going to be excluded. But more often, the homeowner has been paying premiums for years, the loss is genuinely covered, and the adjuster cited a clause that doesn't actually apply once the cause is documented properly. This is the appeal process we walk our own clients through.",
      },
      {
        kind: "callout",
        text: "Important: read your denial letter carefully and identify the exact policy section the adjuster cited. Every step below depends on knowing what they actually said no to — not what you assume they said no to.",
      },
      { kind: "h2", text: "The five reasons State Farm denies water claims most often" },
      {
        kind: "p",
        text: "On a standard HO-3 homeowner's policy, water damage is generally covered if it was sudden and accidental. Denials almost always hinge on one of five clauses:",
      },
      { kind: "h3", text: "1. Long-term seepage or leakage" },
      {
        kind: "p",
        text: "This is the most common denial. The policy excludes damage from water that leaked over weeks or months — a slow drip under a sink, condensation in a wall cavity, a roof that has been failing for a season. The standard exclusion language is something like \"continuous or repeated seepage or leakage of water over a period of 14 days or more.\" If the adjuster believes the loss is long-term, they will deny it regardless of how dramatic the visible damage is.",
      },
      { kind: "h3", text: "2. Lack of maintenance" },
      {
        kind: "p",
        text: "Closely related to seepage. The policy excludes damage caused by the homeowner's failure to maintain the property — a known leaking pipe that wasn't fixed, a gutter that was never cleaned, a roof at the end of its life. This is heavily weather- and inspection-dependent and often debatable.",
      },
      { kind: "h3", text: "3. Mold and microbial sublimit" },
      {
        kind: "p",
        text: "Even when the underlying water loss is covered, mold is usually subject to a separate sublimit (often $5,000-$10,000 on Washington and Oregon policies) and is sometimes excluded entirely. If the claim has been open long enough that mold has appeared, the adjuster may pay the water-mitigation portion and decline the mold portion under this clause.",
      },
      { kind: "h3", text: "4. Flood, surface water, or sewer backup" },
      {
        kind: "p",
        text: "Damage from rising surface water (atmospheric river runoff, creek overflow, storm surge) is not covered under a standard HO-3 — it requires separate NFIP flood insurance. Sewer backup is usually excluded unless you have a specific sewer backup rider. The trick is that suppression water from above (a burst pipe in the ceiling) is covered, while ground-up water (a sewer line backing up from below) usually isn't.",
      },
      { kind: "h3", text: "5. Anti-concurrent causation" },
      {
        kind: "p",
        text: "The most aggressive clause. If two perils contribute to a loss and one of them is excluded, the entire loss may be denied even if the other peril is covered. State Farm's HO-3 includes language barring coverage when an excluded cause (flood, earth movement) combines with a covered cause (wind, burst pipe). Most denials citing this clause can be challenged when the covered peril clearly came first and caused the damage independently.",
      },
      { kind: "h2", text: "Step one: request the complete claim file" },
      {
        kind: "p",
        text: "You are entitled to the full claim file, including the adjuster's notes, photos, the damage estimate (usually in Xactimate format), and any reports from independent experts the carrier hired. In Washington, RCW 48.18.140 and WAC 284-30 require insurers to handle claims in good faith and produce documentation on request; Oregon DCBS has similar consumer protections. Request the file in writing. Most insurers turn it over within ten business days.",
      },
      {
        kind: "p",
        text: "Once you have the file, you know exactly what the adjuster saw — and didn't see — when they made the decision. Most denials we overturn are based on incomplete documentation, not bad faith. The adjuster spent twenty minutes on-site, missed the bracket-stain pattern that proves a sudden release rather than seepage, and wrote the loss up accordingly.",
      },
      { kind: "h2", text: "Step two: get an independent inspection" },
      {
        kind: "p",
        text: "An IICRC-certified restoration contractor can perform a moisture-mapping inspection and produce documentation an insurer's adjuster will recognize:",
      },
      {
        kind: "list",
        items: [
          "Thermal imaging showing the moisture migration pattern (which proves whether the water came from a single sudden event or has been seeping over time).",
          "Penetrating-meter readings with timestamps documenting the moisture content in framing, insulation, and finished materials.",
          "Photographs of source — the failed component (pipe, valve, fitting) — preserved before any demolition.",
          "An Xactimate-formatted scope of work matching the carrier's own pricing system, line-by-line.",
          "A written cause-and-origin opinion from a certified technician explaining why the loss is sudden and accidental, not long-term.",
        ],
      },
      {
        kind: "p",
        text: "This is the single highest-leverage step in a claim appeal. An adjuster will rarely overturn their own decision based on a homeowner's letter; they will overturn it based on an Xactimate from an IICRC-certified contractor with photographs and moisture readings. Restoration contractors do this routinely — we deliver this package to our clients' carriers on every job whether it gets denied or not.",
      },
      { kind: "h2", text: "Step three: file a written appeal" },
      {
        kind: "p",
        text: "Write a formal appeal letter that does three things. First, cite the specific policy section the adjuster used as grounds for denial — quote it verbatim. Second, present the new evidence: the moisture readings, the cause-and-origin opinion, the Xactimate scope. Third, request a specific outcome (full coverage of the documented scope) and a deadline (30 days is standard).",
      },
      {
        kind: "p",
        text: "Keep the tone factual. Most appeals fail because the homeowner argues about how unfair the decision feels; appeals succeed when they present documentation the adjuster didn't have on the first pass. State Farm has internal escalation paths — your letter often gets reviewed by a different adjuster or a claims supervisor, not the original one.",
      },
      { kind: "h2", text: "Step four: escalate to the state insurance commissioner" },
      {
        kind: "p",
        text: "If the carrier upholds the denial after appeal, file a complaint with the state regulator. In Washington, that's the Office of the Insurance Commissioner (insurance.wa.gov). In Oregon, it's the Department of Consumer and Business Services (dfr.oregon.gov). Both agencies have formal complaint processes; the insurer is required to respond within a set timeframe.",
      },
      {
        kind: "p",
        text: "Filing a complaint is not the same as suing. It's a regulatory step that often produces movement — insurers track their complaint counts and respond more carefully to claims with regulator attention. Many claims get resolved at this stage without litigation.",
      },
      { kind: "h2", text: "When to hire a public adjuster — and when not to" },
      {
        kind: "p",
        text: "A public adjuster represents the homeowner (not the insurance company) on the claim, in exchange for a percentage of the settlement — typically 10-15% in Washington and Oregon. They are useful for large, complex claims where the disputed amount is substantial. They are usually not worth the cost on a clean $15,000 water claim that a restoration contractor's documentation can resolve on its own.",
      },
      {
        kind: "p",
        text: "Public adjusters must be licensed in the state where they practice. In Washington, verify the license at insurance.wa.gov. In Oregon, verify at dfr.oregon.gov/licensing. Unlicensed claim help is illegal in both states.",
      },
      { kind: "h2", text: "Where ONA fits in" },
      {
        kind: "p",
        text: "We don't take a cut of your settlement. We do produce the IICRC-grade documentation that carriers respond to — Xactimate scopes matched to the carrier's pricing, moisture documentation, cause-and-origin opinions, and direct adjuster communication — as part of every restoration project we run. That documentation is what overturns most denials we see in the Vancouver, WA and Portland metro market. If you're staring at a denial letter and you'd like a second-opinion inspection, call the number at the top of the page or send us photos by email. The inspection is free for losses we end up working on.",
      },
    ],
    howTo: {
      name: "Appeal a denied water-damage insurance claim",
      description:
        "A six-step process for overturning a denied water-damage claim, from requesting the claim file through escalation to the state insurance regulator.",
      steps: [
        {
          name: "Read the denial letter and identify the cited policy clause",
          text: "Determine exactly which exclusion the adjuster used — seepage, lack of maintenance, flood, mold sublimit, or anti-concurrent causation. Quote the language verbatim for the appeal.",
        },
        {
          name: "Request the full claim file in writing",
          text: "Ask for the adjuster's notes, photos, Xactimate estimate, and any independent expert reports. Both Washington and Oregon require insurers to produce these on request.",
        },
        {
          name: "Get an independent IICRC-certified inspection",
          text: "A restoration contractor's moisture mapping, photographs, cause-and-origin opinion, and Xactimate-formatted scope produce the evidence adjusters respond to.",
        },
        {
          name: "File a written appeal with new evidence",
          text: "Cite the policy clause the adjuster used, present the contractor's documentation, and request a specific outcome and 30-day decision deadline.",
        },
        {
          name: "Escalate to the state insurance regulator if appeal is denied",
          text: "File a formal complaint with Washington OIC (insurance.wa.gov) or Oregon DCBS (dfr.oregon.gov). Insurers must respond within set timeframes.",
        },
        {
          name: "Consider a licensed public adjuster for large or complex claims",
          text: "Public adjusters take 10-15% of the settlement and make sense on large disputes. Verify their license at the state regulator before hiring.",
        },
      ],
    },
    faqs: [
      {
        q: "How long do I have to appeal a denied claim in Washington or Oregon?",
        a: "Both states allow you to request reconsideration at any time, though insurers may treat very late requests as new claims. The practical window is 30-60 days after the denial letter. The statute of limitations on a bad-faith lawsuit is generally 3 years in Washington and Oregon, but you must complete the carrier's internal appeal process first.",
      },
      {
        q: "Can I hire a restoration contractor before the appeal is resolved?",
        a: "Yes — you can hire any IICRC-certified contractor at any time, and an independent contractor's inspection often becomes the evidence that overturns the denial. You are not required to use a carrier-preferred vendor. If the appeal succeeds, the carrier reimburses the documented scope.",
      },
      {
        q: "What's the difference between ACV and RCV on a water claim?",
        a: "Actual Cash Value is the depreciated value of damaged materials — what they're worth today after age and wear. Replacement Cost Value is what it takes to rebuild with new materials. Most policies pay ACV up front and the remaining RCV depreciation after the work is completed. If your policy is ACV-only, the depreciation is yours to absorb.",
      },
      {
        q: "Will my premium go up if I appeal a denied claim?",
        a: "Filing or appealing a claim that is ultimately denied does not directly affect premium. Filing a claim that is paid does affect future premiums and risk classification. Appealing a denial does not make your premium worse — declining to appeal a covered loss only makes the financial outcome worse for you.",
      },
      {
        q: "Does State Farm specifically deny more water claims than other carriers?",
        a: "No carrier publishes denial rates. Anecdotally, every major carrier denies water claims they believe to be long-term seepage or lack of maintenance, and the criteria they apply are similar. The variation is in how thoroughly each adjuster documents the cause — which is exactly why independent contractor documentation matters on appeal regardless of which carrier you have.",
      },
    ],
  },
  {
    slug: "water-damage-first-hour-checklist",
    title:
      "Water Damage in Your Home: What to Do in the First Hour (and What Not to Touch)",
    description:
      "A step-by-step checklist from an IICRC-certified restoration contractor. What to shut off, what to photograph, what to move — and which mistakes will cost you most.",
    excerpt:
      "The first sixty minutes after a burst pipe or flood decide whether you're looking at a $4,000 mitigation job or a $40,000 rebuild. Here's the exact sequence we tell our own families.",
    category: "Water",
    readingMinutes: 6,
    publishedAt: "2026-05-15",
    author: { name: "ONA Restoration", title: "IICRC-certified restoration team" },
    sections: [
      {
        kind: "p",
        text: "We get the call at 3 a.m. on a regular schedule: a supply line ruptured, a dishwasher hose let go, a roof valley failed during an atmospheric river. The next sixty minutes decide whether you're looking at a clean four-day dry-out or a six-week reconstruction with a mold subcontractor. Most homeowners do two or three things very right and one thing very wrong in that window. This is the sequence we walk our own families through.",
      },
      { kind: "h2", text: "Stop the water" },
      {
        kind: "p",
        text: "Almost every interior water loss has a single shut-off that stops the bleeding. Find it first — fixing the source is more valuable than mopping the floor.",
      },
      {
        kind: "list",
        items: [
          "Supply-line leak under a sink or toilet: the angle-stop valve directly under the fixture (turn clockwise).",
          "Washing machine or dishwasher: the hot/cold shut-offs behind the unit, or the main water valve if those don't move.",
          "Whole-house: the main shut-off, typically in the garage, crawlspace access, or against the wall where the water main enters the house.",
          "Roof or window leak from a storm: there is no shut-off — go to step three (photograph everything) and call.",
        ],
      },
      { kind: "h2", text: "Kill the power to the affected area" },
      {
        kind: "p",
        text: "If water is anywhere near outlets, an extension cord, or a fixture, throw the breaker for that area before you go in. Standing water plus live wiring is the most common preventable cause of restoration injuries we see. If you can't reach the panel safely, stay out and call us — we work with the fire department on power isolation routinely.",
      },
      { kind: "h2", text: "Photograph the loss before you touch anything" },
      {
        kind: "p",
        text: "Your insurance claim will hinge on what's in your phone's photo album in the next ten minutes. Open the camera and shoot:",
      },
      {
        kind: "list",
        items: [
          "Wide shots of every affected room from each corner.",
          "Close-ups of the visible water source (the burst line, the failed appliance, the ceiling stain).",
          "Standing water depth — put a tape measure or ruler in frame.",
          "Affected contents (rugs, furniture, electronics) before you move them.",
          "The exterior of the property if storm-driven — broken windows, damaged siding, fallen trees.",
        ],
      },
      {
        kind: "callout",
        text: "If you only do one thing on this list before help arrives, do this one. Adjusters approve claims they can see, not claims they have to imagine.",
      },
      { kind: "h2", text: "Get porous, valuable items off the floor" },
      {
        kind: "p",
        text: "Rugs, books, paper records, family photos and electronics are the first total losses in a water event. Move what you can to a dry, elevated surface — but don't injure yourself doing it and don't risk an electrical contact. Wood furniture legs sitting in water for more than an hour will stain hardwood floors permanently; aluminum foil under the legs is a five-minute fix that saves a refinish.",
      },
      { kind: "h2", text: "Don't do these things" },
      {
        kind: "ordered",
        items: [
          "Don't run a household vacuum on standing water. They're not designed for it and you will electrocute yourself.",
          "Don't lift wet drywall, insulation or carpet pad. It tears, it gets heavier, and you contaminate the rest of the house. Wait for us.",
          "Don't run fans or open windows yet if it's a sewage or contaminated-water loss — you'll spread the contamination.",
          "Don't strip wallpaper, peel paint or pull baseboards. Restoration starts cleaner if you leave the structure intact.",
          "Don't agree to demolition over the phone with any contractor before the loss is scoped. Mitigation comes before demolition.",
        ],
      },
      { kind: "h2", text: "Call your insurance and a restoration contractor in that order" },
      {
        kind: "p",
        text: "File a first notice of loss with your insurer so the claim is open. Then call a restoration contractor — ideally one who is IICRC certified and can bill insurance directly. The contractor will dispatch emergency mitigation while the adjuster is still scheduling their visit. Your policy almost always pays for emergency mitigation; you don't need to wait.",
      },
      {
        kind: "p",
        text: "If you're in Vancouver, WA or anywhere in the Portland metro and you'd rather skip the research call us at the number at the top of this page. We're 24/7 and the technician you'll meet at your door already has your address by the time we hang up.",
      },
    ],
    howTo: {
      name: "Respond to water damage in your home in the first hour",
      description:
        "A six-step emergency response checklist from an IICRC-certified restoration contractor.",
      steps: [
        {
          name: "Stop the water at the closest shut-off valve",
          text: "Find and close the angle-stop valve under the fixture, the appliance shut-off, or the main water valve.",
        },
        {
          name: "Kill the power to the affected area at the breaker",
          text: "If water is near outlets, fixtures, or extension cords, turn off the breaker for that area before re-entering.",
        },
        {
          name: "Photograph everything before touching it",
          text: "Wide shots of each affected room, close-ups of the source, standing water depth with a ruler in frame, and exterior damage.",
        },
        {
          name: "Move valuable porous items to a dry, elevated surface",
          text: "Rugs, books, family photos, electronics. Place aluminum foil under wood furniture legs to prevent staining.",
        },
        {
          name: "Avoid common mistakes",
          text: "No household vacuums on water, no lifting wet drywall, no running fans on sewage losses, no demolition over the phone.",
        },
        {
          name: "Call your insurance, then a restoration contractor",
          text: "Open the claim with your insurer first, then dispatch an IICRC-certified restoration contractor for emergency mitigation.",
        },
      ],
    },
    faqs: [
      {
        q: "Do I need to wait for the insurance adjuster before starting mitigation?",
        a: "No. Standard homeowner's policies cover reasonable emergency mitigation to prevent additional damage. Restoration contractors can begin extraction and drying immediately and bill the insurance company afterward.",
      },
      {
        q: "How long after water damage does mold grow?",
        a: "Mold can begin growing on wet drywall, insulation and other porous materials within 24–48 hours. After 72 hours of saturation, mold growth becomes very likely and the job changes from water mitigation to mold remediation.",
      },
      {
        q: "Will my hardwood floors be ruined?",
        a: "Often they can be saved if specialized hardwood-drying mats are deployed within the first 24 hours. After that, cupping and crowning may be permanent and refinishing or replacement is needed.",
      },
    ],
  },
];

export const findPost = (slug: string) => posts.find((p) => p.slug === slug);
