# Phase 4.27 Synthetic Fixture Metadata

Date: 2026-06-01

Primary agent role: Privacy and Evidence Safety Agent

Supporting reviews: Product Strategy, Architecture and Maintainability, Receipt Intelligence, Integration Readiness, Scoring and Safety, QA Harness, Deployment and Release

## 1. Purpose And Scope

Phase 4.27 implements synthetic OpenAI Vision sandbox fixture metadata only. It adds a package-safe metadata registry for future synthetic fixtures without adding image files, evidence files, screenshots, PDFs, real receipts, product photos, provider payloads, raw OCR dumps, public URLs, object URLs, storage handles, runtime schema/types, route behavior, UI wiring, uploads, storage, persistence, package artifacts, deployment, provider SDKs, provider calls, environment variables, live AI/Vision/photo analysis, or real/anonymized customer evidence.

The metadata is source-of-truth test planning data only. It is not imported by runtime code. It is not wired into `POST /api/analysis/ocr`, `POST /api/analysis/mock-provider`, `analyzeEvidenceFile`, `LocalAnalysisResult`, receipt parser/scoring/report behavior, `ClaimReviewWorkflow`, or `ProductPhotoReviewPanel`.

## 2. Implemented Metadata Registry

Added:

- `fixtures/vision-sandbox/metadata/synthetic-fixture-registry.json`

The registry includes package-safe synthetic metadata entries for:

- Clean synthetic receipt.
- Suspicious-layout synthetic receipt.
- Partial/cropped synthetic receipt.
- Synthetic order screenshot with missing context.
- Synthetic product photo normal context.
- Synthetic damaged product ambiguous context.
- Altered-or-AI-generated-image uncertainty low review concern.
- Altered-or-AI-generated-image uncertainty medium review concern.
- Altered-or-AI-generated-image uncertainty high review concern.
- Unsupported synthetic evidence.
- Provider timeout simulation.
- Schema-validation-failure simulation.

## 3. Required Metadata Fields

Each metadata entry includes:

- `fixtureKey`
- `fixtureVersion`
- `fixtureTitle`
- `fixtureDescription`
- `fixtureCategory`
- `evidenceType`
- `evidenceSubtype`
- `scenarioSlug`
- `scenarioGroup`
- `schemaVersionTarget`
- `syntheticStatus`
- `redactionStatus`
- `approvalStatus`
- `packageDistributionStatus`
- `safeForDownloadablePackage`
- `safeForDemoMode`
- `safeForSelfHostedInstall`
- `allowedPromptFamilies`
- `targetAnalysisModes`
- `expectedResultStatus`
- `expectedObservationCategories`
- `expectedUncertaintySignalTypes`
- `expectedLimitationTypes`
- `expectedManualReviewDriverPriorities`
- `expectedPrivacyFlags`
- `expectedRetentionFlags`
- `expectedCostTimeoutBehavior`
- `disallowedOutputPatterns`
- `reviewOwner`
- `createdForPhase`
- `lastReviewedForPhase`

## 4. Safety And Package Posture

The Phase 4.27 metadata uses:

- `syntheticStatus: synthetic-only`
- `redactionStatus: synthetic-not-applicable`
- `approvalStatus: metadata-reviewed`
- `packageDistributionStatus: distributable-synthetic-demo`
- `safeForDownloadablePackage: true`
- `safeForDemoMode: true`
- `safeForSelfHostedInstall: true`

The metadata contains no real evidence, no anonymized/redacted customer evidence, no private identifiers, no provider payloads, no raw OCR dumps, no public image URLs, no object URLs, no data URLs, no file URLs, no storage handles, no EXIF/location metadata, no screenshots of real accounts, and no external copyrighted/customer images.

## 5. Altered/AI Uncertainty Framing

Altered-or-AI-generated-image uncertainty metadata remains a review signal only, not proof, not a final decision, not a fraud score, not an accusation, and not an automatic support outcome.

Low review concern does not confirm authenticity. Medium and high review concern do not confirm alteration, AI generation, deception, or a claim outcome. All altered/AI entries remain synthetic test expectations for manual-review driver behavior.

## 6. Validation Coverage

Phase 4.27 metadata is checked by:

- `npm.cmd run check:vision-sandbox-boundaries`
- `npm.cmd run check:report-semantics`
- Existing lint/build/probe/diff gates.

The boundary checker confirms required metadata safety fields exist and blocks provider payloads, raw OCR, private identifiers, public URLs, object URLs, data URLs, file URLs, storage handles, unsafe outcome wording, protected runtime diffs, provider SDK/env/call additions, and package artifacts.

## 7. Specialist Review Findings

Product Strategy Agent: The metadata matrix supports Robert's future photo intelligence direction while preserving uncertainty and manual-review framing.

Architecture and Maintainability Agent: Metadata remains plain JSON under a sandbox fixture directory and is not imported by runtime code.

Receipt Intelligence Agent: Receipt behavior remains unchanged; receipt-like metadata does not replace the OCR fixture harness or receipt parser/scoring/report behavior.

Integration Readiness Agent: No SDKs, env vars, provider calls, provider payloads, uploads, storage, route changes, or persistence were added.

Scoring and Safety Reviewer Agent: Expected outputs remain review-support expectations and avoid proof, accusation, and automatic disposition language.

Privacy and Evidence Safety Agent: Metadata is synthetic-only, non-identifying, package-safe, and free of real/anonymized customer evidence.

QA Harness Agent: The metadata covers baseline, quality limitation, missing context, altered/AI uncertainty, unsupported, timeout, and schema-validation-failure scenarios.

Deployment and Release Agent: No package artifact or deployment was created. Package distribution status is explicit for each entry.

## 8. Phase Gate Recommendation

Recommended Phase 4.28 task:

Plan synthetic fixture file/image creation only. Do not create fixture files/images until Phase 4.29. Continue to block SDKs, env vars, provider calls, runtime schema/types, route changes, uploads, storage, persistence, UI, real evidence, anonymized/redacted customer evidence, package artifacts, receipt behavior changes, `analyzeEvidenceFile` changes, and `LocalAnalysisResult` changes.
