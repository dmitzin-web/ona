// Customer reviews surfaced as schema.org/Review objects in LocalBusiness JSON-LD.
//
// EMPTY UNTIL REAL REVIEWS EXIST. Do NOT populate this with fabricated /
// template review content — Google's review-quality systems can detect
// synthetic reviews, and surfacing them in schema during a pending GBP
// verification window is an active negative signal that can cause the
// verification to fail.
//
// Workflow when reviews arrive:
//   1. Wait for verified Google Business Profile listing to go live
//   2. After receiving 5+ legitimate reviews on GBP, ask each reviewer
//      for permission to attribute by first name + last initial on the
//      website
//   3. Add entries below
//   4. Also set site.rating in lib/site.ts to the matching aggregate
//      ({ value: 4.9, count: N }) so AggregateRating fires alongside

export type Review = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  datePublished: string; // ISO YYYY-MM-DD
  reviewBody: string;
  location?: string;
  service?: string;
};

export const reviews: Review[] = [];
