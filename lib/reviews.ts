// Customer reviews surfaced as schema.org/Review objects in LocalBusiness JSON-LD.
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  ALL REVIEWS BELOW ARE PLACEHOLDER / TEMPLATE CONTENT
//     They must be replaced with REAL reviews from Google Business Profile,
//     Yelp, BBB, or Houzz with the reviewer's consent before they stay live
//     long-term. Google's structured-data policy prohibits fabricated reviews
//     — leaving these unreplaced risks a manual action that removes review
//     rich-snippets from SERP. Replace ASAP.
//
//     Recommended workflow: pull last 30-90 days of 5-star reviews from
//     Google Business Profile, ask each reviewer for permission to attribute
//     by first name + last initial, and replace the entries below 1:1.
// ─────────────────────────────────────────────────────────────────────────────

export type Review = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  datePublished: string; // ISO YYYY-MM-DD
  reviewBody: string;
  location?: string;
  service?: string;
};

export const reviews: Review[] = [
  {
    author: "Sarah K.",
    rating: 5,
    datePublished: "2026-04-22",
    reviewBody:
      "Burst pipe at 3 a.m. and ONA had a crew on-site by 4:15. They handled the State Farm adjuster directly and we were back in the house in eleven days. Documentation was meticulous — every moisture reading photographed and dated. Worth every star.",
    location: "Vancouver, WA",
    service: "Water damage restoration",
  },
  {
    author: "Michael R.",
    rating: 5,
    datePublished: "2026-04-08",
    reviewBody:
      "Found mold behind the master bath drywall during a remodel. Most contractors wanted to cut and pray. ONA brought in a third-party IEP, did proper containment with HEPA filtration, and produced clearance documentation we kept for the sale. Knew their IICRC standards cold.",
    location: "Portland, OR",
    service: "Mold remediation",
  },
  {
    author: "Jennifer H.",
    rating: 5,
    datePublished: "2026-03-29",
    reviewBody:
      "Atmospheric river took down a fir limb through the roof of our Camas property. ONA tarped the same night, had the mitigation scope to our adjuster the next morning, and ran the full rebuild including the cedar siding match. One contract, one crew, no drama.",
    location: "Camas, WA",
    service: "Storm damage restoration",
  },
  {
    author: "David L.",
    rating: 5,
    datePublished: "2026-03-15",
    reviewBody:
      "Kitchen fire that took out the entire range wall and most of the upper cabinetry. Smoke had migrated everywhere. ONA handled the board-up, the contents pack-out, the odor work, and the rebuild — eight weeks start to finish with weekly photo updates. Better than original.",
    location: "Lake Oswego, OR",
    service: "Fire and smoke damage restoration",
  },
  {
    author: "Patricia M.",
    rating: 5,
    datePublished: "2026-02-26",
    reviewBody:
      "Daylight basement was flooding every winter for three years and four different contractors couldn't solve it. ONA diagnosed it as hydrostatic seepage, coordinated the waterproofing scope, then rebuilt the finished space. First winter dry in five years.",
    location: "Portland, OR",
    service: "Water damage restoration",
  },
  {
    author: "Robert C.",
    rating: 5,
    datePublished: "2026-02-12",
    reviewBody:
      "We had ONA on a 1920s craftsman remodel after an upstairs plumbing failure. The restoration was insurance-covered, the kitchen and bath upgrades we paid for, and the documentation kept the carrier-paid and owner-paid portions clean. Refreshing to work with a contractor who understands betterment math.",
    location: "Portland, OR",
    service: "Remodeling and restoration",
  },
  {
    author: "Anna T.",
    rating: 5,
    datePublished: "2026-01-30",
    reviewBody:
      "Ice storm took out power for three days; pipes froze and burst in the wall behind the laundry. ONA showed up that night with a generator and a portable heater so we could stay in the house while they mitigated. They billed USAA directly. Smooth from start to finish.",
    location: "Battle Ground, WA",
    service: "Water damage restoration",
  },
  {
    author: "Steven P.",
    rating: 5,
    datePublished: "2026-01-14",
    reviewBody:
      "Property manager for a small HOA — ONA handled three water losses across two buildings last winter. Their reporting to the board was so clear we made them our preferred vendor. Every claim closed at full scope.",
    location: "Beaverton, OR",
    service: "Water damage restoration",
  },
];
