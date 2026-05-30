import {
  buildPreAnalysisEvidenceGateDecision,
  type PreAnalysisEvidenceGateDeclaredCategory,
  type PreAnalysisEvidenceGateDecision,
  type PreAnalysisEvidenceGateFileTypeHint,
  type PreAnalysisEvidenceGateInput,
  type PreAnalysisEvidenceGateOutcome,
} from "@/lib/analysis/pre-analysis-evidence-gate";
import type { LocalAnalysisResult } from "@/lib/analysis/types";

export const ENABLE_PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_GUARD: boolean = false;

type NonAllowPreAnalysisGateOutcome = Exclude<PreAnalysisEvidenceGateOutcome, "allow-receipt-default-path">;

type UnsupportedEvidenceKind =
  | "unsupported-evidence"
  | "legacy-damage-photo"
  | "product-photo-like"
  | "unknown-inconclusive";

type ReceiptAnalyzer = (file: File) => Promise<LocalAnalysisResult>;

export type PreAnalysisGateRuntimeOptions = {
  declaredEvidenceCategoryHint?: PreAnalysisEvidenceGateDeclaredCategory;
  sourceCategoryHint?: PreAnalysisEvidenceGateDeclaredCategory;
  runtimeGuardEnabled?: boolean;
  enablePreAnalysisEvidenceGateRuntimeGuard?: boolean;
  receiptAnalyzerForProbe?: ReceiptAnalyzer;
};

export type UnsupportedEvidenceResult = {
  kind: "unsupported-evidence";
  boundary: "pre-analysis-evidence-gate-runtime";
  outcome: NonAllowPreAnalysisGateOutcome;
  evidenceKind: UnsupportedEvidenceKind;
  evidenceLabel: string;
  runtimeGuardEnabled: true;
  runtimeLive: false;
  productPhotoRuntimeLive: false;
  manualReviewOnly: true;
  allowReceiptDefaultPath: false;
  ocrInvoked: false;
  metadataInvoked: false;
  analyzerInvoked: false;
  adapterInvoked: false;
  uiUploadReportScoringParserFixturePathsInvoked: false;
  providersStorageIntegrationsCaseQueuesInvoked: false;
  liveReceiptAnalyzerInvoked: false;
  productPhotoAnalysisInvoked: false;
  productPhotoReportProduced: false;
  productPhotoReviewPanelRouted: false;
  reviewSummary: string;
  recommendedSupportAction: string;
  customerSafeWording: string;
  reasons: string[];
  limitations: string[];
};

export type PreAnalysisGateRuntimeReceiptResult = {
  kind: "receipt-analysis";
  runtimeGuardEnabled: boolean;
  gateDecision: PreAnalysisEvidenceGateDecision | null;
  result: LocalAnalysisResult;
};

export type PreAnalysisGateRuntimeUnsupportedResult = {
  kind: "unsupported-evidence";
  runtimeGuardEnabled: true;
  gateDecision: PreAnalysisEvidenceGateDecision;
  result: UnsupportedEvidenceResult;
};

export type PreAnalysisGateRuntimeResult =
  | PreAnalysisGateRuntimeReceiptResult
  | PreAnalysisGateRuntimeUnsupportedResult;

export const PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_STATUS = {
  boundary: "pre-analysis-evidence-gate-runtime",
  defaultFlagEnabled: ENABLE_PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_GUARD,
  runtimeLive: false,
  productPhotoRuntimeLive: false,
  manualReviewOnly: true,
  wrapperUnwiredFromLiveCallers: true,
  localAnalysisResultMigration: false,
  liveReportAdapterMapping: false,
  uploadUiRouting: false,
  productPhotoAnalyzerInvoked: false,
  productPhotoReviewPanelRouted: false,
  providersStorageIntegrationsCaseQueuesInvoked: false,
} as const;

function normalize(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function hasCue(text: string, cues: readonly string[]) {
  return text.length > 0 && cues.some((cue) => text.includes(cue));
}

function runtimeGuardEnabledFor(options: PreAnalysisGateRuntimeOptions) {
  if (options.runtimeGuardEnabled === true || options.enablePreAnalysisEvidenceGateRuntimeGuard === true) {
    return true;
  }

  return ENABLE_PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_GUARD === true;
}

async function defaultReceiptAnalyzer(file: File) {
  const { analyzeEvidenceFile } = await import("@/lib/analysis/analyzer");
  return analyzeEvidenceFile(file);
}

const LEGACY_DAMAGE_PHOTO_FILE_CUES = ["damage", "damaged", "dent", "scratch"] as const;
const PRODUCT_PHOTO_FILE_CUES = [
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
const RECEIPT_FILE_CUES = ["receipt", "invoice", "purchase", "proof-of-purchase", "proof_of_purchase"] as const;
const SCREENSHOT_FILE_CUES = ["screenshot", "screen-capture", "screen_capture", "screen"] as const;
const UNSUPPORTED_MIME_PREFIXES = ["video/", "audio/", "model/", "font/"] as const;
const UNSUPPORTED_MIME_EXACT = [
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
  "application/x-msdownload",
  "application/vnd.android.package-archive",
] as const;

function isUnsupportedMime(mimeType: string) {
  return (
    mimeType.length > 0 &&
    (UNSUPPORTED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix)) ||
      UNSUPPORTED_MIME_EXACT.includes(mimeType as (typeof UNSUPPORTED_MIME_EXACT)[number]))
  );
}

function fileTypeCategoryHintFor(fileName: string, mimeType: string): PreAnalysisEvidenceGateFileTypeHint {
  if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
    return "pdf";
  }

  if (hasCue(fileName, SCREENSHOT_FILE_CUES)) {
    return "screenshot";
  }

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("text/") || mimeType.includes("document")) {
    return "document";
  }

  return "unknown";
}

function firstDeclaredCategory(options: PreAnalysisGateRuntimeOptions) {
  return options.declaredEvidenceCategoryHint ?? options.sourceCategoryHint;
}

export function buildPreAnalysisEvidenceGateHintsFromFile(
  file: File,
  options: PreAnalysisGateRuntimeOptions = {},
): PreAnalysisEvidenceGateInput {
  const fileNameHint = file.name;
  const mimeTypeHint = file.type;
  const fileName = normalize(fileNameHint);
  const mimeType = normalize(mimeTypeHint);
  const declaredCategory = firstDeclaredCategory(options);
  const fileTypeCategoryHint = fileTypeCategoryHintFor(fileName, mimeType);

  if (isUnsupportedMime(mimeType) || declaredCategory === "unsupported") {
    return {
      fileNameHint,
      mimeTypeHint,
      fileTypeCategoryHint,
      declaredEvidenceCategoryHint: "unsupported",
    };
  }

  if (declaredCategory === "damage-photo" || hasCue(fileName, LEGACY_DAMAGE_PHOTO_FILE_CUES)) {
    return {
      fileNameHint,
      mimeTypeHint,
      fileTypeCategoryHint,
      declaredEvidenceCategoryHint: "damage-photo",
      productPhotoLikeHint: true,
    };
  }

  if (declaredCategory === "product-photo" || hasCue(fileName, PRODUCT_PHOTO_FILE_CUES)) {
    return {
      fileNameHint,
      mimeTypeHint,
      fileTypeCategoryHint,
      declaredEvidenceCategoryHint: "product-photo",
      productPhotoLikeHint: true,
    };
  }

  if (declaredCategory) {
    return {
      fileNameHint,
      mimeTypeHint,
      fileTypeCategoryHint,
      declaredEvidenceCategoryHint: declaredCategory,
    };
  }

  const pdfReceiptLikeHint = fileTypeCategoryHint === "pdf";
  const screenshotLikeHint = fileTypeCategoryHint === "screenshot";
  const receiptLikeHint = hasCue(fileName, RECEIPT_FILE_CUES);

  return {
    fileNameHint,
    mimeTypeHint,
    fileTypeCategoryHint,
    receiptLikeHint,
    pdfReceiptLikeHint,
    screenshotLikeHint,
  };
}

function unsupportedEvidenceKindFor(outcome: NonAllowPreAnalysisGateOutcome): UnsupportedEvidenceKind {
  if (outcome === "legacy-damage-photo-quarantine") {
    return "legacy-damage-photo";
  }

  if (outcome === "product-photo-like-unsupported") {
    return "product-photo-like";
  }

  if (outcome === "unknown-inconclusive") {
    return "unknown-inconclusive";
  }

  return "unsupported-evidence";
}

function evidenceLabelFor(outcome: NonAllowPreAnalysisGateOutcome) {
  if (outcome === "legacy-damage-photo-quarantine") {
    return "Legacy damage-photo terminology quarantined";
  }

  if (outcome === "product-photo-like-unsupported") {
    return "Product-photo-like evidence unsupported";
  }

  if (outcome === "unknown-inconclusive") {
    return "Evidence type inconclusive";
  }

  return "Unsupported evidence";
}

function reviewSummaryFor(outcome: NonAllowPreAnalysisGateOutcome) {
  if (outcome === "legacy-damage-photo-quarantine") {
    return "Legacy damage-photo terminology is quarantined before the receipt analyzer runs.";
  }

  if (outcome === "product-photo-like-unsupported") {
    return "Product-photo-like evidence is not currently supported by the live receipt-only analyzer.";
  }

  if (outcome === "unknown-inconclusive") {
    return "Lightweight file hints are inconclusive, so the file is stopped for manual review under the enabled guard.";
  }

  return "This file type is unsupported for the current live receipt-only analyzer.";
}

function unsupportedEvidenceResultFor(gateDecision: PreAnalysisEvidenceGateDecision): UnsupportedEvidenceResult {
  const outcome = gateDecision.outcome as NonAllowPreAnalysisGateOutcome;

  return {
    kind: "unsupported-evidence",
    boundary: "pre-analysis-evidence-gate-runtime",
    outcome,
    evidenceKind: unsupportedEvidenceKindFor(outcome),
    evidenceLabel: evidenceLabelFor(outcome),
    runtimeGuardEnabled: true,
    runtimeLive: false,
    productPhotoRuntimeLive: false,
    manualReviewOnly: true,
    allowReceiptDefaultPath: false,
    ocrInvoked: false,
    metadataInvoked: false,
    analyzerInvoked: false,
    adapterInvoked: false,
    uiUploadReportScoringParserFixturePathsInvoked: false,
    providersStorageIntegrationsCaseQueuesInvoked: false,
    liveReceiptAnalyzerInvoked: false,
    productPhotoAnalysisInvoked: false,
    productPhotoReportProduced: false,
    productPhotoReviewPanelRouted: false,
    reviewSummary: reviewSummaryFor(outcome),
    recommendedSupportAction: "Manual review only. Request eligible receipt evidence or route the case to a reviewer.",
    customerSafeWording:
      "We could not process this file with the current receipt-only analyzer. A clearer or eligible proof-of-purchase document may be needed for review.",
    reasons: gateDecision.reasons,
    limitations: [
      ...gateDecision.limitations,
      "No receipt score, product-photo analysis, product-photo report, or product-photo review panel route was produced.",
    ],
  };
}

export async function analyzeEvidenceFileWithPreAnalysisGate(
  file: File,
  options: PreAnalysisGateRuntimeOptions = {},
): Promise<PreAnalysisGateRuntimeResult> {
  const receiptAnalyzer = options.receiptAnalyzerForProbe ?? defaultReceiptAnalyzer;
  const runtimeGuardEnabled = runtimeGuardEnabledFor(options);

  if (!runtimeGuardEnabled) {
    return {
      kind: "receipt-analysis",
      runtimeGuardEnabled: false,
      gateDecision: null,
      result: await receiptAnalyzer(file),
    };
  }

  const gateInput = buildPreAnalysisEvidenceGateHintsFromFile(file, options);
  const gateDecision = buildPreAnalysisEvidenceGateDecision(gateInput);

  if (gateDecision.outcome === "allow-receipt-default-path") {
    return {
      kind: "receipt-analysis",
      runtimeGuardEnabled: true,
      gateDecision,
      result: await receiptAnalyzer(file),
    };
  }

  return {
    kind: "unsupported-evidence",
    runtimeGuardEnabled: true,
    gateDecision,
    result: unsupportedEvidenceResultFor(gateDecision),
  };
}
