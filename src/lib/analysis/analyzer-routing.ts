import {
  recognizeProductPhotoEvidence,
  type ProductPhotoRecognitionInput,
  type ProductPhotoRecognitionResult,
} from "@/lib/analysis/product-photo-recognition";

export const ENABLE_PRODUCT_PHOTO_RUNTIME_ROUTING: boolean = false;

export type AnalyzerRoutingGuardInput = ProductPhotoRecognitionInput & {
  runtimeRoutingEnabled?: boolean;
};

export type AnalyzerRoutingGuardRoute =
  | "receipt-analyzer-path"
  | "product-photo-guarded"
  | "unknown-inconclusive";

export type AnalyzerRoutingGuardStatus =
  | "receipt-path-preserved"
  | "unsupported-live-path"
  | "unknown-inconclusive";

export type AnalyzerRoutingGuardDecision = {
  boundary: "analyzer-routing-guard";
  devOnly: true;
  runtimeRoutingEnabled: boolean;
  route: AnalyzerRoutingGuardRoute;
  receiptPathPreserved: boolean;
  productPhotoCandidate: boolean;
  status: AnalyzerRoutingGuardStatus;
  recognition: ProductPhotoRecognitionResult;
  localAnalysisResultShapeRequired: false;
  adapterInvoked: false;
  uiOrReportBehaviorExercised: false;
  reasons: string[];
  limitations: string[];
};

const ANALYZER_ROUTING_LIMITATIONS = [
  "dev-only analyzer routing guard",
  "unsupported live path for product-photo candidates",
  "manual-review support only",
  "product-photo routing adapter was not invoked",
  "UI, upload, report, scoring, parser, and fixture behavior were not exercised",
] as const;

function runtimeRoutingEnabledFor(input: AnalyzerRoutingGuardInput) {
  return input.runtimeRoutingEnabled === true && ENABLE_PRODUCT_PHOTO_RUNTIME_ROUTING === true;
}

function buildBaseLimitations(recognition: ProductPhotoRecognitionResult) {
  return [...recognition.limitations, ...ANALYZER_ROUTING_LIMITATIONS];
}

export function buildAnalyzerRoutingDecision(
  input: AnalyzerRoutingGuardInput = {},
): AnalyzerRoutingGuardDecision {
  const recognition = recognizeProductPhotoEvidence(input);
  const runtimeRoutingEnabled = runtimeRoutingEnabledFor(input);
  const productPhotoCandidate =
    recognition.devOnly &&
    recognition.productPhotoCompatible &&
    recognition.futureRoutingCandidate &&
    recognition.recognitionState === "product-photo-compatible";

  if (productPhotoCandidate) {
    return {
      boundary: "analyzer-routing-guard",
      devOnly: true,
      runtimeRoutingEnabled,
      route: "product-photo-guarded",
      receiptPathPreserved: true,
      productPhotoCandidate: true,
      status: "unsupported-live-path",
      recognition,
      localAnalysisResultShapeRequired: false,
      adapterInvoked: false,
      uiOrReportBehaviorExercised: false,
      reasons: [
        ...recognition.reasons,
        runtimeRoutingEnabled
          ? "product-photo runtime routing guard enabled, but live analysis remains unsupported in this wrapper"
          : "product-photo runtime routing disabled",
        "receipt analyzer path preserved",
      ],
      limitations: buildBaseLimitations(recognition),
    };
  }

  if (recognition.recognitionState === "other-evidence") {
    return {
      boundary: "analyzer-routing-guard",
      devOnly: true,
      runtimeRoutingEnabled,
      route: "receipt-analyzer-path",
      receiptPathPreserved: true,
      productPhotoCandidate: false,
      status: "receipt-path-preserved",
      recognition,
      localAnalysisResultShapeRequired: false,
      adapterInvoked: false,
      uiOrReportBehaviorExercised: false,
      reasons: [...recognition.reasons, "existing receipt analyzer path remains the live conceptual route"],
      limitations: buildBaseLimitations(recognition),
    };
  }

  return {
    boundary: "analyzer-routing-guard",
    devOnly: true,
    runtimeRoutingEnabled,
    route: "unknown-inconclusive",
    receiptPathPreserved: true,
    productPhotoCandidate: false,
    status: "unknown-inconclusive",
    recognition,
    localAnalysisResultShapeRequired: false,
    adapterInvoked: false,
    uiOrReportBehaviorExercised: false,
    reasons: [...recognition.reasons, "unknown evidence context remains inconclusive"],
    limitations: buildBaseLimitations(recognition),
  };
}

export const analyzeEvidenceWithRoutingGuard = buildAnalyzerRoutingDecision;
