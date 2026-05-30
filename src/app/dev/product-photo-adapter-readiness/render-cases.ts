import type { ProductPhotoAdapterReadinessResult } from "@/lib/analysis/product-photo-routing-adapter";

// Dev-only, synthetic review fixtures for the product-photo adapter-readiness
// harness.
//
// These are literal, hand-authored results that mirror what the adapter
// readiness boundary would produce. The readiness builder is NOT value-imported
// and is NOT called at render time, so this dev surface can never be mistaken
// for runtime adapter execution. No real files, photos, metadata, identifiers,
// object URLs, or handles appear here.

export type ProductPhotoAdapterReadinessReviewCase = {
  key: string;
  title: string;
  caption: string;
  result: ProductPhotoAdapterReadinessResult;
};

const ADAPTER_MARKERS = {
  boundary: "product-photo-adapter-readiness",
  devOnly: true,
  probeOnly: true,
  runtimeLive: false,
  manualReviewOnly: true,
  evidenceType: "product-photo",
  privacy: {
    derivedSummaryOnly: true,
    privateSourceValuesOmitted: true,
    exactMetadataOmitted: true,
    externalHandlesOmitted: true,
  },
  isolation: {
    localAnalysisResultRequired: false,
    analyzeEvidenceFileInvoked: false,
    analyzerRoutingInvoked: false,
    uiUploadReportScoringParserFixturePathsInvoked: false,
    providersStorageIntegrationsCaseQueuesInvoked: false,
  },
} as const;

const SCORE_SCOPE = "Local evidence quality and review readiness only";

const QUARANTINE_NOTE =
  "Legacy damage-photo compatibility alias is quarantined from canonical product-photo adapter readiness.";

const COMMON_LIMITATIONS = [
  "dev-only routing adapter; runtime analyzer behavior is not live",
  "manual-review support only",
];

export const productPhotoAdapterReadinessReviewCases: readonly ProductPhotoAdapterReadinessReviewCase[] = [
  {
    key: "accepted-analysis-result",
    title: "Accepted product-photo analysis-result",
    caption: "Synthetic canonical product-photo analysis-result readiness with derived fields only.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: true,
      inputKind: "analysis-result",
      score: {
        label: "Evidence Reliability Score",
        value: 68,
        scope: SCORE_SCOPE,
        meaning: "Score reflects product-photo review readiness and local evidence quality only.",
      },
      confidence: "Medium confidence",
      reviewPriority: "Manual review",
      localSignalLevel: "Medium",
      sourceKind: "synthetic-fixture",
      reviewSummary:
        "Synthetic non-live readiness case. Product-photo context is usable for local review but is not externally verified.",
      recommendedSupportAction:
        "Manual review recommended. Compare product-photo context with available receipt or order evidence.",
      customerSafeWording: "Thanks for the photo. We are reviewing it and may follow up if more context is needed.",
      limitations: [
        ...COMMON_LIMITATIONS,
        "product-photo details were built for a future routing candidate only",
      ],
      signals: [
        {
          label: "Image consistency needs manual review",
          category: "Image Consistency",
          severity: "Medium",
          confidencePercent: 61,
          reviewNote: "This local-only signal supports manual review priority.",
        },
      ],
    },
  },
  {
    key: "accepted-report-view-model",
    title: "Accepted product-photo report-view-model",
    caption: "Synthetic canonical product-photo report-view-model readiness with derived fields only.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: true,
      inputKind: "report-view-model",
      score: {
        label: "Evidence Reliability Score",
        value: 74,
        scope: SCORE_SCOPE,
        meaning: "Score reflects product-photo review readiness and local evidence quality only.",
      },
      confidence: "Medium confidence",
      reviewPriority: "Review",
      localSignalLevel: "Low",
      sourceKind: "synthetic-fixture",
      reviewSummary:
        "Synthetic non-live readiness case derived from a report-view-model. Local context only; not externally verified.",
      recommendedSupportAction: "Manual review recommended. Request only the additional view needed for review.",
      customerSafeWording: "Thanks for the photo. One clearer view may help us complete the review.",
      limitations: [
        ...COMMON_LIMITATIONS,
        "product-photo details were built for a future routing candidate only",
      ],
      signals: [
        {
          label: "Metadata context is limited",
          category: "Metadata Context",
          severity: "Low",
          confidencePercent: 52,
          reviewNote: "Metadata is context only and raw metadata values are omitted.",
        },
      ],
    },
  },
  {
    key: "top-level-damage-photo-quarantine",
    title: "Top-level legacy damage-photo quarantine",
    caption: "Synthetic legacy-compatibility input collapses to a quarantine result, never canonical runtime.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: false,
      inputKind: "legacy-quarantine",
      legacyCompatibility: {
        alias: "damage-photo",
        canonicalEvidenceType: "product-photo",
        quarantined: true,
        runtimeCandidate: false,
        note: QUARANTINE_NOTE,
      },
      score: {
        label: "Evidence Reliability Score",
        value: 0,
        scope: SCORE_SCOPE,
        meaning: "Quarantined legacy compatibility input; no readiness score is derived.",
      },
      confidence: "Low confidence",
      reviewPriority: "Manual review",
      localSignalLevel: "None",
      sourceKind: "manual-review-context",
      reviewSummary: "Synthetic legacy damage-photo compatibility input is quarantined and remains non-canonical.",
      recommendedSupportAction: "Manual review recommended. Legacy compatibility input is not a runtime candidate.",
      customerSafeWording: "Thanks for the photo. A reviewer will take a look.",
      limitations: [...COMMON_LIMITATIONS, QUARANTINE_NOTE],
      signals: [],
    },
  },
  {
    key: "nested-analysis-result-damage-photo-quarantine",
    title: "Nested analysis-result damage-photo quarantine",
    caption: "Synthetic analysis-result whose nested evidence type is damage-photo collapses to quarantine.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: false,
      inputKind: "legacy-quarantine",
      legacyCompatibility: {
        alias: "damage-photo",
        canonicalEvidenceType: "product-photo",
        quarantined: true,
        runtimeCandidate: false,
        note: QUARANTINE_NOTE,
      },
      score: {
        label: "Evidence Reliability Score",
        value: 0,
        scope: SCORE_SCOPE,
        meaning: "Quarantined legacy compatibility input; no readiness score is derived.",
      },
      confidence: "Low confidence",
      reviewPriority: "Manual review",
      localSignalLevel: "None",
      sourceKind: "manual-review-context",
      reviewSummary: "Synthetic nested damage-photo analysis-result is quarantined and remains non-canonical.",
      recommendedSupportAction: "Manual review recommended. Nested legacy alias is not a runtime candidate.",
      customerSafeWording: "Thanks for the photo. A reviewer will take a look.",
      limitations: [...COMMON_LIMITATIONS, QUARANTINE_NOTE],
      signals: [],
    },
  },
  {
    key: "nested-report-view-model-damage-photo-quarantine",
    title: "Nested report-view-model damage-photo quarantine",
    caption: "Synthetic report-view-model whose nested evidence type is damage-photo collapses to quarantine.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: false,
      inputKind: "legacy-quarantine",
      legacyCompatibility: {
        alias: "damage-photo",
        canonicalEvidenceType: "product-photo",
        quarantined: true,
        runtimeCandidate: false,
        note: QUARANTINE_NOTE,
      },
      score: {
        label: "Evidence Reliability Score",
        value: 0,
        scope: SCORE_SCOPE,
        meaning: "Quarantined legacy compatibility input; no readiness score is derived.",
      },
      confidence: "Low confidence",
      reviewPriority: "Manual review",
      localSignalLevel: "None",
      sourceKind: "manual-review-context",
      reviewSummary: "Synthetic nested damage-photo report-view-model is quarantined and remains non-canonical.",
      recommendedSupportAction: "Manual review recommended. Nested legacy alias is not a runtime candidate.",
      customerSafeWording: "Thanks for the photo. A reviewer will take a look.",
      limitations: [...COMMON_LIMITATIONS, QUARANTINE_NOTE],
      signals: [],
    },
  },
  {
    key: "receipt-like-mismatch-collapse",
    title: "Receipt-like mismatch collapse",
    caption: "Synthetic receipt-style mismatch is not accepted as product-photo readiness; it collapses to unsupported.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: false,
      inputKind: "unsupported",
      score: {
        label: "Evidence Reliability Score",
        value: 0,
        scope: SCORE_SCOPE,
        meaning: "Unsupported input for product-photo adapter readiness; no readiness score is derived.",
      },
      confidence: "Low confidence",
      reviewPriority: "Manual review",
      localSignalLevel: "None",
      sourceKind: "manual-review-context",
      reviewSummary: "Synthetic receipt-style input is unsupported for product-photo readiness and collapses safely.",
      recommendedSupportAction: "Manual review recommended. Route receipt-style evidence to the receipt path.",
      customerSafeWording: "Thanks for the document. A reviewer will take a look.",
      limitations: [...COMMON_LIMITATIONS, "product-photo details were not built for this input"],
      signals: [],
    },
  },
  {
    key: "unknown-mismatch-collapse",
    title: "Unknown mismatch collapse",
    caption: "Synthetic unknown evidence-type mismatch collapses to unsupported readiness.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: false,
      inputKind: "unsupported",
      score: {
        label: "Evidence Reliability Score",
        value: 0,
        scope: SCORE_SCOPE,
        meaning: "Unsupported input for product-photo adapter readiness; no readiness score is derived.",
      },
      confidence: "Low confidence",
      reviewPriority: "Manual review",
      localSignalLevel: "None",
      sourceKind: "manual-review-context",
      reviewSummary: "Synthetic unknown evidence-type input is unsupported for product-photo readiness.",
      recommendedSupportAction: "Manual review recommended. Unknown evidence-type input is not a runtime candidate.",
      customerSafeWording: "Thanks for the upload. A reviewer will take a look.",
      limitations: [...COMMON_LIMITATIONS, "product-photo details were not built for this input"],
      signals: [],
    },
  },
  {
    key: "unsupported-mismatch-collapse",
    title: "Unsupported mismatch collapse",
    caption: "Synthetic explicitly unsupported input collapses to unsupported readiness.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: false,
      inputKind: "unsupported",
      score: {
        label: "Evidence Reliability Score",
        value: 0,
        scope: SCORE_SCOPE,
        meaning: "Unsupported input for product-photo adapter readiness; no readiness score is derived.",
      },
      confidence: "Low confidence",
      reviewPriority: "Manual review",
      localSignalLevel: "None",
      sourceKind: "manual-review-context",
      reviewSummary: "Synthetic unsupported input collapses safely and is not accepted as product-photo readiness.",
      recommendedSupportAction: "Manual review recommended. Unsupported input is not a runtime candidate.",
      customerSafeWording: "Thanks for the upload. A reviewer will take a look.",
      limitations: [...COMMON_LIMITATIONS, "product-photo details were not built for this input"],
      signals: [],
    },
  },
  {
    key: "hostile-sentinel-omission",
    title: "Hostile override / sentinel omission",
    caption:
      "Synthetic hostile report-view-model; raw caller score, labels, and signals were collapsed and private sentinels omitted.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: true,
      inputKind: "report-view-model",
      score: {
        label: "Evidence Reliability Score",
        value: 100,
        scope: SCORE_SCOPE,
        meaning: "Caller score override was clamped; score reflects review readiness only.",
      },
      confidence: "Low confidence",
      reviewPriority: "Manual review",
      localSignalLevel: "Medium",
      sourceKind: "manual-review-context",
      reviewSummary:
        "Synthetic hostile-override case. Caller-supplied narrative and structured overrides were canonicalized; no raw values are shown.",
      recommendedSupportAction: "Manual review recommended. Caller overrides were collapsed to safe values.",
      customerSafeWording: "Thanks for the photo. A reviewer will take a look.",
      limitations: [
        ...COMMON_LIMITATIONS,
        "raw caller overrides and private sentinels are omitted; only derived, privacy-safe fields are shown",
      ],
      signals: [
        {
          label: "Manual review recommended",
          category: "Recommendation",
          severity: "Medium",
          confidencePercent: 100,
          reviewNote: "Caller signal override was collapsed to a recommendation.",
        },
      ],
    },
  },
  {
    key: "limited-metadata-bucket",
    title: "Limited metadata bucket",
    caption: "Synthetic accepted case where metadata is bucketed context only with exact values omitted.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: true,
      inputKind: "analysis-result",
      score: {
        label: "Evidence Reliability Score",
        value: 55,
        scope: SCORE_SCOPE,
        meaning: "Score reflects product-photo review readiness and local evidence quality only.",
      },
      confidence: "Low confidence",
      reviewPriority: "Manual review",
      localSignalLevel: "Low",
      sourceKind: "synthetic-fixture",
      reviewSummary: "Synthetic case with limited bucketed metadata context; exact metadata values are omitted.",
      recommendedSupportAction: "Manual review recommended. Use bucketed metadata as context only.",
      customerSafeWording: "Thanks for the photo. We are reviewing it with the available information.",
      limitations: [
        ...COMMON_LIMITATIONS,
        "metadata is bucketed context only and exact metadata values are omitted",
      ],
      signals: [
        {
          label: "Metadata context is limited",
          category: "Metadata Context",
          severity: "Low",
          confidencePercent: 44,
          reviewNote: "Metadata is context only and raw metadata values are omitted.",
        },
      ],
    },
  },
  {
    key: "long-text-layout-stress",
    title: "Long-text layout stress",
    caption:
      "Synthetic long-text layout stress case used only to verify wrapping, spacing, and scan-ability across desktop and mobile widths without any real evidence content.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: false,
      inputKind: "unsupported",
      score: {
        label: "Evidence Reliability Score",
        value: 0,
        scope: SCORE_SCOPE,
        meaning: "Unsupported input for product-photo adapter readiness; no readiness score is derived.",
      },
      confidence: "Low confidence",
      reviewPriority: "Manual review",
      localSignalLevel: "None",
      sourceKind: "manual-review-context",
      reviewSummary:
        "Synthetic unsupported input used to stress test layout. This summary is intentionally verbose so reviewers can confirm long readiness text wraps cleanly, does not overflow horizontally, does not overlap neighbouring content, and does not introduce nested primary scrolling on desktop or mobile widths.",
      recommendedSupportAction: "Manual review recommended. This is a layout stress fixture only.",
      customerSafeWording: "Thanks for the upload. A reviewer will take a look.",
      limitations: [
        ...COMMON_LIMITATIONS,
        "This intentionally long synthetic limitation string exists only to stress test layout wrapping and spacing so reviewers can confirm long readiness text remains readable, does not overflow horizontally, does not overlap neighbouring content, and does not introduce nested primary scrolling on either desktop or mobile widths.",
      ],
      signals: [],
    },
  },
  {
    key: "manual-review-only-no-live-marker",
    title: "Manual-review-only no-live marker",
    caption: "Synthetic case emphasizing the readiness, no-live, and manual-review-only markers.",
    result: {
      ...ADAPTER_MARKERS,
      readinessAccepted: true,
      inputKind: "analysis-result",
      score: {
        label: "Evidence Reliability Score",
        value: 61,
        scope: SCORE_SCOPE,
        meaning: "Score reflects product-photo review readiness and local evidence quality only.",
      },
      confidence: "Medium confidence",
      reviewPriority: "Manual review",
      localSignalLevel: "Medium",
      sourceKind: "synthetic-fixture",
      reviewSummary:
        "Synthetic case emphasizing that readiness output stays non-live and manual-review-only with no runtime coupling.",
      recommendedSupportAction: "Manual review recommended. Readiness output is non-live and decision-only.",
      customerSafeWording: "Thanks for the photo. A reviewer will take a look.",
      limitations: [
        ...COMMON_LIMITATIONS,
        "product-photo details were built for a future routing candidate only",
      ],
      signals: [
        {
          label: "Manual review recommended",
          category: "Recommendation",
          severity: "Medium",
          confidencePercent: 70,
          reviewNote: "This local-only signal supports manual review priority.",
        },
      ],
    },
  },
];
