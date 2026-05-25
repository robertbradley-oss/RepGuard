import {
  buildAnalyzerFileRoutingDecision,
  buildAnalyzerRoutingDecision,
  ENABLE_PRODUCT_PHOTO_RUNTIME_ROUTING,
  type AnalyzerFileRoutingGuardInput,
  type AnalyzerRoutingGuardInput,
} from "@/lib/analysis/analyzer-routing";

const receiptLikeInput = {
  evidenceType: "receipt",
  fileTypeCategory: "image",
  mimeType: "image/png",
  fileName: "synthetic-receipt-photo.png",
} satisfies AnalyzerRoutingGuardInput;

const productPhotoRuntimeOffInput = {
  evidenceType: "product-photo",
  fileTypeCategory: "image",
  mimeType: "image/jpeg",
  fileName: "synthetic-product-photo.jpg",
  subjectType: "damage-close-up",
} satisfies AnalyzerRoutingGuardInput;

const productPhotoRuntimeTrueInput = {
  evidenceType: "product-photo",
  fileTypeCategory: "image",
  mimeType: "image/jpeg",
  fileName: "synthetic-product-photo.jpg",
  subjectType: "damage-close-up",
  runtimeRoutingEnabled: true,
} satisfies AnalyzerRoutingGuardInput;

const unknownInput = {} satisfies AnalyzerRoutingGuardInput;

const receiptLikeFileInput = {
  file: {
    name: "synthetic-receipt-photo.png",
    type: "image/png",
    size: 120_000,
  },
} satisfies AnalyzerFileRoutingGuardInput;

const productPhotoRuntimeOffFileInput = {
  file: {
    name: "synthetic-product-photo.jpg",
    type: "image/jpeg",
    size: 180_000,
  },
  subjectType: "damage-close-up",
} satisfies AnalyzerFileRoutingGuardInput;

const productPhotoRuntimeTrueFileInput = {
  file: {
    name: "synthetic-product-photo.jpg",
    type: "image/jpeg",
    size: 180_000,
  },
  subjectType: "damage-close-up",
  runtimeRoutingEnabled: true,
} satisfies AnalyzerFileRoutingGuardInput;

const unknownFileInput = {} satisfies AnalyzerFileRoutingGuardInput;

const receiptLikeDecision = buildAnalyzerRoutingDecision(receiptLikeInput);
const productPhotoRuntimeOffDecision = buildAnalyzerRoutingDecision(productPhotoRuntimeOffInput);
const productPhotoRuntimeTrueDecision = buildAnalyzerRoutingDecision(productPhotoRuntimeTrueInput);
const unknownDecision = buildAnalyzerRoutingDecision(unknownInput);
const receiptLikeFileDecision = buildAnalyzerFileRoutingDecision(receiptLikeFileInput);
const productPhotoRuntimeOffFileDecision = buildAnalyzerFileRoutingDecision(productPhotoRuntimeOffFileInput);
const productPhotoRuntimeTrueFileDecision = buildAnalyzerFileRoutingDecision(productPhotoRuntimeTrueFileInput);
const unknownFileDecision = buildAnalyzerFileRoutingDecision(unknownFileInput);

function allChecksPass(checks: Record<string, boolean>) {
  return Object.values(checks).every(Boolean);
}

const receiptPathPreservationChecks = {
  receiptLikeObjectUsesReceiptPath: receiptLikeDecision.route === "receipt-analyzer-path",
  receiptLikeObjectStatusPreserved: receiptLikeDecision.status === "receipt-path-preserved",
  receiptLikeObjectPreservesReceiptPath: receiptLikeDecision.receiptPathPreserved,
  receiptLikeObjectIsNotProductPhotoCandidate: !receiptLikeDecision.productPhotoCandidate,
  receiptLikeFileUsesReceiptPath: receiptLikeFileDecision.route === "receipt-analyzer-path",
  receiptLikeFileStatusPreserved: receiptLikeFileDecision.status === "receipt-path-preserved",
  receiptLikeFilePreservesReceiptPath: receiptLikeFileDecision.receiptPathPreserved,
  receiptLikeFileIsNotProductPhotoCandidate: !receiptLikeFileDecision.productPhotoCandidate,
} as const;

const productPhotoGuardChecks = {
  runtimeRoutingDisabledByDefault: ENABLE_PRODUCT_PHOTO_RUNTIME_ROUTING === false,
  productPhotoObjectUsesGuardedRoute: productPhotoRuntimeOffDecision.route === "product-photo-guarded",
  productPhotoObjectStatusUnsupported: productPhotoRuntimeOffDecision.status === "unsupported-live-path",
  productPhotoObjectCandidateGuarded: productPhotoRuntimeOffDecision.productPhotoCandidate,
  productPhotoObjectDoesNotNeedLocalAnalysisResult:
    productPhotoRuntimeOffDecision.localAnalysisResultShapeRequired === false,
  productPhotoObjectDoesNotInvokeAdapter: productPhotoRuntimeOffDecision.adapterInvoked === false,
  productPhotoRuntimeRequestStillDisabled: productPhotoRuntimeTrueDecision.runtimeRoutingEnabled === false,
  productPhotoRuntimeRequestStillUnsupported: productPhotoRuntimeTrueDecision.status === "unsupported-live-path",
  productPhotoFileUsesGuardedRoute: productPhotoRuntimeOffFileDecision.route === "product-photo-guarded",
  productPhotoFileStatusUnsupported: productPhotoRuntimeOffFileDecision.status === "unsupported-live-path",
  productPhotoFileCandidateGuarded: productPhotoRuntimeOffFileDecision.productPhotoCandidate,
  productPhotoFileDoesNotNeedLocalAnalysisResult:
    productPhotoRuntimeOffFileDecision.localAnalysisResultShapeRequired === false,
  productPhotoFileDoesNotInvokeAdapter: productPhotoRuntimeOffFileDecision.adapterInvoked === false,
  productPhotoFileRuntimeRequestStillDisabled: productPhotoRuntimeTrueFileDecision.runtimeRoutingEnabled === false,
  productPhotoFileRuntimeRequestStillUnsupported: productPhotoRuntimeTrueFileDecision.status === "unsupported-live-path",
} as const;

const unknownPathChecks = {
  unknownObjectRouteInconclusive: unknownDecision.route === "unknown-inconclusive",
  unknownObjectStatusInconclusive: unknownDecision.status === "unknown-inconclusive",
  unknownObjectNotProductPhotoCandidate: !unknownDecision.productPhotoCandidate,
  unknownFileRouteInconclusive: unknownFileDecision.route === "unknown-inconclusive",
  unknownFileStatusInconclusive: unknownFileDecision.status === "unknown-inconclusive",
  unknownFileNotProductPhotoCandidate: !unknownFileDecision.productPhotoCandidate,
} as const;

const livePathIsolationChecks = {
  receiptObjectDoesNotExerciseUiOrReport: receiptLikeDecision.uiOrReportBehaviorExercised === false,
  productPhotoObjectDoesNotExerciseUiOrReport: productPhotoRuntimeOffDecision.uiOrReportBehaviorExercised === false,
  unknownObjectDoesNotExerciseUiOrReport: unknownDecision.uiOrReportBehaviorExercised === false,
  receiptFileDoesNotExerciseUiOrReport: receiptLikeFileDecision.uiOrReportBehaviorExercised === false,
  productPhotoFileDoesNotExerciseUiOrReport: productPhotoRuntimeOffFileDecision.uiOrReportBehaviorExercised === false,
  unknownFileDoesNotExerciseUiOrReport: unknownFileDecision.uiOrReportBehaviorExercised === false,
  receiptObjectDoesNotInvokeAdapter: receiptLikeDecision.adapterInvoked === false,
  productPhotoObjectDoesNotInvokeAdapter: productPhotoRuntimeOffDecision.adapterInvoked === false,
  unknownObjectDoesNotInvokeAdapter: unknownDecision.adapterInvoked === false,
  receiptFileDoesNotInvokeAdapter: receiptLikeFileDecision.adapterInvoked === false,
  productPhotoFileDoesNotInvokeAdapter: productPhotoRuntimeOffFileDecision.adapterInvoked === false,
  unknownFileDoesNotInvokeAdapter: unknownFileDecision.adapterInvoked === false,
} as const;

export const ANALYZER_ROUTING_GUARD_DEVELOPER_PROBE = {
  guard: {
    defaultProductPhotoRuntimeRoutingEnabled: ENABLE_PRODUCT_PHOTO_RUNTIME_ROUTING,
  },
  cases: {
    receiptLike: receiptLikeDecision,
    productPhotoRuntimeOff: productPhotoRuntimeOffDecision,
    productPhotoRuntimeTrue: productPhotoRuntimeTrueDecision,
    unknown: unknownDecision,
    receiptLikeFile: receiptLikeFileDecision,
    productPhotoRuntimeOffFile: productPhotoRuntimeOffFileDecision,
    productPhotoRuntimeTrueFile: productPhotoRuntimeTrueFileDecision,
    unknownFile: unknownFileDecision,
  },
  expectations: {
    receiptLike: {
      route: receiptLikeDecision.route,
      status: receiptLikeDecision.status,
      receiptPathPreserved: receiptLikeDecision.receiptPathPreserved,
      productPhotoCandidate: receiptLikeDecision.productPhotoCandidate,
      adapterInvoked: receiptLikeDecision.adapterInvoked,
      uiOrReportBehaviorExercised: receiptLikeDecision.uiOrReportBehaviorExercised,
    },
    productPhotoRuntimeOff: {
      route: productPhotoRuntimeOffDecision.route,
      status: productPhotoRuntimeOffDecision.status,
      runtimeRoutingEnabled: productPhotoRuntimeOffDecision.runtimeRoutingEnabled,
      productPhotoCandidate: productPhotoRuntimeOffDecision.productPhotoCandidate,
      localAnalysisResultShapeRequired: productPhotoRuntimeOffDecision.localAnalysisResultShapeRequired,
      adapterInvoked: productPhotoRuntimeOffDecision.adapterInvoked,
      uiOrReportBehaviorExercised: productPhotoRuntimeOffDecision.uiOrReportBehaviorExercised,
    },
    productPhotoRuntimeTrue: {
      route: productPhotoRuntimeTrueDecision.route,
      status: productPhotoRuntimeTrueDecision.status,
      runtimeRoutingEnabled: productPhotoRuntimeTrueDecision.runtimeRoutingEnabled,
      productPhotoCandidate: productPhotoRuntimeTrueDecision.productPhotoCandidate,
      localAnalysisResultShapeRequired: productPhotoRuntimeTrueDecision.localAnalysisResultShapeRequired,
      adapterInvoked: productPhotoRuntimeTrueDecision.adapterInvoked,
      uiOrReportBehaviorExercised: productPhotoRuntimeTrueDecision.uiOrReportBehaviorExercised,
    },
    unknown: {
      route: unknownDecision.route,
      status: unknownDecision.status,
      productPhotoCandidate: unknownDecision.productPhotoCandidate,
      recognitionState: unknownDecision.recognition.recognitionState,
      adapterInvoked: unknownDecision.adapterInvoked,
      uiOrReportBehaviorExercised: unknownDecision.uiOrReportBehaviorExercised,
    },
    receiptLikeFile: {
      boundary: receiptLikeFileDecision.boundary,
      route: receiptLikeFileDecision.route,
      status: receiptLikeFileDecision.status,
      receiptPathPreserved: receiptLikeFileDecision.receiptPathPreserved,
      productPhotoCandidate: receiptLikeFileDecision.productPhotoCandidate,
      fileTypeCategory: receiptLikeFileDecision.fileContext.fileTypeCategory,
      adapterInvoked: receiptLikeFileDecision.adapterInvoked,
      uiOrReportBehaviorExercised: receiptLikeFileDecision.uiOrReportBehaviorExercised,
    },
    productPhotoRuntimeOffFile: {
      boundary: productPhotoRuntimeOffFileDecision.boundary,
      route: productPhotoRuntimeOffFileDecision.route,
      status: productPhotoRuntimeOffFileDecision.status,
      runtimeRoutingEnabled: productPhotoRuntimeOffFileDecision.runtimeRoutingEnabled,
      productPhotoCandidate: productPhotoRuntimeOffFileDecision.productPhotoCandidate,
      localAnalysisResultShapeRequired: productPhotoRuntimeOffFileDecision.localAnalysisResultShapeRequired,
      adapterInvoked: productPhotoRuntimeOffFileDecision.adapterInvoked,
      uiOrReportBehaviorExercised: productPhotoRuntimeOffFileDecision.uiOrReportBehaviorExercised,
    },
    productPhotoRuntimeTrueFile: {
      boundary: productPhotoRuntimeTrueFileDecision.boundary,
      route: productPhotoRuntimeTrueFileDecision.route,
      status: productPhotoRuntimeTrueFileDecision.status,
      runtimeRoutingEnabled: productPhotoRuntimeTrueFileDecision.runtimeRoutingEnabled,
      productPhotoCandidate: productPhotoRuntimeTrueFileDecision.productPhotoCandidate,
      localAnalysisResultShapeRequired: productPhotoRuntimeTrueFileDecision.localAnalysisResultShapeRequired,
      adapterInvoked: productPhotoRuntimeTrueFileDecision.adapterInvoked,
      uiOrReportBehaviorExercised: productPhotoRuntimeTrueFileDecision.uiOrReportBehaviorExercised,
    },
    unknownFile: {
      boundary: unknownFileDecision.boundary,
      route: unknownFileDecision.route,
      status: unknownFileDecision.status,
      productPhotoCandidate: unknownFileDecision.productPhotoCandidate,
      recognitionState: unknownFileDecision.recognition.recognitionState,
      adapterInvoked: unknownFileDecision.adapterInvoked,
      uiOrReportBehaviorExercised: unknownFileDecision.uiOrReportBehaviorExercised,
    },
  },
  preservationStatus: {
    receiptPathPreserved: allChecksPass(receiptPathPreservationChecks),
    productPhotoCandidatesGuarded: allChecksPass(productPhotoGuardChecks),
    unknownInputsRemainInconclusive: allChecksPass(unknownPathChecks),
    livePathBehaviorNotExercised: allChecksPass(livePathIsolationChecks),
    localAnalysisResultShapeRequiredForProductPhoto: false,
    adapterInvokedForProductPhoto: false,
    checks: {
      receiptPathPreservation: receiptPathPreservationChecks,
      productPhotoGuard: productPhotoGuardChecks,
      unknownPath: unknownPathChecks,
      livePathIsolation: livePathIsolationChecks,
    },
  },
} as const;
