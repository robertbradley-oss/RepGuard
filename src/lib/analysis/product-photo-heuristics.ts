import type {
  DamageVisibilityStatus,
  EvidenceMetadataSummary,
  PhotoReviewCompleteness,
  ProductContextStatus,
  ProductPhotoSubjectType,
  RequestedPhotoView,
  SharedEvidenceSignal,
  SharedEvidenceSignalCategory,
  SignalSeverity,
} from "@/lib/analysis/types";

export const PRODUCT_PHOTO_SAFE_REVIEW_LABELS = [
  "manual review recommended",
  "image consistency signal",
  "photo quality limits review",
  "product context incomplete",
  "requested view incomplete",
  "metadata context limited",
  "findings inconclusive",
  "additional context may be needed",
  "local-only review signal",
] as const;

export type ProductPhotoSafeReviewLabel = (typeof PRODUCT_PHOTO_SAFE_REVIEW_LABELS)[number];

export const PRODUCT_PHOTO_SIGNAL_CATEGORY_LABELS: Record<
  Extract<SharedEvidenceSignalCategory, "Photo Context" | "Image Quality" | "Image Consistency" | "Recommendation">,
  ProductPhotoSafeReviewLabel
> = {
  "Photo Context": "product context incomplete",
  "Image Quality": "photo quality limits review",
  "Image Consistency": "image consistency signal",
  Recommendation: "manual review recommended",
};

export const PRODUCT_PHOTO_REQUESTED_VIEW_LABELS: Record<RequestedPhotoView, ProductPhotoSafeReviewLabel> = {
  "wider-product-photo": "product context incomplete",
  "clearer-damage-close-up": "photo quality limits review",
  "serial-or-model-label": "product context incomplete",
  "packaging-context": "product context incomplete",
  "installation-context": "product context incomplete",
  "proof-of-purchase-match": "findings inconclusive",
};

export type ProductPhotoCompletenessDefaults = {
  subjectType: ProductPhotoSubjectType;
  damageVisibility: DamageVisibilityStatus;
  productContext: ProductContextStatus;
  reviewLabel: ProductPhotoSafeReviewLabel;
  requestedAdditionalViews: RequestedPhotoView[];
};

export const PRODUCT_PHOTO_COMPLETENESS_DEFAULTS: ProductPhotoCompletenessDefaults = {
  subjectType: "damage-close-up",
  damageVisibility: "inconclusive",
  productContext: "inconclusive",
  reviewLabel: "manual review recommended",
  requestedAdditionalViews: ["wider-product-photo", "clearer-damage-close-up", "proof-of-purchase-match"],
};

export type ProductPhotoSignalInput = {
  id: string;
  title: string;
  category: SharedEvidenceSignalCategory;
  severity?: SignalSeverity;
  confidence?: number;
  explanation: string;
  recommendation: string;
  evidenceSource?: string;
};

export type ProductPhotoFileSummaryInput = {
  metadataSummary?: EvidenceMetadataSummary;
  fileTypeCategory?: EvidenceMetadataSummary["fileTypeCategory"];
  fileSizeBucket?: EvidenceMetadataSummary["fileSizeBucket"];
  dimensionsPresent?: boolean;
  dimensionsBucket?: EvidenceMetadataSummary["dimensionsBucket"];
  metadataContext?: EvidenceMetadataSummary["metadataContext"];
  qualityLimits?: string[];
};

export type ProductPhotoFileSummary = {
  fileTypeCategory: EvidenceMetadataSummary["fileTypeCategory"];
  fileSizeBucket: EvidenceMetadataSummary["fileSizeBucket"];
  dimensionsPresent: boolean;
  dimensionsBucket: NonNullable<EvidenceMetadataSummary["dimensionsBucket"]>;
  metadataContext: EvidenceMetadataSummary["metadataContext"];
  qualityLimits: string[];
  summary: ProductPhotoSafeReviewLabel;
};

export type ProductPhotoReviewCompletenessInput = {
  subjectType?: ProductPhotoSubjectType;
  requestedAdditionalViews?: RequestedPhotoView[];
  missingContext?: RequestedPhotoView[];
  productContext?: ProductContextStatus;
  purchaseOrReceiptMatchNeeded?: boolean;
};

export type ProductPhotoLocalReviewSignalInput = {
  fileSummary?: ProductPhotoFileSummary | ProductPhotoFileSummaryInput;
  reviewCompleteness?: PhotoReviewCompleteness | ProductPhotoReviewCompletenessInput;
  includeManualReviewRecommendation?: boolean;
};

const PRODUCT_PHOTO_LOCAL_EVIDENCE_SOURCE = "Local-only product-photo review signal";

function normalizeProductPhotoSignalConfidence(confidence: number) {
  return Math.max(0, Math.min(100, Math.round(confidence)));
}

function uniqueRequestedPhotoViews(views: RequestedPhotoView[]) {
  return Array.from(new Set(views));
}

function hasPhotoReviewCompletenessShape(
  input: PhotoReviewCompleteness | ProductPhotoReviewCompletenessInput,
): input is PhotoReviewCompleteness {
  return "status" in input && "missingContext" in input && "summary" in input;
}

function hasProductPhotoFileSummaryShape(
  input: ProductPhotoFileSummary | ProductPhotoFileSummaryInput,
): input is ProductPhotoFileSummary {
  return "summary" in input && "qualityLimits" in input && "metadataContext" in input;
}

function uniqueProductPhotoSignals(signals: SharedEvidenceSignal[]) {
  const seen = new Set<string>();

  return signals.filter((signal) => {
    if (seen.has(signal.id)) {
      return false;
    }

    seen.add(signal.id);
    return true;
  });
}

export function buildProductPhotoSignal(input: ProductPhotoSignalInput): SharedEvidenceSignal {
  return {
    id: input.id,
    title: input.title,
    category: input.category,
    severity: input.severity ?? "Medium",
    confidence: normalizeProductPhotoSignalConfidence(input.confidence ?? 60),
    evidenceSource: input.evidenceSource ?? PRODUCT_PHOTO_LOCAL_EVIDENCE_SOURCE,
    explanation: input.explanation,
    recommendation: input.recommendation,
  };
}

export function buildPhotoQualityLimitsReviewSignal(
  input: Partial<ProductPhotoSignalInput> = {},
): SharedEvidenceSignal {
  return buildProductPhotoSignal({
    id: input.id ?? "product-photo-quality-limits-review",
    title: input.title ?? "Photo quality limits review",
    category: input.category ?? "Image Quality",
    severity: input.severity ?? "Medium",
    confidence: input.confidence ?? 62,
    evidenceSource: input.evidenceSource,
    explanation:
      input.explanation ??
      "Image quality may limit manual review. A clearer photo may be needed before support can complete the case.",
    recommendation:
      input.recommendation ??
      "Request one clearer photo if the current image does not provide enough detail for manual review.",
  });
}

export function buildProductContextIncompleteSignal(
  input: Partial<ProductPhotoSignalInput> = {},
): SharedEvidenceSignal {
  return buildProductPhotoSignal({
    id: input.id ?? "product-photo-context-incomplete",
    title: input.title ?? "Product context is incomplete",
    category: input.category ?? "Photo Context",
    severity: input.severity ?? "Medium",
    confidence: input.confidence ?? 64,
    evidenceSource: input.evidenceSource,
    explanation:
      input.explanation ??
      "The current photo does not show enough surrounding product context for confident manual review.",
    recommendation:
      input.recommendation ??
      "Request a wider product photo showing the relevant area and surrounding product context.",
  });
}

const PRODUCT_PHOTO_REQUESTED_VIEW_COPY: Record<
  RequestedPhotoView,
  {
    category: SharedEvidenceSignalCategory;
    recommendation: string;
  }
> = {
  "wider-product-photo": {
    category: "Photo Context",
    recommendation: "Request a wider product photo showing the relevant area and surrounding product context.",
  },
  "clearer-damage-close-up": {
    category: "Image Quality",
    recommendation: "Request one clearer close-up of the relevant area if review detail is limited.",
  },
  "serial-or-model-label": {
    category: "Photo Context",
    recommendation: "Request a serial or model label photo if support policy requires it.",
  },
  "packaging-context": {
    category: "Photo Context",
    recommendation: "Request packaging context if transit or shipping context is part of the review.",
  },
  "installation-context": {
    category: "Photo Context",
    recommendation: "Request installation context if support policy needs setup or usage context.",
  },
  "proof-of-purchase-match": {
    category: "Purchase Match",
    recommendation: "Match the product photo evidence against receipt or order evidence before completing review.",
  },
};

export function buildRequestedViewIncompleteSignal(
  requestedView: RequestedPhotoView,
  input: Partial<ProductPhotoSignalInput> = {},
): SharedEvidenceSignal {
  const copy = PRODUCT_PHOTO_REQUESTED_VIEW_COPY[requestedView];

  return buildProductPhotoSignal({
    id: input.id ?? `product-photo-requested-view-incomplete-${requestedView}`,
    title: input.title ?? "Requested view incomplete",
    category: input.category ?? copy.category,
    severity: input.severity ?? "Medium",
    confidence: input.confidence ?? 60,
    evidenceSource: input.evidenceSource,
    explanation:
      input.explanation ??
      "Additional context may be needed before support can complete manual product-photo review.",
    recommendation: input.recommendation ?? copy.recommendation,
  });
}

export function buildMetadataContextLimitedSignal(
  input: Partial<ProductPhotoSignalInput> = {},
): SharedEvidenceSignal {
  return buildProductPhotoSignal({
    id: input.id ?? "product-photo-metadata-context-limited",
    title: input.title ?? "Metadata context is limited",
    category: input.category ?? "Metadata Context",
    severity: input.severity ?? "Low",
    confidence: input.confidence ?? 58,
    evidenceSource: input.evidenceSource,
    explanation: input.explanation ?? "Metadata context is limited and should be used as context only.",
    recommendation:
      input.recommendation ??
      "Continue manual review using available photo context; do not use metadata status by itself as a claim decision.",
  });
}

export function buildFindingsInconclusiveSignal(
  input: Partial<ProductPhotoSignalInput> = {},
): SharedEvidenceSignal {
  return buildProductPhotoSignal({
    id: input.id ?? "product-photo-findings-inconclusive",
    title: input.title ?? "Findings are inconclusive",
    category: input.category ?? "Recommendation",
    severity: input.severity ?? "Medium",
    confidence: input.confidence ?? 56,
    evidenceSource: input.evidenceSource,
    explanation:
      input.explanation ??
      "Findings are inconclusive from the current photo. Additional context may be needed.",
    recommendation:
      input.recommendation ??
      "Request the minimum additional photo or proof detail needed to support manual review.",
  });
}

export function buildManualReviewRecommendedSignal(
  input: Partial<ProductPhotoSignalInput> = {},
): SharedEvidenceSignal {
  return buildProductPhotoSignal({
    id: input.id ?? "product-photo-manual-review-recommended",
    title: input.title ?? "Manual review recommended",
    category: input.category ?? "Recommendation",
    severity: input.severity ?? "Medium",
    confidence: input.confidence ?? 60,
    evidenceSource: input.evidenceSource,
    explanation: input.explanation ?? "This local-only review signal supports review priority only.",
    recommendation:
      input.recommendation ??
      "Have a reviewer inspect the photo evidence and decide the next support step.",
  });
}

export function buildProductPhotoFileSummary(
  input: ProductPhotoFileSummaryInput = {},
): ProductPhotoFileSummary {
  const metadataSummary = input.metadataSummary;
  const fileTypeCategory = input.fileTypeCategory ?? metadataSummary?.fileTypeCategory ?? "unknown";
  const fileSizeBucket = input.fileSizeBucket ?? metadataSummary?.fileSizeBucket ?? "unknown";
  const dimensionsPresent = input.dimensionsPresent ?? metadataSummary?.dimensionsPresent ?? false;
  const dimensionsBucket = input.dimensionsBucket ?? metadataSummary?.dimensionsBucket ?? "unknown";
  const metadataContext = input.metadataContext ?? metadataSummary?.metadataContext ?? "Unavailable";
  const qualityLimits = input.qualityLimits ? [...input.qualityLimits] : [];

  if (!dimensionsPresent) {
    qualityLimits.push("photo dimensions unavailable");
  }

  if (dimensionsBucket === "small") {
    qualityLimits.push("photo dimensions may limit review");
  }

  if (fileSizeBucket === "tiny" || fileSizeBucket === "small") {
    qualityLimits.push("file size may limit review");
  }

  if (fileTypeCategory !== "image" && fileTypeCategory !== "screenshot") {
    qualityLimits.push("file context needs manual review");
  }

  const summary: ProductPhotoSafeReviewLabel =
    qualityLimits.length > 0
      ? "photo quality limits review"
      : metadataContext === "Available"
        ? "local-only review signal"
        : "metadata context limited";

  return {
    fileTypeCategory,
    fileSizeBucket,
    dimensionsPresent,
    dimensionsBucket,
    metadataContext,
    qualityLimits: Array.from(new Set(qualityLimits)),
    summary,
  };
}

export function buildProductPhotoFileSummarySignals(
  input: ProductPhotoFileSummary | ProductPhotoFileSummaryInput = {},
): SharedEvidenceSignal[] {
  const fileSummary = hasProductPhotoFileSummaryShape(input) ? input : buildProductPhotoFileSummary(input);
  const signals: SharedEvidenceSignal[] = [];

  if (fileSummary.qualityLimits.length > 0) {
    signals.push(
      buildPhotoQualityLimitsReviewSignal({
        explanation:
          "File summary suggests photo quality limits review. This local-only review signal supports manual review only.",
        recommendation:
          "Request a clearer product photo if the current file summary does not provide enough review-ready context.",
      }),
    );
  }

  if (fileSummary.metadataContext !== "Available") {
    signals.push(buildMetadataContextLimitedSignal());
  }

  return uniqueProductPhotoSignals(signals);
}

export function buildProductPhotoReviewCompleteness(
  input: ProductPhotoReviewCompletenessInput = {},
): PhotoReviewCompleteness {
  const requestedAdditionalViews =
    input.requestedAdditionalViews ?? PRODUCT_PHOTO_COMPLETENESS_DEFAULTS.requestedAdditionalViews;
  const defaultMissingContext =
    input.productContext === "complete" && !input.purchaseOrReceiptMatchNeeded
      ? []
      : requestedAdditionalViews;
  const missingContext = uniqueRequestedPhotoViews(input.missingContext ?? defaultMissingContext);
  const status: PhotoReviewCompleteness["status"] =
    missingContext.length === 0 ? "complete" : missingContext.length === 1 ? "partial" : "inconclusive";
  const summary: ProductPhotoSafeReviewLabel =
    status === "complete"
      ? "local-only review signal"
      : missingContext.includes("wider-product-photo")
        ? "product context incomplete"
        : "requested view incomplete";

  return {
    status,
    missingContext,
    summary,
  };
}

export function buildProductPhotoReviewCompletenessSignals(
  input: PhotoReviewCompleteness | ProductPhotoReviewCompletenessInput = {},
): SharedEvidenceSignal[] {
  const reviewCompleteness = hasPhotoReviewCompletenessShape(input)
    ? input
    : buildProductPhotoReviewCompleteness(input);
  const signals = reviewCompleteness.missingContext.map((requestedView) =>
    buildRequestedViewIncompleteSignal(requestedView),
  );

  if (reviewCompleteness.missingContext.includes("wider-product-photo")) {
    signals.push(buildProductContextIncompleteSignal());
  }

  if (reviewCompleteness.status === "inconclusive") {
    signals.push(buildFindingsInconclusiveSignal());
  }

  return uniqueProductPhotoSignals(signals);
}

export function buildProductPhotoLocalReviewSignals(
  input: ProductPhotoLocalReviewSignalInput = {},
): SharedEvidenceSignal[] {
  const signals = [
    ...buildProductPhotoFileSummarySignals(input.fileSummary),
    ...buildProductPhotoReviewCompletenessSignals(input.reviewCompleteness),
  ];
  const shouldRecommendManualReview = input.includeManualReviewRecommendation ?? signals.length > 0;

  if (shouldRecommendManualReview) {
    signals.push(buildManualReviewRecommendedSignal());
  }

  return uniqueProductPhotoSignals(signals);
}
