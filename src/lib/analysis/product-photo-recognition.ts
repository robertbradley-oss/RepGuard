import type {
  EvidenceMetadataSummary,
  EvidenceTypeCompatibilityAlias,
  FileTypeCategory,
  ProductPhotoSubjectType,
  SharedEvidenceType,
} from "@/lib/analysis/types";

export type ProductPhotoRecognitionEvidenceType =
  | SharedEvidenceType
  | EvidenceTypeCompatibilityAlias["alias"]
  | "screenshot"
  | "pdf";

export type ProductPhotoRecognitionInput = {
  evidenceType?: ProductPhotoRecognitionEvidenceType;
  fileTypeCategory?: FileTypeCategory;
  mimeType?: string;
  fileName?: string;
  metadataSummary?: Pick<EvidenceMetadataSummary, "fileTypeCategory" | "dimensionsPresent" | "dimensionsBucket">;
  subjectType?: ProductPhotoSubjectType;
};

export type ProductPhotoRecognitionResult = {
  boundary: "product-photo-recognition";
  devOnly: true;
  evidenceType: SharedEvidenceType;
  productPhotoCompatible: boolean;
  futureRoutingCandidate: boolean;
  recognitionState: "product-photo-compatible" | "other-evidence" | "inconclusive";
  subjectType?: ProductPhotoSubjectType;
  compatibilityAlias?: EvidenceTypeCompatibilityAlias;
  reasons: string[];
  limitations: string[];
};

const PRODUCT_PHOTO_COMPATIBILITY_ALIAS: EvidenceTypeCompatibilityAlias = {
  alias: "damage-photo",
  canonicalEvidenceType: "product-photo",
  subjectType: "damage-close-up",
};

const PRODUCT_PHOTO_NAME_CUES = [
  "product",
  "photo",
  "closeup",
  "close-up",
  "crack",
  "leak",
  "broken",
  "warranty",
  "label",
  "serial",
  "model",
  "packaging",
  "installation",
] as const;

const RECEIPT_NAME_CUES = ["receipt", "invoice", "order-confirmation", "order_confirmation", "order details"] as const;
const SCREENSHOT_NAME_CUES = ["screenshot", "screen"] as const;

function normalizedText(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function fileTypeCategoryFor(input: ProductPhotoRecognitionInput): FileTypeCategory {
  if (input.fileTypeCategory) {
    return input.fileTypeCategory;
  }

  if (input.metadataSummary?.fileTypeCategory) {
    return input.metadataSummary.fileTypeCategory;
  }

  const mimeType = normalizedText(input.mimeType);
  if (mimeType === "application/pdf") {
    return "pdf";
  }

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  return "unknown";
}

function evidenceTypeForDeclaredType(
  evidenceType: ProductPhotoRecognitionEvidenceType | undefined,
): SharedEvidenceType | undefined {
  if (!evidenceType) {
    return undefined;
  }

  if (evidenceType === "damage-photo") {
    return "product-photo";
  }

  if (evidenceType === "screenshot") {
    return "order-screenshot";
  }

  if (evidenceType === "pdf") {
    return "pdf-receipt";
  }

  return evidenceType;
}

function hasCue(text: string, cues: readonly string[]) {
  return cues.some((cue) => text.includes(cue));
}

function resultForOtherEvidence(evidenceType: SharedEvidenceType, reason: string): ProductPhotoRecognitionResult {
  return {
    boundary: "product-photo-recognition",
    devOnly: true,
    evidenceType,
    productPhotoCompatible: false,
    futureRoutingCandidate: false,
    recognitionState: "other-evidence",
    reasons: [reason],
    limitations: ["dev-only recognition boundary; no analyzer report was produced"],
  };
}

function resultForInconclusive(reason: string): ProductPhotoRecognitionResult {
  return {
    boundary: "product-photo-recognition",
    devOnly: true,
    evidenceType: "unknown-evidence",
    productPhotoCompatible: false,
    futureRoutingCandidate: false,
    recognitionState: "inconclusive",
    reasons: [reason],
    limitations: ["dev-only recognition boundary; more evidence context is needed for future routing"],
  };
}

function resultForProductPhoto(
  input: ProductPhotoRecognitionInput,
  reasons: string[],
): ProductPhotoRecognitionResult {
  const subjectType =
    input.subjectType ??
    (input.evidenceType === PRODUCT_PHOTO_COMPATIBILITY_ALIAS.alias
      ? PRODUCT_PHOTO_COMPATIBILITY_ALIAS.subjectType
      : undefined);

  return {
    boundary: "product-photo-recognition",
    devOnly: true,
    evidenceType: "product-photo",
    productPhotoCompatible: true,
    futureRoutingCandidate: true,
    recognitionState: "product-photo-compatible",
    subjectType,
    compatibilityAlias:
      input.evidenceType === PRODUCT_PHOTO_COMPATIBILITY_ALIAS.alias ? PRODUCT_PHOTO_COMPATIBILITY_ALIAS : undefined,
    reasons,
    limitations: ["dev-only recognition boundary; no analyzer report was produced"],
  };
}

export function recognizeProductPhotoEvidence(
  input: ProductPhotoRecognitionInput = {},
): ProductPhotoRecognitionResult {
  const declaredEvidenceType = evidenceTypeForDeclaredType(input.evidenceType);
  const fileTypeCategory = fileTypeCategoryFor(input);
  const fileName = normalizedText(input.fileName);

  if (declaredEvidenceType === "receipt") {
    return resultForOtherEvidence("receipt", "declared receipt evidence");
  }

  if (declaredEvidenceType === "order-screenshot") {
    return resultForOtherEvidence("order-screenshot", "declared order screenshot evidence");
  }

  if (declaredEvidenceType === "pdf-receipt") {
    return resultForOtherEvidence("pdf-receipt", "declared PDF receipt evidence");
  }

  if (declaredEvidenceType === "product-photo") {
    return resultForProductPhoto(input, [
      input.evidenceType === PRODUCT_PHOTO_COMPATIBILITY_ALIAS.alias
        ? "compatibility alias mapped to canonical product-photo"
        : "declared product-photo evidence",
    ]);
  }

  if (fileTypeCategory === "pdf" || normalizedText(input.mimeType) === "application/pdf") {
    return resultForOtherEvidence("pdf-receipt", "PDF-like evidence");
  }

  if (fileTypeCategory === "screenshot" || hasCue(fileName, SCREENSHOT_NAME_CUES)) {
    return resultForOtherEvidence("order-screenshot", "screenshot-like evidence");
  }

  if (hasCue(fileName, RECEIPT_NAME_CUES)) {
    return resultForOtherEvidence("receipt", "receipt-like evidence");
  }

  const imageLike = fileTypeCategory === "image" || normalizedText(input.mimeType).startsWith("image/");
  const productPhotoCue = Boolean(input.subjectType) || hasCue(fileName, PRODUCT_PHOTO_NAME_CUES);

  if (imageLike && productPhotoCue) {
    return resultForProductPhoto(input, [
      input.subjectType ? "product-photo subject type supplied" : "image-like evidence with product-photo cue",
    ]);
  }

  if (imageLike) {
    return resultForInconclusive("image-like evidence without product-photo routing cue");
  }

  return resultForInconclusive("missing or unknown evidence context");
}
