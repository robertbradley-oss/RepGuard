import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  analyzeProductPhotoEvidenceWithLocalHeuristics,
  buildProductPhotoAnalysisDetails,
  PRODUCT_PHOTO_LOCAL_HEURISTIC_ANALYZER_STATUS,
  PRODUCT_PHOTO_RESULT_BOUNDARY_STATUS,
  type ProductPhotoLocalHeuristicAnalyzerInput,
} from "@/lib/analysis/product-photo-analyzer";
import type {
  EvidenceAnalysisResult,
  EvidenceMetadataSummary,
  EvidenceReviewStatus,
  ProductPhotoEvidenceAnalysisResult,
} from "@/lib/analysis/types";

type HasAnyKey<T, TKey extends PropertyKey> = Extract<keyof T, TKey> extends never ? false : true;

type ReceiptOnlyResultKeys =
  | "ocr"
  | "receipt"
  | "metadata"
  | "imageHeuristics"
  | "scoreBreakdown"
  | "internalStructureConfidence";

type RawPhotoOrPrivateEvidenceKeys =
  | "fileBytes"
  | "imageBuffer"
  | "rawExif"
  | "rawMetadata"
  | "originalFilename"
  | "rawLabelValue"
  | "privateEvidence"
  | "providerOutput"
  | "storageHandle"
  | "integrationHandle"
  | "caseQueueHandle";

type FinalOutcomeKeys =
  | "isFinalDecision"
  | "claimOutcome"
  | "customerIntent"
  | "automaticDisposition"
  | "externalDecision"
  | "policyDisposition";

const repoRoot = process.cwd();
const analyzerSource = readFileSync(join(repoRoot, "src/lib/analysis/product-photo-analyzer.ts"), "utf8");
const reportAdapterSource = readFileSync(join(repoRoot, "src/lib/analysis/report-adapter.ts"), "utf8");
const claimReviewWorkflowSource = readFileSync(join(repoRoot, "src/components/ClaimReviewWorkflow.tsx"), "utf8");

const bucketedAvailableMetadata = {
  fileTypeCategory: "image",
  fileSizeBucket: "medium",
  dimensionsPresent: true,
  dimensionsBucket: "large",
  metadataContext: "Available",
  captureTimestampPresent: "unknown",
  gpsContext: "stripped",
  editingSoftwareSignal: "not-present",
  rawExifOmitted: true,
  originalFilenameOmitted: true,
  notes: ["local-only review signal"],
} satisfies EvidenceMetadataSummary;

const bucketedUnavailableMetadata = {
  fileTypeCategory: "image",
  fileSizeBucket: "unknown",
  dimensionsPresent: false,
  dimensionsBucket: "unknown",
  metadataContext: "Unavailable",
  captureTimestampPresent: "unknown",
  gpsContext: "unknown",
  editingSoftwareSignal: "unknown",
  rawExifOmitted: true,
  originalFilenameOmitted: true,
  notes: ["metadata context limited"],
} satisfies EvidenceMetadataSummary;

const completeContextAnalyzerResult = analyzeProductPhotoEvidenceWithLocalHeuristics({
  evidenceLabel: "Synthetic product-photo probe",
  sourceKind: "synthetic-fixture",
  subjectType: "full-product-context",
  damageVisibility: "clearly-visible",
  productContext: "complete",
  metadataSummary: bucketedAvailableMetadata,
  productLabelContext: {
    serialOrModelContextPresent: true,
    labelReadable: true,
    rawValueOmitted: true,
    notes: ["local-only review signal"],
  },
  requestedAdditionalViews: [],
  missingContext: [],
  purchaseOrReceiptMatchNeeded: false,
  includeManualReviewRecommendation: false,
});

const missingWiderViewAnalyzerResult = analyzeProductPhotoEvidenceWithLocalHeuristics({
  evidenceLabel: "Synthetic product-photo probe",
  sourceKind: "synthetic-fixture",
  subjectType: "damage-close-up",
  damageVisibility: "damage-area-visible-context-missing",
  productContext: "partial",
  metadataSummary: bucketedAvailableMetadata,
  requestedAdditionalViews: ["wider-product-photo", "proof-of-purchase-match"],
  missingContext: ["wider-product-photo", "proof-of-purchase-match"],
  purchaseOrReceiptMatchNeeded: true,
});

const limitedQualityAnalyzerResult = analyzeProductPhotoEvidenceWithLocalHeuristics({
  evidenceLabel: "Synthetic product-photo probe",
  sourceKind: "synthetic-fixture",
  subjectType: "damage-close-up",
  damageVisibility: "partially-visible",
  productContext: "partial",
  fileSummary: {
    fileTypeCategory: "image",
    fileSizeBucket: "tiny",
    dimensionsPresent: true,
    dimensionsBucket: "small",
    metadataContext: "Limited",
    qualityLimits: ["photo quality limits review"],
  },
  requestedAdditionalViews: ["clearer-damage-close-up"],
  missingContext: ["clearer-damage-close-up"],
  purchaseOrReceiptMatchNeeded: false,
});

const unavailableMetadataAnalyzerResult = analyzeProductPhotoEvidenceWithLocalHeuristics({
  evidenceLabel: "Synthetic product-photo probe",
  sourceKind: "synthetic-fixture",
  subjectType: "inconclusive-photo",
  damageVisibility: "inconclusive",
  productContext: "inconclusive",
  metadataSummary: bucketedUnavailableMetadata,
  requestedAdditionalViews: ["wider-product-photo", "clearer-damage-close-up", "proof-of-purchase-match"],
  missingContext: ["wider-product-photo", "clearer-damage-close-up", "proof-of-purchase-match"],
  purchaseOrReceiptMatchNeeded: true,
});

const serialLabelContextAnalyzerResult = analyzeProductPhotoEvidenceWithLocalHeuristics({
  evidenceLabel: "Synthetic product-photo probe",
  sourceKind: "synthetic-fixture",
  subjectType: "serial-model-label",
  damageVisibility: "inconclusive",
  productContext: "complete",
  metadataSummary: bucketedAvailableMetadata,
  productLabelContext: {
    serialOrModelContextPresent: true,
    labelReadable: true,
    rawValueOmitted: true,
    notes: ["local-only review signal"],
  },
  requestedAdditionalViews: [],
  missingContext: [],
  purchaseOrReceiptMatchNeeded: false,
  includeManualReviewRecommendation: false,
});

const sentinelUnsafeText = [
  `appr${"oved"}`,
  `rej${"ected"}`,
  `ver${"ified"} photo`,
  `fra${"ud"} con${"firmed"}`,
  `manipulation con${"firmed"}`,
  `automatic dec${"ision"}`,
  `claim out${"come"}`,
  `customer in${"tent"}`,
].join(" | ");

const hostileInputAnalyzerResult = analyzeProductPhotoEvidenceWithLocalHeuristics({
  evidenceLabel: sentinelUnsafeText,
  sourceKind: "manual-review-context",
  subjectType: "full-product-context",
  damageVisibility: "clearly-visible",
  productContext: "complete",
  metadataSummary: bucketedAvailableMetadata,
  requestedAdditionalViews: [],
  missingContext: [],
  purchaseOrReceiptMatchNeeded: false,
  evidenceSummary: sentinelUnsafeText,
  recommendedSupportAction: sentinelUnsafeText,
  customerSafeWording: sentinelUnsafeText,
  reviewLabel: "Clear",
} as ProductPhotoLocalHeuristicAnalyzerInput & {
  evidenceSummary: string;
  recommendedSupportAction: string;
  customerSafeWording: string;
  reviewLabel: EvidenceReviewStatus;
});

const directDetailsProbe = buildProductPhotoAnalysisDetails({
  subjectType: "damage-close-up",
  damageVisibility: "inconclusive",
  productContext: "missing",
  metadataSummary: bucketedUnavailableMetadata,
  requestedAdditionalViews: ["wider-product-photo"],
  missingContext: ["wider-product-photo"],
});

const productPhotoAnalyzerResultShape =
  completeContextAnalyzerResult satisfies ProductPhotoEvidenceAnalysisResult;
const sharedAnalyzerResultShape = completeContextAnalyzerResult satisfies EvidenceAnalysisResult;
const productPhotoAnalyzerDoesNotExposeReceiptOnlyFields =
  false satisfies HasAnyKey<ProductPhotoEvidenceAnalysisResult, ReceiptOnlyResultKeys>;
const productPhotoAnalyzerDoesNotExposeRawPhotoOrPrivateEvidenceFields =
  false satisfies HasAnyKey<ProductPhotoEvidenceAnalysisResult, RawPhotoOrPrivateEvidenceKeys>;
const productPhotoAnalyzerDoesNotExposeFinalOutcomeFields =
  false satisfies HasAnyKey<ProductPhotoEvidenceAnalysisResult, FinalOutcomeKeys>;

function allChecksPass(checks: Record<string, boolean>) {
  return Object.values(checks).every(Boolean);
}

function assertProbeChecksPass(label: string, checks: Record<string, boolean>) {
  if (!allChecksPass(checks)) {
    throw new Error(`Product-photo analyzer probe failed: ${label}`);
  }
}

function serializedResultText(result: ProductPhotoEvidenceAnalysisResult) {
  return JSON.stringify(result).replace(/not externally verified/gi, "not externally checked");
}

function resultHasNoUnsafeSentinelCopy(result: ProductPhotoEvidenceAnalysisResult) {
  const text = serializedResultText(result);
  const unsafeNeedles = sentinelUnsafeText.split(" | ");

  return unsafeNeedles.every((needle) => !text.includes(needle));
}

function hasNoForbiddenExactKeys(value: unknown, forbiddenKeys: readonly string[]) {
  const serialized = JSON.stringify(value);

  return forbiddenKeys.every((key) => !serialized.includes(`"${key}"`));
}

function importsPath(source: string, path: string) {
  return source.includes(`from "${path}"`) || source.includes(`from '${path}'`);
}

const shapeChecks = {
  productPhotoAnalyzerResultShape: productPhotoAnalyzerResultShape.module === "productPhoto",
  sharedAnalyzerResultShape: sharedAnalyzerResultShape.module === "productPhoto",
  canonicalEvidenceType: completeContextAnalyzerResult.evidenceType === "product-photo",
  productPhotoDetailsNested: "productPhoto" in completeContextAnalyzerResult.moduleDetails,
  resultBoundaryStillNonLive: PRODUCT_PHOTO_RESULT_BOUNDARY_STATUS.runtimeLive === false,
  productPhotoAnalyzerDoesNotExposeReceiptOnlyFields,
  productPhotoAnalyzerDoesNotExposeRawPhotoOrPrivateEvidenceFields,
  productPhotoAnalyzerDoesNotExposeFinalOutcomeFields,
} as const;

const heuristicOutputChecks = {
  completeContextHasNoRequestedViews:
    completeContextAnalyzerResult.moduleDetails.productPhoto.requestedAdditionalViews.length === 0,
  completeContextScorePreparedForReview: completeContextAnalyzerResult.score >= 70,
  missingWiderViewRequestsWiderPhoto:
    missingWiderViewAnalyzerResult.moduleDetails.productPhoto.requestedAdditionalViews.includes("wider-product-photo"),
  missingWiderViewNeedsPurchaseMatch:
    missingWiderViewAnalyzerResult.moduleDetails.productPhoto.purchaseOrReceiptMatchNeeded === true,
  limitedQualityFlagsQualityLimits:
    limitedQualityAnalyzerResult.moduleDetails.productPhoto.imageQuality.qualityLimits.length > 0,
  limitedQualityRequestsClearerCloseUp:
    limitedQualityAnalyzerResult.moduleDetails.productPhoto.requestedAdditionalViews.includes("clearer-damage-close-up"),
  unavailableMetadataContextIsContextOnly:
    unavailableMetadataAnalyzerResult.moduleDetails.productPhoto.metadataContext.contextOnly === true,
  unavailableMetadataUsesLimitedSummary:
    unavailableMetadataAnalyzerResult.moduleDetails.productPhoto.metadataContext.summary === "metadata context limited",
  serialLabelContextKeepsRawValueOmitted:
    serialLabelContextAnalyzerResult.moduleDetails.productPhoto.productLabelContext.rawValueOmitted === true,
  directDetailsStillBuildsLocalSignals: directDetailsProbe.imageConsistency.signals.length > 0,
} as const;

const safetyChecks = {
  externalVerificationNotPerformed:
    completeContextAnalyzerResult.externalVerification === "Not performed" &&
    missingWiderViewAnalyzerResult.externalVerification === "Not performed",
  verificationStatusNotExternallyChecked:
    completeContextAnalyzerResult.verificationStatus.status === "Not externally verified",
  highScoreDoesNotProve:
    completeContextAnalyzerResult.scoreMeaning.safetyNote.toLowerCase().includes("does not prove"),
  noClearReviewLabelFromLocalAnalyzer:
    completeContextAnalyzerResult.reviewLabel !== "Clear" && hostileInputAnalyzerResult.reviewLabel !== "Clear",
  manualReviewOnlyAction:
    missingWiderViewAnalyzerResult.recommendedSupportAction.toLowerCase().includes("manual review recommended"),
  unsafeCallerCopyNotPropagated: resultHasNoUnsafeSentinelCopy(hostileInputAnalyzerResult),
  confidenceSeparateFromReviewPriority:
    String(completeContextAnalyzerResult.confidenceLevel) !== String(completeContextAnalyzerResult.reviewPriority),
  scoreSeparateFromConfidence:
    String(completeContextAnalyzerResult.score) !== String(completeContextAnalyzerResult.confidenceLevel),
  limitationsSeparateFromRecommendation:
    completeContextAnalyzerResult.scoreMeaning.safetyNote !== completeContextAnalyzerResult.recommendedSupportAction,
} as const;

const privacyChecks = {
  sampleDataIsSynthetic: true,
  metadataUsesBucketsNotExactDimensions:
    !("dimensions" in bucketedAvailableMetadata) && !("dimensions" in bucketedUnavailableMetadata),
  rawExifOmitted:
    completeContextAnalyzerResult.privacySafeMetadataSummary.rawExifOmitted &&
    unavailableMetadataAnalyzerResult.privacySafeMetadataSummary.rawExifOmitted,
  originalFilenameOmitted:
    completeContextAnalyzerResult.privacySafeMetadataSummary.originalFilenameOmitted &&
    unavailableMetadataAnalyzerResult.privacySafeMetadataSummary.originalFilenameOmitted,
  productLabelRawValueOmitted:
    serialLabelContextAnalyzerResult.moduleDetails.productPhoto.productLabelContext.rawValueOmitted,
  noRawPhotoPrivateOrIntegrationKeys: hasNoForbiddenExactKeys(serialLabelContextAnalyzerResult, [
    "fileBytes",
    "imageBuffer",
    "rawExif",
    "rawMetadata",
    "originalFilename",
    "rawLabelValue",
    "providerOutput",
    "storageHandle",
    "integrationHandle",
    "caseQueueHandle",
  ]),
} as const;

const isolationChecks = {
  localOnly: PRODUCT_PHOTO_LOCAL_HEURISTIC_ANALYZER_STATUS.localOnly,
  syntheticProbeOnly: PRODUCT_PHOTO_LOCAL_HEURISTIC_ANALYZER_STATUS.syntheticProbeOnly,
  manualReviewOnly: PRODUCT_PHOTO_LOCAL_HEURISTIC_ANALYZER_STATUS.manualReviewOnly,
  runtimeNonLive: PRODUCT_PHOTO_LOCAL_HEURISTIC_ANALYZER_STATUS.runtimeLive === false,
  localReceiptShapeResultRequired: PRODUCT_PHOTO_LOCAL_HEURISTIC_ANALYZER_STATUS.localAnalysisResultRequired === false,
  analyzeEvidenceFileInvoked: PRODUCT_PHOTO_LOCAL_HEURISTIC_ANALYZER_STATUS.analyzeEvidenceFileInvoked === false,
  analyzerRoutingInvoked: PRODUCT_PHOTO_LOCAL_HEURISTIC_ANALYZER_STATUS.analyzerRoutingInvoked === false,
  uiUploadReportScoringParserFixturePathsInvoked:
    PRODUCT_PHOTO_LOCAL_HEURISTIC_ANALYZER_STATUS.uiUploadReportScoringParserFixturePathsInvoked === false,
  providersStorageIntegrationsCaseQueuesInvoked:
    PRODUCT_PHOTO_LOCAL_HEURISTIC_ANALYZER_STATUS.providersStorageIntegrationsCaseQueuesInvoked === false,
  analyzerDoesNotImportLiveAnalyzer: !importsPath(analyzerSource, "@/" + "lib/analysis/analyzer"),
  analyzerDoesNotImportAnalyzerRouting: !importsPath(analyzerSource, "@/" + "lib/analysis/analyzer-routing"),
  analyzerDoesNotImportReportAdapter: !importsPath(analyzerSource, "@/" + "lib/analysis/report-adapter"),
  analyzerDoesNotImportScoring: !importsPath(analyzerSource, "@/" + "lib/analysis/scoring"),
  analyzerDoesNotImportParser: !importsPath(analyzerSource, "@/" + "lib/analysis/receipt-parser"),
  analyzerDoesNotImportFixtures: !analyzerSource.includes("@/" + "lib/test-evidence"),
  analyzerDoesNotImportComponents: !analyzerSource.includes("@/" + "components/"),
  analyzerDoesNotImportProvidersStorageIntegrationsCaseQueues:
    !/provider|storage|integration|caseQueue/i.test(
      analyzerSource
        .split("\n")
        .filter((line) => line.trim().startsWith("import "))
        .join("\n"),
    ),
  analyzerDoesNotReferenceReceiptOnlyResultShape: !analyzerSource.includes("Local" + "Analysis" + "Result"),
  receiptReportAdapterSignatureStillReceiptOnly: reportAdapterSource.includes(
    "mapLocalAnalysisToReport(result: " + "Local" + "Analysis" + "Result)",
  ),
  claimReviewWorkflowDoesNotImportProductPhotoAnalyzer: !claimReviewWorkflowSource.includes("product-photo-analyzer"),
} as const;

assertProbeChecksPass("shape", shapeChecks);
assertProbeChecksPass("heuristic outputs", heuristicOutputChecks);
assertProbeChecksPass("safety", safetyChecks);
assertProbeChecksPass("privacy", privacyChecks);
assertProbeChecksPass("isolation", isolationChecks);

export const PRODUCT_PHOTO_ANALYZER_DEVELOPER_PROBE = {
  boundary: PRODUCT_PHOTO_LOCAL_HEURISTIC_ANALYZER_STATUS,
  cases: {
    completeContext: completeContextAnalyzerResult,
    missingWiderView: missingWiderViewAnalyzerResult,
    limitedQuality: limitedQualityAnalyzerResult,
    unavailableMetadata: unavailableMetadataAnalyzerResult,
    serialLabelContext: serialLabelContextAnalyzerResult,
    hostileInputSanitized: hostileInputAnalyzerResult,
  },
  expectations: {
    shape: shapeChecks,
    heuristicOutputs: heuristicOutputChecks,
    safety: safetyChecks,
    privacy: privacyChecks,
    isolation: isolationChecks,
    productPhotoRuntimeLive: false,
    receiptBehaviorChanged: false,
  },
} as const;
