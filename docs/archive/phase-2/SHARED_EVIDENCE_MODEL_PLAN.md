# Shared Evidence Model Plan

This document is a code-facing planning contract for ClaimGuard's shared evidence model and Phase 2 photo metadata privacy rules.

It is planning guidance only. It does not open Phase 2 implementation by itself and does not change runtime behavior.

Phase 1 Receipt Intelligence is closed, pushed, deployed, and production-smoked. Phase 2 should start local-heuristics-only, but provider-ready. No OpenAI Vision, Google Vision, AWS, external OCR, external AI, storage, database, ticket, email, drive, or other real provider connection should be added until Robert separately approves that work.

## Purpose

The readiness review found that the current analyzer shape is still receipt-centered:

- `LocalAnalysisResult` requires receipt details.
- `analyzeEvidenceFile` always runs OCR, parses receipt text, and runs receipt scoring.
- Metadata can currently include raw-ish file and EXIF fields internally.
- The main UI and `/test-evidence` harness read receipt-specific fields directly.

The goal of this plan is to define a shared result contract so receipts remain stable while product photos can become first-class evidence without pretending to be failed receipts.

## Phase 2 Stance

Phase 2 starts local-heuristics-only, but provider-ready.

Allowed early:

- File type category.
- Image dimensions and dimension buckets.
- Approximate file size bucket.
- Compression indicators when available.
- Metadata-safe summaries.
- Image quality and readability.
- Damage visibility/readiness from local heuristics or reviewer-declared fixture labels.
- Full product context completeness.
- Manual-review guidance.

Not allowed early:

- External AI or computer-vision provider calls.
- AI-generated image detection claims.
- Manipulation, tampering, or fake-damage claims.
- Automatic approval, denial, rejection, or claim outcome.
- Evidence storage outside the current local/browser flow.
- Cross-case image matching.
- Customer-facing pass/fail verdicts.
- Persistent image fingerprints.

Provider-ready means a future provider can be added as one signal source, not as the owner of the safety model, score meaning, or final recommendation.

## SharedEvidenceResult Base Contract

Future shared analyzer output should have a stable top-level shape used by receipts, PDFs, screenshots, product photos, and later evidence types.

Proposed TypeScript direction:

```ts
type SharedEvidenceResult = {
  evidenceType: EvidenceType;
  sourceKind: EvidenceSourceKind;
  reviewStatus: EvidenceReviewStatus;
  evidenceReliabilityScore: EvidenceReliabilityScore;
  localSignalLevel: LocalSignalLevel;
  reviewPriority: ReviewPriority;
  confidence: EvidenceConfidence;
  signals: EvidenceSignal[];
  findingGroups: EvidenceFindingGroup[];
  evidenceSummary: string;
  recommendedAction: string;
  customerSafeWording: string;
  externalVerification: ExternalVerificationStatus;
  privacySafeMetadataSummary: EvidenceMetadataSummary;
  moduleSpecificDetails: EvidenceModuleDetails;
};
```

Base field meanings:

- `evidenceType`: broad evidence category, such as receipt, screenshot, pdf, or product-photo.
- `sourceKind`: how the evidence was processed, such as local-browser, local-fixture, future-provider, or manual-review-context.
- `reviewStatus`: support-safe state, such as clear, inconclusive, review recommended, or manual review recommended.
- `evidenceReliabilityScore`: local evidence quality and review-readiness score. It is not proof of truth.
- `localSignalLevel`: local signal strength, not customer risk or wrongdoing.
- `reviewPriority`: support workflow priority, not an automated outcome.
- `confidence`: confidence in the local analysis result, not confidence that the claim is true or false.
- `signals`: review-support signals with safe labels and recommendations.
- `findingGroups`: grouped result sections appropriate to the evidence type.
- `evidenceSummary`: concise internal summary for support review.
- `recommendedAction`: next support action, usually manual review, proof matching, or additional evidence request.
- `customerSafeWording`: neutral customer-facing wording.
- `externalVerification`: default is `Not performed`.
- `privacySafeMetadataSummary`: safe metadata summary only.
- `moduleSpecificDetails`: receipt, product-photo, screenshot, or PDF detail block.

Suggested supporting types:

```ts
type EvidenceType =
  | "receipt"
  | "order-screenshot"
  | "pdf-receipt"
  | "product-photo"
  | "mixed-evidence"
  | "unknown-evidence";

type EvidenceSourceKind =
  | "local-browser-analysis"
  | "synthetic-fixture"
  | "manual-review-context"
  | "future-provider-signal";

type EvidenceReviewStatus =
  | "Clear"
  | "Inconclusive"
  | "Review recommended"
  | "Manual review recommended";

type LocalSignalLevel = "None" | "Low" | "Medium" | "High";
type ReviewPriority = "Standard" | "Review" | "Manual review" | "Senior review";
type EvidenceConfidence = "High confidence" | "Medium confidence" | "Low confidence";

type ExternalVerificationStatus = {
  status: "Not externally verified" | "Locally analyzed only" | "External verification unavailable";
  externalVerification: "Not performed";
  method: "Local evidence analysis only" | "Future approved provider";
  summary: string;
};

type EvidenceReliabilityScore = {
  label: "Evidence Reliability Score";
  value: number;
  meaning: string;
  scoreScope: "Local evidence quality and review readiness only";
};
```

Rules:

- High score does not prove evidence is real.
- Low score does not prove evidence is false.
- Review priority is not claim disposition.
- External verification remains `Not performed` unless an approved integration performs it.
- Top-level shared fields must not require receipt-specific details.

## Evidence Signals

Signals should be broad enough for receipts and photos while remaining module-aware.

```ts
type EvidenceSignal = {
  id: string;
  title: string;
  category: EvidenceSignalCategory;
  severity: "Low" | "Medium" | "High";
  confidence: number;
  evidenceSource: string;
  explanation: string;
  recommendation: string;
};

type EvidenceSignalCategory =
  | "Evidence Quality"
  | "Receipt Structure"
  | "Photo Context"
  | "Image Quality"
  | "Image Consistency"
  | "Metadata Context"
  | "Purchase Match"
  | "Recommendation";
```

Signal rules:

- Use signal language, not verdict language.
- Separate quality limits from image consistency.
- Treat metadata as context only.
- Require manual-review wording for uncertain signals.
- Do not expose internal score details to customers by default.

## Module-Specific Details

The shared contract should use a discriminated details block so photo evidence does not need fake receipt fields.

```ts
type EvidenceModuleDetails =
  | { module: "receipt"; receipt: ReceiptAnalysisDetails }
  | { module: "productPhoto"; productPhoto: ProductPhotoAnalysisDetails }
  | { module: "screenshot"; screenshot: ScreenshotAnalysisDetails }
  | { module: "pdf"; pdf: PdfAnalysisDetails }
  | { module: "unknown"; unknown: UnknownEvidenceDetails };
```

Phase 2 implementation should start with receipt and product-photo contracts. Screenshot and PDF can remain thin wrappers around existing behavior until their own readiness work exists.

## ReceiptAnalysisDetails

Receipt intelligence remains a first-class module and should preserve Phase 1 behavior.

Receipt-specific details include:

- Parsed receipt fields.
- OCR text/readability and OCR quality summaries.
- Merchant/source classification.
- Amazon, iSpring, Lowe's, Home Depot, Costco, Lazada, generic merchant, and unknown receipt lanes.
- Order-number extraction and validation.
- Purchase date extraction.
- Total, subtotal, tax, shipping, discount, refund, and payment parsing.
- Line item and product-detail parsing from OCR text.
- Receipt structure confidence.
- Receipt-specific source summaries.
- Receipt-specific scoring breakdown.
- Receipt-specific fixture expectations and tuning notes.

Proposed TypeScript direction:

```ts
type ReceiptAnalysisDetails = {
  ocr: ReceiptOcrSummary;
  parsedFields: ReceiptParsedFieldSummary;
  sourceClassification: ReceiptSourceClassificationSummary;
  receiptStructure: ReceiptStructureSummary;
  receiptScoreBreakdown: ReceiptScoreBreakdown;
  proofOfPurchaseMatchNeeded: boolean;
  receiptPrivacySummary: ReceiptPrivacySummary;
};
```

Receipt rules:

- Existing parser behavior must stay stable during shared-model migration.
- Receipt scoring can continue to credit merchant, order number, purchase date, line item, total, and payment method.
- Missing receipt fields should produce proof-of-purchase/manual-review guidance, not accusation.
- Receipt exports should remain presence/count/status oriented by default.
- Raw OCR, raw parsed private values, order IDs, payment details, names, addresses, phones, emails, and tracking numbers must stay out of default copied summaries.

## ProductPhotoAnalysisDetails

Product photos should be first-class evidence with their own review-readiness model.

Canonical Phase 2 naming:

- Canonical evidence type: `product-photo`.
- `damage-photo` is a compatibility alias only. If older inputs or fixtures need it, map `damage-photo` to `product-photo` with `subjectType: "damage-close-up"`.
- Product-photo subtypes/categories should use `damage-close-up`, `full-product-context`, `serial-model-label`, `packaging-damage`, and `installation-context`.

Photo-specific details include:

- Damage visibility.
- Full product context.
- Product, model, serial, or label context if visible.
- Image quality/readability.
- Image consistency signals.
- Metadata context.
- Review completeness.
- Whether purchase/receipt match is still needed.
- Manual review recommendation.

Proposed TypeScript direction:

```ts
type ProductPhotoAnalysisDetails = {
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
```

Suggested values:

```ts
type ProductPhotoSubjectType =
  | "damage-close-up"
  | "full-product-context"
  | "serial-model-label"
  | "packaging-damage"
  | "installation-context"
  | "mixed-evidence-image"
  | "inconclusive-photo";

type DamageVisibilityStatus =
  | "clearly-visible"
  | "partially-visible"
  | "claimed-but-not-visible"
  | "damage-area-visible-context-missing"
  | "product-visible-damage-area-missing"
  | "inconclusive";

type ProductContextStatus =
  | "complete"
  | "partial"
  | "missing"
  | "not-applicable"
  | "inconclusive";

type RequestedPhotoView =
  | "wider-product-photo"
  | "clearer-damage-close-up"
  | "serial-or-model-label"
  | "packaging-context"
  | "installation-context"
  | "proof-of-purchase-match";
```

Photo rules:

- Product photos must not be penalized for missing receipt fields.
- Damage visibility is review readiness, not proof that damage is real or false.
- Full product context is important because close-ups can be incomplete.
- Serial/model context should not expose raw serial/model values by default.
- Packaging and installation context stay secondary until the close-up/context path is stable.
- Photo outputs should guide the next useful support step.

## EvidenceMetadataSummary Privacy Contract

`EvidenceMetadataSummary` is the only metadata shape that should be displayed, copied, exported, committed in fixtures, or passed to future providers by default.

Proposed TypeScript direction:

```ts
type EvidenceMetadataSummary = {
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
```

Allowed by default:

- File type category.
- Approximate file size bucket.
- Image dimensions when useful.
- Metadata present/absent/limited summary.
- Capture timestamp present/absent/unknown only, not exact timestamp.
- GPS present/stripped/unknown only, not coordinates.
- Editing/software signal category only when safe and non-accusatory.
- Safe short notes.

Forbidden by default:

- Raw EXIF.
- GPS coordinates.
- Original filename.
- Exact capture timestamp.
- Device owner fields.
- Full device serial/model identifiers.
- Local file path.
- Raw metadata JSON.
- Customer-identifying strings.
- Serial/model label values.
- Barcode or QR contents.
- Faces, names, addresses, emails, phone numbers, account IDs, or private background details.

Metadata rules:

- Missing EXIF is not suspicious by itself.
- Stripped metadata is not proof of editing.
- Metadata is context only and must not determine claim outcome.
- GPS presence may be noted only as a privacy-review fact.
- Raw GPS coordinates require a separate privacy, retention, and legal decision.
- Future provider requests should receive the privacy-safe summary by default, not raw metadata.

## Local-Heuristics-Only Phase 2 Boundary

Early local photo signals can include:

- File type category.
- Image dimensions and dimension bucket.
- File size bucket.
- Compression indicators when available.
- Metadata-safe categories.
- Image readability and quality.
- Whether the available image appears suitable for manual damage review.
- Whether a wider product context photo is needed.
- Whether proof-of-purchase matching remains needed.
- Manual-review support recommendations.

Early local photo signals must not include:

- AI-generated detection claims.
- Manipulation claims.
- Tampering claims.
- Fake-damage claims.
- External authenticity claims.
- Automatic escalation based only on metadata.
- Automated claim outcome.
- Customer-facing verdicts.

Approved local wording:

- "Photo quality limits review."
- "Product context is incomplete."
- "Damage area needs clearer view."
- "Wider product photo recommended."
- "Image consistency needs manual review."
- "Metadata context is limited."
- "Findings are inconclusive from current photo."
- "Purchase match still required."
- "External verification was not performed."

Forbidden wording:

- "The customer altered the photo."
- "The image proves the damage is real."
- "The image proves the damage is not real."
- "The claim should be rejected."
- "The customer submitted misleading evidence."
- "The evidence is definitively valid or invalid."
- "AI detected manipulation."
- "The photo is externally verified."
- "The customer caused the damage."
- "The claim is approved or rejected based on photo analysis."

## Provider-Ready Future Seam

Future providers should plug into ClaimGuard as evidence-signal providers, not as the product's decision engine.

Proposed seam:

```ts
type EvidenceSignalProvider = {
  id: string;
  label: string;
  sourceKind: "future-provider-signal";
  supportedEvidenceTypes: EvidenceType[];
  analyze(input: ProviderSafeEvidenceInput): Promise<ProviderEvidenceSignalResult>;
};

type ProviderSafeEvidenceInput = {
  evidenceType: EvidenceType;
  privacySafeMetadataSummary: EvidenceMetadataSummary;
  localSignals: EvidenceSignal[];
  redactedImageContext?: RedactedImageContext;
};

type ProviderEvidenceSignalResult = {
  providerId: string;
  signals: EvidenceSignal[];
  confidence: EvidenceConfidence;
  limitations: string[];
  providerOutputStored: false;
};
```

Provider rules:

- No provider is connected in early Phase 2.
- Provider output should become one signal source.
- Provider output must not replace ClaimGuard's safety language.
- Provider output must not produce customer-facing verdicts by default.
- Provider requests require privacy review before any real evidence leaves the browser/local workflow.
- Provider responses should be summarized into safe signals and limitations, not copied raw by default.
- Provider-specific costs, latency, fallbacks, retention, and audit behavior belong to a later approved integration phase.

## First No-Behavior-Change Implementation Boundary

Recommended first Phase 2 implementation task after this doc is approved:

Add shared evidence model TypeScript types only.

Hard boundary:

- No runtime behavior change.
- No upload behavior change.
- No report semantics change.
- No analyzer pipeline change.
- No receipt parser change.
- No scoring change.
- No fixture change.
- No UI behavior change.
- No provider connection.
- Receipts should behave exactly the same.

The first task should be easy to audit: new or renamed types only, with existing `LocalAnalysisResult` still supported until a later migration slice wraps receipt behavior.

## Migration Sequence

Safest implementation order:

1. Add shared evidence model TypeScript types only.
2. Add `EvidenceMetadataSummary` types only.
3. Add product-photo detail types only.
4. Adapt receipt result to a shared wrapper without behavior change.
5. Add a privacy-safe metadata summary helper while preserving current receipt behavior.
6. Update report/export adapters to read shared base fields where safe.
7. Add product-photo fixture scaffolding with synthetic-only assets and advisory expectations.
8. Add product-photo QA harness lane separate from Real Receipt QA.
9. Add local photo heuristics for dimensions, file type, safe metadata categories, quality/readability, context completeness, and manual-review guidance.
10. Add provider interface stubs only after local workflow is stable and Robert approves provider-readiness work.
11. Consider real provider integration only in a future approved integration phase.

Migration audit rules:

- Each step should be small enough to review independently.
- Receipt behavior should be checked before and after each step that touches shared analyzer or report paths.
- Product-photo fields should never require receipt field fallbacks.
- Metadata privacy should be reviewed before any photo export or fixture summary ships.

## QA And Fixture Plan

Phase 2 fixtures should be synthetic or anonymized-safe only.

Initial fixture categories:

- Clear damage close-up with visible damage area.
- Damage close-up with missing full-product context.
- Damage close-up with poor image quality.
- Full product context companion photo for a damage close-up.
- Full product context photo with no visible damage from current image.
- Blurry or low-resolution damage close-up.
- Overexposed or glare-heavy photo.
- Tight crop showing damage but not product identity.

Later fixture categories:

- Serial/model label photo.
- Packaging damage photo.
- Installation/context photo.
- Screenshot of a product photo.
- Multi-photo scenario after the single-photo model is stable.

Fixture rules:

- Do not add fixtures until Robert opens the relevant implementation task.
- Do not use real customer photos in committed fixtures.
- Do not commit screenshots containing private backgrounds, labels, serials, QR codes, barcodes, faces, addresses, or account identifiers.
- Photo fixture expectations should be advisory at first, not CI-blocking.
- Keep receipt fixture behavior stable.

## Required Checks

Docs-only tasks:

- `git status --short --branch` before and after.
- `git diff --check`.
- `npm.cmd run check:report-semantics` when safety wording or report semantics are discussed.

Type-only tasks:

- `git status --short --branch` before and after.
- `npm.cmd run lint`.
- `npm.cmd run build`.
- `npm.cmd run check:report-semantics`.
- `git diff --check`.

Analyzer, scoring, report, privacy, or metadata helper tasks:

- `git status --short --branch` before and after.
- `npm.cmd run lint`.
- `npm.cmd run build`.
- `npm.cmd run check:report-semantics`.
- Targeted synthetic receipt fixture/manual QA.
- Photo fixture/manual QA once photo fixtures exist.
- Privacy review of copied/exported payload shapes.

UI tasks:

- `git status --short --branch` before and after.
- `npm.cmd run lint`.
- `npm.cmd run build`.
- `npm.cmd run check:report-semantics` if wording changes.
- Manual browser check of affected routes when practical.
- Main analyzer upload checks if upload layout, evidence viewer, or reset behavior changes.

QA harness tasks:

- `npm.cmd run lint`.
- `npm.cmd run build`.
- `npm.cmd run check:report-semantics`.
- Run existing synthetic receipt fixture workflow manually when relevant.
- Keep new photo expectations advisory until enough evidence exists.

Release tasks:

- Robert must explicitly approve commit, push, deploy, or production smoke.
- Confirm branch, changed files, and exact commit target.
- Run checks for the changed area.
- Do not stage private evidence, `.env*`, `.vercel/`, `.next/`, `node_modules/`, raw OCR, private JSON exports, private screenshots, or credentials.

## Stop Conditions

Stop and report if any of the following happen:

- Work is happening outside `C:\Users\robby\Projects\ClaimGuard`.
- The worktree has unexpected mixed changes.
- App code changes appear during a docs-only task.
- Analyzer, parser, scoring, report, privacy, fixture, package, script, upload, or UI changes appear outside the approved scope.
- Receipt behavior changes during a type-only or docs-only task.
- Upload/input/reset behavior changes without explicit approval.
- Real customer evidence, raw OCR, private metadata, raw EXIF, GPS coordinates, private JSON, screenshots with private details, or credentials appear.
- Unsafe wording appears, including customer accusation, proof of wrongdoing, automatic denial, or definitive photo authenticity language.
- Phase 2 implementation begins before Robert explicitly opens it.
- A required check fails or cannot be interpreted safely.

## Open Decisions Before Photo Runtime Work

Robert has decided Phase 2 starts local-heuristics-only, but provider-ready.

Robert has also decided that the canonical Phase 2 evidence type is `product-photo`. `damage-photo` should remain only as a compatibility alias or subtype mapping to `product-photo` with `subjectType: "damage-close-up"` when needed.

Remaining decisions before runtime behavior changes:

- Whether early damage visibility is reviewer-declared, local-heuristic-derived, or both.
- Whether product-photo score should reuse `Evidence Reliability Score` display or add a sub-label such as review readiness.
- Whether metadata dimensions should expose exact width/height in UI or only buckets outside developer tools.
- Which first synthetic photo fixtures Robert approves.

## Final Recommendation

After Robert reviews this document, the safest first implementation task is:

Add shared evidence model TypeScript types only, with no runtime behavior change.

That task should preserve all Phase 1 receipt behavior exactly, keep upload/input/reset untouched, keep report semantics unchanged, and create the structure needed for local-only product-photo evidence work.
