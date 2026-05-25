import {
  buildManualReviewRecommendedSignal,
  buildMetadataContextLimitedSignal,
  buildPhotoQualityLimitsReviewSignal,
  buildProductContextIncompleteSignal,
  buildProductPhotoFileSummary,
  buildProductPhotoFileSummarySignals,
  buildProductPhotoLocalReviewSignals,
  buildProductPhotoReviewCompleteness,
  buildProductPhotoReviewCompletenessSignals,
  buildProductPhotoSignal,
  buildRequestedViewIncompleteSignal,
  PRODUCT_PHOTO_COMPLETENESS_DEFAULTS,
  PRODUCT_PHOTO_REQUESTED_VIEW_LABELS,
  PRODUCT_PHOTO_SAFE_REVIEW_LABELS,
  PRODUCT_PHOTO_SIGNAL_CATEGORY_LABELS,
} from "@/lib/analysis/product-photo-heuristics";
import type {
  EvidenceMetadataSummary,
  PhotoReviewCompleteness,
  RequestedPhotoView,
  SharedEvidenceSignal,
} from "@/lib/analysis/types";

const availableImageMetadata = {
  fileTypeCategory: "image",
  fileSizeBucket: "medium",
  dimensionsPresent: true,
  dimensionsBucket: "large",
  dimensions: {
    width: 1600,
    height: 1200,
  },
  metadataContext: "Available",
  captureTimestampPresent: true,
  gpsContext: "stripped",
  editingSoftwareSignal: "not-present",
  rawExifOmitted: true,
  originalFilenameOmitted: true,
  notes: ["local-only review signal"],
} satisfies EvidenceMetadataSummary;

const limitedImageMetadata = {
  fileTypeCategory: "image",
  fileSizeBucket: "tiny",
  dimensionsPresent: true,
  dimensionsBucket: "small",
  metadataContext: "Limited",
  captureTimestampPresent: "unknown",
  gpsContext: "unknown",
  editingSoftwareSignal: "unknown",
  rawExifOmitted: true,
  originalFilenameOmitted: true,
  notes: ["metadata context limited"],
} satisfies EvidenceMetadataSummary;

const oneRequestedView: RequestedPhotoView = "serial-or-model-label";

const completeReviewState = {
  status: "complete",
  missingContext: [],
  summary: "local-only review signal",
} satisfies PhotoReviewCompleteness;

const partialReviewState = buildProductPhotoReviewCompleteness({
  requestedAdditionalViews: [oneRequestedView],
  missingContext: [oneRequestedView],
  productContext: "partial",
});

const multiViewIncompleteState = buildProductPhotoReviewCompleteness({
  requestedAdditionalViews: [
    "wider-product-photo",
    "wider-product-photo",
    "clearer-damage-close-up",
    "proof-of-purchase-match",
  ],
  missingContext: [
    "wider-product-photo",
    "wider-product-photo",
    "clearer-damage-close-up",
    "proof-of-purchase-match",
  ],
  productContext: "missing",
  purchaseOrReceiptMatchNeeded: true,
});

const emptyFileSummary = buildProductPhotoFileSummary();
const availableImageFileSummary = buildProductPhotoFileSummary({
  metadataSummary: availableImageMetadata,
});
const limitedSmallFileSummary = buildProductPhotoFileSummary({
  metadataSummary: limitedImageMetadata,
});
const nonImageFileSummary = buildProductPhotoFileSummary({
  fileTypeCategory: "document",
  fileSizeBucket: "small",
  dimensionsPresent: false,
  metadataContext: "Unavailable",
  qualityLimits: ["metadata context limited"],
});

const localSignalsWithManualReview = buildProductPhotoLocalReviewSignals({
  fileSummary: limitedSmallFileSummary,
  reviewCompleteness: multiViewIncompleteState,
});

const localSignalsWithoutManualReview = buildProductPhotoLocalReviewSignals({
  fileSummary: availableImageFileSummary,
  reviewCompleteness: completeReviewState,
  includeManualReviewRecommendation: false,
});

const normalizedConfidenceSignals = [
  buildProductPhotoSignal({
    id: "product-photo-confidence-low-clamp",
    title: "local-only review signal",
    category: "Recommendation",
    confidence: -12,
    explanation: "Findings are inconclusive from the current photo.",
    recommendation: "Additional context may be needed before completing manual review.",
  }),
  buildProductPhotoSignal({
    id: "product-photo-confidence-high-clamp",
    title: "manual review recommended",
    category: "Recommendation",
    confidence: 145,
    explanation: "This local-only review signal supports review priority only.",
    recommendation: "Manual review recommended.",
  }),
  buildProductPhotoSignal({
    id: "product-photo-confidence-rounding",
    title: "metadata context limited",
    category: "Metadata Context",
    confidence: 62.4,
    explanation: "Metadata context is limited and should be used as context only.",
    recommendation: "Continue manual review using available photo context.",
  }),
] satisfies SharedEvidenceSignal[];

export const PRODUCT_PHOTO_HEURISTICS_DEVELOPER_PROBE = {
  labels: {
    safeReviewLabels: PRODUCT_PHOTO_SAFE_REVIEW_LABELS,
    categoryLabels: PRODUCT_PHOTO_SIGNAL_CATEGORY_LABELS,
    requestedViewLabels: PRODUCT_PHOTO_REQUESTED_VIEW_LABELS,
    defaults: PRODUCT_PHOTO_COMPLETENESS_DEFAULTS,
  },
  directSignals: {
    qualityLimits: buildPhotoQualityLimitsReviewSignal(),
    productContextIncomplete: buildProductContextIncompleteSignal(),
    requestedViewIncomplete: buildRequestedViewIncompleteSignal("wider-product-photo"),
    metadataContextLimited: buildMetadataContextLimitedSignal(),
    manualReviewRecommended: buildManualReviewRecommendedSignal(),
    normalizedConfidenceSignals,
  },
  fileSummaries: {
    emptyFileSummary,
    availableImageFileSummary,
    limitedSmallFileSummary,
    nonImageFileSummary,
  },
  fileSummarySignals: {
    emptyFileSummarySignals: buildProductPhotoFileSummarySignals(emptyFileSummary),
    availableImageFileSummarySignals: buildProductPhotoFileSummarySignals(availableImageFileSummary),
    limitedSmallFileSummarySignals: buildProductPhotoFileSummarySignals(limitedSmallFileSummary),
    nonImageFileSummarySignals: buildProductPhotoFileSummarySignals(nonImageFileSummary),
  },
  reviewCompleteness: {
    completeReviewState,
    partialReviewState,
    multiViewIncompleteState,
  },
  reviewCompletenessSignals: {
    completeReviewSignals: buildProductPhotoReviewCompletenessSignals(completeReviewState),
    partialReviewSignals: buildProductPhotoReviewCompletenessSignals(partialReviewState),
    multiViewIncompleteSignals: buildProductPhotoReviewCompletenessSignals(multiViewIncompleteState),
  },
  localReviewSignals: {
    localSignalsWithManualReview,
    localSignalsWithoutManualReview,
  },
} as const;
