import type { ClaimReport } from "./config";

// Generic, fact-free sample report. Per the project brief: no fake dollar
// amounts, no invented policy language, no invented code citations.
// Every finding here is phrased as a possibility tied to a placeholder
// document reference. Used by the landing page preview tile and by
// /claimlens/report when accessed without a real analysis in session.
export const sampleReport: ClaimReport = {
  snapshot: {
    claimType: "Water — sample",
    documentsReviewed: 5,
    estimateTotal: "Sample — not a real figure",
    lossDate: "Sample",
    carrier: "Sample Carrier",
    propertyState: "WA",
  },
  keyFindings: [
    {
      label: "Possible missing baseboard paint touch-up",
      severity: "medium",
      summary:
        "Baseboards appear to be detached and reset in the estimate, but related paint touch-up does not appear on the same room scope.",
    },
    {
      label: "Quantity mismatch detected",
      severity: "high",
      summary:
        "Estimate references a drywall replacement quantity that may not align with the affected wall area shown in the uploaded photos.",
    },
    {
      label: "Mitigation invoice requires line-by-line review",
      severity: "needs-documentation",
      summary:
        "Mitigation invoice line items do not appear to be itemized against equipment days or affected rooms in the uploaded documents.",
    },
    {
      label: "Policy language not provided",
      severity: "needs-documentation",
      summary:
        "No policy document was uploaded, so coverage language, exclusions, and limitations were not reviewed.",
    },
  ],
  missingScope: [
    {
      item: "Baseboard paint touch-up after detach/reset",
      whyItMatters:
        "When baseboards are detached and reset, the paint finish typically requires touch-up or blending where caulk lines and fasteners were disturbed.",
      evidenceReference: "Carrier estimate — Room: Kitchen (line item detach/reset baseboard)",
      evidenceNeeded:
        "Photos of baseboards before and after reset, and any caulk/paint line disturbances.",
      confidence: "likely",
      severity: "medium",
      recommendedQuestion:
        "Could you clarify whether baseboard paint touch-up after detach and reset was included in the room scope?",
    },
    {
      item: "Texture match to existing wall pattern",
      whyItMatters:
        "Drywall replacement on a textured wall typically requires texture match before paint, otherwise the repair is visible from normal viewing distance.",
      evidenceReference: "Carrier estimate — drywall patch on affected wall",
      evidenceNeeded:
        "Photo of existing wall texture pattern and adjacent wall surfaces.",
      confidence: "likely",
      severity: "medium",
      recommendedQuestion:
        "Was a texture match line item considered for the drywall patch on the affected wall?",
    },
    {
      item: "Floor protection during demolition and drying",
      whyItMatters:
        "Industry guidance typically expects floor protection on adjacent rooms during demolition and equipment setup to prevent secondary damage.",
      evidenceReference: "Mitigation invoice — equipment placement room list",
      evidenceNeeded:
        "Mitigation daily logs or photos showing protection in place.",
      confidence: "possible",
      severity: "low",
      recommendedQuestion:
        "Was floor protection of adjacent rooms during demolition and drying considered?",
    },
    {
      item: "Final cleaning after reconstruction",
      whyItMatters:
        "A final cleaning pass is typically expected after reconstruction to remove construction dust and prepare the space for occupancy.",
      evidenceReference: "Carrier estimate — repair scope summary",
      evidenceNeeded: "Confirmation in scope of work or rebuild section.",
      confidence: "possible",
      severity: "low",
      recommendedQuestion:
        "Is final cleaning included in the reconstruction scope?",
    },
    {
      item: "HEPA filtration during demolition",
      whyItMatters:
        "When demolition occurs in a containment, HEPA filtration is typically used to control airborne particulates.",
      evidenceReference: "Mitigation invoice — containment line",
      evidenceNeeded:
        "Mitigation daily logs or equipment placement records.",
      confidence: "needs-verification",
      severity: "needs-documentation",
      recommendedQuestion:
        "Were HEPA air scrubbers used during demolition, and if so, were they included on the mitigation invoice?",
    },
  ],
  inconsistencies: [
    {
      title: "Detach/reset approved without related paint touch-up",
      detail:
        "Estimate appears to approve baseboard detach/reset but does not appear to include the related paint touch-up that typically follows.",
      severity: "medium",
    },
    {
      title: "Wall area does not match drywall replacement quantity",
      detail:
        "Drywall replacement quantity on the estimate may not align with the affected wall area shown in the photos provided.",
      severity: "high",
    },
    {
      title: "Mitigation category gap",
      detail:
        "Mitigation invoice references equipment that does not appear to be tied to specific affected rooms in the documentation provided.",
      severity: "needs-documentation",
    },
  ],
  questionsToAsk: [
    "Could you walk me through how the affected wall area was measured for the drywall replacement quantity?",
    "Was baseboard paint touch-up considered as part of the room scope where baseboards are detached and reset?",
    "Could you share the mitigation daily logs and equipment placement records that support the invoiced equipment days?",
    "Was a texture match included for the drywall patch on the affected wall?",
    "Is final cleaning included in the reconstruction scope?",
  ],
  documentationChecklist: [
    { label: "Photos of every affected room, before any cleanup if available" },
    { label: "Measurements of affected areas (length, width, ceiling height)" },
    { label: "Moisture readings from the mitigation crew" },
    { label: "Mitigation daily logs and equipment placement records" },
    { label: "Contractor scope of work and detailed line-item estimate" },
    { label: "Carrier estimate (most recent revision)" },
    { label: "Insurance policy declarations page and full policy form" },
    { label: "Any denial, partial-denial, or coverage clarification letters" },
    {
      label: "ITEL or material-matching documentation if discontinued materials are involved",
    },
    { label: "Product or finish specifications where matching is required" },
  ],
  generatedAt: new Date(2026, 4, 15).toISOString(),
  source: "demo",
};
