import {
  recognizeProductPhotoEvidence,
  type ProductPhotoRecognitionInput,
} from "@/lib/analysis/product-photo-recognition";

const imageLikeProductPhoto = {
  fileTypeCategory: "image",
  mimeType: "image/jpeg",
  fileName: "synthetic-product-photo.jpg",
  subjectType: "damage-close-up",
} satisfies ProductPhotoRecognitionInput;

const compatibilityAliasProductPhoto = {
  evidenceType: "damage-photo",
  fileTypeCategory: "image",
  mimeType: "image/webp",
} satisfies ProductPhotoRecognitionInput;

const receiptLikeEvidence = {
  evidenceType: "receipt",
  fileTypeCategory: "image",
  mimeType: "image/png",
  fileName: "synthetic-receipt-photo.png",
} satisfies ProductPhotoRecognitionInput;

const orderScreenshotEvidence = {
  evidenceType: "order-screenshot",
  fileTypeCategory: "screenshot",
  mimeType: "image/png",
  fileName: "synthetic-order-screen.png",
} satisfies ProductPhotoRecognitionInput;

const pdfEvidence = {
  evidenceType: "pdf-receipt",
  fileTypeCategory: "pdf",
  mimeType: "application/pdf",
  fileName: "synthetic-receipt.pdf",
} satisfies ProductPhotoRecognitionInput;

const unknownEvidence = {} satisfies ProductPhotoRecognitionInput;

const productPhotoResult = recognizeProductPhotoEvidence(imageLikeProductPhoto);
const compatibilityAliasResult = recognizeProductPhotoEvidence(compatibilityAliasProductPhoto);
const receiptResult = recognizeProductPhotoEvidence(receiptLikeEvidence);
const orderScreenshotResult = recognizeProductPhotoEvidence(orderScreenshotEvidence);
const pdfResult = recognizeProductPhotoEvidence(pdfEvidence);
const unknownResult = recognizeProductPhotoEvidence(unknownEvidence);

export const PRODUCT_PHOTO_RECOGNITION_DEVELOPER_PROBE = {
  cases: {
    imageLikeProductPhoto: productPhotoResult,
    compatibilityAliasProductPhoto: compatibilityAliasResult,
    receiptLikeEvidence: receiptResult,
    orderScreenshotEvidence: orderScreenshotResult,
    pdfEvidence: pdfResult,
    unknownEvidence: unknownResult,
  },
  expectations: {
    imageLikeProductPhoto: {
      productPhotoCompatible: productPhotoResult.productPhotoCompatible,
      evidenceType: productPhotoResult.evidenceType,
      subjectType: productPhotoResult.subjectType,
    },
    compatibilityAliasProductPhoto: {
      productPhotoCompatible: compatibilityAliasResult.productPhotoCompatible,
      evidenceType: compatibilityAliasResult.evidenceType,
      alias: compatibilityAliasResult.compatibilityAlias?.alias,
    },
    receiptLikeEvidence: {
      productPhotoCompatible: receiptResult.productPhotoCompatible,
      evidenceType: receiptResult.evidenceType,
    },
    orderScreenshotEvidence: {
      productPhotoCompatible: orderScreenshotResult.productPhotoCompatible,
      evidenceType: orderScreenshotResult.evidenceType,
    },
    pdfEvidence: {
      productPhotoCompatible: pdfResult.productPhotoCompatible,
      evidenceType: pdfResult.evidenceType,
    },
    unknownEvidence: {
      productPhotoCompatible: unknownResult.productPhotoCompatible,
      recognitionState: unknownResult.recognitionState,
    },
  },
} as const;
