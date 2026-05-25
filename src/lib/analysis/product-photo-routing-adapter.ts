import {
  recognizeProductPhotoEvidence,
  type ProductPhotoRecognitionInput,
  type ProductPhotoRecognitionResult,
} from "@/lib/analysis/product-photo-recognition";
import {
  buildProductPhotoAnalysisDetails,
  type ProductPhotoAnalysisDetailsInput,
} from "@/lib/analysis/product-photo-analyzer";
import type { ProductPhotoAnalysisDetails } from "@/lib/analysis/types";

export type ProductPhotoRoutingAdapterInput = ProductPhotoRecognitionInput & {
  productPhotoAnalysisInput?: ProductPhotoAnalysisDetailsInput;
};

export type ProductPhotoRoutingAdapterResult = {
  boundary: "product-photo-routing-adapter";
  devOnly: true;
  recognition: ProductPhotoRecognitionResult;
  productPhotoDetails?: ProductPhotoAnalysisDetails;
  routed: boolean;
  reasons: string[];
  limitations: string[];
};

const PRODUCT_PHOTO_ROUTING_ADAPTER_LIMITATIONS = [
  "dev-only routing adapter; runtime analyzer behavior is not live",
  "manual-review support only",
] as const;

function buildLimitations(recognition: ProductPhotoRecognitionResult, routed: boolean) {
  return [
    ...recognition.limitations,
    ...PRODUCT_PHOTO_ROUTING_ADAPTER_LIMITATIONS,
    routed
      ? "product-photo details were built for a future routing candidate only"
      : "product-photo details were not built for this input",
  ];
}

export function routeProductPhotoEvidenceForDevOnlyBoundary(
  input: ProductPhotoRoutingAdapterInput = {},
): ProductPhotoRoutingAdapterResult {
  const recognition = recognizeProductPhotoEvidence(input);
  const routed =
    recognition.devOnly &&
    recognition.productPhotoCompatible &&
    recognition.futureRoutingCandidate &&
    recognition.recognitionState === "product-photo-compatible";

  if (!routed) {
    return {
      boundary: "product-photo-routing-adapter",
      devOnly: true,
      recognition,
      routed: false,
      reasons: recognition.reasons,
      limitations: buildLimitations(recognition, false),
    };
  }

  const productPhotoDetails = buildProductPhotoAnalysisDetails({
    ...input.productPhotoAnalysisInput,
    subjectType: input.productPhotoAnalysisInput?.subjectType ?? recognition.subjectType,
  });

  return {
    boundary: "product-photo-routing-adapter",
    devOnly: true,
    recognition,
    productPhotoDetails,
    routed: true,
    reasons: [...recognition.reasons, "product-photo future routing candidate prepared"],
    limitations: buildLimitations(recognition, true),
  };
}
