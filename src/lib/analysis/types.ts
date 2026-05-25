import type { AnalysisConfidence, EvidenceType, RiskLevel } from "@/lib/claim-data";

export type SignalSeverity = "Low" | "Medium" | "High";

export type SharedEvidenceType =
  | "receipt"
  | "order-screenshot"
  | "pdf-receipt"
  | "product-photo"
  | "mixed-evidence"
  | "unknown-evidence";

export type EvidenceTypeCompatibilityAlias = {
  alias: "damage-photo";
  canonicalEvidenceType: "product-photo";
  subjectType: "damage-close-up";
};

export type EvidenceSourceKind =
  | "local-browser-analysis"
  | "synthetic-fixture"
  | "manual-review-context"
  | "future-provider-signal";

export type EvidenceReviewStatus = "Clear" | "Inconclusive" | "Review recommended" | "Manual review recommended";

export type LocalSignalLevel = "None" | "Low" | "Medium" | "High";

export type ReviewPriority = "Standard" | "Review" | "Manual review" | "Senior review";

export type EvidenceConfidence = "High confidence" | "Medium confidence" | "Low confidence";

export type SharedEvidenceReliabilityScore = {
  label: "Evidence Reliability Score";
  value: number;
  meaning: string;
  scoreScope: "Local evidence quality and review readiness only";
};

export type SharedExternalVerificationStatus = {
  status: "Not externally verified" | "Locally analyzed only" | "External verification unavailable";
  externalVerification: "Not performed";
  method: "Local evidence analysis only" | "Future approved provider";
  summary: string;
};

export type SharedEvidenceSignalCategory =
  | "Evidence Quality"
  | "Receipt Structure"
  | "Photo Context"
  | "Image Quality"
  | "Image Consistency"
  | "Metadata Context"
  | "Purchase Match"
  | "Recommendation";

export type SharedEvidenceSignal = {
  id: string;
  title: string;
  category: SharedEvidenceSignalCategory;
  severity: SignalSeverity;
  confidence: number;
  evidenceSource: string;
  explanation: string;
  recommendation: string;
};

export type FileTypeCategory = "image" | "pdf" | "screenshot" | "document" | "unknown";

export type FileSizeBucket = "tiny" | "small" | "medium" | "large" | "very-large" | "unknown";

export type DimensionBucket = "small" | "medium" | "large" | "very-large" | "unknown";

export type EvidenceMetadataSummary = {
  fileTypeCategory: FileTypeCategory;
  fileSizeBucket: FileSizeBucket;
  dimensionsPresent: boolean;
  dimensionsBucket?: DimensionBucket;
  dimensions?: {
    width: number;
    height: number;
  };
  metadataContext: "Available" | "Limited" | "Unavailable";
  captureTimestampPresent: boolean | "unknown";
  gpsContext: "present" | "stripped" | "unknown" | "not-applicable";
  editingSoftwareSignal: "present" | "not-present" | "unknown";
  rawExifOmitted: true;
  originalFilenameOmitted: true;
  notes: string[];
};

export type ProductPhotoSubjectType =
  | "damage-close-up"
  | "full-product-context"
  | "serial-model-label"
  | "packaging-damage"
  | "installation-context"
  | "mixed-evidence-image"
  | "inconclusive-photo";

export type DamageVisibilityStatus =
  | "clearly-visible"
  | "partially-visible"
  | "claimed-but-not-visible"
  | "damage-area-visible-context-missing"
  | "product-visible-damage-area-missing"
  | "inconclusive";

export type ProductContextStatus = "complete" | "partial" | "missing" | "not-applicable" | "inconclusive";

export type ProductLabelContext = {
  serialOrModelContextPresent: boolean;
  labelReadable: boolean | "unknown";
  rawValueOmitted: true;
  notes: string[];
};

export type ProductPhotoQualitySummary = {
  qualityLevel: "Clear" | "Usable" | "Limited" | "Poor" | "Inconclusive";
  qualityLimits: string[];
  summary: string;
};

export type ProductPhotoConsistencySummary = {
  status: "No material signal" | "Needs manual review" | "Inconclusive";
  signals: SharedEvidenceSignal[];
  summary: string;
};

export type PhotoMetadataContextSummary = {
  metadataSummary: EvidenceMetadataSummary;
  contextOnly: true;
  summary: string;
};

export type PhotoReviewCompleteness = {
  status: "complete" | "partial" | "inconclusive";
  missingContext: RequestedPhotoView[];
  summary: string;
};

export type RequestedPhotoView =
  | "wider-product-photo"
  | "clearer-damage-close-up"
  | "serial-or-model-label"
  | "packaging-context"
  | "installation-context"
  | "proof-of-purchase-match";

export type ProductPhotoAnalysisDetails = {
  subjectType: ProductPhotoSubjectType;
  damageVisibility: DamageVisibilityStatus;
  fullProductContext: ProductContextStatus;
  productLabelContext: ProductLabelContext;
  imageQuality: ProductPhotoQualitySummary;
  imageConsistency: ProductPhotoConsistencySummary;
  metadataContext: PhotoMetadataContextSummary;
  reviewCompleteness: PhotoReviewCompleteness;
  purchaseOrReceiptMatchNeeded: boolean;
  requestedAdditionalViews: RequestedPhotoView[];
  manualReviewRecommendation: string;
};

export type OcrRegion = {
  text: string;
  confidence: number;
};

export type OcrUncertaintyNote = {
  label: string;
  severity: "Low" | "Medium" | "High";
  samples: OcrRegion[];
  note: string;
};

export type OcrQuality = {
  label: "Clear" | "Usable" | "Inconclusive" | "Unreadable";
  wordCount: number;
  lowConfidenceWordCount: number;
  lowConfidenceRate: number;
  summary: string;
};

export type OcrExtraction = {
  engine: "tesseract.js" | "pdfjs-text" | "pdfjs-rendered-ocr" | "unsupported";
  text: string;
  averageConfidence: number;
  pages: number;
  quality: OcrQuality;
  lowConfidenceRegions: OcrRegion[];
  uncertaintyNotes: OcrUncertaintyNote[];
};

export type ReceiptFieldReliability = {
  field: "merchant" | "order number" | "purchase date" | "line item or product detail" | "total" | "payment method";
  value?: string;
  confidence: number;
  status: "Likely reliable" | "Needs review" | "Not extracted";
  note: string;
};

export type ReceiptAmountCategory =
  | "subtotal"
  | "tax"
  | "shipping"
  | "discount"
  | "refund"
  | "total"
  | "payment"
  | "other";

export type ReceiptAmountCandidate = {
  label: string;
  value: string;
  priority: number;
  category: ReceiptAmountCategory;
};

export type ReceiptPaymentCandidate = {
  label: string;
  value: string;
  kind: "card" | "wallet" | "gift-card" | "store-credit" | "unknown";
  hasVisibleLastFour: boolean;
};

export type ReceiptContextCandidate = {
  kind: "seller" | "recipient" | "shipping" | "billing" | "delivery" | "payment" | "invoice" | "redacted-private";
  label: string;
  value: string;
  source: "line" | "adjacent line";
};

export type RejectedLineItemCandidate = {
  text: string;
  reason: string;
};

export type ReceiptSourceCategory =
  | "amazon-app-screenshot"
  | "amazon-print-order-details"
  | "amazon-invoice-detail"
  | "ispring-direct-invoice"
  | "lowes-email-order"
  | "home-depot-order"
  | "costco-order"
  | "lazada-order"
  | "generic-merchant-receipt"
  | "unknown-inconclusive";

export type ReceiptSourceClassification = {
  category: ReceiptSourceCategory;
  label: string;
  confidence: number;
  cues: string[];
};

export type ReceiptSourceStructureField = {
  key: string;
  label: string;
  present: boolean;
  count?: number;
  note: string;
};

export type ReceiptSourceStructureSummary = {
  category: ReceiptSourceCategory;
  label: string;
  confidence: number;
  fieldsPresent: number;
  fieldsExpected: number;
  productTableRowCount?: number;
  fields: ReceiptSourceStructureField[];
  notes: string[];
};

export type ExtractedReceiptInfo = {
  merchantName?: string;
  orderNumber?: string;
  orderNumberValid?: boolean;
  purchaseDate?: string;
  total?: string;
  paymentMethod?: string;
  parsingDetails: {
    purchaseDateSource?: string;
    selectedTotalSource?: string;
    paymentSource?: string;
    lineItemCandidates: string[];
    rejectedLineItemCandidates: RejectedLineItemCandidate[];
    amountCandidates: ReceiptAmountCandidate[];
    amountCategories: Partial<Record<ReceiptAmountCategory, string[]>>;
    amountReviewNotes: string[];
    paymentCandidates: ReceiptPaymentCandidate[];
    paymentReviewNotes: string[];
    contextCandidates: ReceiptContextCandidate[];
  };
  source: "amazon" | "merchant-receipt" | "unknown";
  sourceClassification: ReceiptSourceClassification;
  sourceSpecificSummary?: ReceiptSourceStructureSummary;
  missingFields: string[];
  structure: {
    hasMerchantPlatform: boolean;
    hasOrderNumber: boolean;
    hasPurchaseDate: boolean;
    hasTotal: boolean;
    hasPaymentMethod: boolean;
    hasLineItems: boolean;
    hasSubtotal: boolean;
    hasTax: boolean;
    hasShippingIndicator: boolean;
    currencyAmountCount: number;
    amazonOrderFormat: "valid" | "invalid" | "missing" | "not-applicable";
    amazonSignals?: {
      hasOrderPlacedCue: boolean;
      hasItemsOrderedCue: boolean;
      hasOrderSummaryCue: boolean;
      hasOrderTotalCue: boolean;
      hasShipToOrDeliveryCue: boolean;
      hasArrivalOrShipmentCue: boolean;
      hasPaymentCue: boolean;
      hasMultiShipmentCue: boolean;
      hasInvoiceCue: boolean;
      hasSoldByCue: boolean;
      hasBillingCue: boolean;
      hasPromotionCue: boolean;
      orderNumberIssue?: string;
    };
    notes: string[];
  };
  fieldConfidence: Record<string, number>;
  fieldReliability: ReceiptFieldReliability[];
  rawText: string;
  lineCount: number;
};

export type EvidenceMetadata = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  lastModifiedIso: string;
  metadataAvailable: boolean;
  metadataNotes: string[];
  context: {
    status: "Available" | "Limited" | "Unavailable";
    summary: string;
  };
  image?: {
    width: number;
    height: number;
    megapixels: number;
  };
  pdf?: {
    pages: number;
    textExtracted: boolean;
  };
  exif?: Record<string, string | number | boolean>;
};

export type ImageHeuristics = {
  bytesPerPixel?: number;
  qualityLevel: "Clear" | "Usable" | "Limited" | "Poor";
  qualitySummary: string;
  compressionLevel: "Normal" | "Review" | "High review";
  formattingAlignment: "Consistent" | "Needs review" | "Inconclusive";
  evidenceQualityIndicators: string[];
  sourceContextIndicators: string[];
  potentialEditingIndicators: string[];
};

export type ReviewSignal = {
  id: string;
  title: string;
  severity: SignalSeverity;
  confidence: number;
  evidenceSource: string;
  explanation: string;
  recommendation: string;
};

export type FindingStatus = "Clear" | "Inconclusive" | "Review" | "Manual review recommended";

export type FindingGroup = {
  category: "OCR/Text" | "Receipt Structure" | "Metadata" | "Image Quality" | "Recommendation";
  status: FindingStatus;
  summary: string;
  details: {
    label: string;
    value: string;
    status: FindingStatus;
  }[];
  relatedSignalIds: string[];
};

export type ScoreBreakdown = {
  startingScore: number;
  signalPenalty: number;
  ocrPenalty: number;
  fieldBonus: number;
  rawScore: number;
  finalScore: number;
  formula: string;
  interpretation: string;
  riskBands: {
    low: string;
    medium: string;
    high: string;
  };
  ocrPenaltyDetails: {
    averageConfidence: number;
    confidencePenalty: number;
    qualityLabel: OcrQuality["label"];
    qualityPenalty: number;
    lowConfidenceRate: number;
  };
  fieldBonusDetails: {
    maxBonus: number;
    deductionPerMissingField: number;
    missingFieldCount: number;
    creditedFields: string[];
    missingFields: string[];
  };
  signalPenalties: {
    id: string;
    title: string;
    severity: SignalSeverity;
    penalty: number;
  }[];
};

export type ReceiptAnalysisDetails = {
  ocr: OcrExtraction;
  parsedReceipt: ExtractedReceiptInfo;
  sourceClassification: ReceiptSourceClassification;
  sourceStructure?: ReceiptSourceStructureSummary;
  imageQuality: ImageHeuristics;
  receiptScoreBreakdown: ScoreBreakdown;
  proofOfPurchaseMatchNeeded: boolean;
  receiptPrivacySummary: EvidenceMetadataSummary;
};

export type EvidenceModuleDetails =
  | { module: "receipt"; receipt: ReceiptAnalysisDetails }
  | { module: "productPhoto"; productPhoto: ProductPhotoAnalysisDetails }
  | {
      module: "screenshot";
      screenshot: {
        sourceContext: "order-screenshot" | "screenshot-of-photo" | "unknown";
        reviewStatus: EvidenceReviewStatus;
        notes: string[];
      };
    }
  | {
      module: "pdf";
      pdf: {
        pageCount?: number;
        textLayerAvailable: boolean | "unknown";
        reviewStatus: EvidenceReviewStatus;
        notes: string[];
      };
    }
  | {
      module: "unknown";
      unknown: {
        reviewStatus: EvidenceReviewStatus;
        notes: string[];
      };
    };

export type SharedEvidenceFindingStatus =
  | "Clear"
  | "Inconclusive"
  | "Review recommended"
  | "Manual review recommended";

export type SharedEvidenceFindingGroup = {
  category: SharedEvidenceSignalCategory;
  status: SharedEvidenceFindingStatus;
  summary: string;
  details: {
    label: string;
    value: string;
    status: SharedEvidenceFindingStatus;
  }[];
  relatedSignalIds: string[];
};

export type EvidenceAnalysisModule = EvidenceModuleDetails["module"];

export type EvidenceAnalysisResultBase<TModuleDetails extends EvidenceModuleDetails> = {
  module: TModuleDetails["module"];
  evidenceType: SharedEvidenceType;
  evidenceLabel: string;
  sourceKind: EvidenceSourceKind;
  scoreLabel: "Evidence Reliability Score";
  evidenceReliabilityScore: SharedEvidenceReliabilityScore;
  score: number;
  scoreMeaning: ScoreMeaning;
  localSignalLevel: LocalSignalLevel;
  reviewPriority: ReviewPriority;
  confidenceLevel: EvidenceConfidence;
  reviewLabel: EvidenceReviewStatus;
  verificationStatus: SharedExternalVerificationStatus;
  externalVerification: "Not performed";
  signals: SharedEvidenceSignal[];
  findingGroups: SharedEvidenceFindingGroup[];
  evidenceSummary: string;
  recommendedSupportAction: string;
  customerSafeWording: string;
  privacySafeMetadataSummary: EvidenceMetadataSummary;
  moduleDetails: TModuleDetails;
};

export type ReceiptEvidenceAnalysisResult = EvidenceAnalysisResultBase<
  Extract<EvidenceModuleDetails, { module: "receipt" }>
> & {
  module: "receipt";
  evidenceType: "receipt" | "pdf-receipt" | "order-screenshot";
};

export type ProductPhotoEvidenceAnalysisResult = EvidenceAnalysisResultBase<
  Extract<EvidenceModuleDetails, { module: "productPhoto" }>
> & {
  module: "productPhoto";
  evidenceType: "product-photo";
};

export type EvidenceAnalysisResult = ReceiptEvidenceAnalysisResult | ProductPhotoEvidenceAnalysisResult;

export type VerificationStatus = {
  status: "Not externally verified" | "Locally analyzed only" | "External verification unavailable";
  externalVerification: "Not performed";
  method: "Local OCR, structure, and metadata analysis only";
  summary: string;
};

export type ScoreMeaning = {
  highScore: string;
  lowOrMediumScore: string;
  safetyNote: string;
};

export type LocalAnalysisResult = {
  evidenceType: EvidenceType;
  evidenceLabel: string;
  scoreLabel: "Evidence Reliability Score";
  score: number;
  riskLevel: RiskLevel;
  confidenceLevel: AnalysisConfidence;
  reviewLabel: string;
  verificationStatus: VerificationStatus;
  externalVerification: "Not performed";
  internalStructureConfidence: number;
  scoreMeaning: ScoreMeaning;
  ocr: OcrExtraction;
  receipt: ExtractedReceiptInfo;
  metadata: EvidenceMetadata;
  imageHeuristics: ImageHeuristics;
  scoreBreakdown: ScoreBreakdown;
  signals: ReviewSignal[];
  findingGroups: FindingGroup[];
  evidenceSummary: string;
  recommendedSupportAction: string;
  customerSafeWording: string;
};
