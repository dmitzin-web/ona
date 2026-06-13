export type Service = {
  slug: string;
  name: string;
  shortName: string;
  title: string;
  description: string;
  hero: string;
  intro: string;
  body: { heading: string; paragraphs: string[] }[];
  process: { step: string; text: string }[];
  signs: string[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "water-damage",
    name: "Water Damage Restoration",
    shortName: "Water Damage",
    title: "Water Damage Restoration in Vancouver, WA & Portland Metro",
    description:
      "24/7 emergency water damage restoration in Vancouver, WA and Portland, OR. IICRC-standard water extraction, structural drying and reconstruction. We bill your insurance directly.",
    hero: "Burst pipe, flooded basement, or appliance leak? Our crews are on-site within 60 minutes across the Portland metro area.",
    intro:
      "Standing water turns into structural damage and mold growth in as little as 24 hours. ONA Restoration is a water-damage restoration company working to IICRC standards, serving Vancouver, WA and the entire Portland metro. We extract water, dry the structure, and rebuild — and we coordinate the claim with your insurance carrier so you don't have to.",
    body: [
      {
        heading: "What we handle",
        paragraphs: [
          "Burst and frozen pipes, supply-line failures, water-heater leaks, dishwasher and washing-machine overflows, sewage backups, roof leaks, foundation seepage, and storm-driven flooding. Residential and commercial properties of any size.",
          "Every job starts with a moisture map using thermal imaging and penetrating meters so we know exactly where the water went — not just where it pooled. That's how we prevent the secondary damage and mold growth that show up six weeks later.",
        ],
      },
      {
        heading: "Why response time matters",
        paragraphs: [
          "Category 1 (clean) water becomes Category 2 (gray) within 48 hours and Category 3 (black) within 72. Drywall wicks moisture upward at roughly one inch per hour. Hardwood floors can cup permanently in 24 hours.",
          "We staff 24/7/365 with trucks pre-loaded with extractors, air movers, dehumidifiers, and HEPA scrubbers. When you call (360) 553-2138, the technician on the truck has your address before they hang up.",
        ],
      },
    ],
    process: [
      {
        step: "1. Emergency call & dispatch",
        text: "Live answer 24/7. Crew dispatched within minutes; on-site target is 60 minutes in the Portland metro.",
      },
      {
        step: "2. Inspection & moisture mapping",
        text: "Thermal imaging, penetrating moisture meters, and category/class assessment per IICRC S500 standards.",
      },
      {
        step: "3. Water extraction",
        text: "Truck-mounted and portable extractors remove standing water. Affected materials are documented before removal.",
      },
      {
        step: "4. Structural drying",
        text: "Air movers and commercial dehumidifiers run until moisture readings match dry standard. Daily monitoring with documented readings.",
      },
      {
        step: "5. Cleaning & antimicrobial",
        text: "EPA-registered antimicrobial application to prevent mold. Contents cleaned, deodorized, and inventoried.",
      },
      {
        step: "6. Reconstruction",
        text: "Drywall, flooring, cabinetry and paint restored. Single point of contact through your insurance claim.",
      },
    ],
    signs: [
      "Standing water or saturated carpet",
      "Sagging or stained ceilings",
      "Buckled or cupped hardwood flooring",
      "Musty odor in basement or crawlspace",
      "Unexplained spike in water bill",
      "Peeling paint or bubbling drywall",
    ],
    faqs: [
      {
        q: "How fast can you be on-site in Portland or Vancouver?",
        a: "Our standard response target is 60 minutes anywhere in the Portland metro area, 24/7. For severe emergencies we dispatch the closest available crew immediately.",
      },
      {
        q: "Do you work directly with insurance?",
        a: "Yes. We document the loss with photos, moisture readings, and a detailed Xactimate-formatted estimate, and we communicate directly with your adjuster from first notice of loss through final invoice.",
      },
      {
        q: "How long does water damage drying take?",
        a: "Most residential jobs dry in 3–5 days. The timeline depends on water category, materials affected, and the moisture content at the start. We monitor daily and adjust equipment until structural materials reach dry standard.",
      },
      {
        q: "Will my hardwood floors be saved?",
        a: "Often, yes — if we get to it inside 24–48 hours and use specialized hardwood drying mats. After that, cupping and crowning may be permanent and refinishing or replacement is needed.",
      },
    ],
  },
  {
    slug: "fire-damage",
    name: "Fire & Smoke Damage Restoration",
    shortName: "Fire & Smoke",
    title: "Fire & Smoke Damage Restoration | Vancouver, WA & Portland, OR",
    description:
      "Fire, smoke and soot damage restoration in Vancouver, WA and Portland, OR. Board-up, structural cleaning, odor removal and full reconstruction. 24/7 emergency response.",
    hero: "After the fire department leaves, the damage keeps spreading. We secure the property and stop secondary loss within hours.",
    intro:
      "Fire damage is rarely just fire. Soot is acidic and continues to etch metal, glass, and finishes within hours. Water from suppression saturates the structure. Smoke odor migrates into HVAC and porous materials throughout the home. ONA Restoration works to the IICRC S700 fire & smoke damage standard and handles every stage from board-up through reconstruction.",
    body: [
      {
        heading: "Immediate stabilization",
        paragraphs: [
          "Board-up of openings, roof tarping, temporary power, and securing the structure against weather and trespass. We coordinate with your insurance carrier from the first call so emergency mitigation is authorized without delay.",
          "Soot and corrosive residues are neutralized on metal fixtures, electronics, and finished surfaces before they cause permanent etching. Contents are inventoried, packed out for off-site cleaning, or documented for total-loss claims.",
        ],
      },
      {
        heading: "Smoke odor — the part most companies miss",
        paragraphs: [
          "Smoke molecules penetrate drywall, insulation, framing, fabrics, and HVAC ductwork. Surface cleaning alone does not solve it. We use hydroxyl generation, ozone treatment (unoccupied spaces only), thermal fogging, and sealed-encapsulation primers depending on the substrate.",
          "Every job ends with a third-party odor verification step before reconstruction begins. If it doesn't pass, we don't close the file.",
        ],
      },
    ],
    process: [
      { step: "1. Emergency response & board-up", text: "Secure structure, tarp roof, install temporary fencing if needed." },
      { step: "2. Damage & contents assessment", text: "Room-by-room scope with photos, salvageable vs. non-salvageable inventory." },
      { step: "3. Water & debris removal", text: "Suppression water extracted and drying initiated to prevent mold." },
      { step: "4. Soot & residue cleaning", text: "Dry-sponge, HEPA vacuum, and chemical cleaning by surface type." },
      { step: "5. Odor removal", text: "Hydroxyl, ozone, thermal fogging, sealed primers — matched to substrate." },
      { step: "6. Reconstruction", text: "Framing, drywall, paint, flooring, cabinetry, finish carpentry." },
    ],
    signs: [
      "Visible soot or smoke staining on walls and ceilings",
      "Persistent smoke odor after surface cleaning",
      "Yellow or brown residue on plastics and finishes",
      "Heat damage to electrical panels or HVAC",
      "Water damage from fire suppression",
    ],
    faqs: [
      {
        q: "Can you start before the fire investigation is complete?",
        a: "We do not disturb the scene until the fire marshal or insurance investigator releases it. We can complete emergency board-up and securement immediately, then start mitigation as soon as the release is granted.",
      },
      {
        q: "Will smoke odor really come out?",
        a: "Yes, when the source materials are addressed. Surface cleaning is not enough — smoke penetrates porous materials and HVAC systems. We match the deodorization method to each substrate and verify before closing the job.",
      },
      {
        q: "Do you handle the rebuild too?",
        a: "Yes. We are a single-source contractor for mitigation and reconstruction, so you do not coordinate between two companies and your claim has one estimate.",
      },
    ],
  },
  {
    slug: "mold-removal",
    name: "Mold Remediation",
    shortName: "Mold Remediation",
    title: "Mold Removal & Remediation | Vancouver, WA & Portland, OR",
    description:
      "IICRC-standard mold remediation in Vancouver, WA and Portland, OR. Third-party testing, containment, HEPA filtration, and full remediation per IICRC S520.",
    hero: "Pacific Northwest humidity makes mold inevitable when there's a moisture source. We find the source and remove the mold safely.",
    intro:
      "Mold isn't a cleaning problem — it's a moisture problem. Bleaching surface growth without identifying and stopping the moisture source guarantees regrowth within weeks. ONA Restoration follows the IICRC S520 standard for assessment, containment, and remediation.",
    body: [
      {
        heading: "Assessment first, demolition second",
        paragraphs: [
          "We start with a moisture investigation to find the source: roof leak, plumbing failure, foundation seepage, condensation, or undetected slow leak. Without solving that, remediation is wasted money.",
          "For larger jobs and insurance claims we coordinate third-party Indoor Environmental Professional (IEP) testing both before and after remediation. The pre-test scopes the work; the post-test verifies clearance independently.",
        ],
      },
      {
        heading: "Safe remediation",
        paragraphs: [
          "Affected areas are contained with poly sheeting and negative-air HEPA machines so spores aren't pushed into clean parts of the home. Non-salvageable porous materials (drywall, insulation, carpet pad) are removed and bagged inside containment. Framing and structural materials are HEPA-vacuumed, treated with EPA-registered antimicrobials, and verified dry.",
          "Containment stays up until clearance testing passes. Then reconstruction restores everything we removed.",
        ],
      },
    ],
    process: [
      { step: "1. Inspection & moisture mapping", text: "Identify the moisture source and the extent of contamination." },
      { step: "2. Third-party testing (recommended)", text: "Independent IEP sets the scope and writes the protocol." },
      { step: "3. Containment & filtration", text: "Poly barriers, negative air, HEPA scrubbers, decontamination chambers." },
      { step: "4. Removal & cleaning", text: "Non-salvageable porous materials removed; framing HEPA-vacuumed and treated." },
      { step: "5. Drying & moisture control", text: "Underlying moisture source repaired or rerouted. Area dried to standard." },
      { step: "6. Clearance & reconstruction", text: "Post-remediation verification, then rebuild." },
    ],
    signs: [
      "Visible black, green, or white growth on walls or ceilings",
      "Persistent musty odor",
      "Allergy or respiratory symptoms that improve when you leave the house",
      "Recent water damage left undried for more than 48 hours",
      "Discoloration around windows, in bathrooms, or in basements",
    ],
    faqs: [
      {
        q: "Do I need a mold test before remediation?",
        a: "For small, clearly visible growth from a known moisture source, often no — we can scope the work directly. For larger areas, health concerns, or insurance claims, an independent IEP test protects you and produces clearance documentation.",
      },
      {
        q: "Is bleach enough for mold?",
        a: "No. Bleach addresses surface coloration on non-porous materials but does not kill mold in porous substrates like drywall or framing, and it does not solve the moisture source. Improper DIY treatment usually makes the job more expensive later.",
      },
      {
        q: "Does insurance cover mold?",
        a: "It depends on the policy and the cause. Mold from a sudden, covered water loss is often covered up to a sublimit. Mold from long-term seepage or neglected maintenance generally is not. We help you document the cause for the claim.",
      },
      {
        q: "How long does mold remediation take?",
        a: "Most residential jobs run two to five days: a day to set containment and remove affected materials, a day or two of HEPA cleaning and drying, then clearance and rebuild. The driver is how far the moisture traveled and whether porous materials have to come out — which is exactly why we map it before we quote.",
      },
      {
        q: "Will the mold come back after you're done?",
        a: "Not if the moisture source is fixed — and that's the part most companies skip. We don't close a job until the leak, seepage, or condensation that fed the colony is repaired or rerouted and the area reads dry. Surface treatment without solving the water is why DIY and bargain jobs regrow within weeks.",
      },
      {
        q: "Is it safe to stay in the house during remediation?",
        a: "Usually yes. We seal the work area behind poly containment and run negative-air HEPA scrubbers so spores can't migrate into the rest of the home. For larger losses or sensitive occupants (asthma, allergies, compromised immunity) we'll advise whether to relocate during the active phase.",
      },
      {
        q: "Do you remove the mold and rebuild, or just the removal?",
        a: "Both — under one contract. The same crew that removes the contaminated materials puts the wall, insulation, and finishes back. No handing your half-finished house to a separate contractor, no second estimate, one accountable team from containment to final paint.",
      },
    ],
  },
  {
    slug: "storm-damage",
    name: "Storm Damage Restoration",
    shortName: "Storm Damage",
    title: "Storm & Wind Damage Restoration | Vancouver, WA & Portland, OR",
    description:
      "24/7 storm damage restoration in Vancouver, WA and Portland, OR. Emergency board-up, roof tarping, tree removal, water extraction and full reconstruction.",
    hero: "Wind, ice storm, fallen tree, or atmospheric river — we stabilize, dry, and rebuild on one claim.",
    intro:
      "The Pacific Northwest gets ice storms, windstorms, atmospheric rivers, and the occasional fallen Douglas fir through a roof. ONA Restoration handles the entire arc: emergency board-up and tarping the same night, water mitigation, structural repair, and final reconstruction.",
    body: [
      {
        heading: "First 24 hours",
        paragraphs: [
          "We tarp the roof, board up broken openings, and remove debris or tree limbs preventing entry. Standing water is extracted before it migrates into framing and subflooring. Temporary power and heat are arranged when utilities are out.",
          "Photo and video documentation is captured from the first visit so your insurance claim has a clean evidentiary trail.",
        ],
      },
      {
        heading: "Full restoration",
        paragraphs: [
          "Once stabilized, we move into structural drying, mold prevention, and reconstruction. Roof, siding, windows, drywall, flooring, and interior finishes — all on one estimate, one schedule, one point of contact.",
        ],
      },
    ],
    process: [
      { step: "1. Emergency dispatch", text: "Crew with tarps, boards, and extractors en route within minutes." },
      { step: "2. Stabilization", text: "Roof tarp, window board-up, debris removal, water extraction." },
      { step: "3. Documentation", text: "Photo, video, and moisture documentation for your claim." },
      { step: "4. Drying", text: "Air movers and dehumidifiers run until structure is dry." },
      { step: "5. Reconstruction", text: "Roofing, siding, windows, interior finishes." },
    ],
    signs: [
      "Roof damage, missing shingles, or visible tarping needed",
      "Tree or limb impact",
      "Broken windows or breached siding",
      "Interior water intrusion after a storm",
      "Power loss with risk of frozen pipes",
    ],
    faqs: [
      {
        q: "How fast can you tarp a damaged roof?",
        a: "Same day in almost all cases. During a major regional storm event we prioritize by severity — call us as soon as the damage occurs to get in queue.",
      },
      {
        q: "Will my insurance cover storm damage?",
        a: "Wind, hail, and falling-object losses are generally covered under standard homeowner's policies. Flooding from rising surface water is typically separate (NFIP) coverage. We help you understand what your policy includes before work begins.",
      },
    ],
  },
  {
    slug: "remodeling",
    name: "Remodeling & Reconstruction",
    shortName: "Remodeling",
    title: "Custom Remodeling & Reconstruction — Vancouver, WA & Portland Metro",
    description:
      "Custom kitchen, bath, and whole-house remodeling in Vancouver, WA and Portland, OR — built to the same IICRC-grade documentation and craftsmanship as our restoration work. Licensed, bonded, insured.",
    hero: "From kitchen and bath remodels to whole-house renovations and additions — built by a crew that already meets insurance-grade documentation standards every day.",
    intro:
      "After we put a property back together, many clients keep us on for the renovation they actually want. ONA Restoration's remodeling division handles full kitchen and bath renovations, whole-house remodels, structural additions, basement and ADU build-outs, and custom millwork — all delivered with the same crew, the same documentation discipline, and the same IICRC-grade workmanship as our restoration projects.",
    body: [
      {
        heading: "What we build",
        paragraphs: [
          "Full kitchen renovations — cabinetry, countertops, tile, lighting, electrical, plumbing relocation. Bathroom remodels from shower-only refresh to full gut-and-replace including curbless wet rooms and steam showers. Whole-house renovations including layout reconfiguration, structural openings, and finish-package upgrades. Basement and attic build-outs, ADU and garage conversions, and second-story additions.",
          "Custom millwork — built-ins, paneling, wainscoting, libraries, integrated banquettes, mantels, closet systems. Hardwood, stone, and large-format tile installation. Trade-grade electrical, plumbing, and HVAC work coordinated under one general contractor.",
        ],
      },
      {
        heading: "Why our restoration roots matter",
        paragraphs: [
          "Restoration contractors know how houses fail. We see what's behind the drywall every week — the rotted sill plates, the undersized headers, the abandoned shut-offs, the surprises that turn a 6-week remodel into 16. That knowledge means we scope projects with fewer change orders and fewer end-of-project surprises than firms that only do new finish work.",
          "We document every project the way an insurance adjuster expects — measurements, daily progress photos, a written scope, and weekly client updates. It's overkill for most remodels, and it's exactly why our clients keep us on for everything after the first restoration job.",
        ],
      },
      {
        heading: "Upgrades during a restoration claim",
        paragraphs: [
          "When insurance is rebuilding a damaged room, you can often upgrade finishes and pay only the difference — the carrier pays for like-kind replacement, you pay the betterment delta. This is the cleanest way to fund a kitchen or bath upgrade and we handle the documentation so the carrier-paid portion and the owner-paid portion are tracked separately from day one.",
        ],
      },
    ],
    process: [
      {
        step: "1. Consultation & scope",
        text: "In-home consultation, scope outline, photo documentation, and an honest preliminary budget range before any drawings start.",
      },
      {
        step: "2. Design & specifications",
        text: "Drawings, finish selections, fixture and appliance specifications, and a fixed-scope written agreement before demolition.",
      },
      {
        step: "3. Permitting & pre-construction",
        text: "Permits pulled where required (Vancouver, WA / Portland metro), subs scheduled, materials ordered with lead-time tracked weekly.",
      },
      {
        step: "4. Build",
        text: "Demolition, framing, MEP rough-in, drywall, finish carpentry, paint, and final installations. Weekly progress photos and client check-ins.",
      },
      {
        step: "5. Walkthrough & punch list",
        text: "Final walkthrough with the client, documented punch list, and warranty issued on completion.",
      },
    ],
    signs: [
      "Your kitchen or bath is original to the house and showing wear",
      "Layout no longer fits how you actually live in the space",
      "You're considering an addition, ADU, or basement build-out",
      "Insurance is rebuilding a damaged room and you'd like to upgrade",
      "You've inherited or purchased a property that needs full renovation",
      "Multiple subs gave you wildly different timelines — you want one accountable contractor",
    ],
    faqs: [
      {
        q: "Do you take on remodels without a prior restoration project?",
        a: "Yes. Remodeling and reconstruction is a full division — clients come to us directly for new renovations as often as they come to us after a loss. Restoration credentials apply the same craftsmanship discipline either way.",
      },
      {
        q: "Can I upgrade finishes during an insurance claim?",
        a: "Yes — this is called betterment. The carrier pays for like-kind replacement of the damaged finishes, and you pay only the difference for the upgrade. We document the carrier-paid scope and the owner-paid overage separately so the math is clean for everyone.",
      },
      {
        q: "What's the timeline for a full kitchen remodel?",
        a: "Most full kitchen renovations run 8–12 weeks from demolition to final install once permits are in hand. Long-lead items (custom cabinetry, specialty stone, imported tile) can extend that — we surface the critical path at design stage so you know what's driving the schedule.",
      },
      {
        q: "Do you handle architectural drawings and permits?",
        a: "For non-structural remodels (kitchens, baths, layout changes within existing walls) we handle drawings in-house. For additions, structural changes, and projects requiring engineered drawings, we partner with licensed architects and structural engineers and manage the permit process end-to-end.",
      },
      {
        q: "Are you licensed for new construction in both WA and OR?",
        a: "Yes — licensed, bonded, and insured for both restoration and new construction in Washington and Oregon. Permitting jurisdictions across the Portland metro know us by name.",
      },
    ],
  },
];

// ─── Three co-equal business lines (pillars) ──────────────────
// The site presents three directions of work. Mold and Remodeling
// each get their own elevated landing/section; Restoration is the
// multi-discipline emergency line. All three still live in the same
// `services` array (so /services/<slug> + city pages auto-generate),
// but these helpers are the single source of truth for which slug
// belongs to which pillar — use them instead of ad-hoc
// `s.slug !== "remodeling"` filters.
export const RESTORATION_SLUGS = [
  "water-damage",
  "fire-damage",
  "storm-damage",
] as const;
export const MOLD_SLUG = "mold-removal";
export const REMODELING_SLUG = "remodeling";

export const restorationServices = services.filter((s) =>
  RESTORATION_SLUGS.includes(s.slug as (typeof RESTORATION_SLUGS)[number]),
);
export const moldService = services.find((s) => s.slug === MOLD_SLUG)!;
export const remodelingService = services.find(
  (s) => s.slug === REMODELING_SLUG,
)!;

export const findService = (slug: string) =>
  services.find((s) => s.slug === slug);
