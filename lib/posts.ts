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
