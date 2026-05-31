import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  MOCK_PROVIDER_MODE,
  runMockOcrProvider,
  runMockVisionProvider,
  validateMockProviderAdapterInput,
  type MockProviderAdapterResult,
} from "@/lib/analysis/providers/mock-provider-adapter";

const repoRoot = process.cwd();
const adapterSource = readFileSync(join(repoRoot, "src/lib/analysis/providers/mock-provider-adapter.ts"), "utf8");
const probeSource = readFileSync(join(repoRoot, "src/lib/analysis/providers/mock-provider-adapter.probe.ts"), "utf8");
const packageJson = readFileSync(join(repoRoot, "package.json"), "utf8");

function assertProbeChecksPass(group: string, checks: Record<string, boolean>) {
  const failed = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);

  if (failed.length > 0) {
    throw new Error(`Mock provider adapter probe failed (${group}): ${failed.join(", ")}`);
  }
}

function successInput(overrides: Record<string, unknown> = {}) {
  return {
    providerMode: MOCK_PROVIDER_MODE,
    evidenceTypeHint: "receipt",
    behavior: "success",
    fixtureKey: "clean-receipt-ocr",
    ...overrides,
  };
}

function failureInput(behavior: string) {
  return successInput({ behavior });
}

function allPrivacyFlagsSafe(result: MockProviderAdapterResult) {
  const privacy = result.result.privacy;

  return (
    privacy.syntheticOnly === true &&
    privacy.realEvidenceUsed === false &&
    privacy.customerDataUsed === false &&
    privacy.fileRetained === false &&
    privacy.rawOcrRetained === false &&
    privacy.providerPayloadRetained === false &&
    privacy.providerPayloadLogged === false &&
    privacy.externalNetworkCalled === false &&
    privacy.storageUsed === false &&
    privacy.envUsed === false &&
    privacy.redactionStatus === "synthetic-not-applicable"
  );
}

function serializedHasUnsafeTerms(value: unknown) {
  const serialized = JSON.stringify(value).toLowerCase();
  const unsafeTerms = [
    ["fr", "aud"].join(""),
    ["fa", "ke"].join(""),
    ["for", "ged"].join(""),
    ["den", "y"].join(""),
    ["ref", "und"].join(""),
    ["final", "decision"].join(" "),
    ["final", "claim"].join(" "),
    ["external verification", "complete"].join(" "),
    ["external verification", "confirmed"].join(" "),
    ["proof", "of", "alteration"].join(" "),
  ];

  return unsafeTerms.some((term) => serialized.includes(term));
}

function hasForbiddenImport(fragment: string) {
  return new RegExp(`from\\s+["'][^"']*${fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(
    adapterSource,
  );
}

function runMockProviderAdapterProbe() {
  const mockOcrSuccess = runMockOcrProvider(successInput());
  const mockVisionSuccess = runMockVisionProvider(successInput({ evidenceTypeHint: "product-photo" }));
  const timeoutFailure = runMockOcrProvider(failureInput("timeout"));
  const unavailableFailure = runMockOcrProvider(failureInput("unavailable"));
  const malformedFailure = runMockOcrProvider(failureInput("malformed-response"));
  const unsupportedFailure = runMockOcrProvider(failureInput("unsupported-evidence"));
  const emptyFailure = runMockOcrProvider(failureInput("empty-output"));
  const rateCostFailure = runMockVisionProvider(failureInput("rate-cost-limit"));
  const redactionFailure = runMockVisionProvider(failureInput("redaction-failure"));
  const safetyRefusal = runMockVisionProvider(failureInput("safety-refusal"));
  const normalizationFailure = runMockVisionProvider(failureInput("internal-normalization-error"));

  const customerIdentifierRejected = runMockOcrProvider(successInput({ customerId: "synthetic-private-marker" }));
  const urlRejected = runMockOcrProvider(successInput({ url: "https://example.invalid/synthetic" }));
  const objectUrlRejected = runMockOcrProvider(successInput({ objecturl: "blob:http://local/synthetic" }));
  const dataUrlRejected = runMockOcrProvider(successInput({ dataurl: "data:image/png;base64,AAAA" }));
  const imageUrlRejected = runMockOcrProvider(successInput({ imageurl: "https://example.invalid/synthetic.png" }));
  const fileUrlRejected = runMockOcrProvider(successInput({ fileurl: "file:///tmp/synthetic.png" }));
  const storageHandleRejected = runMockOcrProvider(successInput({ storagehandle: "synthetic-storage-key" }));
  const uploadLikeRejected = runMockOcrProvider(successInput({ file: { name: "synthetic-upload" } }));
  const base64Rejected = runMockOcrProvider({
    ...successInput(),
    base64image: "QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWg==",
  });
  const providerPayloadRejected = runMockOcrProvider(successInput({ providerpayload: { raw: "synthetic" } }));
  const nonSyntheticModeRejected = validateMockProviderAdapterInput({
    providerMode: "live",
    evidenceTypeHint: "receipt",
    behavior: "success",
  });

  const moduleChecks = {
    moduleImportsSuccessfully: typeof runMockOcrProvider === "function" && typeof runMockVisionProvider === "function",
    providerModeConstantIsMockOnly: MOCK_PROVIDER_MODE === "mock-synthetic",
  };

  const successChecks = {
    mockOcrSuccessStructured:
      mockOcrSuccess.ok &&
      mockOcrSuccess.provider.type === "mock-ocr" &&
      mockOcrSuccess.provider.mode === MOCK_PROVIDER_MODE &&
      mockOcrSuccess.result.resultKind === "mock-ocr-success" &&
      mockOcrSuccess.result.status === "completed" &&
      mockOcrSuccess.result.extractedTextBlockCandidates.length > 0 &&
      Object.keys(mockOcrSuccess.result.structuredFieldCandidates).length > 0 &&
      mockOcrSuccess.result.simulatedConfidence.score >= 0 &&
      mockOcrSuccess.result.simulatedConfidence.score <= 100 &&
      mockOcrSuccess.result.contractCompatibility.canFeedOcrExtractionContract,
    mockVisionSuccessStructured:
      mockVisionSuccess.ok &&
      mockVisionSuccess.provider.type === "mock-vision" &&
      mockVisionSuccess.provider.mode === MOCK_PROVIDER_MODE &&
      mockVisionSuccess.result.resultKind === "mock-vision-success" &&
      mockVisionSuccess.result.status === "completed" &&
      mockVisionSuccess.result.visualContextSummary.length > 0 &&
      mockVisionSuccess.result.screenshotLayoutObservations.length > 0 &&
      mockVisionSuccess.result.productPhotoObservations.length > 0 &&
      mockVisionSuccess.result.imageConsistencyUncertainty.value >= 1 &&
      mockVisionSuccess.result.imageConsistencyUncertainty.value <= 100 &&
      mockVisionSuccess.result.imageConsistencyUncertainty.reviewSignalOnly === true &&
      mockVisionSuccess.result.imageConsistencyUncertainty.uncertaintyOnly === true,
  };

  const failureChecks = {
    timeoutOperationalOnly:
      !timeoutFailure.ok &&
      timeoutFailure.result.status === "timed-out" &&
      timeoutFailure.result.failure.operationalOnly &&
      !timeoutFailure.result.failure.customerRiskSignal,
    unavailableOperationalOnly:
      !unavailableFailure.ok &&
      unavailableFailure.result.failure.code === "unavailable" &&
      unavailableFailure.result.failure.operationalOnly &&
      !unavailableFailure.result.failure.customerRiskSignal,
    malformedOperationalOnly:
      !malformedFailure.ok &&
      malformedFailure.result.failure.code === "malformed-response" &&
      malformedFailure.result.failure.operationalOnly,
    unsupportedEvidenceLimitationOnly:
      !unsupportedFailure.ok &&
      unsupportedFailure.result.status === "unsupported" &&
      unsupportedFailure.result.failure.evidenceLimitationOnly,
    emptyOutputSafeLimitation:
      !emptyFailure.ok && emptyFailure.result.status === "empty" && emptyFailure.result.failure.evidenceLimitationOnly,
    rateCostOperationalOnly:
      !rateCostFailure.ok && rateCostFailure.result.failure.code === "rate-cost-limit" && rateCostFailure.result.failure.operationalOnly,
    redactionOperationalOnly:
      !redactionFailure.ok &&
      redactionFailure.result.failure.code === "redaction-failure" &&
      redactionFailure.result.failure.operationalOnly,
    safetyRefusalOperationalOnly:
      !safetyRefusal.ok && safetyRefusal.result.failure.code === "safety-refusal" && safetyRefusal.result.failure.operationalOnly,
    normalizationOperationalOnly:
      !normalizationFailure.ok &&
      normalizationFailure.result.failure.code === "internal-normalization-error" &&
      normalizationFailure.result.failure.operationalOnly,
  };

  const privacyChecks = {
    ocrPrivacyFlagsSafe: allPrivacyFlagsSafe(mockOcrSuccess),
    visionPrivacyFlagsSafe: allPrivacyFlagsSafe(mockVisionSuccess),
    failurePrivacyFlagsSafe: [
      timeoutFailure,
      unavailableFailure,
      malformedFailure,
      unsupportedFailure,
      emptyFailure,
      rateCostFailure,
      redactionFailure,
      safetyRefusal,
      normalizationFailure,
    ].every(allPrivacyFlagsSafe),
    noExternalNetworkMarker:
      mockOcrSuccess.provider.externalNetworkCalled === false &&
      mockVisionSuccess.provider.externalNetworkCalled === false &&
      mockOcrSuccess.result.privacy.externalNetworkCalled === false &&
      mockVisionSuccess.result.privacy.externalNetworkCalled === false,
    noEnvUsageMarker:
      mockOcrSuccess.provider.envUsed === false &&
      mockVisionSuccess.provider.envUsed === false &&
      mockOcrSuccess.result.privacy.envUsed === false &&
      mockVisionSuccess.result.privacy.envUsed === false,
    noStorageMarker: mockOcrSuccess.result.privacy.storageUsed === false && mockVisionSuccess.result.privacy.storageUsed === false,
  };

  const inputRejectionChecks = {
    customerIdentifierInputsRejected: !customerIdentifierRejected.ok && customerIdentifierRejected.result.failure.code === "input-rejected",
    urlInputsRejected: !urlRejected.ok && urlRejected.result.failure.code === "input-rejected",
    objectUrlInputsRejected: !objectUrlRejected.ok && objectUrlRejected.result.failure.code === "input-rejected",
    dataUrlInputsRejected: !dataUrlRejected.ok && dataUrlRejected.result.failure.code === "input-rejected",
    imageUrlInputsRejected: !imageUrlRejected.ok && imageUrlRejected.result.failure.code === "input-rejected",
    fileUrlInputsRejected: !fileUrlRejected.ok && fileUrlRejected.result.failure.code === "input-rejected",
    storageHandleInputsRejected: !storageHandleRejected.ok && storageHandleRejected.result.failure.code === "input-rejected",
    uploadLikeInputsRejected: !uploadLikeRejected.ok && uploadLikeRejected.result.failure.code === "input-rejected",
    base64LikeInputsRejected: !base64Rejected.ok && base64Rejected.result.failure.code === "input-rejected",
    providerPayloadInputsRejected: !providerPayloadRejected.ok && providerPayloadRejected.result.failure.code === "input-rejected",
    nonSyntheticModeRejected: !nonSyntheticModeRejected.ok,
  };

  const serializedResults = [
    mockOcrSuccess,
    mockVisionSuccess,
    timeoutFailure,
    unavailableFailure,
    malformedFailure,
    unsupportedFailure,
    emptyFailure,
    rateCostFailure,
    redactionFailure,
    safetyRefusal,
    normalizationFailure,
  ];

  const responseSafetyChecks = {
    unsafeWordingAbsent: serializedResults.every((result) => !serializedHasUnsafeTerms(result)),
    noSingleUnsafeScoreField: serializedResults.every(
      (result) => !JSON.stringify(result).toLowerCase().includes(["fr", "aud"].join("") + "score"),
    ),
    noDecisionField: serializedResults.every((result) => !JSON.stringify(result).includes("finalDecision")),
    noLocalAnalysisResultShape: serializedResults.every((result) => {
      const serialized = JSON.stringify(result);

      return (
        !serialized.includes(["Local", "Analysis", "Result"].join("")) &&
        !serialized.includes("\"metadata\"") &&
        !serialized.includes("\"imageHeuristics\"") &&
        !serialized.includes("\"scoreBreakdown\"")
      );
    }),
  };

  const forbiddenImports = [
    "@/lib/analysis/analyzer",
    "@/lib/analysis/types",
    "@/lib/analysis/report-adapter",
    "@/lib/analysis/receipt-parser",
    "@/lib/analysis/scoring",
    "@/components/ClaimReviewWorkflow",
    "@/components/ProductPhotoReviewPanel",
    "@/components/UploadPanel",
    "openai",
    "@aws-sdk",
    "@google-cloud",
    "tesseract.js",
    "pdfjs-dist",
  ];

  const isolationChecks = {
    adapterImportsOnlyAllowedModules:
      adapterSource.includes("@/lib/analysis/ocr-fixture-harness") &&
      adapterSource.includes("@/lib/analysis/ocr-extraction-contract") &&
      forbiddenImports.every((fragment) => !hasForbiddenImport(fragment)),
    adapterDoesNotTouchLiveAnalyzer: !adapterSource.includes("analyzeEvidenceFile"),
    adapterDoesNotTouchLocalAnalysisResult: !adapterSource.includes(["Local", "Analysis", "Result"].join("")),
    adapterDoesNotTouchReportAdapter: !adapterSource.includes("report-adapter"),
    adapterDoesNotTouchUiComponents:
      !adapterSource.includes("ClaimReviewWorkflow") && !adapterSource.includes("ProductPhotoReviewPanel"),
    adapterDoesNotReadEnvVars: !/process\.env/.test(adapterSource),
    adapterDoesNotCallNetwork: !/\bfetch\s*\(/.test(adapterSource),
    adapterDoesNotLogRawText: !/console\.(?:log|warn|error|info)/.test(adapterSource),
    adapterDoesNotCreateObjectUrls: !/createObjectURL|revokeObjectURL/.test(adapterSource),
    adapterDoesNotUseBrowserUploadTypes: !/\bFile\b|\bBlob\b/.test(adapterSource),
    probeImportsAdapterOnly: probeSource.includes("@/lib/analysis/providers/mock-provider-adapter"),
  };

  const packageChecks = {
    noOpenAiDependency: !/"openai"\s*:/.test(packageJson),
    noAwsTextractDependency: !/"@aws-sdk\/client-textract"\s*:/.test(packageJson),
    noGoogleVisionDependency: !/"@google-cloud\/vision"\s*:/.test(packageJson),
  };

  assertProbeChecksPass("module", moduleChecks);
  assertProbeChecksPass("success", successChecks);
  assertProbeChecksPass("failures", failureChecks);
  assertProbeChecksPass("privacy", privacyChecks);
  assertProbeChecksPass("input rejection", inputRejectionChecks);
  assertProbeChecksPass("response safety", responseSafetyChecks);
  assertProbeChecksPass("isolation", isolationChecks);
  assertProbeChecksPass("package", packageChecks);

  return {
    moduleChecks,
    successChecks,
    failureChecks,
    privacyChecks,
    inputRejectionChecks,
    responseSafetyChecks,
    isolationChecks,
    packageChecks,
    providerMode: MOCK_PROVIDER_MODE,
  } as const;
}

export const MOCK_PROVIDER_ADAPTER_DEVELOPER_PROBE = runMockProviderAdapterProbe();
