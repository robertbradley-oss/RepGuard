// Pre-analysis evidence gate (Phase 2.4.10 no-live contract).
//
// This is a decision-only boundary that runs conceptually BEFORE receipt OCR,
// receipt parsing, metadata inspection, scoring, and live report mapping. It
// classifies privacy-safe synthetic filename/type/category hints so a future
// approved slice can stop product-photo-like or otherwise unsupported evidence
// before any OCR/metadata-heavy receipt processing.
//
// It is intentionally unwired and non-live:
// - It is NOT called by the live receipt analyzer entrypoint, upload, UI,
//   analyzer routing, the live report adapter, providers, storage,
//   integrations, or case queues.
// - It does NOT import or run OCR, metadata extraction, the analyzer, the
//   product-photo analyzer/adapter, scoring, the receipt parser, or fixtures.
// - It does NOT depend on or produce the receipt-shaped live analysis result.
// - It does NOT accept image bytes, object URLs, raw EXIF, raw metadata,
//   provider/storage/integration/case-queue handles, or customer/ticket/order
//   identifiers.
// - product-photo runtime stays non-live; damage-photo stays legacy/non-canonical.

export type PreAnalysisEvidenceGateOutcome =
  | "allow-receipt-default-path"
  | "unsupported-evidence"
  | "legacy-damage-photo-quarantine"
  | "product-photo-like-unsupported"
  | "unknown-inconclusive";

export type PreAnalysisEvidenceGateFileTypeHint =
  | "image"
  | "pdf"
  | "screenshot"
  | "document"
  | "unknown";

export type PreAnalysisEvidenceGateDeclaredCategory =
  | "receipt"
  | "pdf-receipt"
  | "order-screenshot"
  | "screenshot"
  | "product-photo"
  | "damage-photo"
  | "unsupported"
  | "unknown";

// Synthetic hints only. No file blobs, image bytes, object URLs, EXIF, raw
// metadata, provider/storage/integration/case-queue handles, or customer,
// ticket, or order identifiers are accepted here by design.
export type PreAnalysisEvidenceGateInput = {
  fileNameHint?: string;
  mimeTypeHint?: string;
  fileTypeCategoryHint?: PreAnalysisEvidenceGateFileTypeHint;
  declaredEvidenceCategoryHint?: PreAnalysisEvidenceGateDeclaredCategory;
  receiptLikeHint?: boolean;
  pdfReceiptLikeHint?: boolean;
  screenshotLikeHint?: boolean;
  productPhotoLikeHint?: boolean;
};

export type PreAnalysisEvidenceGateLegacyCompatibility = {
  alias: "damage-photo";
  canonicalEvidenceType: "product-photo";
  quarantined: true;
  runtimeCandidate: false;
};

export type PreAnalysisEvidenceGateDecision = {
  boundary: "pre-analysis-evidence-gate";
  devOnly: true;
  outcome: PreAnalysisEvidenceGateOutcome;
  allowReceiptDefaultPath: boolean;
  productPhotoRuntimeLive: false;
  runtimeLive: false;
  manualReviewOnly: true;
  ocrInvoked: false;
  metadataInvoked: false;
  analyzerInvoked: false;
  adapterInvoked: false;
  uiUploadReportScoringParserFixturePathsInvoked: false;
  providersStorageIntegrationsCaseQueuesInvoked: false;
  legacyCompatibility?: PreAnalysisEvidenceGateLegacyCompatibility;
  reasons: string[];
  limitations: string[];
};

// Boundary status marker. Records that the gate is decision-only and non-live,
// invokes no OCR/metadata processing, and has no upload/UI/report-adapter/
// provider/storage/integration/case-queue coupling.
export const PRE_ANALYSIS_EVIDENCE_GATE_STATUS = {
  boundary: "pre-analysis-evidence-gate",
  devOnly: true,
  runtimeLive: false,
  manualReviewOnly: true,
  ocrInvoked: false,
  metadataInvoked: false,
  analyzerInvoked: false,
  adapterInvoked: false,
  uiUploadReportScoringParserFixturePathsInvoked: false,
  providersStorageIntegrationsCaseQueuesInvoked: false,
  productPhotoRuntimeLive: false,
  damagePhotoCanonicalRuntime: false,
  liveReceiptAnalyzerEntrypointInvoked: false,
  liveReceiptAnalysisResultRequired: false,
  outcomes: [
    "allow-receipt-default-path",
    "unsupported-evidence",
    "legacy-damage-photo-quarantine",
    "product-photo-like-unsupported",
    "unknown-inconclusive",
  ],
} as const;

const LEGACY_DAMAGE_PHOTO_COMPATIBILITY: PreAnalysisEvidenceGateLegacyCompatibility = {
  alias: "damage-photo",
  canonicalEvidenceType: "product-photo",
  quarantined: true,
  runtimeCandidate: false,
};

// Legacy damage-photo compatibility cues route to quarantine, not runtime.
const LEGACY_DAMAGE_PHOTO_NAME_CUES = ["damage", "damaged", "dent", "scratch"] as const;

// Other product-photo-like cues route to product-photo-like-unsupported.
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
  "package",
  "installation",
  "install",
  "unboxing",
] as const;

const RECEIPT_NAME_CUES = [
  "receipt",
  "invoice",
  "order",
  "purchase",
  "proof-of-purchase",
  "proof_of_purchase",
] as const;

const SCREENSHOT_NAME_CUES = ["screenshot", "screen-capture", "screen_capture", "screen"] as const;

// Synthetic media-type hints that are unsupported for the current live receipt
// analyzer path (these never reach OCR/metadata processing here).
const UNSUPPORTED_MIME_PREFIXES = ["video/", "audio/", "model/", "font/"] as const;
const UNSUPPORTED_MIME_EXACT = [
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
  "application/x-msdownload",
  "application/vnd.android.package-archive",
] as const;

function normalize(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function hasCue(text: string, cues: readonly string[]) {
  return text.length > 0 && cues.some((cue) => text.includes(cue));
}

function isUnsupportedMime(mimeType: string) {
  if (mimeType.length === 0) {
    return false;
  }

  return (
    UNSUPPORTED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix)) ||
    UNSUPPORTED_MIME_EXACT.includes(mimeType as (typeof UNSUPPORTED_MIME_EXACT)[number])
  );
}

const COMMON_LIMITATIONS = [
  "Decision-only pre-analysis evidence gate; no OCR, metadata inspection, analyzer, adapter, or report mapping was invoked.",
  "Decision is based on synthetic filename, type, and category hints only.",
  "Product-photo runtime remains non-live and manual-review-only.",
];

function baseDecision(): Omit<PreAnalysisEvidenceGateDecision, "outcome" | "allowReceiptDefaultPath" | "reasons" | "limitations"> {
  return {
    boundary: "pre-analysis-evidence-gate",
    devOnly: true,
    productPhotoRuntimeLive: false,
    runtimeLive: false,
    manualReviewOnly: true,
    ocrInvoked: false,
    metadataInvoked: false,
    analyzerInvoked: false,
    adapterInvoked: false,
    uiUploadReportScoringParserFixturePathsInvoked: false,
    providersStorageIntegrationsCaseQueuesInvoked: false,
  };
}

function allowReceiptDefaultPath(reason: string): PreAnalysisEvidenceGateDecision {
  return {
    ...baseDecision(),
    outcome: "allow-receipt-default-path",
    allowReceiptDefaultPath: true,
    reasons: [reason],
    limitations: [
      ...COMMON_LIMITATIONS,
      "Receipt, PDF receipt, and order-screenshot handling may continue on the existing receipt/default path unchanged.",
    ],
  };
}

function unsupportedEvidence(reason: string): PreAnalysisEvidenceGateDecision {
  return {
    ...baseDecision(),
    outcome: "unsupported-evidence",
    allowReceiptDefaultPath: false,
    reasons: [reason],
    limitations: [
      ...COMMON_LIMITATIONS,
      "Input is unsupported for the current live receipt analyzer and should be routed to manual review only.",
    ],
  };
}

function legacyDamagePhotoQuarantine(reason: string): PreAnalysisEvidenceGateDecision {
  return {
    ...baseDecision(),
    outcome: "legacy-damage-photo-quarantine",
    allowReceiptDefaultPath: false,
    legacyCompatibility: LEGACY_DAMAGE_PHOTO_COMPATIBILITY,
    reasons: [reason],
    limitations: [
      ...COMMON_LIMITATIONS,
      "Legacy damage-photo compatibility input is quarantined and remains non-canonical; it should be routed to manual review only.",
    ],
  };
}

function productPhotoLikeUnsupported(reason: string): PreAnalysisEvidenceGateDecision {
  return {
    ...baseDecision(),
    outcome: "product-photo-like-unsupported",
    allowReceiptDefaultPath: false,
    reasons: [reason],
    limitations: [
      ...COMMON_LIMITATIONS,
      "Input appears product-photo-like; product-photo runtime is non-live, so no OCR/metadata should run and manual review is recommended.",
    ],
  };
}

function unknownInconclusive(reason: string): PreAnalysisEvidenceGateDecision {
  return {
    ...baseDecision(),
    outcome: "unknown-inconclusive",
    allowReceiptDefaultPath: false,
    reasons: [reason],
    limitations: [
      ...COMMON_LIMITATIONS,
      "Lightweight hints are insufficient to classify the input before analysis; receipt behavior is preserved and manual review is recommended.",
    ],
  };
}

export function buildPreAnalysisEvidenceGateDecision(
  input: PreAnalysisEvidenceGateInput = {},
): PreAnalysisEvidenceGateDecision {
  const declared = input.declaredEvidenceCategoryHint;

  // 1. Declared synthetic categories take precedence.
  if (declared === "unsupported") {
    return unsupportedEvidence("declared unsupported evidence category");
  }

  if (declared === "damage-photo") {
    return legacyDamagePhotoQuarantine("declared legacy damage-photo compatibility category");
  }

  if (declared === "product-photo") {
    return productPhotoLikeUnsupported("declared product-photo category");
  }

  if (
    declared === "receipt" ||
    declared === "pdf-receipt" ||
    declared === "order-screenshot" ||
    declared === "screenshot"
  ) {
    return allowReceiptDefaultPath("declared receipt-style evidence category");
  }

  // 2. Explicit synthetic boolean hints.
  if (input.receiptLikeHint || input.pdfReceiptLikeHint || input.screenshotLikeHint) {
    return allowReceiptDefaultPath("explicit receipt-style synthetic hint");
  }

  if (input.productPhotoLikeHint) {
    return productPhotoLikeUnsupported("explicit product-photo-like synthetic hint");
  }

  const fileName = normalize(input.fileNameHint);
  const mimeType = normalize(input.mimeTypeHint);
  const fileTypeCategory = input.fileTypeCategoryHint ?? "unknown";

  // 3. Unsupported synthetic media types.
  if (isUnsupportedMime(mimeType)) {
    return unsupportedEvidence("unsupported synthetic media-type hint");
  }

  // 4. PDF-style hints preserve PDF receipt behavior.
  const pdfLike =
    fileTypeCategory === "pdf" || mimeType === "application/pdf" || fileName.endsWith(".pdf");
  if (pdfLike) {
    return allowReceiptDefaultPath("pdf-style hint preserved on the receipt/default path");
  }

  // 5. Screenshot-style hints preserve order-screenshot behavior.
  if (fileTypeCategory === "screenshot" || hasCue(fileName, SCREENSHOT_NAME_CUES)) {
    return allowReceiptDefaultPath("screenshot-style hint preserved on the receipt/default path");
  }

  // 6. Receipt-style filename cues preserve receipt behavior.
  if (hasCue(fileName, RECEIPT_NAME_CUES)) {
    return allowReceiptDefaultPath("receipt-style filename cue preserved on the receipt/default path");
  }

  const imageLike = fileTypeCategory === "image" || mimeType.startsWith("image/");

  // 7. Legacy damage-photo cues quarantine; other product-photo cues are unsupported.
  if (hasCue(fileName, LEGACY_DAMAGE_PHOTO_NAME_CUES)) {
    return legacyDamagePhotoQuarantine("legacy damage-photo filename cue");
  }

  if (hasCue(fileName, PRODUCT_PHOTO_NAME_CUES)) {
    return productPhotoLikeUnsupported("image-like hint with product-photo filename cue");
  }

  // 8. Image-like without a receipt/screenshot/product-photo cue stays inconclusive.
  if (imageLike) {
    return unknownInconclusive("image-like hint without receipt, screenshot, or product-photo cue");
  }

  // 9. Fallback: not enough synthetic hint context.
  return unknownInconclusive("lightweight hints insufficient to classify before analysis");
}
