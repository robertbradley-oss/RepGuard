import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  mapUnsupportedEvidenceReviewState,
  UNSUPPORTED_EVIDENCE_REVIEW_STATE_STATUS,
  type UnsupportedEvidenceReviewDisplay,
  type UnsupportedEvidenceReviewDisplayInput,
} from "@/lib/analysis/unsupported-evidence-review-state";

type HasAnyKey<T, TKey extends PropertyKey> = Extract<keyof T, TKey> extends never ? false : true;
type AssertFalse<T extends false> = T extends false ? true : never;

type ForbiddenDisplayInputKeys =
  | "file"
  | "blob"
  | "fileBytes"
  | "imageBuffer"
  | "arrayBuffer"
  | "stream"
  | "objectUrl"
  | "imageUrl"
  | "dataUrl"
  | "rawExif"
  | "exif"
  | "rawMetadata"
  | "metadata"
  | "originalFilename"
  | "rawOcr"
  | "ocrText"
  | "providerOutput"
  | "providerHandle"
  | "storageHandle"
  | "integrationHandle"
  | "caseQueueHandle"
  | "customerId"
  | "ticketId"
  | "orderId"
  | "claimId"
  | "caseId"
  | "evidenceId";

const repoRoot = process.cwd();
const mapperSource = readFileSync(join(repoRoot, "src/lib/analysis/unsupported-evidence-review-state.ts"), "utf8");
const probeSource = readFileSync(join(repoRoot, "src/lib/analysis/unsupported-evidence-review-state.probe.ts"), "utf8");
const analyzerSource = readFileSync(join(repoRoot, "src/lib/analysis/analyzer.ts"), "utf8");
const typesSource = readFileSync(join(repoRoot, "src/lib/analysis/types.ts"), "utf8");
const claimReviewWorkflowSource = readFileSync(join(repoRoot, "src/components/ClaimReviewWorkflow.tsx"), "utf8");
const uploadPanelSource = readFileSync(join(repoRoot, "src/components/UploadPanel.tsx"), "utf8");
const reportAdapterSource = readFileSync(join(repoRoot, "src/lib/analysis/report-adapter.ts"), "utf8");
const appPageSource = readFileSync(join(repoRoot, "src/app/page.tsx"), "utf8");
const productPhotoReviewPanelSource = readFileSync(join(repoRoot, "src/components/ProductPhotoReviewPanel.tsx"), "utf8");

function assertProbeChecksPass(group: string, checks: Record<string, boolean>) {
  const failed = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);

  if (failed.length > 0) {
    throw new Error(`Unsupported evidence review-state probe failed (${group}): ${failed.join(", ")}`);
  }
}

const productPhoto = mapUnsupportedEvidenceReviewState({
  outcome: "product-photo-like-unsupported",
  syntheticCaseKind: "product-photo",
});
const orderScreenshot = mapUnsupportedEvidenceReviewState({
  outcome: "unsupported-evidence",
  syntheticCaseKind: "order-screenshot",
});
const ambiguousPdf = mapUnsupportedEvidenceReviewState({
  outcome: "unknown-inconclusive",
  syntheticCaseKind: "ambiguous-pdf",
});
const unknownEvidence = mapUnsupportedEvidenceReviewState({
  outcome: "unknown-inconclusive",
  syntheticCaseKind: "unknown-evidence",
});
const mixedEvidence = mapUnsupportedEvidenceReviewState({
  outcome: "product-photo-like-unsupported",
  syntheticCaseKind: "mixed-evidence",
});
const unsupportedImage = mapUnsupportedEvidenceReviewState({
  outcome: "unsupported-evidence",
  syntheticCaseKind: "unsupported-image",
});
const receiptLikeNotParseable = mapUnsupportedEvidenceReviewState({
  outcome: "unknown-inconclusive",
  syntheticCaseKind: "receipt-like-not-parseable",
});
const legacyTerminology = mapUnsupportedEvidenceReviewState({
  outcome: "legacy-damage-photo-quarantine",
  syntheticCaseKind: "mixed-evidence",
});

const hostilePrivateSentinel = "PRIVATE_CUSTOMER_ORDER_777";
const hostileInput = {
  outcome: "unsupported-evidence",
  syntheticCaseKind: "unknown-evidence",
  rawOcr: hostilePrivateSentinel,
  originalFilename: `${hostilePrivateSentinel}.jpg`,
  objectUrl: `blob:${hostilePrivateSentinel}`,
} as UnsupportedEvidenceReviewDisplayInput & Record<string, string>;
const hostileOutput = mapUnsupportedEvidenceReviewState(hostileInput);

const allDisplays: UnsupportedEvidenceReviewDisplay[] = [
  productPhoto,
  orderScreenshot,
  ambiguousPdf,
  unknownEvidence,
  mixedEvidence,
  unsupportedImage,
  receiptLikeNotParseable,
  legacyTerminology,
  hostileOutput,
];

const visibleDisplayTextFields = (display: UnsupportedEvidenceReviewDisplay) => [
  display.evidenceTypeLabel,
  display.reviewStatus,
  display.riskTreatment,
  display.supportRepSummary,
  display.customerSafeWording,
  display.confidenceTreatment.label,
  display.confidenceTreatment.summary,
  display.confidenceTreatment.scoreBoundaryNotice,
  ...display.manualReviewGuidance,
  ...display.blockedOutputReasons,
];

const exactReceiptAuthenticityBoundaryNotice = [
  "This result should not be treated as a receipt auth",
  "enticity score.",
].join("");

const forbiddenVisiblePhrases = [
  ["fr", "aud confirmed"].join(""),
  ["fa", "ke receipt"].join(""),
  ["for", "ged"].join(""),
  ["manipulated", " evidence"].join(""),
  ["pr", "oof of purchase"].join(""),
  ["receipt", " score"].join(""),
  ["auth", "enticity score"].join(""),
  ["product-photo", " report"].join(""),
  ["photo", " report"].join(""),
  ["deny", " this claim"].join(""),
  ["customer", " is lying"].join(""),
  ["quaran", "tine"].join(""),
] as const;

function visibleOutputOmitsForbiddenPhrases(display: UnsupportedEvidenceReviewDisplay) {
  const visibleText = visibleDisplayTextFields(display).join(" ").toLowerCase();
  const visibleTextWithoutAllowedBoundaryNotice = visibleText.replace(
    exactReceiptAuthenticityBoundaryNotice.toLowerCase(),
    "",
  );

  return forbiddenVisiblePhrases.every((phrase) => {
    if (phrase === ["auth", "enticity score"].join("")) {
      return !visibleTextWithoutAllowedBoundaryNotice.includes(phrase);
    }

    return !visibleText.includes(phrase);
  });
}

function stringifyForProbe(value: unknown) {
  return JSON.stringify(value);
}

function sourceImports(source: string, importPath: string) {
  return source.includes(`from "${importPath}"`) || source.includes(`from '${importPath}'`);
}

function outputOmitsPrivateSentinels(display: UnsupportedEvidenceReviewDisplay) {
  const serialized = stringifyForProbe(display);
  const forbiddenFragments = [
    hostilePrivateSentinel,
    "rawOcr",
    "ocrText",
    "fileBytes",
    "imageBuffer",
    "arrayBuffer",
    "objectUrl",
    "imageUrl",
    "dataUrl",
    "rawExif",
    "rawMetadata",
    "originalFilename",
    "providerOutput",
    "storageHandle",
    "integrationHandle",
    "caseQueueHandle",
    "customerId",
    "ticketId",
    "orderId",
    "claimId",
    "caseId",
    "evidenceId",
  ];

  return forbiddenFragments.every((fragment) => !serialized.includes(fragment));
}

function displayHasRequiredSafeConcepts(display: UnsupportedEvidenceReviewDisplay) {
  const visibleText = visibleDisplayTextFields(display).join(" ");

  return (
    visibleText.includes("This file type is not supported for automated receipt analysis.") &&
    visibleText.includes("Manual review is recommended before taking action.") &&
    visibleText.includes(exactReceiptAuthenticityBoundaryNotice) &&
    visibleText.includes("Use the available evidence and support policy to decide the next step.")
  );
}

const typeChecks = {
  inputHasNoForbiddenKeys: true satisfies AssertFalse<
    HasAnyKey<UnsupportedEvidenceReviewDisplayInput, ForbiddenDisplayInputKeys>
  >,
};

const caseCoverageChecks = {
  productPhotoCovered: productPhoto.evidenceTypeLabel.includes("Product photo evidence"),
  orderScreenshotCovered: orderScreenshot.evidenceTypeLabel.includes("Order screenshot"),
  ambiguousPdfCovered: ambiguousPdf.evidenceTypeLabel.includes("Ambiguous PDF"),
  unknownEvidenceCovered: unknownEvidence.evidenceTypeLabel.includes("Evidence type could not be routed"),
  mixedEvidenceCovered: mixedEvidence.evidenceTypeLabel.includes("Mixed evidence"),
  unsupportedImageCovered: unsupportedImage.evidenceTypeLabel.includes("Unsupported image"),
  receiptLikeNotParseableCovered: receiptLikeNotParseable.evidenceTypeLabel.includes("Receipt-like evidence"),
};

const shapeChecks = {
  everyDisplayUsesUnsupportedState: allDisplays.every(
    (display) =>
      display.resultKind === "unsupported-evidence-review" &&
      display.state === "unsupportedEvidenceReview" &&
      display.boundary === "unsupported-evidence-display-mapping-probe",
  ),
  everyDisplayManualReviewRecommended: allDisplays.every(
    (display) => display.reviewStatus === "Manual review recommended" && display.manualReviewOnly === true,
  ),
  everyDisplayHasAllowedNextActions: allDisplays.every(
    (display) =>
      display.allowedNextActions.includes("manual-review") &&
      display.allowedNextActions.includes("request-eligible-receipt") &&
      display.allowedNextActions.includes("use-support-policy"),
  ),
  everyDisplayHasRequiredSafeConcepts: allDisplays.every(displayHasRequiredSafeConcepts),
  unknownRoutingUsesInconclusiveConfidence:
    ambiguousPdf.confidenceTreatment.label === "Routing inconclusive" &&
    unknownEvidence.confidenceTreatment.label === "Routing inconclusive" &&
    receiptLikeNotParseable.confidenceTreatment.label === "Routing inconclusive",
  nonUnknownRoutingUsesNotAnalyzed:
    productPhoto.confidenceTreatment.label === "Not analyzed" &&
    orderScreenshot.confidenceTreatment.label === "Not analyzed" &&
    mixedEvidence.confidenceTreatment.label === "Not analyzed" &&
    unsupportedImage.confidenceTreatment.label === "Not analyzed",
};

const noLiveBoundaryChecks = {
  everyDisplayNonLive: allDisplays.every(
    (display) => display.runtimeLive === false && display.productPhotoRuntimeLive === false,
  ),
  everyDisplayNoAnalyzerReportUiRouting: allDisplays.every(
    (display) =>
      display.ocrInvoked === false &&
      display.metadataInvoked === false &&
      display.analyzerInvoked === false &&
      display.liveReportAdapterInvoked === false &&
      display.uiUploadReportScoringParserFixturePathsInvoked === false &&
      display.productPhotoReviewPanelRouted === false,
  ),
  everyDisplayNoProviderStorageIntegrationQueue: allDisplays.every(
    (display) => display.providersStorageIntegrationsCaseQueuesInvoked === false,
  ),
  everyDisplayNoReceiptOrProductPhotoReportShown: allDisplays.every(
    (display) =>
      display.receiptScoreShown === false &&
      display.receiptReportShown === false &&
      display.productPhotoReportShown === false &&
      display.proofOfPurchaseLanguageShown === false,
  ),
  statusMarkerNonLive:
    UNSUPPORTED_EVIDENCE_REVIEW_STATE_STATUS.runtimeLive === false &&
    UNSUPPORTED_EVIDENCE_REVIEW_STATE_STATUS.productPhotoRuntimeLive === false &&
    UNSUPPORTED_EVIDENCE_REVIEW_STATE_STATUS.renderedUiAdded === false &&
    UNSUPPORTED_EVIDENCE_REVIEW_STATE_STATUS.liveRuntimeWired === false &&
    UNSUPPORTED_EVIDENCE_REVIEW_STATE_STATUS.receiptBehaviorChanged === false,
};

const wordingChecks = {
  everyVisibleOutputOmitsForbiddenPhrases: allDisplays.every(visibleOutputOmitsForbiddenPhrases),
  everyOutputOmitsPrivateSentinels: allDisplays.every(outputOmitsPrivateSentinels),
};

const sourceBoundaryChecks = {
  mapperHasNoImports: !/^import\s/m.test(mapperSource),
  mapperDoesNotReferenceLiveAnalyzerOrReceiptResult:
    !mapperSource.includes("analyzeEvidenceFile") &&
    !mapperSource.includes("LocalAnalysisResult") &&
    !mapperSource.includes("MockAnalysisReport"),
  mapperDoesNotReferenceProtectedRuntimePaths:
    !mapperSource.includes("@/lib/analysis/report-adapter") &&
    !mapperSource.includes("@/lib/analysis/receipt-parser") &&
    !mapperSource.includes("@/lib/analysis/scoring") &&
    !mapperSource.includes("@/lib/test-evidence") &&
    !mapperSource.includes("@/components/ClaimReviewWorkflow") &&
    !mapperSource.includes("@/components/UploadPanel") &&
    !mapperSource.includes("@/components/ProductPhotoReviewPanel"),
  mapperDoesNotReferenceRawFileOrIntegrationSurfaces:
    !/createObjectURL|\bobjectUrl\b|\bimageUrl\b|\bdataUrl\b|rawExif|rawMetadata|originalFilename|providerOutput|storageHandle|integrationHandle|caseQueueHandle/.test(
      mapperSource,
    ),
  probeOnlyImportsMapper:
    sourceImports(probeSource, "@/lib/analysis/unsupported-evidence-review-state") &&
    !sourceImports(probeSource, "@/lib/analysis/pre-analysis-evidence-gate-runtime") &&
    !sourceImports(probeSource, "@/lib/analysis/report-adapter"),
  liveWorkflowDoesNotImportMapper: !claimReviewWorkflowSource.includes("unsupported-evidence-review-state"),
  uploadPanelDoesNotImportMapper: !uploadPanelSource.includes("unsupported-evidence-review-state"),
  reportAdapterDoesNotImportMapper: !reportAdapterSource.includes("unsupported-evidence-review-state"),
  appPageDoesNotImportMapper: !appPageSource.includes("unsupported-evidence-review-state"),
  productPhotoReviewPanelDoesNotImportMapper:
    !productPhotoReviewPanelSource.includes("unsupported-evidence-review-state"),
  analyzerFunctionSignatureUnchanged: analyzerSource.includes(
    "analyzeEvidenceFile(file: File): Promise<LocalAnalysisResult>",
  ),
  localAnalysisResultStillReceiptShaped:
    typesSource.includes("export type LocalAnalysisResult = {") &&
    typesSource.includes("receipt: ExtractedReceiptInfo;") &&
    !typesSource.includes("UnsupportedEvidenceReviewDisplay") &&
    !typesSource.includes("UnsupportedEvidenceResult"),
};

assertProbeChecksPass("types", typeChecks);
assertProbeChecksPass("case coverage", caseCoverageChecks);
assertProbeChecksPass("shape", shapeChecks);
assertProbeChecksPass("no-live boundaries", noLiveBoundaryChecks);
assertProbeChecksPass("wording", wordingChecks);
assertProbeChecksPass("source boundaries", sourceBoundaryChecks);

export const UNSUPPORTED_EVIDENCE_REVIEW_STATE_DEVELOPER_PROBE = {
  status: UNSUPPORTED_EVIDENCE_REVIEW_STATE_STATUS,
  cases: {
    productPhoto,
    orderScreenshot,
    ambiguousPdf,
    unknownEvidence,
    mixedEvidence,
    unsupportedImage,
    receiptLikeNotParseable,
    legacyTerminology,
    hostileOutput,
  },
  expectations: {
    types: typeChecks,
    caseCoverage: caseCoverageChecks,
    shape: shapeChecks,
    noLiveBoundaries: noLiveBoundaryChecks,
    wording: wordingChecks,
    sourceBoundaries: sourceBoundaryChecks,
  },
} as const;
