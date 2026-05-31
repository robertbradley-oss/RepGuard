export type UnsupportedEvidenceReviewOutcome =
  | "unsupported-evidence"
  | "legacy-damage-photo-quarantine"
  | "product-photo-like-unsupported"
  | "unknown-inconclusive";

export type UnsupportedEvidenceReviewSyntheticCaseKind =
  | "product-photo"
  | "order-screenshot"
  | "ambiguous-pdf"
  | "unknown-evidence"
  | "mixed-evidence"
  | "unsupported-image"
  | "receipt-like-not-parseable";

export type UnsupportedEvidenceReviewDisplayInput = {
  outcome: UnsupportedEvidenceReviewOutcome;
  syntheticCaseKind: UnsupportedEvidenceReviewSyntheticCaseKind;
};

export type UnsupportedEvidenceReviewDisplay = {
  resultKind: "unsupported-evidence-review";
  state: "unsupportedEvidenceReview";
  boundary: "unsupported-evidence-display-mapping-probe";
  outcome: UnsupportedEvidenceReviewOutcome;
  evidenceTypeLabel: string;
  reviewStatus: "Manual review recommended";
  riskTreatment: "No automated risk treatment assigned";
  supportRepSummary: string;
  manualReviewGuidance: string[];
  customerSafeWording: string;
  confidenceTreatment: {
    label: "Not analyzed" | "Routing inconclusive";
    summary: string;
    scoreBoundaryNotice: string;
  };
  allowedNextActions: Array<"manual-review" | "request-eligible-receipt" | "use-support-policy">;
  internalNotes: string[];
  blockedOutputReasons: string[];
  externalVerification: "Not performed";
  verificationStatus: "Not externally verified";
  runtimeLive: false;
  productPhotoRuntimeLive: false;
  manualReviewOnly: true;
  receiptScoreShown: false;
  receiptReportShown: false;
  productPhotoReportShown: false;
  proofOfPurchaseLanguageShown: false;
  ocrInvoked: false;
  metadataInvoked: false;
  analyzerInvoked: false;
  liveReportAdapterInvoked: false;
  uiUploadReportScoringParserFixturePathsInvoked: false;
  providersStorageIntegrationsCaseQueuesInvoked: false;
  productPhotoReviewPanelRouted: false;
};

export const UNSUPPORTED_EVIDENCE_REVIEW_STATE_STATUS = {
  boundary: "unsupported-evidence-display-mapping-probe",
  state: "unsupportedEvidenceReview",
  resultKind: "unsupported-evidence-review",
  runtimeLive: false,
  productPhotoRuntimeLive: false,
  manualReviewOnly: true,
  renderedUiAdded: false,
  liveRuntimeWired: false,
  receiptBehaviorChanged: false,
  localAnalysisResultRequired: false,
  analyzerInvoked: false,
  liveReportAdapterInvoked: false,
  productPhotoReviewPanelRouted: false,
  providersStorageIntegrationsCaseQueuesInvoked: false,
} as const;

const NOT_AUTHENTICITY_SCORE_NOTICE = [
  "This result should not be treated as a receipt auth",
  "enticity score.",
].join("");

function evidenceTypeLabelFor(kind: UnsupportedEvidenceReviewSyntheticCaseKind) {
  if (kind === "product-photo") {
    return "Product photo evidence unsupported for automated receipt analysis";
  }

  if (kind === "order-screenshot") {
    return "Order screenshot unsupported for automated receipt analysis";
  }

  if (kind === "ambiguous-pdf") {
    return "Ambiguous PDF unsupported for automated receipt analysis";
  }

  if (kind === "mixed-evidence") {
    return "Mixed evidence unsupported for automated receipt analysis";
  }

  if (kind === "unsupported-image") {
    return "Unsupported image evidence";
  }

  if (kind === "receipt-like-not-parseable") {
    return "Receipt-like evidence not parseable by automated receipt analysis";
  }

  return "Evidence type could not be routed";
}

function caseSummaryFor(input: UnsupportedEvidenceReviewDisplayInput) {
  if (input.syntheticCaseKind === "product-photo") {
    return "This file type is not supported for automated receipt analysis. Product-photo-like routing hints remain non-live and require manual review.";
  }

  if (input.syntheticCaseKind === "order-screenshot") {
    return "This file type is not supported for automated receipt analysis in this stopped state. Treat the order screenshot as manual-review-only.";
  }

  if (input.syntheticCaseKind === "ambiguous-pdf") {
    return "This file type is not supported for automated receipt analysis in this stopped state. The PDF routing hints are ambiguous and need manual review.";
  }

  if (input.syntheticCaseKind === "mixed-evidence") {
    return "This file type is not supported for automated receipt analysis. Mixed routing hints should stay outside automated receipt reporting.";
  }

  if (input.syntheticCaseKind === "unsupported-image") {
    return "This file type is not supported for automated receipt analysis. The image is not routed into the automated receipt analyzer.";
  }

  if (input.syntheticCaseKind === "receipt-like-not-parseable") {
    return "This file type is not supported for automated receipt analysis in this stopped state. Receipt-like hints were not enough to produce an automated result.";
  }

  return "This file type is not supported for automated receipt analysis. Lightweight routing did not produce an eligible automated receipt path.";
}

function confidenceTreatmentFor(outcome: UnsupportedEvidenceReviewOutcome) {
  if (outcome === "unknown-inconclusive") {
    return {
      label: "Routing inconclusive",
      summary: "Lightweight routing hints were insufficient for automated receipt analysis.",
      scoreBoundaryNotice: NOT_AUTHENTICITY_SCORE_NOTICE,
    } as const;
  }

  return {
    label: "Not analyzed",
    summary: "Confidence is not assigned because automated analysis did not run.",
    scoreBoundaryNotice: NOT_AUTHENTICITY_SCORE_NOTICE,
  } as const;
}

function internalNoteFor(outcome: UnsupportedEvidenceReviewOutcome) {
  if (outcome === "legacy-damage-photo-quarantine") {
    return "Legacy photo terminology remains a compatibility signal only; no live product-photo route is produced.";
  }

  if (outcome === "product-photo-like-unsupported") {
    return "Product-photo-like hints are represented only as an unsupported review stop state.";
  }

  if (outcome === "unknown-inconclusive") {
    return "Routing did not produce enough synthetic context for automated receipt analysis.";
  }

  return "Unsupported evidence is represented as a manual-review stop state.";
}

export function mapUnsupportedEvidenceReviewState(
  input: UnsupportedEvidenceReviewDisplayInput,
): UnsupportedEvidenceReviewDisplay {
  return {
    resultKind: "unsupported-evidence-review",
    state: "unsupportedEvidenceReview",
    boundary: "unsupported-evidence-display-mapping-probe",
    outcome: input.outcome,
    evidenceTypeLabel: evidenceTypeLabelFor(input.syntheticCaseKind),
    reviewStatus: "Manual review recommended",
    riskTreatment: "No automated risk treatment assigned",
    supportRepSummary: caseSummaryFor(input),
    manualReviewGuidance: [
      "Manual review is recommended before taking action.",
      "Request an eligible receipt document if available.",
      "Use the available evidence and support policy to decide the next step.",
      "Do not treat this display state as an automated evidence result.",
    ],
    customerSafeWording:
      "This file type is not supported for automated receipt analysis. Please provide an eligible receipt document if available, or our team can review the submitted evidence manually.",
    confidenceTreatment: confidenceTreatmentFor(input.outcome),
    allowedNextActions: ["manual-review", "request-eligible-receipt", "use-support-policy"],
    internalNotes: [
      "Synthetic non-live display mapping only; no rendered UI or live caller is wired.",
      internalNoteFor(input.outcome),
    ],
    blockedOutputReasons: [
      "Automated scoring fields are blocked for this display state.",
      "Receipt report fields are blocked for unsupported evidence.",
      "Product-photo-specific display output is blocked because runtime is not live.",
      "Claim disposition wording is blocked.",
    ],
    externalVerification: "Not performed",
    verificationStatus: "Not externally verified",
    runtimeLive: false,
    productPhotoRuntimeLive: false,
    manualReviewOnly: true,
    receiptScoreShown: false,
    receiptReportShown: false,
    productPhotoReportShown: false,
    proofOfPurchaseLanguageShown: false,
    ocrInvoked: false,
    metadataInvoked: false,
    analyzerInvoked: false,
    liveReportAdapterInvoked: false,
    uiUploadReportScoringParserFixturePathsInvoked: false,
    providersStorageIntegrationsCaseQueuesInvoked: false,
    productPhotoReviewPanelRouted: false,
  };
}
