import type { UnsupportedEvidenceReviewDisplay } from "@/lib/analysis/unsupported-evidence-review-state";

// Dev-only, synthetic review states for the unsupported-evidence bridge.
//
// These are literal, hand-authored display states. The unsupported-evidence
// mapper and workflow boundary helper are NOT value-imported and are NOT called
// here, so this route cannot become runtime behavior by accident.

export type UnsupportedEvidenceReviewRenderCase = {
  key: string;
  title: string;
  caption: string;
  badgeLabel: string;
  badgeTone: "amber" | "cyan" | "rose" | "slate";
  review: UnsupportedEvidenceReviewDisplay;
};

type CommonUnsupportedEvidenceReviewFields = Omit<
  UnsupportedEvidenceReviewDisplay,
  "outcome" | "evidenceTypeLabel" | "supportRepSummary" | "confidenceTreatment" | "internalNotes"
>;

const SCORE_BOUNDARY_NOTICE = "This result is not a receipt verification outcome.";

const COMMON_GUIDANCE = [
  "Manual review recommended before action.",
  "Request an eligible receipt document if available.",
  "Use available evidence and support policy to decide the next step.",
  "No automated decision should be made from this bridge.",
] satisfies string[];

const COMMON_BLOCKED_OUTPUT_REASONS = [
  "Automated scoring fields are blocked for this bridge.",
  "Receipt report fields are blocked for unsupported evidence.",
  "Product-photo-specific output is blocked because runtime is not live.",
  "Final claim outcome wording is blocked.",
] satisfies string[];

const COMMON_REVIEW_MARKERS = {
  resultKind: "unsupported-evidence-review",
  state: "unsupportedEvidenceReview",
  boundary: "unsupported-evidence-display-mapping-probe",
  reviewStatus: "Manual review recommended",
  riskTreatment: "No automated risk treatment assigned",
  manualReviewGuidance: [...COMMON_GUIDANCE],
  customerSafeWording:
    "This file type is not supported for automated receipt analysis. Please provide an eligible receipt document if available, or our team can review the submitted evidence manually.",
  allowedNextActions: ["manual-review", "request-eligible-receipt", "use-support-policy"],
  blockedOutputReasons: [...COMMON_BLOCKED_OUTPUT_REASONS],
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
} satisfies CommonUnsupportedEvidenceReviewFields;

export const unsupportedEvidenceReviewCases = [
  {
    key: "generic-unsupported-evidence",
    title: "Generic unsupported evidence",
    caption: "Synthetic unsupported evidence stopped before automated receipt analysis.",
    badgeLabel: "Unsupported evidence",
    badgeTone: "amber",
    review: {
      ...COMMON_REVIEW_MARKERS,
      outcome: "unsupported-evidence",
      evidenceTypeLabel: "Unsupported evidence for automated receipt analysis",
      supportRepSummary:
        "This synthetic file type is unsupported for automated receipt analysis and should remain a manual-review stop state.",
      confidenceTreatment: {
        label: "Not analyzed",
        summary: "Confidence is not assigned because automated analysis did not run.",
        scoreBoundaryNotice: SCORE_BOUNDARY_NOTICE,
      },
      internalNotes: [
        "Synthetic dev-only bridge case; no upload, OCR, metadata, analyzer, or report path is invoked.",
        "Unsupported state is rendered only as manual-review support.",
      ],
    },
  },
  {
    key: "product-photo-like-unsupported",
    title: "Product-photo-like evidence",
    caption: "Synthetic product-photo-like routing hint shown as unsupported, not analyzed.",
    badgeLabel: "Product-photo-like unsupported",
    badgeTone: "rose",
    review: {
      ...COMMON_REVIEW_MARKERS,
      outcome: "product-photo-like-unsupported",
      evidenceTypeLabel: "Product photo evidence unsupported for automated receipt analysis",
      supportRepSummary:
        "Product-photo-like routing hints remain non-live and are shown only as an unsupported manual-review state.",
      confidenceTreatment: {
        label: "Not analyzed",
        summary: "Confidence is not assigned because automated analysis did not run.",
        scoreBoundaryNotice: SCORE_BOUNDARY_NOTICE,
      },
      internalNotes: [
        "Product-photo runtime remains non-live.",
        "This bridge does not route product-photo review components or analyzer paths.",
      ],
    },
  },
  {
    key: "legacy-photo-terminology",
    title: "Legacy photo terminology",
    caption: "Synthetic legacy terminology compatibility case with safe visible wording.",
    badgeLabel: "Legacy terminology",
    badgeTone: "slate",
    review: {
      ...COMMON_REVIEW_MARKERS,
      outcome: "legacy-damage-photo-quarantine",
      evidenceTypeLabel: "Legacy photo terminology unsupported for automated receipt analysis",
      supportRepSummary:
        "Legacy photo terminology is treated as a compatibility signal only and does not create a live product-photo path.",
      confidenceTreatment: {
        label: "Not analyzed",
        summary: "Confidence is not assigned because automated analysis did not run.",
        scoreBoundaryNotice: SCORE_BOUNDARY_NOTICE,
      },
      internalNotes: [
        "Compatibility terminology remains non-canonical for runtime.",
        "No live product-photo route is produced.",
      ],
    },
  },
  {
    key: "unknown-inconclusive-routing",
    title: "Unknown routing state",
    caption: "Synthetic unknown evidence hint with inconclusive lightweight routing.",
    badgeLabel: "Routing inconclusive",
    badgeTone: "slate",
    review: {
      ...COMMON_REVIEW_MARKERS,
      outcome: "unknown-inconclusive",
      evidenceTypeLabel: "Evidence type could not be routed",
      supportRepSummary:
        "Lightweight routing did not produce an eligible automated receipt path, so this state remains manual-review-only.",
      confidenceTreatment: {
        label: "Routing inconclusive",
        summary: "Lightweight routing hints were insufficient for automated receipt analysis.",
        scoreBoundaryNotice: SCORE_BOUNDARY_NOTICE,
      },
      internalNotes: [
        "Routing did not produce enough synthetic context for automated receipt analysis.",
        "The bridge shows uncertainty without assigning a numeric confidence.",
      ],
    },
  },
  {
    key: "order-screenshot-unsupported",
    title: "Order screenshot unsupported state",
    caption: "Synthetic order screenshot stopped outside automated receipt reporting.",
    badgeLabel: "Order screenshot",
    badgeTone: "cyan",
    review: {
      ...COMMON_REVIEW_MARKERS,
      outcome: "unsupported-evidence",
      evidenceTypeLabel: "Order screenshot unsupported for automated receipt analysis",
      supportRepSummary:
        "This synthetic order screenshot state is unsupported for automated receipt analysis and should be reviewed manually.",
      confidenceTreatment: {
        label: "Not analyzed",
        summary: "Confidence is not assigned because automated analysis did not run.",
        scoreBoundaryNotice: SCORE_BOUNDARY_NOTICE,
      },
      internalNotes: [
        "Order screenshot context is not mapped into receipt report fields here.",
        "The bridge does not run parser, scoring, or report mapping paths.",
      ],
    },
  },
  {
    key: "ambiguous-pdf-unsupported",
    title: "Ambiguous PDF stopped state",
    caption: "Synthetic ambiguous PDF hint stopped for manual review.",
    badgeLabel: "Ambiguous PDF",
    badgeTone: "amber",
    review: {
      ...COMMON_REVIEW_MARKERS,
      outcome: "unknown-inconclusive",
      evidenceTypeLabel: "Ambiguous PDF unsupported for automated receipt analysis",
      supportRepSummary:
        "The synthetic PDF routing hints are ambiguous, so no automated receipt result is produced from this bridge.",
      confidenceTreatment: {
        label: "Routing inconclusive",
        summary: "Lightweight routing hints were insufficient for automated receipt analysis.",
        scoreBoundaryNotice: SCORE_BOUNDARY_NOTICE,
      },
      internalNotes: [
        "Ambiguous PDF review stays outside receipt report output.",
        "No OCR or metadata processing is invoked by this bridge.",
      ],
    },
  },
  {
    key: "receipt-like-not-parseable",
    title: "Receipt-like not parseable",
    caption: "Synthetic receipt-like hint that does not produce automated receipt analysis.",
    badgeLabel: "Receipt-like stopped",
    badgeTone: "cyan",
    review: {
      ...COMMON_REVIEW_MARKERS,
      outcome: "unsupported-evidence",
      evidenceTypeLabel: "Receipt-like evidence not parseable by automated receipt analysis",
      supportRepSummary:
        "Receipt-like hints were not enough to produce an automated result, so a reviewer should inspect the available evidence.",
      confidenceTreatment: {
        label: "Not analyzed",
        summary: "Confidence is not assigned because automated analysis did not run.",
        scoreBoundaryNotice: SCORE_BOUNDARY_NOTICE,
      },
      internalNotes: [
        "The live receipt analyzer is not called by this route.",
        "This case exists to show stopped-state wording only.",
      ],
    },
  },
  {
    key: "hostile-private-sentinel-omitted",
    title: "Private sentinel omitted",
    caption: "Synthetic hostile/private source value is represented only by safe derived wording.",
    badgeLabel: "Private value omitted",
    badgeTone: "rose",
    review: {
      ...COMMON_REVIEW_MARKERS,
      outcome: "unsupported-evidence",
      evidenceTypeLabel: "Unsupported evidence for automated receipt analysis",
      supportRepSummary:
        "A synthetic private source value was omitted. The bridge renders only generic review text and no raw identifiers.",
      confidenceTreatment: {
        label: "Not analyzed",
        summary: "Confidence is not assigned because automated analysis did not run.",
        scoreBoundaryNotice: SCORE_BOUNDARY_NOTICE,
      },
      internalNotes: [
        "Raw private source values are not rendered, copied, or stored in this route.",
        "Only derived, synthetic, privacy-safe review state is visible.",
      ],
    },
  },
  {
    key: "long-text-layout-stress",
    title: "Long-text wrapping state",
    caption: "Synthetic long text used to verify responsive layout without real evidence content.",
    badgeLabel: "Layout stress",
    badgeTone: "slate",
    review: {
      ...COMMON_REVIEW_MARKERS,
      outcome: "unknown-inconclusive",
      evidenceTypeLabel: "Evidence type could not be routed",
      supportRepSummary:
        "This intentionally long synthetic stopped-state summary exists only to verify that the unsupported-evidence bridge wraps dense review text cleanly on desktop and mobile widths without horizontal overflow, overlapping labels, or confusing nested scrolling.",
      confidenceTreatment: {
        label: "Routing inconclusive",
        summary:
          "Lightweight routing hints were insufficient for automated receipt analysis, and the bridge keeps that uncertainty visible without assigning a score.",
        scoreBoundaryNotice: SCORE_BOUNDARY_NOTICE,
      },
      internalNotes: [
        "Long synthetic note for layout verification only; no real evidence content is represented.",
        "Reviewers should see complete guidance without clipped text.",
      ],
    },
  },
  {
    key: "manual-review-no-live-marker",
    title: "Manual-review-only marker",
    caption: "Synthetic case emphasizing no-live isolation markers.",
    badgeLabel: "No-live marker",
    badgeTone: "amber",
    review: {
      ...COMMON_REVIEW_MARKERS,
      outcome: "product-photo-like-unsupported",
      evidenceTypeLabel: "Unsupported evidence for automated receipt analysis",
      supportRepSummary:
        "This bridge is a developer-only visual review surface. It does not make automated decisions or run analysis.",
      confidenceTreatment: {
        label: "Not analyzed",
        summary: "Confidence is not assigned because automated analysis did not run.",
        scoreBoundaryNotice: SCORE_BOUNDARY_NOTICE,
      },
      internalNotes: [
        "Runtime live: no.",
        "Manual review only: yes.",
      ],
    },
  },
] satisfies readonly UnsupportedEvidenceReviewRenderCase[];
