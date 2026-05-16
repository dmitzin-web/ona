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
