import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  analyzeEvidenceFileWithPreAnalysisGate,
  buildPreAnalysisEvidenceGateHintsFromFile,
  ENABLE_PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_GUARD,
  PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_STATUS,
  type PreAnalysisGateRuntimeOptions,
  type PreAnalysisGateRuntimeResult,
} from "@/lib/analysis/pre-analysis-evidence-gate-runtime";
import type { LocalAnalysisResult } from "@/lib/analysis/types";

type HasAnyKey<T, TKey extends PropertyKey> = Extract<keyof T, TKey> extends never ? false : true;
type AssertFalse<T extends false> = T extends false ? true : never;

type ForbiddenRuntimeOptionKeys =
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
const wrapperSource = readFileSync(join(repoRoot, "src/lib/analysis/pre-analysis-evidence-gate-runtime.ts"), "utf8");
const analyzerSource = readFileSync(join(repoRoot, "src/lib/analysis/analyzer.ts"), "utf8");
const typesSource = readFileSync(join(repoRoot, "src/lib/analysis/types.ts"), "utf8");
const claimReviewWorkflowSource = readFileSync(join(repoRoot, "src/components/ClaimReviewWorkflow.tsx"), "utf8");
const uploadPanelSource = readFileSync(join(repoRoot, "src/components/UploadPanel.tsx"), "utf8");
const reportAdapterSource = readFileSync(join(repoRoot, "src/lib/analysis/report-adapter.ts"), "utf8");
const appPageSource = readFileSync(join(repoRoot, "src/app/page.tsx"), "utf8");
const appLayoutSource = readFileSync(join(repoRoot, "src/app/layout.tsx"), "utf8");

function assertProbeChecksPass(group: string, checks: Record<string, boolean>) {
  const failed = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);

  if (failed.length > 0) {
    throw new Error(`Pre-analysis gate runtime wrapper probe failed (${group}): ${failed.join(", ")}`);
  }
}

function syntheticFile(name: string, type: string) {
  return { name, type } as File;
}

function syntheticReceiptResult(label: string) {
  return {
    evidenceType: "receipt",
    evidenceLabel: label,
  } as unknown as LocalAnalysisResult;
}

function createReceiptAnalyzer(result: LocalAnalysisResult) {
  const calls: File[] = [];

  return {
    calls,
    analyzer: async (file: File) => {
      calls.push(file);
      return result;
    },
  };
}

async function runWrapper(
  file: File,
  options: PreAnalysisGateRuntimeOptions,
  resultLabel: string,
) {
  const receiptResult = syntheticReceiptResult(resultLabel);
  const receiptAnalyzer = createReceiptAnalyzer(receiptResult);
  const wrapperResult = await analyzeEvidenceFileWithPreAnalysisGate(file, {
    ...options,
    receiptAnalyzerForProbe: receiptAnalyzer.analyzer,
  });

  return {
    receiptResult,
    receiptAnalyzer,
    wrapperResult,
  };
}

function stringifyForProbe(value: unknown) {
  return JSON.stringify(value);
}

export const PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_DEVELOPER_PROBE = (async () => {
const privateFilenameSentinel = "PRIVATE_CUSTOMER_ORDER_777_damage_closeup.jpg";

const disabledProductPhoto = await runWrapper(
  syntheticFile("synthetic-product-closeup.jpg", "image/jpeg"),
  {},
  "disabled product-photo-like delegate",
);
const disabledMalformedFlag = await runWrapper(
  syntheticFile("synthetic-damage-closeup.jpg", "image/jpeg"),
  { runtimeGuardEnabled: false, enablePreAnalysisEvidenceGateRuntimeGuard: false },
  "disabled malformed flag delegate",
);
const enabledReceiptAllow = await runWrapper(
  syntheticFile("synthetic-receipt.jpg", "image/jpeg"),
  { runtimeGuardEnabled: true },
  "enabled receipt allow delegate",
);
const enabledPdfAllow = await runWrapper(
  syntheticFile("synthetic-receipt.pdf", "application/pdf"),
  { enablePreAnalysisEvidenceGateRuntimeGuard: true },
  "enabled PDF allow delegate",
);
const productPhotoBlocked = await runWrapper(
  syntheticFile("synthetic-product-closeup.jpg", "image/jpeg"),
  { runtimeGuardEnabled: true },
  "product photo should not delegate",
);
const legacyDamageBlocked = await runWrapper(
  syntheticFile(privateFilenameSentinel, "image/jpeg"),
  { runtimeGuardEnabled: true },
  "legacy damage should not delegate",
);
const unsupportedBlocked = await runWrapper(
  syntheticFile("synthetic-clip.mp4", "video/mp4"),
  { runtimeGuardEnabled: true },
  "unsupported should not delegate",
);
const unknownBlocked = await runWrapper(
  syntheticFile("synthetic-image.jpg", "image/jpeg"),
  { runtimeGuardEnabled: true },
  "unknown should not delegate",
);
const mixedReceiptDamageBlocked = await runWrapper(
  syntheticFile("synthetic-receipt-damage-closeup.jpg", "image/jpeg"),
  { runtimeGuardEnabled: true, declaredEvidenceCategoryHint: "receipt" },
  "mixed receipt damage should not delegate",
);

const mixedHints = buildPreAnalysisEvidenceGateHintsFromFile(
  syntheticFile("synthetic-receipt-damage-closeup.jpg", "image/jpeg"),
  { declaredEvidenceCategoryHint: "receipt" },
);
const productHints = buildPreAnalysisEvidenceGateHintsFromFile(
  syntheticFile("synthetic-receipt-product-label.jpg", "image/jpeg"),
  { sourceCategoryHint: "receipt" },
);

const allWrapperResults: PreAnalysisGateRuntimeResult[] = [
  disabledProductPhoto.wrapperResult,
  disabledMalformedFlag.wrapperResult,
  enabledReceiptAllow.wrapperResult,
  enabledPdfAllow.wrapperResult,
  productPhotoBlocked.wrapperResult,
  legacyDamageBlocked.wrapperResult,
  unsupportedBlocked.wrapperResult,
  unknownBlocked.wrapperResult,
  mixedReceiptDamageBlocked.wrapperResult,
];

const unsupportedResults = [
  productPhotoBlocked.wrapperResult,
  legacyDamageBlocked.wrapperResult,
  unsupportedBlocked.wrapperResult,
  unknownBlocked.wrapperResult,
  mixedReceiptDamageBlocked.wrapperResult,
].filter((result): result is Extract<PreAnalysisGateRuntimeResult, { kind: "unsupported-evidence" }> => {
  return result.kind === "unsupported-evidence";
});

function unsupportedOutputOmitsPrivateFields(result: PreAnalysisGateRuntimeResult) {
  const serialized = stringifyForProbe(result);
  const forbiddenFragments = [
    privateFilenameSentinel,
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

function unsupportedOutputOmitsScoreAndReportFields(result: PreAnalysisGateRuntimeResult) {
  const serialized = stringifyForProbe(result);

  return (
    !/"score"\s*:/.test(serialized) &&
    !/"riskLevel"\s*:/.test(serialized) &&
    !/"riskBand"\s*:/.test(serialized) &&
    !/"receipt"\s*:/.test(serialized) &&
    !/"productPhotoReport"\s*:/.test(serialized) &&
    !/"viewModel"\s*:/.test(serialized)
  );
}

const unsafeTerms = [
  ["fa", "ke"].join(""),
  ["fr", "aud confirmed"].join(""),
  ["confirmed ", "fraud"].join(""),
  ["manipulation", " confirmed"].join(""),
  ["ver", "ified"].join(""),
  ["app", "roved"].join(""),
  ["rej", "ected"].join(""),
  ["den", "ied"].join(""),
  ["customer ", "accusation"].join(""),
  ["final ", "outcome"].join(""),
  ["automatic ", "denial"].join(""),
];

function outputOmitsUnsafeWording(result: PreAnalysisGateRuntimeResult) {
  const serialized = stringifyForProbe(result).toLowerCase();
  return unsafeTerms.every((term) => !serialized.includes(term));
}

const typeChecks = {
  runtimeOptionsHaveNoForbiddenKeys: true satisfies AssertFalse<
    HasAnyKey<PreAnalysisGateRuntimeOptions, ForbiddenRuntimeOptionKeys>
  >,
};

const defaultOffChecks = {
  exportedFlagDefaultsFalse: ENABLE_PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_GUARD === false,
  statusMarkerRecordsDefaultFalse:
    PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_STATUS.defaultFlagEnabled === false &&
    PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_STATUS.wrapperUnwiredFromLiveCallers === true,
  disabledDelegatesToAnalyzer:
    disabledProductPhoto.wrapperResult.kind === "receipt-analysis" &&
    disabledProductPhoto.wrapperResult.runtimeGuardEnabled === false &&
    disabledProductPhoto.wrapperResult.gateDecision === null &&
    disabledProductPhoto.wrapperResult.result === disabledProductPhoto.receiptResult &&
    disabledProductPhoto.receiptAnalyzer.calls.length === 1,
  disabledMalformedFlagDelegates:
    disabledMalformedFlag.wrapperResult.kind === "receipt-analysis" &&
    disabledMalformedFlag.wrapperResult.runtimeGuardEnabled === false &&
    disabledMalformedFlag.wrapperResult.gateDecision === null &&
    disabledMalformedFlag.wrapperResult.result === disabledMalformedFlag.receiptResult &&
    disabledMalformedFlag.receiptAnalyzer.calls.length === 1,
};

const allowPathChecks = {
  enabledReceiptAllowsAndDelegates:
    enabledReceiptAllow.wrapperResult.kind === "receipt-analysis" &&
    enabledReceiptAllow.wrapperResult.runtimeGuardEnabled === true &&
    enabledReceiptAllow.wrapperResult.gateDecision?.outcome === "allow-receipt-default-path" &&
    enabledReceiptAllow.wrapperResult.result === enabledReceiptAllow.receiptResult &&
    enabledReceiptAllow.receiptAnalyzer.calls.length === 1,
  enabledPdfAllowsAndDelegates:
    enabledPdfAllow.wrapperResult.kind === "receipt-analysis" &&
    enabledPdfAllow.wrapperResult.runtimeGuardEnabled === true &&
    enabledPdfAllow.wrapperResult.gateDecision?.outcome === "allow-receipt-default-path" &&
    enabledPdfAllow.wrapperResult.result === enabledPdfAllow.receiptResult &&
    enabledPdfAllow.receiptAnalyzer.calls.length === 1,
};

const nonAllowChecks = {
  productPhotoLikeBlocksAnalyzer:
    productPhotoBlocked.wrapperResult.kind === "unsupported-evidence" &&
    productPhotoBlocked.wrapperResult.gateDecision.outcome === "product-photo-like-unsupported" &&
    productPhotoBlocked.receiptAnalyzer.calls.length === 0,
  legacyDamageBlocksAnalyzer:
    legacyDamageBlocked.wrapperResult.kind === "unsupported-evidence" &&
    legacyDamageBlocked.wrapperResult.gateDecision.outcome === "legacy-damage-photo-quarantine" &&
    legacyDamageBlocked.receiptAnalyzer.calls.length === 0,
  unsupportedBlocksAnalyzer:
    unsupportedBlocked.wrapperResult.kind === "unsupported-evidence" &&
    unsupportedBlocked.wrapperResult.gateDecision.outcome === "unsupported-evidence" &&
    unsupportedBlocked.receiptAnalyzer.calls.length === 0,
  unknownBlocksAnalyzer:
    unknownBlocked.wrapperResult.kind === "unsupported-evidence" &&
    unknownBlocked.wrapperResult.gateDecision.outcome === "unknown-inconclusive" &&
    unknownBlocked.receiptAnalyzer.calls.length === 0,
  mixedReceiptDamageBlocksAnalyzer:
    mixedReceiptDamageBlocked.wrapperResult.kind === "unsupported-evidence" &&
    mixedReceiptDamageBlocked.wrapperResult.gateDecision.outcome === "legacy-damage-photo-quarantine" &&
    mixedReceiptDamageBlocked.receiptAnalyzer.calls.length === 0,
  mixedHintsPreferLegacyQuarantine:
    mixedHints.declaredEvidenceCategoryHint === "damage-photo" && mixedHints.productPhotoLikeHint === true,
  productHintsPreferProductPhotoUnsupported:
    productHints.declaredEvidenceCategoryHint === "product-photo" && productHints.productPhotoLikeHint === true,
};

const unsupportedShapeChecks = {
  everyUnsupportedResultManualReviewOnly: unsupportedResults.every(
    (wrapperResult) => wrapperResult.result.manualReviewOnly === true,
  ),
  everyUnsupportedResultNonLive: unsupportedResults.every(
    (wrapperResult) =>
      wrapperResult.result.runtimeLive === false && wrapperResult.result.productPhotoRuntimeLive === false,
  ),
  everyUnsupportedResultNoAnalyzerOrAdapter: unsupportedResults.every(
    (wrapperResult) =>
      wrapperResult.result.analyzerInvoked === false &&
      wrapperResult.result.adapterInvoked === false &&
      wrapperResult.result.liveReceiptAnalyzerInvoked === false,
  ),
  everyUnsupportedResultNoOcrOrMetadata: unsupportedResults.every(
    (wrapperResult) => wrapperResult.result.ocrInvoked === false && wrapperResult.result.metadataInvoked === false,
  ),
  everyUnsupportedResultNoUiReportParserFixtureOrProviderPath: unsupportedResults.every(
    (wrapperResult) =>
      wrapperResult.result.uiUploadReportScoringParserFixturePathsInvoked === false &&
      wrapperResult.result.providersStorageIntegrationsCaseQueuesInvoked === false &&
      wrapperResult.result.productPhotoReviewPanelRouted === false,
  ),
  everyUnsupportedResultOmitsScoreRiskAndReportFields: unsupportedResults.every(unsupportedOutputOmitsScoreAndReportFields),
  everyUnsupportedResultOmitsPrivateFields: unsupportedResults.every(unsupportedOutputOmitsPrivateFields),
  everyUnsupportedResultOmitsUnsafeWording: allWrapperResults.every(outputOmitsUnsafeWording),
};

const sourceBoundaryChecks = {
  wrapperImportsGateDecisionBuilder: wrapperSource.includes("buildPreAnalysisEvidenceGateDecision"),
  wrapperImportsAnalyzerOnlyForDelegation: wrapperSource.includes('import("@/lib/analysis/analyzer")'),
  wrapperUsesTypeOnlyLocalAnalysisResult: wrapperSource.includes('import type { LocalAnalysisResult } from "@/lib/analysis/types";'),
  wrapperDoesNotImportOcrMetadataParserScoringReportAdapter:
    !wrapperSource.includes("@/lib/analysis/ocr-service") &&
    !wrapperSource.includes("@/lib/analysis/metadata-service") &&
    !wrapperSource.includes("@/lib/analysis/receipt-parser") &&
    !wrapperSource.includes("@/lib/analysis/scoring") &&
    !wrapperSource.includes("@/lib/analysis/report-adapter"),
  wrapperDoesNotImportProductPhotoAnalyzerOrUi:
    !wrapperSource.includes("@/lib/analysis/product-photo-analyzer") &&
    !wrapperSource.includes("@/lib/analysis/product-photo-routing-adapter") &&
    !wrapperSource.includes("@/lib/analysis/product-photo-report-view-model") &&
    !wrapperSource.includes("@/components/ProductPhotoReviewPanel") &&
    !wrapperSource.includes("@/components/ClaimReviewWorkflow") &&
    !wrapperSource.includes("@/components/UploadPanel"),
  wrapperDoesNotReadBytesOrMetadata:
    !/arrayBuffer\s*\(|stream\s*\(|slice\s*\(|createObjectURL|objectUrl|imageUrl|dataUrl|rawExif|rawMetadata|lastModified/.test(
      wrapperSource,
    ),
  liveWorkflowDoesNotImportWrapper: !claimReviewWorkflowSource.includes("pre-analysis-evidence-gate-runtime"),
  uploadPanelDoesNotImportWrapper: !uploadPanelSource.includes("pre-analysis-evidence-gate-runtime"),
  reportAdapterDoesNotImportWrapper: !reportAdapterSource.includes("pre-analysis-evidence-gate-runtime"),
  productionAppRoutesDoNotImportWrapper:
    !appPageSource.includes("pre-analysis-evidence-gate-runtime") &&
    !appLayoutSource.includes("pre-analysis-evidence-gate-runtime"),
  analyzerFunctionSignatureUnchanged: analyzerSource.includes(
    "analyzeEvidenceFile(file: File): Promise<LocalAnalysisResult>",
  ),
  localAnalysisResultStillReceiptShaped:
    typesSource.includes("export type LocalAnalysisResult = {") &&
    typesSource.includes("receipt: ExtractedReceiptInfo;") &&
    !typesSource.includes("UnsupportedEvidenceResult") &&
    !typesSource.includes("PreAnalysisGateRuntimeResult"),
};

assertProbeChecksPass("types", typeChecks);
assertProbeChecksPass("default-off", defaultOffChecks);
assertProbeChecksPass("allow path", allowPathChecks);
assertProbeChecksPass("non-allow path", nonAllowChecks);
assertProbeChecksPass("unsupported shape", unsupportedShapeChecks);
assertProbeChecksPass("source boundaries", sourceBoundaryChecks);

return {
  status: PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_STATUS,
  cases: {
    disabledProductPhoto,
    disabledMalformedFlag,
    enabledReceiptAllow,
    enabledPdfAllow,
    productPhotoBlocked,
    legacyDamageBlocked,
    unsupportedBlocked,
    unknownBlocked,
    mixedReceiptDamageBlocked,
  },
  expectations: {
    types: typeChecks,
    defaultOff: defaultOffChecks,
    allowPath: allowPathChecks,
    nonAllowPath: nonAllowChecks,
    unsupportedShape: unsupportedShapeChecks,
    sourceBoundaries: sourceBoundaryChecks,
  },
} as const;
})();
