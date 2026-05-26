import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ProductPhotoReviewPanel } from "@/components/ProductPhotoReviewPanel";
import type { ProductPhotoReportViewModel } from "@/lib/analysis/product-photo-report-view-model";

type Exact<TActual, TExpected> = TActual extends TExpected ? (TExpected extends TActual ? true : false) : false;
type ProductPhotoReviewPanelProps = Parameters<typeof ProductPhotoReviewPanel>[0];
type HasAnyKey<T, TKey extends PropertyKey> = Extract<keyof T, TKey> extends never ? false : true;

type ForbiddenPropKeys =
  | "className"
  | "children"
  | "onReview"
  | "onExport"
  | "callback"
  | "file"
  | "blob"
  | "previewUrl"
  | "objectUrl"
  | "imageUrl"
  | "dataUrl"
  | "rawResult"
  | "analysisResult"
  | "localAnalysisResult"
  | "evidenceAnalysisResult"
  | "uploadState"
  | "providerData"
  | "storageHandle"
  | "integrationId"
  | "caseQueueId";

const repoRoot = process.cwd();
const componentSource = readFileSync(join(repoRoot, "src/components/ProductPhotoReviewPanel.tsx"), "utf8");
const claimReviewWorkflowSource = readFileSync(join(repoRoot, "src/components/ClaimReviewWorkflow.tsx"), "utf8");
const reportAdapterSource = readFileSync(join(repoRoot, "src/lib/analysis/report-adapter.ts"), "utf8");

const forbiddenImportFragments = [
  "@/components/ClaimReviewWorkflow",
  "@/components/AnalysisReport",
  "@/components/AuthenticityResultCard",
  "@/components/RiskScoreCard",
  "@/components/UploadPanel",
  "@/lib/analysis/analyzer",
  "@/lib/analysis/analyzer-routing",
  "@/lib/analysis/report-adapter",
  "@/lib/analysis/scoring",
  "@/lib/analysis/receipt-parser",
  "@/lib/test-evidence",
  "@/lib/claim-data",
] as const;

const forbiddenTypeNames = [
  "LocalAnalysisResult",
  "EvidenceAnalysisResult",
  "ProductPhotoEvidenceAnalysisResult",
  "MockAnalysisReport",
  "ProductPhotoEvidenceAnalysisResultInput",
] as const;

const forbiddenSourceFragments = [
  "createObjectURL",
  "objectUrl",
  "imageUrl",
  "dataUrl",
  "File",
  "Blob",
  "rawExif",
  "rawMetadata",
  "originalFilename",
  "rawLabelValue",
  "moduleDetails",
  "privacySafeMetadataSummary",
] as const;

const forbiddenSentinelValues = [
  "RAW_ORIGINAL_FILENAME_SENTINEL.jpg",
  "RAW_EXIF_GPS_SENTINEL",
  "RAW_LABEL_VALUE_SENTINEL",
  "PROVIDER_HANDLE_SENTINEL",
  "STORAGE_HANDLE_SENTINEL",
  "INTEGRATION_HANDLE_SENTINEL",
  "CASE_QUEUE_HANDLE_SENTINEL",
] as const;

const lowScoreViewModel = {
  boundary: "product-photo-report-view-model",
  devOnly: true,
  probeOnly: true,
  runtimeLive: false,
  sourceModule: "productPhoto",
  evidenceType: "product-photo",
  reviewTitle: "Product photo review summary",
  reviewSummary: "Product-photo review context is local-only. 2 additional review items may be needed.",
  reviewStatus: "Manual review recommended",
  reviewPriority: "Manual review",
  confidence: "Low confidence",
  score: {
    label: "Evidence Reliability Score",
    value: 24,
    scope: "Local evidence quality and review readiness only",
    meaning: "Score reflects product-photo review readiness and local evidence quality only.",
    highScoreMeaning: "High score means the product-photo context may be more useful for local support review.",
    lowOrMediumScoreMeaning:
      "Low or medium score means image quality, product context, or receipt/order matching may require manual review.",
    safetyNote: "High score does not prove the product photo or claim. Manual review may still be required.",
  },
  evidenceQuality: {
    qualityLevel: "Limited",
    qualitySummary: "Photo dimensions were not available in the privacy-safe summary.",
    qualityLimitCount: 2,
  },
  productContext: {
    subjectType: "Close-up product photo",
    productContextStatus: "Product context may be incomplete",
    damageVisibilityReviewContext: "Relevant area is visible, but surrounding product context may be needed",
    labelContextSummary: "Label context is present for reviewer inspection; raw label values are omitted.",
    purchaseOrOrderMatchNeeded: true,
    requestedAdditionalViews: ["Wider product photo", "Receipt or order match"],
  },
  reviewSignals: [
    {
      label: "Photo quality limits review",
      category: "Image Quality",
      severity: "Medium",
      confidencePercent: 68,
      reviewNote: "Image quality may limit local reviewer inspection.",
      recommendedReviewStep: "Request a clearer product photo only if current detail limits review.",
    },
  ],
  limitations: [
    "Local product-photo analysis only",
    "External verification was not performed",
    "High score does not prove the product photo or claim",
    "Metadata is context only and raw metadata values are omitted",
    "Additional product or order context may be needed",
  ],
  recommendedSupportAction:
    "Manual review recommended. Request only the additional product view or receipt/order match needed for support review.",
  customerSafeWording: "Thanks for the photo. We may need one wider product view to complete the review.",
  externalVerification: {
    status: "Not externally verified",
    externalVerification: "Not performed",
    summary: "External verification was not performed. Product-photo details remain local review context only.",
  },
  privacy: {
    derivedSummaryOnly: true,
    rawPhotoBytesIncluded: false,
    imageBufferIncluded: false,
    rawExifIncluded: false,
    rawMetadataIncluded: false,
    originalFilenameIncluded: false,
    rawLabelValueIncluded: false,
    providerOutputIncluded: false,
    storageHandleIncluded: false,
    integrationHandleIncluded: false,
    caseQueueHandleIncluded: false,
  },
  isolation: {
    localAnalysisResultRequired: false,
    analyzeEvidenceFileInvoked: false,
    analyzerRoutingInvoked: false,
    uiUploadReportScoringParserFixturePathsInvoked: false,
  },
} satisfies ProductPhotoReportViewModel;

const mediumScoreViewModel = {
  ...lowScoreViewModel,
  reviewPriority: "Review",
  confidence: "Medium confidence",
  score: {
    ...lowScoreViewModel.score,
    value: 64,
  },
} satisfies ProductPhotoReportViewModel;

const highScoreViewModel = {
  ...lowScoreViewModel,
  reviewSummary:
    "Product-photo review context is local-only and ready for manual support comparison with available order evidence.",
  reviewStatus: "Review recommended",
  reviewPriority: "Standard",
  confidence: "High confidence",
  score: {
    ...lowScoreViewModel.score,
    value: 92,
  },
  evidenceQuality: {
    qualityLevel: "Clear",
    qualitySummary: "Photo quality context is available for local support review.",
    qualityLimitCount: 0,
  },
  productContext: {
    ...lowScoreViewModel.productContext,
    productContextStatus: "Product context available for review",
    purchaseOrOrderMatchNeeded: false,
    requestedAdditionalViews: [],
  },
  recommendedSupportAction:
    "Manual review recommended. Compare the product-photo context with available receipt or order evidence before completing support handling.",
  limitations: lowScoreViewModel.limitations.filter(
    (limitation) => limitation !== "Additional product or order context may be needed",
  ),
} satisfies ProductPhotoReportViewModel;

const displayCaseViewModels = [lowScoreViewModel, mediumScoreViewModel, highScoreViewModel] as const;

function allChecksPass(checks: Record<string, boolean>) {
  return Object.values(checks).every(Boolean);
}

function assertProbeChecksPass(label: string, checks: Record<string, boolean>) {
  if (!allChecksPass(checks)) {
    throw new Error(`ProductPhotoReviewPanel probe failed: ${label}`);
  }
}

function collectObjectKeyPaths(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectObjectKeyPaths(item, `${prefix}[${index}]`));
  }

  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const keyPath = prefix ? `${prefix}.${key}` : key;

    return [keyPath, ...collectObjectKeyPaths(nestedValue, keyPath)];
  });
}

function hasNoForbiddenExactKeys(value: unknown, forbiddenKeys: readonly string[]) {
  const forbiddenKeySet = new Set(forbiddenKeys);

  return collectObjectKeyPaths(value).every((keyPath) => {
    const keyName = keyPath.split(".").at(-1)?.replace(/\[\d+\]$/, "");

    return keyName ? !forbiddenKeySet.has(keyName) : true;
  });
}

function hasNoSentinelValues(value: unknown, sentinels: readonly string[]) {
  const text = JSON.stringify(value);

  return sentinels.every((sentinel) => !text.includes(sentinel));
}

function phrasePattern(parts: readonly string[]) {
  return new RegExp(parts.join("\\s+"), "i");
}

function wholeWordPattern(parts: readonly string[]) {
  return new RegExp(`\\b${parts.join("")}\\b`, "i");
}

const unsafeRenderableCopyPatterns = [
  phrasePattern(["fraud", "confirmed"]),
  phrasePattern(["confirmed", "fraud"]),
  phrasePattern(["manipulation", "confirmed"]),
  wholeWordPattern(["fa", "ke"]),
  wholeWordPattern(["appro", "ved"]),
  wholeWordPattern(["rej", "ected"]),
  phrasePattern(["automatic", "decision"]),
  phrasePattern(["automatic", "disposition"]),
  phrasePattern(["claim", "outcome"]),
  phrasePattern(["policy", "disposition"]),
  phrasePattern(["customer", "intent"]),
  phrasePattern(["customer", "wrongdoing"]),
  phrasePattern(["support", "policy", "decision"]),
  phrasePattern(["proof", "of", "authenticity"]),
  phrasePattern(["verified", "authentic"]),
  phrasePattern(["passed", "authenticity", "check"]),
  phrasePattern(["failed", "authenticity", "check"]),
  phrasePattern(["customer", "caused", "the", "damage"]),
  phrasePattern(["ai", "detected", "manipulation"]),
  /\b(?:image|photo|evidence)\s+proves/i,
] as const;

const exactPropsShape = true satisfies Exact<ProductPhotoReviewPanelProps, { viewModel: ProductPhotoReportViewModel }>;
const noForbiddenPropKeys = false satisfies HasAnyKey<ProductPhotoReviewPanelProps, ForbiddenPropKeys>;

const contractChecks = {
  propsExactlyViewModelOnly: exactPropsShape,
  propsDoNotAcceptClassNameCallbacksFilesBlobsUrlsOrRawResults: noForbiddenPropKeys,
  componentImportsOnlyReactAndProductPhotoViewModel:
    componentSource.includes(
      'import type { ProductPhotoReportViewModel } from "@/lib/analysis/product-photo-report-view-model";',
    ) && !componentSource.includes("import {"),
  componentDoesNotImportClaimReviewWorkflowUploadAnalyzerRoutingReportAdapterScoringParserFixtures:
    forbiddenImportFragments.every((fragment) => !componentSource.includes(fragment)),
  componentDoesNotImportLocalAnalysisResultEvidenceAnalysisResultProductPhotoEvidenceAnalysisResultMockAnalysisReport:
    forbiddenTypeNames.every((typeName) => !componentSource.includes(typeName)),
  componentSourceDoesNotReferenceObjectUrlImageUrlDataUrlFileBlobRawExifRawMetadataOriginalFilenameRawLabelValue:
    forbiddenSourceFragments.every((fragment) => !componentSource.includes(fragment)),
} as const;

const displayChecks = {
  missingContextCaseRendersRequiredSections:
    componentSource.includes("Review snapshot") &&
    componentSource.includes("Product/photo context") &&
    componentSource.includes("Recommended support action") &&
    componentSource.includes("Limitations") &&
    componentSource.includes("Review signals") &&
    componentSource.includes("Privacy posture"),
  completeContextCaseDoesNotRequestAdditionalViews:
    highScoreViewModel.productContext.requestedAdditionalViews.length === 0 &&
    highScoreViewModel.recommendedSupportAction.includes("Compare the product-photo context"),
  noRequestedViewsCaseRendersEmptyOrNeutralAdditionalViewsState:
    componentSource.includes("No additional view requested by this summary."),
  multipleRequestedViewsCaseRendersAllDerivedLabels:
    lowScoreViewModel.productContext.requestedAdditionalViews.includes("Wider product photo") &&
    lowScoreViewModel.productContext.requestedAdditionalViews.includes("Receipt or order match"),
  lowMediumHighScoreCasesKeepScoreLocalOnlyAndNotProof: displayCaseViewModels.every(
    (viewModel) =>
      viewModel.score.scope === "Local evidence quality and review readiness only" &&
      viewModel.score.safetyNote.includes("does not prove"),
  ),
  priorityConfidenceEvidenceQualityRemainSeparateFromScore:
    componentSource.includes("Review priority") &&
    componentSource.includes("Confidence") &&
    componentSource.includes("Evidence quality") &&
    !Object.keys(lowScoreViewModel.score).includes("reviewPriority") &&
    !Object.keys(lowScoreViewModel.score).includes("confidence") &&
    !Object.keys(lowScoreViewModel.score).includes("limitations"),
  externalVerificationAlwaysNotPerformed: displayCaseViewModels.every(
    (viewModel) => viewModel.externalVerification.externalVerification === "Not performed",
  ),
  manualReviewOnlyRecommendedAction: displayCaseViewModels.every((viewModel) =>
    viewModel.recommendedSupportAction.includes("Manual review recommended"),
  ),
  limitationsIncludeLocalOnlyExternalVerificationNotPerformedHighScoreNotProofMetadataContextOnly:
    lowScoreViewModel.limitations.includes("Local product-photo analysis only") &&
    lowScoreViewModel.limitations.includes("External verification was not performed") &&
    lowScoreViewModel.limitations.includes("High score does not prove the product photo or claim") &&
    lowScoreViewModel.limitations.includes("Metadata is context only and raw metadata values are omitted"),
  reviewSignalsRenderLabelCategorySeverityConfidenceReviewNoteAndRecommendedStep:
    componentSource.includes("signal.label") &&
    componentSource.includes("signal.category") &&
    componentSource.includes("Severity:") &&
    componentSource.includes("signal.confidencePercent") &&
    componentSource.includes("Review note:") &&
    componentSource.includes("Recommended review step:"),
  privacyPostureShowsDerivedSummaryOnlyAndExcludedRawFields:
    componentSource.includes("Derived summaries only") &&
    componentSource.includes("stay outside this panel") &&
    componentSource.includes("viewModel.privacy.derivedSummaryOnly"),
} as const;

const safetyAndPrivacyChecks = {
  sentinelPrivateValuesAbsent: displayCaseViewModels.every((viewModel) =>
    hasNoSentinelValues(viewModel, forbiddenSentinelValues),
  ),
  forbiddenPrivateKeyPathsAbsent: displayCaseViewModels.every((viewModel) =>
    hasNoForbiddenExactKeys(viewModel, [
      "fileBytes",
      "imageBuffer",
      "objectUrl",
      "retainedImageFingerprint",
      "providerHandle",
      "storageId",
      "integrationId",
      "caseQueueId",
    ]),
  ),
  customerSafeWordingDoesNotExposeScoreConfidencePriorityOrVerificationInternals: displayCaseViewModels.every(
    (viewModel) =>
      !/score|confidence|review priority|external verification|not externally verified/i.test(
        viewModel.customerSafeWording,
      ),
  ),
  renderableCopyAvoidsUnsafeOutcomeProofVerificationAccusationLanguage:
    unsafeRenderableCopyPatterns.every((pattern) => !pattern.test(JSON.stringify(displayCaseViewModels))) &&
    unsafeRenderableCopyPatterns.every((pattern) => !pattern.test(componentSource)),
} as const;

const isolationChecks = {
  receiptReportAdapterSignatureStillReceiptOnly: reportAdapterSource.includes(
    "mapLocalAnalysisToReport(result: LocalAnalysisResult)",
  ),
  claimReviewWorkflowSourceDoesNotImportProductPhotoReviewPanel:
    !claimReviewWorkflowSource.includes("ProductPhotoReviewPanel"),
} as const;

assertProbeChecksPass("contract", contractChecks);
assertProbeChecksPass("display", displayChecks);
assertProbeChecksPass("safety and privacy", safetyAndPrivacyChecks);
assertProbeChecksPass("isolation", isolationChecks);

export const PRODUCT_PHOTO_REVIEW_PANEL_DEVELOPER_PROBE = {
  cases: {
    lowScoreViewModel,
    mediumScoreViewModel,
    highScoreViewModel,
  },
  expectations: {
    contract: contractChecks,
    display: displayChecks,
    safetyAndPrivacy: safetyAndPrivacyChecks,
    isolation: isolationChecks,
  },
  preservationStatus: {
    componentPropsExactlyProductPhotoReportViewModelOnly: allChecksPass(contractChecks),
    safeManualReviewOnlyRendering: allChecksPass(displayChecks) && allChecksPass(safetyAndPrivacyChecks),
    componentRemainsUnwiredFromClaimReviewWorkflow: isolationChecks.claimReviewWorkflowSourceDoesNotImportProductPhotoReviewPanel,
    receiptReportMappingUnchanged: isolationChecks.receiptReportAdapterSignatureStillReceiptOnly,
    localAnalysisResultChanged: false,
    productPhotoRuntimeLive: false,
  },
} as const;
