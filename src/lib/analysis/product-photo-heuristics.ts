import type {
  DamageVisibilityStatus,
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

const PRODUCT_PHOTO_LOCAL_EVIDENCE_SOURCE = "Local-only product-photo review signal";

function normalizeProductPhotoSignalConfidence(confidence: number) {
  return Math.max(0, Math.min(100, Math.round(confidence)));
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
