import type { ClaimReport } from "./config";

// Sample forensic review. Used by the landing-page preview tile and by
// /claimlens/report when accessed without a real analysis in session.
//
// Editorial principle: every entry below is written the way a senior
// IICRC estimator would describe it on a desk review. No fabricated
// dollar amounts. No fabricated policy language. Every finding ties
// to a fictional but realistic document reference and explains the
// workflow consequence — not a hand-wave "this is usually included."

export const sampleReport: ClaimReport = {
  snapshot: {
    claimType: "Water — Cat-2, sample",
    documentsReviewed: 5,
    estimateTotal: "Sample — not a real figure",
    lossDate: "Sample",
    carrier: "Sample Carrier",
    propertyState: "WA",
  },
  keyFindings: [
    {
      label:
        "Detach/reset approved without corresponding finish restoration on the same room scope",
      severity: "high",
      summary:
        "Carrier estimate approves detach/reset operations for baseboards in the Kitchen and adjacent Hallway, which recognises trim disturbance during the rebuild sequence. However, related finish-restoration operations (caulk reset, nail-fill, localised paint touch-up) are not itemised in the same room scopes.",
    },
    {
      label:
        "Drywall replacement quantity does not appear consistent with the photographed affected area",
      severity: "high",
      summary:
        "Drywall replacement is approved on the affected Kitchen elevation. The replacement quantity on the carrier estimate does not appear consistent with the wall area shown in the uploaded photographs, particularly above the cabinet line where moisture staining is visible.",
    },
    {
      label:
        "Mitigation invoice — equipment days not tied to affected rooms",
      severity: "medium",
      summary:
        "Mitigation invoice itemises equipment days for air movers and dehumidifiers but does not break down equipment placement by affected room. Without daily logs or moisture-reading records, equipment day count cannot be independently verified against the documented loss area.",
    },
    {
      label: "Policy language not provided",
      severity: "needs-documentation",
      summary:
        "No insurance policy document was uploaded. Coverage scope, exclusions, deductible application, and any applicable endorsements could not be reviewed in this analysis.",
    },
  ],
  missingScope: [
    {
      item: "Caulk reset, nail-fill, and localised paint touch-up on detached/reset MDF baseboards",
      whyItMatters:
        "When MDF baseboards are detached and reset during flooring or drywall repairs, existing caulk lines at the wall-to-trim transition and the trim-to-floor transition are routinely disturbed during removal. Reinstallation typically requires fresh caulk, nail-hole fill, and localised paint touch-up to restore a uniform appearance along the wall and trim transitions. Without this finish work, the reset trim reads as visibly disturbed under normal lighting despite the trim itself being reused.",
      evidenceReference:
        "Carrier estimate — Room: Kitchen, line item 'R&R Baseboard - detach & reset'",
      evidenceNeeded:
        "Pre-loss photographs of the affected baseboard transitions, contractor scope confirmation on whether finish restoration was assumed in their pricing, photos of the trim transitions after reset.",
      confidence: "likely",
      severity: "medium",
      recommendedQuestion:
        "Could you clarify whether caulk reset and localised paint touch-up at the wall-to-trim transition were considered as part of the detach/reset operation, or whether they were assumed to be priced separately?",
    },
    {
      item: "Texture match (skip-trowel) on patched drywall, hallway elevation",
      whyItMatters:
        "Drywall replacement on a textured wall typically requires texture match before paint. Without texture work, the finished repair plane reads visibly different from the undisturbed wall under raking light, even when the painted finish is otherwise uniform. The uploaded carrier estimate includes drywall removal and replacement on the affected hallway elevation but does not itemise a texture operation matching the adjacent existing finish.",
      evidenceReference:
        "Carrier estimate — Room: Hallway, line item 'R&R Drywall 1/2\\\" - hung, taped, ready for texture'",
      evidenceNeeded:
        "Close-up photograph of the existing wall texture pattern in the affected elevation; confirmation from the contractor on whether texture match is being priced separately.",
      confidence: "likely",
      severity: "medium",
      recommendedQuestion:
        "Could you walk me through how texture match was accounted for on the hallway drywall replacement — was it included on a separate line item, or assumed to be priced within the drywall installation?",
    },
    {
      item: "Antimicrobial application to wall cavity, Kitchen wet wall",
      whyItMatters:
        "Per IICRC S500 guidance, when Cat-2 water has intruded a wall cavity, application of an EPA-registered antimicrobial is commonly part of the mitigation scope to limit secondary microbial amplification before reconstruction. The uploaded mitigation invoice itemises water extraction and structural drying but does not show an antimicrobial line item for the Kitchen wet wall, where moisture readings would indicate cavity exposure.",
      evidenceReference:
        "Mitigation invoice — extraction and drying lines; no antimicrobial line item",
      evidenceNeeded:
        "Mitigation daily logs noting antimicrobial application and the rooms in which it was applied; moisture-reading records for the affected wet wall.",
      confidence: "possible",
      severity: "medium",
      recommendedQuestion:
        "Could you share the mitigation daily logs showing whether antimicrobial was applied to the Kitchen wet wall cavity, and if so, why it isn't itemised on the invoice provided?",
    },
    {
      item: "Floor protection (Ram Board or equivalent) on adjacent unaffected rooms during demolition and equipment placement",
      whyItMatters:
        "Industry guidance typically expects temporary floor protection on adjacent unaffected rooms during demolition and equipment placement to prevent secondary damage from foot traffic, equipment movement, and debris. Without protection, finished flooring in adjacent rooms can sustain scuffs, gouges, or moisture damage that becomes its own claim item or is absorbed by the property owner.",
      evidenceReference: "Mitigation invoice — equipment placement room list",
      evidenceNeeded:
        "Mitigation daily logs or progress photographs showing floor protection installed in adjacent rooms.",
      confidence: "possible",
      severity: "low",
      recommendedQuestion:
        "Could you confirm whether floor protection was installed in the adjacent unaffected rooms during demolition and equipment placement, and if so, whether it's included in the mitigation invoice line items?",
    },
    {
      item: "HEPA air filtration during demolition phase",
      whyItMatters:
        "When demolition occurs within a containment area, HEPA air filtration is commonly used to control airborne particulates and prevent cross-contamination of adjacent unaffected spaces. The mitigation invoice itemises containment but does not separately identify HEPA air scrubber equipment days.",
      evidenceReference:
        "Mitigation invoice — containment line; no HEPA air scrubber line",
      evidenceNeeded:
        "Mitigation daily equipment logs noting HEPA air scrubber placement and run-time.",
      confidence: "needs-verification",
      severity: "needs-documentation",
      recommendedQuestion:
        "Could you confirm whether HEPA air scrubbers were operated during the demolition phase, and if so, why the equipment days aren't separately itemised on the mitigation invoice?",
    },
  ],
  inconsistencies: [
    {
      title:
        "Carrier approved finish-disruption operations without corresponding trim restoration",
      detail:
        "Carrier estimate approves drywall patching, masking, and texture preparation operations in the Kitchen and Hallway, which recognise finish disruption in those rooms. However, related trim finish restoration (caulk reset, nail-fill, localised paint touch-up at the wall-to-trim transition) is not itemised for the same rooms. The presence of the upstream operations logically implies the downstream finish-restoration sequence.",
      severity: "high",
    },
    {
      title:
        "Drywall replacement quantity vs. photographed affected wall area",
      detail:
        "Drywall replacement quantity on the carrier estimate for the Kitchen elevation does not appear consistent with the affected wall area visible in the uploaded photographs, particularly above the cabinet line where moisture staining is documented. A measurement-based reconciliation against the contractor estimate or a site re-inspection would resolve this.",
      severity: "high",
    },
    {
      title: "Mitigation invoice equipment days lack per-room allocation",
      detail:
        "Mitigation invoice itemises equipment days in aggregate but does not break down equipment placement by affected room. Without daily logs or per-room equipment-placement records, the equipment day count cannot be independently reconciled against the documented loss area.",
      severity: "medium",
    },
    {
      title:
        "Carrier estimate vs. contractor estimate — line-by-line reconciliation not performed",
      detail:
        "Both the carrier estimate and the contractor estimate are in the file. A line-by-line reconciliation of approved operations, quantities, and unit prices is the highest-value next step to surface specific supplement opportunities.",
      severity: "medium",
    },
  ],
  questionsToAsk: [
    "Could you walk me through how the affected wall area was measured for the drywall replacement quantity on the Kitchen elevation — was the measurement based on the contractor's documented area or carrier-estimator field measurement?",
    "Could you clarify whether caulk reset, nail-fill, and localised paint touch-up at the wall-to-trim transition were considered as part of the baseboard detach/reset operation, or whether they were assumed to be priced separately?",
    "Could you walk me through how texture match on the hallway drywall replacement was accounted for — included on a separate line, or assumed within the drywall installation pricing?",
    "Could you share the mitigation daily logs noting equipment placement by room, antimicrobial application, and HEPA air scrubber run-time during the demolition phase?",
    "Could you confirm whether floor protection was installed in adjacent unaffected rooms during demolition and equipment placement, and where it appears on the mitigation invoice?",
  ],
  documentationChecklist: [
    {
      label:
        "Photographs of every affected room and elevation, with reference scale where possible",
    },
    {
      label:
        "Field measurements of affected wall and floor areas (length, width, ceiling height)",
    },
    {
      label:
        "Mitigation daily logs and equipment-placement records, including moisture readings",
    },
    {
      label:
        "Contractor scope of work with line-item-level breakdown and unit pricing",
    },
    { label: "Carrier estimate — most recent revision, including any supplements" },
    {
      label:
        "Insurance policy declarations page and full policy form, including endorsements",
    },
    {
      label:
        "Any denial, partial-denial, or coverage-clarification letters from the carrier",
    },
    {
      label:
        "ITEL or material-matching documentation if discontinued materials are involved",
    },
    {
      label:
        "Product / finish specifications where matching is required (paint code, texture pattern, flooring SKU)",
    },
  ],
  generatedAt: new Date(2026, 4, 15).toISOString(),
  source: "demo",
};
