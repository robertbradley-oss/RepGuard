import type {
  DamageVisibilityStatus,
  ProductContextStatus,
  ProductPhotoSubjectType,
  RequestedPhotoView,
  SharedEvidenceSignalCategory,
} from "@/lib/analysis/types";

export const PRODUCT_PHOTO_SAFE_REVIEW_LABELS = [
  "manual review recommended",
  "image consistency signal",
  "photo quality limits review",
  "product context incomplete",
  "findings inconclusive",
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
