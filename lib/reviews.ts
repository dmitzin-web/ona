// Customer reviews surfaced as schema.org/Review objects in LocalBusiness JSON-LD.
//
// These must be REAL reviews tied to real customers. Google's structured-data
// policy prohibits fabricated reviews — populate this from actual Google
// Business Profile, Yelp, BBB, or Houzz reviews with the reviewer's consent.
// Authors can be a first name + last initial (e.g. "Sarah K.") to keep
// identifiers minimal while staying truthful.
//
// Once the `reviews` array has entries, they will appear as Review objects in
// the LocalBusiness JSON-LD on every page that emits it. Google may then
// surface review-snippet rich results in SERP.

export type Review = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  datePublished: string; // ISO YYYY-MM-DD
  reviewBody: string;
  location?: string;
  service?: string;
};

export const reviews: Review[] = [
  // Example shape (delete this comment block and add real reviews):
  // {
  //   author: "Sarah K.",
  //   rating: 5,
  //   datePublished: "2026-03-15",
  //   reviewBody:
  //     "Burst pipe at 3am. ONA was on-site by 4:12am. Fully restored in 11 days, billed direct to State Farm. Highly recommend.",
  //   location: "Vancouver, WA",
  //   service: "Water damage restoration",
  // },
];
