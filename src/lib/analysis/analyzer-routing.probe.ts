import {
  buildAnalyzerRoutingDecision,
  ENABLE_PRODUCT_PHOTO_RUNTIME_ROUTING,
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

const receiptLikeDecision = buildAnalyzerRoutingDecision(receiptLikeInput);
const productPhotoRuntimeOffDecision = buildAnalyzerRoutingDecision(productPhotoRuntimeOffInput);
const productPhotoRuntimeTrueDecision = buildAnalyzerRoutingDecision(productPhotoRuntimeTrueInput);
const unknownDecision = buildAnalyzerRoutingDecision(unknownInput);

export const ANALYZER_ROUTING_GUARD_DEVELOPER_PROBE = {
  guard: {
    defaultProductPhotoRuntimeRoutingEnabled: ENABLE_PRODUCT_PHOTO_RUNTIME_ROUTING,
  },
  cases: {
    receiptLike: receiptLikeDecision,
    productPhotoRuntimeOff: productPhotoRuntimeOffDecision,
    productPhotoRuntimeTrue: productPhotoRuntimeTrueDecision,
    unknown: unknownDecision,
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
  },
} as const;
