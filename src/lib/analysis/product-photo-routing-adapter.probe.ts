import {
  routeProductPhotoEvidenceForDevOnlyBoundary,
  type ProductPhotoRoutingAdapterInput,
} from "@/lib/analysis/product-photo-routing-adapter";
import type { EvidenceMetadataSummary } from "@/lib/analysis/types";

const imageMetadataAvailable = {
  fileTypeCategory: "image",
  fileSizeBucket: "medium",
  dimensionsPresent: true,
  dimensionsBucket: "large",
  dimensions: {
    width: 1800,
    height: 1200,
  },
  metadataContext: "Available",
  captureTimestampPresent: true,
  gpsContext: "stripped",
  editingSoftwareSignal: "not-present",
  rawExifOmitted: true,
  originalFilenameOmitted: true,
  notes: ["local-only review signal"],
} satisfies EvidenceMetadataSummary;

const imageMetadataLimited = {
  fileTypeCategory: "image",
  fileSizeBucket: "small",
  dimensionsPresent: true,
  dimensionsBucket: "small",
  metadataContext: "Limited",
  captureTimestampPresent: "unknown",
  gpsContext: "unknown",
  editingSoftwareSignal: "unknown",
  rawExifOmitted: true,
  originalFilenameOmitted: true,
  notes: ["metadata context limited"],
} satisfies EvidenceMetadataSummary;

const productPhotoCompatibleInput = {
  fileTypeCategory: "image",
  mimeType: "image/jpeg",
  fileName: "synthetic-product-photo.jpg",
  subjectType: "damage-close-up",
  productPhotoAnalysisInput: {
    metadataSummary: imageMetadataAvailable,
    requestedAdditionalViews: [],
    missingContext: [],
    productContext: "complete",
    purchaseOrReceiptMatchNeeded: false,
    includeManualReviewRecommendation: false,
  },
} satisfies ProductPhotoRoutingAdapterInput;

const compatibilityAliasInput = {
  evidenceType: "damage-photo",
  fileTypeCategory: "image",
  mimeType: "image/webp",
  productPhotoAnalysisInput: {
    metadataSummary: imageMetadataLimited,
    requestedAdditionalViews: ["wider-product-photo", "proof-of-purchase-match"],
    missingContext: ["wider-product-photo", "proof-of-purchase-match"],
    productContext: "missing",
    purchaseOrReceiptMatchNeeded: true,
  },
} satisfies ProductPhotoRoutingAdapterInput;

const receiptLikeInput = {
  evidenceType: "receipt",
  fileTypeCategory: "image",
  mimeType: "image/png",
  fileName: "synthetic-receipt-photo.png",
} satisfies ProductPhotoRoutingAdapterInput;

const orderScreenshotLikeInput = {
  evidenceType: "order-screenshot",
  fileTypeCategory: "screenshot",
  mimeType: "image/png",
  fileName: "synthetic-order-screen.png",
} satisfies ProductPhotoRoutingAdapterInput;

const pdfLikeInput = {
  evidenceType: "pdf-receipt",
  fileTypeCategory: "pdf",
  mimeType: "application/pdf",
  fileName: "synthetic-receipt.pdf",
} satisfies ProductPhotoRoutingAdapterInput;

const unknownInput = {} satisfies ProductPhotoRoutingAdapterInput;

const productPhotoCompatibleResult = routeProductPhotoEvidenceForDevOnlyBoundary(productPhotoCompatibleInput);
const compatibilityAliasResult = routeProductPhotoEvidenceForDevOnlyBoundary(compatibilityAliasInput);
const receiptLikeResult = routeProductPhotoEvidenceForDevOnlyBoundary(receiptLikeInput);
const orderScreenshotLikeResult = routeProductPhotoEvidenceForDevOnlyBoundary(orderScreenshotLikeInput);
const pdfLikeResult = routeProductPhotoEvidenceForDevOnlyBoundary(pdfLikeInput);
const unknownResult = routeProductPhotoEvidenceForDevOnlyBoundary(unknownInput);

export const PRODUCT_PHOTO_ROUTING_ADAPTER_DEVELOPER_PROBE = {
  cases: {
    productPhotoCompatible: productPhotoCompatibleResult,
    compatibilityAlias: compatibilityAliasResult,
    receiptLike: receiptLikeResult,
    orderScreenshotLike: orderScreenshotLikeResult,
    pdfLike: pdfLikeResult,
    unknown: unknownResult,
  },
  expectations: {
    productPhotoCompatible: {
      routed: productPhotoCompatibleResult.routed,
      hasProductPhotoDetails: Boolean(productPhotoCompatibleResult.productPhotoDetails),
      evidenceType: productPhotoCompatibleResult.recognition.evidenceType,
      subjectType: productPhotoCompatibleResult.productPhotoDetails?.subjectType,
    },
    compatibilityAlias: {
      routed: compatibilityAliasResult.routed,
      hasProductPhotoDetails: Boolean(compatibilityAliasResult.productPhotoDetails),
      evidenceType: compatibilityAliasResult.recognition.evidenceType,
      alias: compatibilityAliasResult.recognition.compatibilityAlias?.alias,
      subjectType: compatibilityAliasResult.productPhotoDetails?.subjectType,
    },
    receiptLike: {
      routed: receiptLikeResult.routed,
      hasProductPhotoDetails: Boolean(receiptLikeResult.productPhotoDetails),
      evidenceType: receiptLikeResult.recognition.evidenceType,
    },
    orderScreenshotLike: {
      routed: orderScreenshotLikeResult.routed,
      hasProductPhotoDetails: Boolean(orderScreenshotLikeResult.productPhotoDetails),
      evidenceType: orderScreenshotLikeResult.recognition.evidenceType,
    },
    pdfLike: {
      routed: pdfLikeResult.routed,
      hasProductPhotoDetails: Boolean(pdfLikeResult.productPhotoDetails),
      evidenceType: pdfLikeResult.recognition.evidenceType,
    },
    unknown: {
      routed: unknownResult.routed,
      hasProductPhotoDetails: Boolean(unknownResult.productPhotoDetails),
      recognitionState: unknownResult.recognition.recognitionState,
    },
  },
} as const;
