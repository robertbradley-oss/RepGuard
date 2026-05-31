import {
  normalizeSyntheticOcrFixtureToExtractionContract,
  type NormalizedOcrReceiptExtractionResult,
} from "@/lib/analysis/ocr-extraction-contract";
import { SYNTHETIC_OCR_FIXTURE_CASES, type SyntheticOcrFixtureCase } from "@/lib/analysis/ocr-fixture-harness";

export const MOCK_PROVIDER_MODE = "mock-synthetic" as const;
export const MOCK_PROVIDER_PHASE = "4.12" as const;

export type MockProviderType = "mock-ocr" | "mock-vision";

export type MockProviderBehavior =
  | "success"
  | "timeout"
  | "unavailable"
  | "malformed-response"
  | "unsupported-evidence"
  | "empty-output"
  | "rate-cost-limit"
  | "redaction-failure"
  | "safety-refusal"
  | "internal-normalization-error";

export type MockEvidenceTypeHint = "receipt" | "order-screenshot" | "product-photo" | "unknown";

export type MockProviderAdapterInput = {
  providerMode: typeof MOCK_PROVIDER_MODE;
  evidenceTypeHint: MockEvidenceTypeHint;
  behavior?: MockProviderBehavior;
  fixtureKey?: string;
};

export type MockProviderDescriptor = {
  name: "ClaimGuard synthetic mock provider";
  type: MockProviderType;
  mode: typeof MOCK_PROVIDER_MODE;
  phase: typeof MOCK_PROVIDER_PHASE;
  providerFree: true;
  sdkFree: true;
  externalNetworkCalled: false;
  envUsed: false;
};

export type MockProviderPrivacyFlags = {
  syntheticOnly: true;
  realEvidenceUsed: false;
  customerDataUsed: false;
  fileRetained: false;
  rawOcrRetained: false;
  providerPayloadRetained: false;
  providerPayloadLogged: false;
  externalNetworkCalled: false;
  storageUsed: false;
  envUsed: false;
  redactionStatus: "synthetic-not-applicable";
};

export type MockProviderUsageMetadata = {
  syntheticPageCount: number;
  syntheticImageCount: number;
  estimatedRequestUnits: number;
  estimatedCostCents: number;
  budgetStatus: "synthetic-within-budget" | "synthetic-blocked-by-budget";
  timeoutMs: number;
  elapsedMs: number;
  retryCount: 0;
};

export type MockProviderLimitation = {
  code:
    | "synthetic-only"
    | "not-externally-verified"
    | "provider-timeout"
    | "provider-unavailable"
    | "malformed-response"
    | "unsupported-evidence"
    | "empty-output"
    | "rate-cost-limit"
    | "redaction-failure"
    | "safety-refusal"
    | "internal-normalization-error";
  message: string;
  operationalOnly: boolean;
  evidenceLimitationOnly: boolean;
};

export type MockProviderManualReviewDriver = {
  code:
    | "mock-provider-success"
    | "mock-vision-uncertainty"
    | "mock-provider-operational-limit"
    | "mock-evidence-limitation";
  message: string;
  reviewSignalOnly: true;
  customerSafe: true;
};

export type MockProviderFailure = {
  code: Exclude<MockProviderBehavior, "success"> | "input-rejected";
  status: "failed" | "timed-out" | "unsupported" | "empty";
  message: string;
  operationalOnly: boolean;
  evidenceLimitationOnly: boolean;
  customerRiskSignal: false;
  retryAllowed: false;
};

export type MockOcrProviderSuccess = {
  resultKind: "mock-ocr-success";
  status: "completed";
  evidenceTypeHint: MockEvidenceTypeHint;
  extractedTextBlockCandidates: NormalizedOcrReceiptExtractionResult["extractedTextBlocks"];
  structuredFieldCandidates: NormalizedOcrReceiptExtractionResult["structuredFields"];
  simulatedConfidence: NormalizedOcrReceiptExtractionResult["extractionConfidence"];
  pageImageMetadata: {
    syntheticPageCount: number;
    syntheticImageCount: number;
    attemptedCount: number;
    completedCount: number;
  };
  costUsage: MockProviderUsageMetadata;
  limitations: readonly MockProviderLimitation[];
  manualReviewDrivers: readonly MockProviderManualReviewDriver[];
  privacy: MockProviderPrivacyFlags;
  contractCompatibility: {
    canFeedOcrExtractionContract: true;
    contractName: NormalizedOcrReceiptExtractionResult["contractName"];
    normalizedStatus: NormalizedOcrReceiptExtractionResult["status"];
    normalizedStructuredFieldKeys: readonly string[];
  };
};

export type MockVisionProviderSuccess = {
  resultKind: "mock-vision-success";
  status: "completed";
  evidenceTypeHint: MockEvidenceTypeHint;
  visualContextSummary: string;
  screenshotLayoutObservations: readonly string[];
  productPhotoObservations: readonly string[];
  imageConsistencyUncertainty: {
    signalName: "synthetic altered-or-ai-generated uncertainty placeholder";
    value: number;
    scale: "1-100";
    reviewSignalOnly: true;
    uncertaintyOnly: true;
  };
  limitations: readonly MockProviderLimitation[];
  manualReviewDrivers: readonly MockProviderManualReviewDriver[];
  privacy: MockProviderPrivacyFlags;
  costUsage: MockProviderUsageMetadata;
};

export type MockProviderFailureResult = {
  resultKind: "mock-provider-failure";
  status: MockProviderFailure["status"];
  evidenceTypeHint: MockEvidenceTypeHint;
  failure: MockProviderFailure;
  limitations: readonly MockProviderLimitation[];
  manualReviewDrivers: readonly MockProviderManualReviewDriver[];
  privacy: MockProviderPrivacyFlags;
  costUsage: MockProviderUsageMetadata;
};

export type MockProviderAdapterResult =
  | {
      ok: true;
      provider: MockProviderDescriptor;
      result: MockOcrProviderSuccess | MockVisionProviderSuccess;
    }
  | {
      ok: false;
      provider: MockProviderDescriptor;
      result: MockProviderFailureResult;
    };

type MockProviderInputValidation =
  | { ok: true; input: Required<Pick<MockProviderAdapterInput, "providerMode" | "evidenceTypeHint" | "behavior">> & Pick<MockProviderAdapterInput, "fixtureKey"> }
  | { ok: false; reason: string };

const allowedInputKeys = new Set(["providerMode", "evidenceTypeHint", "behavior", "fixtureKey"]);
const allowedEvidenceTypeHints = new Set<MockEvidenceTypeHint>(["receipt", "order-screenshot", "product-photo", "unknown"]);
const allowedBehaviors = new Set<MockProviderBehavior>([
  "success",
  "timeout",
  "unavailable",
  "malformed-response",
  "unsupported-evidence",
  "empty-output",
  "rate-cost-limit",
  "redaction-failure",
  "safety-refusal",
  "internal-normalization-error",
]);
const fixtureByKey = new Map<string, SyntheticOcrFixtureCase>(
  SYNTHETIC_OCR_FIXTURE_CASES.map((fixture) => [fixture.key, fixture]),
);
const defaultFixtureKey = "clean-receipt-ocr";

const unsupportedKeyNames = new Set([
  "file",
  "files",
  "blob",
  "bytes",
  "filebytes",
  "imagebuffer",
  "buffer",
  "binary",
  "multipart",
  "formdata",
  "base64",
  "base64image",
  "image",
  "objecturl",
  "imageurl",
  "dataurl",
  "fileurl",
  "url",
  "href",
  "storagehandle",
  "providerpayload",
  "providerresponse",
  "providerrequestid",
  "rawocr",
  "rawocrtext",
  "customer",
  "customerid",
  "customername",
  "name",
  "address",
  "email",
  "phone",
  "ticket",
  "ticketid",
  "order",
  "ordernumber",
  "orderid",
  "trackingnumber",
  "trackingid",
  "caseid",
  "claimid",
  "evidenceid",
]);

const urlLikeValuePattern = /(?:https?:\/\/|blob:|data:|file:|s3:\/\/|gs:\/\/)/i;
const base64LikeValuePattern = /^[A-Za-z0-9+/]{80,}={0,2}$/;
const privateIdentifierValuePatterns = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
  /\b\d{1,6}\s+(?:[A-Za-z0-9.'-]+\s+){0,6}(?:street|st\.?|avenue|ave\.?|road|rd\.?|drive|dr\.?|lane|ln\.?|way|boulevard|blvd\.?)\b/i,
  /\b(?:order|tracking|ticket|case|claim|evidence)[-_ #:]?[A-Z0-9-]{4,}\b/i,
];

function providerDescriptor(type: MockProviderType): MockProviderDescriptor {
  return {
    name: "ClaimGuard synthetic mock provider",
    type,
    mode: MOCK_PROVIDER_MODE,
    phase: MOCK_PROVIDER_PHASE,
    providerFree: true,
    sdkFree: true,
    externalNetworkCalled: false,
    envUsed: false,
  };
}

function privacyFlags(): MockProviderPrivacyFlags {
  return {
    syntheticOnly: true,
    realEvidenceUsed: false,
    customerDataUsed: false,
    fileRetained: false,
    rawOcrRetained: false,
    providerPayloadRetained: false,
    providerPayloadLogged: false,
    externalNetworkCalled: false,
    storageUsed: false,
    envUsed: false,
    redactionStatus: "synthetic-not-applicable",
  };
}

function usageMetadata(behavior: MockProviderBehavior): MockProviderUsageMetadata {
  const timedOut = behavior === "timeout";
  const blockedByBudget = behavior === "rate-cost-limit";

  return {
    syntheticPageCount: behavior === "success" ? 1 : 0,
    syntheticImageCount: behavior === "success" ? 1 : 0,
    estimatedRequestUnits: blockedByBudget ? 0 : 1,
    estimatedCostCents: blockedByBudget ? 0 : 1,
    budgetStatus: blockedByBudget ? "synthetic-blocked-by-budget" : "synthetic-within-budget",
    timeoutMs: 10000,
    elapsedMs: timedOut ? 10000 : 12,
    retryCount: 0,
  };
}

function limitation(
  code: MockProviderLimitation["code"],
  message: string,
  operationalOnly: boolean,
  evidenceLimitationOnly: boolean,
): MockProviderLimitation {
  return {
    code,
    message,
    operationalOnly,
    evidenceLimitationOnly,
  };
}

function safeBaselineLimitations(): readonly MockProviderLimitation[] {
  return [
    limitation("synthetic-only", "Synthetic mock provider output only.", false, true),
    limitation("not-externally-verified", "No external verification was performed.", false, true),
  ];
}

function hasUnsupportedShape(value: unknown, keyPath: string[] = []): boolean {
  if (Array.isArray(value)) {
    return true;
  }

  if (value && typeof value === "object") {
    return Object.entries(value).some(([key, nestedValue]) => {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");

      return unsupportedKeyNames.has(normalizedKey) || hasUnsupportedShape(nestedValue, [...keyPath, key]);
    });
  }

  if (typeof value !== "string") {
    return false;
  }

  if (urlLikeValuePattern.test(value) || base64LikeValuePattern.test(value.trim())) {
    return true;
  }

  if (keyPath.at(-1) === "fixtureKey") {
    return false;
  }

  return privateIdentifierValuePatterns.some((pattern) => pattern.test(value));
}

export function validateMockProviderAdapterInput(input: unknown): MockProviderInputValidation {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, reason: "Mock provider input must be a small synthetic object." };
  }

  const requestKeys = Object.keys(input);

  if (requestKeys.some((key) => !allowedInputKeys.has(key))) {
    return { ok: false, reason: "Mock provider input accepts only synthetic adapter keys." };
  }

  if (hasUnsupportedShape(input)) {
    return { ok: false, reason: "Mock provider input rejected a non-synthetic payload boundary." };
  }

  const providerMode = (input as MockProviderAdapterInput).providerMode;

  if (providerMode !== MOCK_PROVIDER_MODE) {
    return { ok: false, reason: "Mock provider mode must remain mock-synthetic." };
  }

  const evidenceTypeHint = (input as MockProviderAdapterInput).evidenceTypeHint;

  if (!allowedEvidenceTypeHints.has(evidenceTypeHint as MockEvidenceTypeHint)) {
    return { ok: false, reason: "Mock provider evidence type hint is not supported." };
  }

  const behavior = (input as MockProviderAdapterInput).behavior ?? "success";

  if (!allowedBehaviors.has(behavior)) {
    return { ok: false, reason: "Mock provider behavior is not supported." };
  }

  const fixtureKey = (input as MockProviderAdapterInput).fixtureKey;

  if (fixtureKey !== undefined && !fixtureByKey.has(fixtureKey)) {
    return { ok: false, reason: "Mock provider fixture key is not allowlisted." };
  }

  return {
    ok: true,
    input: {
      providerMode,
      evidenceTypeHint: evidenceTypeHint as MockEvidenceTypeHint,
      behavior,
      ...(fixtureKey ? { fixtureKey } : {}),
    },
  };
}

function failureFor(
  providerType: MockProviderType,
  input: MockProviderAdapterInput | undefined,
  code: MockProviderFailure["code"],
  message: string,
): MockProviderAdapterResult {
  const evidenceTypeHint = input?.evidenceTypeHint ?? "unknown";
  const status: MockProviderFailure["status"] =
    code === "timeout" ? "timed-out" : code === "unsupported-evidence" ? "unsupported" : code === "empty-output" ? "empty" : "failed";
  const evidenceLimitationOnly = code === "unsupported-evidence" || code === "empty-output";
  const operationalOnly = !evidenceLimitationOnly;
  const failure: MockProviderFailure = {
    code,
    status,
    message,
    operationalOnly,
    evidenceLimitationOnly,
    customerRiskSignal: false,
    retryAllowed: false,
  };

  return {
    ok: false,
    provider: providerDescriptor(providerType),
    result: {
      resultKind: "mock-provider-failure",
      status,
      evidenceTypeHint,
      failure,
      limitations: [
        ...safeBaselineLimitations(),
        limitation(failureCodeToLimitationCode(code), message, operationalOnly, evidenceLimitationOnly),
      ],
      manualReviewDrivers: [
        {
          code: evidenceLimitationOnly ? "mock-evidence-limitation" : "mock-provider-operational-limit",
          message: evidenceLimitationOnly
            ? "Synthetic evidence coverage is limited; manual review is recommended."
            : "Synthetic provider operation was unavailable; manual review is recommended.",
          reviewSignalOnly: true,
          customerSafe: true,
        },
      ],
      privacy: privacyFlags(),
      costUsage: usageMetadata(code === "input-rejected" ? "unsupported-evidence" : code),
    },
  };
}

function failureCodeToLimitationCode(code: MockProviderFailure["code"]): MockProviderLimitation["code"] {
  if (code === "input-rejected") {
    return "unsupported-evidence";
  }

  if (code === "unavailable") {
    return "provider-unavailable";
  }

  return code === "timeout" ? "provider-timeout" : code;
}

function failureMessageFor(behavior: Exclude<MockProviderBehavior, "success">): string {
  switch (behavior) {
    case "timeout":
      return "Synthetic provider timeout; this is an operational limitation.";
    case "unavailable":
      return "Synthetic provider unavailable; this is an operational limitation.";
    case "malformed-response":
      return "Synthetic provider response could not be normalized.";
    case "unsupported-evidence":
      return "Synthetic evidence is unsupported for this mock provider path.";
    case "empty-output":
      return "Synthetic provider returned no usable output.";
    case "rate-cost-limit":
      return "Synthetic provider budget limit blocked processing.";
    case "redaction-failure":
      return "Synthetic redaction readiness failed before provider processing.";
    case "safety-refusal":
      return "Synthetic provider safety refusal blocked analysis output.";
    case "internal-normalization-error":
      return "Synthetic normalization failed before app-facing output.";
  }
}

function fixtureFor(input: MockProviderAdapterInput): SyntheticOcrFixtureCase {
  const fixtureKey = input.fixtureKey ?? defaultFixtureKey;
  return fixtureByKey.get(fixtureKey) ?? fixtureByKey.get(defaultFixtureKey)!;
}

export function runMockOcrProvider(input: unknown): MockProviderAdapterResult {
  const validation = validateMockProviderAdapterInput(input);

  if (!validation.ok) {
    return failureFor("mock-ocr", undefined, "input-rejected", validation.reason);
  }

  if (validation.input.behavior !== "success") {
    return failureFor(
      "mock-ocr",
      validation.input,
      validation.input.behavior,
      failureMessageFor(validation.input.behavior),
    );
  }

  const normalized = normalizeSyntheticOcrFixtureToExtractionContract(fixtureFor(validation.input));

  return {
    ok: true,
    provider: providerDescriptor("mock-ocr"),
    result: {
      resultKind: "mock-ocr-success",
      status: "completed",
      evidenceTypeHint: validation.input.evidenceTypeHint,
      extractedTextBlockCandidates: normalized.extractedTextBlocks,
      structuredFieldCandidates: normalized.structuredFields,
      simulatedConfidence: normalized.extractionConfidence,
      pageImageMetadata: {
        syntheticPageCount: 1,
        syntheticImageCount: 1,
        attemptedCount: 1,
        completedCount: 1,
      },
      costUsage: usageMetadata("success"),
      limitations: safeBaselineLimitations(),
      manualReviewDrivers: [
        ...normalized.manualReviewDrivers.map((driver) => ({
          code: "mock-provider-success" as const,
          message: driver.message,
          reviewSignalOnly: true as const,
          customerSafe: true as const,
        })),
      ],
      privacy: privacyFlags(),
      contractCompatibility: {
        canFeedOcrExtractionContract: true,
        contractName: normalized.contractName,
        normalizedStatus: normalized.status,
        normalizedStructuredFieldKeys: Object.keys(normalized.structuredFields),
      },
    },
  };
}

export function runMockVisionProvider(input: unknown): MockProviderAdapterResult {
  const validation = validateMockProviderAdapterInput(input);

  if (!validation.ok) {
    return failureFor("mock-vision", undefined, "input-rejected", validation.reason);
  }

  if (validation.input.behavior !== "success") {
    return failureFor(
      "mock-vision",
      validation.input,
      validation.input.behavior,
      failureMessageFor(validation.input.behavior),
    );
  }

  return {
    ok: true,
    provider: providerDescriptor("mock-vision"),
    result: {
      resultKind: "mock-vision-success",
      status: "completed",
      evidenceTypeHint: validation.input.evidenceTypeHint,
      visualContextSummary: "Synthetic visual context is available for reviewer comparison only.",
      screenshotLayoutObservations: [
        "Synthetic layout observation: receipt-like sections may need reviewer comparison.",
        "Synthetic layout observation: cropped or partial screenshot context may limit confidence.",
      ],
      productPhotoObservations: [
        "Synthetic product-photo observation: requested view completeness can be reviewed later.",
        "Synthetic product-photo observation: visible context remains an uncertainty signal only.",
      ],
      imageConsistencyUncertainty: {
        signalName: "synthetic altered-or-ai-generated uncertainty placeholder",
        value: 42,
        scale: "1-100",
        reviewSignalOnly: true,
        uncertaintyOnly: true,
      },
      limitations: safeBaselineLimitations(),
      manualReviewDrivers: [
        {
          code: "mock-vision-uncertainty",
          message: "Synthetic vision confidence is an uncertainty signal for manual review only.",
          reviewSignalOnly: true,
          customerSafe: true,
        },
      ],
      privacy: privacyFlags(),
      costUsage: usageMetadata("success"),
    },
  };
}
