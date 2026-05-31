import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  normalizeSyntheticOcrFixtureToExtractionContract,
  runProviderNeutralOcrExtractionContractHarness,
  type NormalizedOcrReceiptExtractionResult,
  type ProviderNeutralOcrInputContract,
} from "@/lib/analysis/ocr-extraction-contract";
import { SYNTHETIC_OCR_FIXTURE_CASES } from "@/lib/analysis/ocr-fixture-harness";

type HasAnyKey<T, TKey extends PropertyKey> = Extract<keyof T, TKey> extends never ? false : true;
type AssertFalse<T extends false> = T extends false ? true : never;

type ForbiddenContractKeys =
  | "file"
  | "blob"
  | "fileBytes"
  | "imageBuffer"
  | "objectUrl"
  | "imageUrl"
  | "dataUrl"
  | "rawExif"
  | "rawMetadata"
  | "originalFilename"
  | "providerPayload"
  | "providerResponse"
  | "providerRequestId"
  | "storageHandle"
  | "integrationHandle"
  | "caseQueueHandle"
  | "customerId"
  | "ticketId"
  | "claimId"
  | "caseId"
  | "evidenceId"
  | "externalDecision"
  | "claimOutcome"
  | "automaticDisposition";

const repoRoot = process.cwd();
const contractSource = readFileSync(join(repoRoot, "src/lib/analysis/ocr-extraction-contract.ts"), "utf8");
const probeSource = readFileSync(join(repoRoot, "src/lib/analysis/ocr-extraction-contract.probe.ts"), "utf8");
const analyzerSource = readFileSync(join(repoRoot, "src/lib/analysis/analyzer.ts"), "utf8");
const reportAdapterSource = readFileSync(join(repoRoot, "src/lib/analysis/report-adapter.ts"), "utf8");
const claimReviewWorkflowSource = readFileSync(join(repoRoot, "src/components/ClaimReviewWorkflow.tsx"), "utf8");
const productPhotoReviewPanelSource = readFileSync(join(repoRoot, "src/components/ProductPhotoReviewPanel.tsx"), "utf8");

const harness = runProviderNeutralOcrExtractionContractHarness();
const resultsByInputId = new Map(harness.results.map((result) => [result.input.inputId, result]));
const serializedHarness = JSON.stringify(harness).toLowerCase();

function assertProbeChecksPass(group: string, checks: Record<string, boolean>) {
  const failed = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);

  if (failed.length > 0) {
    throw new Error(`Provider-neutral OCR extraction contract probe failed (${group}): ${failed.join(", ")}`);
  }
}

function resultFor(inputId: string) {
  const result = resultsByInputId.get(inputId);

  if (!result) {
    throw new Error(`Missing OCR contract result for fixture ${inputId}`);
  }

  return result;
}

function hasManualDriver(result: NormalizedOcrReceiptExtractionResult, code: string) {
  return result.manualReviewDrivers.some((driver) => driver.code === code);
}

const typeChecks = {
  inputContractHasNoForbiddenKeys: true satisfies AssertFalse<
    HasAnyKey<ProviderNeutralOcrInputContract, ForbiddenContractKeys>
  >,
  resultContractHasNoForbiddenKeys: true satisfies AssertFalse<
    HasAnyKey<NormalizedOcrReceiptExtractionResult, ForbiddenContractKeys>
  >,
};

const requiredFixtureKeys = [
  "clean-receipt-ocr",
  "amazon-like-order-ocr",
  "missing-total-ocr",
  "missing-merchant-ocr",
  "conflicting-date-total-ocr",
  "noisy-ocr-text",
  "receipt-like-incomplete-ocr",
  "unsupported-non-receipt-text",
  "ambiguous-marketplace-screen-ocr",
  "provider-timeout-synthetic-failure",
  "empty-ocr-output",
] as const;

const coverageChecks = {
  coversEverySyntheticFixture: harness.summary.totalResults === SYNTHETIC_OCR_FIXTURE_CASES.length,
  allRequiredFixtureKeysPresent: requiredFixtureKeys.every((key) => resultsByInputId.has(key)),
  cleanReceiptCompleted: resultFor("clean-receipt-ocr").status === "completed",
  amazonLikeCompletedWithReviewDriver:
    resultFor("amazon-like-order-ocr").status === "completed" &&
    hasManualDriver(resultFor("amazon-like-order-ocr"), "marketplace-readiness"),
  missingTotalNeedsReview:
    resultFor("missing-total-ocr").status === "needs-review" &&
    hasManualDriver(resultFor("missing-total-ocr"), "missing-field"),
  missingMerchantNeedsReview:
    resultFor("missing-merchant-ocr").status === "needs-review" &&
    hasManualDriver(resultFor("missing-merchant-ocr"), "missing-field"),
  conflictNeedsReview:
    resultFor("conflicting-date-total-ocr").status === "needs-review" &&
    hasManualDriver(resultFor("conflicting-date-total-ocr"), "conflicting-field"),
  noisyLowConfidenceReview:
    resultFor("noisy-ocr-text").status === "needs-review" &&
    resultFor("noisy-ocr-text").extractionConfidence.reviewSignalLevel === "high",
  incompleteRequiresManualReview:
    resultFor("receipt-like-incomplete-ocr").requiresManualReview &&
    hasManualDriver(resultFor("receipt-like-incomplete-ocr"), "missing-field"),
  unsupportedOutcomeModeled:
    resultFor("unsupported-non-receipt-text").status === "unsupported" &&
    Boolean(resultFor("unsupported-non-receipt-text").unsupportedOutcome),
  ambiguousMarketplaceReview:
    resultFor("ambiguous-marketplace-screen-ocr").status === "needs-review" &&
    hasManualDriver(resultFor("ambiguous-marketplace-screen-ocr"), "ambiguous-marketplace-structure"),
  providerFailureOperationalOnly:
    resultFor("provider-timeout-synthetic-failure").status === "provider-failure" &&
    resultFor("provider-timeout-synthetic-failure").reviewSignalLevel === "operational" &&
    resultFor("provider-timeout-synthetic-failure").providerFailureOutcome?.operationalOnly === true,
  emptyOutputRequiresManualReview:
    resultFor("empty-ocr-output").status === "empty" &&
    hasManualDriver(resultFor("empty-ocr-output"), "empty-output"),
};

const contractShapeChecks = {
  everyResultHasContractMarker: harness.results.every(
    (result) => result.contractName === "phase-4.3-provider-neutral-ocr-extraction-contract",
  ),
  everyInputIsSyntheticOnly: harness.results.every(
    (result) =>
      result.input.sourceKind === "synthetic-fixture" &&
      result.input.processingMode === "synthetic-contract-only" &&
      result.input.providerCallsAllowed === false &&
      result.input.liveRuntimeAllowed === false &&
      result.input.rawOcrRetentionAllowed === false,
  ),
  everyResultHasTextBlocksArray: harness.results.every((result) => Array.isArray(result.extractedTextBlocks)),
  everyResultHasStructuredFields: harness.results.every((result) => Boolean(result.structuredFields)),
  everyResultHasFieldConfidence: harness.results.every((result) => Boolean(result.fieldConfidence)),
  everyResultHasExtractionConfidence: harness.results.every(
    (result) => result.extractionConfidence.score >= 0 && result.extractionConfidence.score <= 100,
  ),
  everyResultHasLimitations: harness.results.every((result) => result.limitations.length > 0),
  everyResultHasSafeSummary: harness.summary.allRequireSafeSummary,
  allProviderFailuresOperationalOnly: harness.summary.allProviderFailuresOperationalOnly,
  normalizedFieldsCoverCoreReceiptFields: [
    "merchant",
    "orderNumber",
    "purchaseDate",
    "subtotal",
    "tax",
    "shipping",
    "total",
    "itemLines",
    "marketplaceHints",
  ].every((fieldKey) => contractSource.includes(fieldKey)),
};

const isolationChecks = {
  harnessRuntimeNonLive: harness.runtimeLive === false,
  harnessProviderFree: harness.providerFree === true,
  harnessRouteFree: harness.routeFree === true,
  harnessUiFree: harness.uiFree === true,
  harnessUploadFree: harness.uploadFree === true,
  harnessStorageFree: harness.storageFree === true,
  harnessRealEvidenceFree: harness.realEvidenceFree === true,
  analyzerDoesNotImportContract: !analyzerSource.includes("ocr-extraction-contract"),
  reportAdapterDoesNotImportContract: !reportAdapterSource.includes("ocr-extraction-contract"),
  claimReviewWorkflowDoesNotImportContract: !claimReviewWorkflowSource.includes("ocr-extraction-contract"),
  productPhotoReviewPanelDoesNotImportContract: !productPhotoReviewPanelSource.includes("ocr-extraction-contract"),
};

const forbiddenContractImports = [
  "@/lib/analysis/analyzer",
  "@/lib/analysis/ocr-service",
  "@/lib/analysis/receipt-parser",
  "@/lib/analysis/report-adapter",
  "@/lib/analysis/scoring",
  "@/lib/analysis/types",
  "@/components/ClaimReviewWorkflow",
  "@/components/ProductPhotoReviewPanel",
  "@/components/UploadPanel",
  "@/lib/test-evidence",
];

const forbiddenContractPatterns = [
  /\bFile\b/,
  /\bBlob\b/,
  /createObjectURL/,
  /\bobjectUrl\b/,
  /\bimageUrl\b/,
  /\bdataUrl\b/,
  /\bfetch\s*\(/,
  /localStorage/,
  /sessionStorage/,
  /process\.env/,
  /api\/|route\.ts|page\.tsx/,
  /providerPayload|providerResponse|providerRequestId/,
  /storageHandle|integrationHandle|caseQueueHandle/,
  /customerId|ticketId|claimId|caseId|evidenceId/,
  /automaticDisposition|externalDecision|claimOutcome/,
];

const importAndPrivacyChecks = {
  contractHasNoForbiddenImports: forbiddenContractImports.every((importPath) => !contractSource.includes(importPath)),
  contractHasNoForbiddenPatterns: forbiddenContractPatterns.every((pattern) => !pattern.test(contractSource)),
  probeOnlyImportsContractAndFixtureHarness:
    probeSource.includes("@/lib/analysis/ocr-extraction-contract") &&
    probeSource.includes("@/lib/analysis/ocr-fixture-harness"),
};

const unsafeTerms = [
  ["fa", "ke"].join(""),
  ["for", "ged"].join(""),
  ["fr", "aud"].join(""),
  ["den", "y"].join(""),
  ["app", "rove"].join(""),
  ["rej", "ect"].join(""),
  ["proves", " authenticity"].join(""),
  ["customer", " accusation"].join(" "),
];

const safetyLanguageChecks = {
  noUnsafeOutputTerms: unsafeTerms.every((term) => !serializedHarness.includes(term)),
  summaryFramesConfidenceAsReviewSignal: harness.summary.safeSummary.includes("review signal"),
  summaryRejectsProofOrFinalDecision: harness.summary.safeSummary.includes("not proof or a final decision"),
  everySafeSummaryIsReviewSupportOnly: harness.results.every(
    (result) => result.safeSummary.reviewPosture === "review-support-only",
  ),
  everySafeSummaryRejectsFinalDecision: harness.results.every((result) => result.safeSummary.noFinalDecision === true),
  fieldConfidenceIsReviewSignalWhenLow: resultFor("noisy-ocr-text").fieldConfidence.total?.reviewSignal === true,
  providerFailureIsNotCustomerRisk: resultFor("provider-timeout-synthetic-failure").providerFailureOutcome?.operationalOnly === true,
  externalVerificationOnlyNotPerformed: !/external verification (?:complete|passed|confirmed)/i.test(
    serializedHarness,
  ),
};

assertProbeChecksPass("types", typeChecks);
assertProbeChecksPass("coverage", coverageChecks);
assertProbeChecksPass("contract shape", contractShapeChecks);
assertProbeChecksPass("isolation", isolationChecks);
assertProbeChecksPass("imports and privacy", importAndPrivacyChecks);
assertProbeChecksPass("safety language", safetyLanguageChecks);

export const OCR_EXTRACTION_CONTRACT_DEVELOPER_PROBE = {
  typeChecks,
  coverageChecks,
  contractShapeChecks,
  isolationChecks,
  importAndPrivacyChecks,
  safetyLanguageChecks,
  fixtureCount: SYNTHETIC_OCR_FIXTURE_CASES.length,
  resultCount: harness.summary.totalResults,
  harnessName: harness.harnessName,
  runtimeLive: harness.runtimeLive,
  providerFree: harness.providerFree,
  routeFree: harness.routeFree,
  uiFree: harness.uiFree,
  uploadFree: harness.uploadFree,
  storageFree: harness.storageFree,
  realEvidenceFree: harness.realEvidenceFree,
  directNormalizationSmoke: normalizeSyntheticOcrFixtureToExtractionContract(SYNTHETIC_OCR_FIXTURE_CASES[0]),
} as const;
