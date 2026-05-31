import {
  SYNTHETIC_OCR_FIXTURE_CASES,
  type SyntheticOcrFixtureCase,
  type SyntheticOcrFixtureStatus,
  type SyntheticOcrTextBlock,
  type SyntheticReceiptFieldExpectation,
  type SyntheticReceiptFieldKey,
} from "@/lib/analysis/ocr-fixture-harness";

export type ProviderNeutralOcrEvidenceKind = "receipt" | "order-screenshot" | "receipt-like" | "non-receipt" | "unknown";

export type ProviderNeutralOcrSourceKind = "synthetic-fixture";

export type ProviderNeutralOcrProcessingMode = "synthetic-contract-only";

export type ProviderNeutralOcrInputContract = {
  inputId: string;
  sourceKind: ProviderNeutralOcrSourceKind;
  evidenceKindHint: ProviderNeutralOcrEvidenceKind;
  processingMode: ProviderNeutralOcrProcessingMode;
  providerCallsAllowed: false;
  liveRuntimeAllowed: false;
  rawOcrRetentionAllowed: false;
  requestedOutputs: {
    extractedTextBlocks: true;
    structuredReceiptFields: true;
    confidenceSignals: true;
    manualReviewDrivers: true;
  };
  syntheticTextBlocks: readonly SyntheticOcrTextBlock[];
  syntheticStatus: SyntheticOcrFixtureStatus;
};

export type NormalizedOcrOutcomeStatus =
  | "completed"
  | "needs-review"
  | "unsupported"
  | "provider-failure"
  | "empty";

export type NormalizedOcrReviewSignalLevel = "none" | "low" | "medium" | "high" | "operational";

export type NormalizedOcrFieldStatus =
  | "extracted"
  | "not-extracted"
  | "needs-review"
  | "conflicting"
  | "not-applicable";

export type NormalizedOcrFieldConfidence = {
  score: number;
  label: "high" | "medium" | "low" | "none";
  reviewSignal: boolean;
  note: string;
};

export type NormalizedOcrExtractionConfidence = {
  score: number;
  label: "high" | "medium" | "low" | "unavailable";
  reviewSignalLevel: NormalizedOcrReviewSignalLevel;
  note: string;
};

export type NormalizedOcrTextBlock = {
  id: string;
  text: string;
  normalizedText: string;
  blockKind: SyntheticOcrTextBlock["kind"];
  confidence: NormalizedOcrFieldConfidence;
  pageNumber: number;
};

export type NormalizedOcrStructuredField = {
  field: SyntheticReceiptFieldKey;
  value?: string | readonly string[];
  status: NormalizedOcrFieldStatus;
  confidence: NormalizedOcrFieldConfidence;
  evidenceBlockIds: readonly string[];
  limitations: readonly string[];
};

export type NormalizedOcrStructuredFields = Partial<Record<SyntheticReceiptFieldKey, NormalizedOcrStructuredField>>;

export type NormalizedOcrManualReviewDriver = {
  code:
    | "missing-field"
    | "conflicting-field"
    | "low-confidence"
    | "incomplete-structure"
    | "unsupported-structure"
    | "ambiguous-marketplace-structure"
    | "provider-unavailable"
    | "empty-output"
    | "marketplace-readiness"
    | "general-review";
  message: string;
  reviewSignalLevel: Exclude<NormalizedOcrReviewSignalLevel, "none">;
  customerSafe: true;
};

export type NormalizedOcrLimitation = {
  code:
    | "synthetic-only"
    | "not-externally-verified"
    | "low-confidence-text"
    | "missing-core-field"
    | "conflicting-fields"
    | "unsupported-text"
    | "ambiguous-layout"
    | "provider-unavailable"
    | "empty-output"
    | "general-limitation";
  message: string;
};

export type NormalizedOcrSafeSummary = {
  headline: string;
  reviewPosture: "review-support-only";
  externalVerification: "Not performed";
  noFinalDecision: true;
};

export type NormalizedOcrUnsupportedOutcome = {
  reason: string;
  reviewSignalLevel: "medium";
};

export type NormalizedOcrProviderFailureOutcome = {
  reason: string;
  operationalOnly: true;
  reviewSignalLevel: "operational";
};

export type NormalizedOcrReceiptExtractionResult = {
  contractName: "phase-4.3-provider-neutral-ocr-extraction-contract";
  phase: "4.3";
  runtimeLive: false;
  providerFree: true;
  routeFree: true;
  uiFree: true;
  uploadFree: true;
  storageFree: true;
  realEvidenceFree: true;
  input: ProviderNeutralOcrInputContract;
  status: NormalizedOcrOutcomeStatus;
  extractedTextBlocks: readonly NormalizedOcrTextBlock[];
  structuredFields: NormalizedOcrStructuredFields;
  fieldConfidence: Partial<Record<SyntheticReceiptFieldKey, NormalizedOcrFieldConfidence>>;
  extractionConfidence: NormalizedOcrExtractionConfidence;
  manualReviewDrivers: readonly NormalizedOcrManualReviewDriver[];
  limitations: readonly NormalizedOcrLimitation[];
  safeSummary: NormalizedOcrSafeSummary;
  unsupportedReason?: string;
  providerFailureReason?: string;
  unsupportedOutcome?: NormalizedOcrUnsupportedOutcome;
  providerFailureOutcome?: NormalizedOcrProviderFailureOutcome;
  reviewSignalLevel: NormalizedOcrReviewSignalLevel;
  requiresManualReview: boolean;
};

export type NormalizedOcrContractHarnessResult = {
  harnessName: "phase-4.3-provider-neutral-ocr-extraction-contract";
  phase: "4.3";
  runtimeLive: false;
  providerFree: true;
  routeFree: true;
  uiFree: true;
  uploadFree: true;
  storageFree: true;
  realEvidenceFree: true;
  results: readonly NormalizedOcrReceiptExtractionResult[];
  summary: {
    totalResults: number;
    completedResults: number;
    manualReviewResults: number;
    unsupportedResults: number;
    providerFailureResults: number;
    emptyResults: number;
    allRequireSafeSummary: boolean;
    allProviderFailuresOperationalOnly: boolean;
    safeSummary: "Provider-neutral synthetic OCR extraction contract only. Confidence is a review signal, not proof or a final decision.";
  };
};

export const REQUIRED_OCR_EXTRACTION_RECEIPT_FIELD_KEYS = [
  "merchant",
  "orderNumber",
  "purchaseDate",
  "subtotal",
  "tax",
  "shipping",
  "total",
  "itemLines",
  "marketplaceHints",
] as const satisfies readonly SyntheticReceiptFieldKey[];

function evidenceKindHintFor(fixture: SyntheticOcrFixtureCase): ProviderNeutralOcrEvidenceKind {
  if (fixture.fixtureKind === "amazon-like" || fixture.fixtureKind === "ambiguous") {
    return "order-screenshot";
  }

  if (fixture.fixtureKind === "unsupported") {
    return "non-receipt";
  }

  if (fixture.fixtureKind === "incomplete" || fixture.fixtureKind === "empty") {
    return "receipt-like";
  }

  return "receipt";
}

function statusFor(status: SyntheticOcrFixtureStatus): NormalizedOcrOutcomeStatus {
  if (status === "structured") {
    return "completed";
  }

  if (status === "provider-unavailable") {
    return "provider-failure";
  }

  return status;
}

function confidenceFor(score: number, subject: string): NormalizedOcrFieldConfidence {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  const label =
    normalizedScore >= 80 ? "high" : normalizedScore >= 55 ? "medium" : normalizedScore > 0 ? "low" : "none";
  const reviewSignal = normalizedScore < 75;

  return {
    score: normalizedScore,
    label,
    reviewSignal,
    note: reviewSignal
      ? `${subject} confidence should be treated as a manual-review signal.`
      : `${subject} confidence is suitable for future parser-contract comparison only.`,
  };
}

function extractionConfidenceFor(score: number, status: NormalizedOcrOutcomeStatus): NormalizedOcrExtractionConfidence {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  if (status === "provider-failure") {
    return {
      score: normalizedScore,
      label: "unavailable",
      reviewSignalLevel: "operational",
      note: "Synthetic provider-unavailable state is an operational limitation, not a customer-risk signal.",
    };
  }

  if (status === "empty") {
    return {
      score: normalizedScore,
      label: "unavailable",
      reviewSignalLevel: "high",
      note: "Empty OCR output cannot support structured extraction and should drive manual review.",
    };
  }

  const label =
    normalizedScore >= 80 ? "high" : normalizedScore >= 55 ? "medium" : normalizedScore > 0 ? "low" : "unavailable";
  const reviewSignalLevel =
    status === "unsupported" ? "medium" : normalizedScore >= 80 && status === "completed" ? "low" : normalizedScore >= 55 ? "medium" : "high";

  return {
    score: normalizedScore,
    label,
    reviewSignalLevel,
    note:
      status === "completed"
        ? "Extraction confidence supports future structure comparison, not a decision."
        : "Extraction confidence indicates how much manual review is needed before relying on fields.",
  };
}

function normalizeTextBlock(block: SyntheticOcrTextBlock): NormalizedOcrTextBlock {
  return {
    id: block.id,
    text: block.text,
    normalizedText: block.text.replace(/\s+/g, " ").trim().toLowerCase(),
    blockKind: block.kind,
    confidence: confidenceFor(block.confidence, `Text block ${block.id}`),
    pageNumber: block.pageNumber,
  };
}

function normalizeStructuredField(
  fieldKey: SyntheticReceiptFieldKey,
  field: SyntheticReceiptFieldExpectation,
): NormalizedOcrStructuredField {
  return {
    field: fieldKey,
    value: field.value,
    status: field.status,
    confidence: confidenceFor(field.confidence, `${fieldKey} field`),
    evidenceBlockIds: field.evidenceBlockIds,
    limitations: field.limitation ? [field.limitation] : [],
  };
}

function manualReviewCodeFor(message: string, status: NormalizedOcrOutcomeStatus): NormalizedOcrManualReviewDriver["code"] {
  const normalized = message.toLowerCase();

  if (status === "provider-failure") {
    return "provider-unavailable";
  }

  if (status === "empty") {
    return "empty-output";
  }

  if (status === "unsupported") {
    return "unsupported-structure";
  }

  if (normalized.includes("missing")) {
    return "missing-field";
  }

  if (normalized.includes("conflict")) {
    return "conflicting-field";
  }

  if (normalized.includes("low-confidence")) {
    return "low-confidence";
  }

  if (normalized.includes("action/status") || normalized.includes("marketplace")) {
    return "ambiguous-marketplace-structure";
  }

  if (normalized.includes("order/date/total")) {
    return "marketplace-readiness";
  }

  if (normalized.includes("absent") || normalized.includes("incomplete")) {
    return "incomplete-structure";
  }

  return "general-review";
}

function reviewLevelForDriver(
  code: NormalizedOcrManualReviewDriver["code"],
  extractionConfidence: NormalizedOcrExtractionConfidence,
): Exclude<NormalizedOcrReviewSignalLevel, "none"> {
  if (code === "provider-unavailable") {
    return "operational";
  }

  if (code === "empty-output" || code === "conflicting-field" || code === "unsupported-structure") {
    return "high";
  }

  if (extractionConfidence.reviewSignalLevel === "low" || extractionConfidence.reviewSignalLevel === "none") {
    return "low";
  }

  return extractionConfidence.reviewSignalLevel;
}

function normalizeManualReviewDrivers(
  fixture: SyntheticOcrFixtureCase,
  status: NormalizedOcrOutcomeStatus,
  extractionConfidence: NormalizedOcrExtractionConfidence,
): readonly NormalizedOcrManualReviewDriver[] {
  const fixtureDrivers = fixture.expectedOutput.manualReviewDrivers.map((message) => {
    const code = manualReviewCodeFor(message, status);

    return {
      code,
      message,
      reviewSignalLevel: reviewLevelForDriver(code, extractionConfidence),
      customerSafe: true,
    } satisfies NormalizedOcrManualReviewDriver;
  });

  const fieldDrivers = Object.entries(fixture.expectedOutput.structuredFields)
    .filter(([, field]) => field.status === "not-extracted" || field.status === "needs-review" || field.status === "conflicting")
    .map(([fieldKey, field]) => {
      const code =
        field.status === "conflicting"
          ? "conflicting-field"
          : field.status === "not-extracted"
            ? "missing-field"
            : "low-confidence";

      return {
        code,
        message: `${fieldKey} field status is ${field.status}; reviewer comparison is recommended before relying on it.`,
        reviewSignalLevel: reviewLevelForDriver(code, extractionConfidence),
        customerSafe: true,
      } satisfies NormalizedOcrManualReviewDriver;
    });

  return [...fixtureDrivers, ...fieldDrivers];
}

function limitationCodeFor(message: string, status: NormalizedOcrOutcomeStatus): NormalizedOcrLimitation["code"] {
  const normalized = message.toLowerCase();

  if (status === "provider-failure") {
    return "provider-unavailable";
  }

  if (status === "empty") {
    return "empty-output";
  }

  if (status === "unsupported") {
    return "unsupported-text";
  }

  if (normalized.includes("conflict")) {
    return "conflicting-fields";
  }

  if (normalized.includes("missing") || normalized.includes("absen")) {
    return "missing-core-field";
  }

  if (normalized.includes("noisy") || normalized.includes("low")) {
    return "low-confidence-text";
  }

  if (normalized.includes("ambiguous") || normalized.includes("marketplace")) {
    return "ambiguous-layout";
  }

  if (normalized.includes("external verification")) {
    return "not-externally-verified";
  }

  if (normalized.includes("synthetic")) {
    return "synthetic-only";
  }

  return "general-limitation";
}

function normalizeLimitations(
  fixture: SyntheticOcrFixtureCase,
  status: NormalizedOcrOutcomeStatus,
): readonly NormalizedOcrLimitation[] {
  const baseLimitations = fixture.expectedOutput.limitations.map((message) => ({
    code: limitationCodeFor(message, status),
    message,
  }));

  return [
    ...baseLimitations,
    {
      code: "synthetic-only",
      message: "Contract result is derived from synthetic OCR fixtures only.",
    },
    {
      code: "not-externally-verified",
      message: "No external verification was performed.",
    },
  ];
}

function reviewSignalLevelFor(params: {
  status: NormalizedOcrOutcomeStatus;
  extractionConfidence: NormalizedOcrExtractionConfidence;
  manualReviewDrivers: readonly NormalizedOcrManualReviewDriver[];
}): NormalizedOcrReviewSignalLevel {
  if (params.status === "provider-failure") {
    return "operational";
  }

  if (
    params.manualReviewDrivers.some((driver) => driver.reviewSignalLevel === "high") ||
    params.extractionConfidence.reviewSignalLevel === "high"
  ) {
    return "high";
  }

  if (
    params.manualReviewDrivers.some((driver) => driver.reviewSignalLevel === "medium") ||
    params.extractionConfidence.reviewSignalLevel === "medium"
  ) {
    return "medium";
  }

  if (
    params.manualReviewDrivers.some((driver) => driver.reviewSignalLevel === "low") ||
    params.extractionConfidence.reviewSignalLevel === "low"
  ) {
    return "low";
  }

  return "none";
}

function buildSafeSummary(fixture: SyntheticOcrFixtureCase): NormalizedOcrSafeSummary {
  return {
    headline: fixture.expectedOutput.safeSummary,
    reviewPosture: "review-support-only",
    externalVerification: "Not performed",
    noFinalDecision: true,
  };
}

export function buildProviderNeutralOcrInputContract(
  fixture: SyntheticOcrFixtureCase,
): ProviderNeutralOcrInputContract {
  return {
    inputId: fixture.key,
    sourceKind: "synthetic-fixture",
    evidenceKindHint: evidenceKindHintFor(fixture),
    processingMode: "synthetic-contract-only",
    providerCallsAllowed: false,
    liveRuntimeAllowed: false,
    rawOcrRetentionAllowed: false,
    requestedOutputs: {
      extractedTextBlocks: true,
      structuredReceiptFields: true,
      confidenceSignals: true,
      manualReviewDrivers: true,
    },
    syntheticTextBlocks: fixture.expectedOutput.extractedTextBlocks,
    syntheticStatus: fixture.expectedOutput.status,
  };
}

export function normalizeSyntheticOcrFixtureToExtractionContract(
  fixture: SyntheticOcrFixtureCase,
): NormalizedOcrReceiptExtractionResult {
  const status = statusFor(fixture.expectedOutput.status);
  const input = buildProviderNeutralOcrInputContract(fixture);
  const structuredFields = Object.fromEntries(
    Object.entries(fixture.expectedOutput.structuredFields).map(([fieldKey, field]) => [
      fieldKey,
      normalizeStructuredField(fieldKey as SyntheticReceiptFieldKey, field),
    ]),
  ) as NormalizedOcrStructuredFields;
  const fieldConfidence = Object.fromEntries(
    Object.entries(fixture.expectedOutput.fieldConfidence).map(([fieldKey, score]) => [
      fieldKey,
      confidenceFor(score, `${fieldKey} field`),
    ]),
  ) as Partial<Record<SyntheticReceiptFieldKey, NormalizedOcrFieldConfidence>>;
  const extractionConfidence = extractionConfidenceFor(fixture.expectedOutput.extractionConfidence, status);
  const manualReviewDrivers = normalizeManualReviewDrivers(fixture, status, extractionConfidence);
  const limitations = normalizeLimitations(fixture, status);
  const reviewSignalLevel = reviewSignalLevelFor({ status, extractionConfidence, manualReviewDrivers });
  const unsupportedReason = status === "unsupported" || status === "empty" ? fixture.expectedOutput.unsupportedReason : undefined;
  const providerFailureReason = status === "provider-failure" ? fixture.expectedOutput.unsupportedReason : undefined;

  return {
    contractName: "phase-4.3-provider-neutral-ocr-extraction-contract",
    phase: "4.3",
    runtimeLive: false,
    providerFree: true,
    routeFree: true,
    uiFree: true,
    uploadFree: true,
    storageFree: true,
    realEvidenceFree: true,
    input,
    status,
    extractedTextBlocks: fixture.expectedOutput.extractedTextBlocks.map(normalizeTextBlock),
    structuredFields,
    fieldConfidence,
    extractionConfidence,
    manualReviewDrivers,
    limitations,
    safeSummary: buildSafeSummary(fixture),
    ...(unsupportedReason
      ? {
          unsupportedReason,
          unsupportedOutcome: {
            reason: unsupportedReason,
            reviewSignalLevel: "medium",
          },
        }
      : {}),
    ...(providerFailureReason
      ? {
          providerFailureReason,
          providerFailureOutcome: {
            reason: providerFailureReason,
            operationalOnly: true,
            reviewSignalLevel: "operational",
          },
        }
      : {}),
    reviewSignalLevel,
    requiresManualReview: manualReviewDrivers.length > 0 || reviewSignalLevel !== "none",
  };
}

export function runProviderNeutralOcrExtractionContractHarness(): NormalizedOcrContractHarnessResult {
  const results = SYNTHETIC_OCR_FIXTURE_CASES.map(normalizeSyntheticOcrFixtureToExtractionContract);

  return {
    harnessName: "phase-4.3-provider-neutral-ocr-extraction-contract",
    phase: "4.3",
    runtimeLive: false,
    providerFree: true,
    routeFree: true,
    uiFree: true,
    uploadFree: true,
    storageFree: true,
    realEvidenceFree: true,
    results,
    summary: {
      totalResults: results.length,
      completedResults: results.filter((result) => result.status === "completed").length,
      manualReviewResults: results.filter((result) => result.requiresManualReview).length,
      unsupportedResults: results.filter((result) => result.status === "unsupported").length,
      providerFailureResults: results.filter((result) => result.status === "provider-failure").length,
      emptyResults: results.filter((result) => result.status === "empty").length,
      allRequireSafeSummary: results.every(
        (result) =>
          result.safeSummary.reviewPosture === "review-support-only" &&
          result.safeSummary.externalVerification === "Not performed" &&
          result.safeSummary.noFinalDecision,
      ),
      allProviderFailuresOperationalOnly: results
        .filter((result) => result.status === "provider-failure")
        .every((result) => result.providerFailureOutcome?.operationalOnly === true),
      safeSummary:
        "Provider-neutral synthetic OCR extraction contract only. Confidence is a review signal, not proof or a final decision.",
    },
  };
}
