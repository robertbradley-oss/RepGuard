# Phase 4.24 Synthetic Fixture Metadata Schema Plan

Date: 2026-06-01

Primary agent role: Privacy and Evidence Safety Agent

Supporting reviews: Product Strategy, Architecture and Maintainability, Receipt Intelligence, Integration Readiness, Scoring and Safety, QA Harness, Deployment and Release

## 1. Purpose And Scope

Phase 4.24 is a synthetic fixture metadata schema planning-only milestone. ClaimGuard needs synthetic fixture metadata schema planning before fixture creation or OpenAI Vision sandbox implementation because future fixture metadata will decide what a fixture is, why it exists, which prompt/schema concepts it may exercise, whether identifiers are blocked, how retention is documented, and whether a fixture can safely appear in downloadable or self-hosted builds.

This milestone is planning-only. No metadata schema/types are implemented. No fixture files or fixture images are added. No validators or probes are implemented except narrow semantic checker coverage for this planning document. This milestone does not add OpenAI SDKs, provider SDKs, environment variables, provider calls, provider implementation, live OCR, real uploads, multipart parsing, binary file parsing, storage, persistence, UI, route behavior changes, runtime schema/types, package artifacts, real evidence processing, production analysis, or live AI/Vision/photo analysis. It does not wire `ClaimReviewWorkflow`, does not route `ProductPhotoReviewPanel`, does not change `analyzeEvidenceFile`, does not change `LocalAnalysisResult`, does not change receipt parser/scoring/report behavior, does not change existing `POST /api/analysis/ocr` behavior, does not change existing `POST /api/analysis/mock-provider` behavior, does not deploy, and does not start Phase 4.25.

This is not live AI. It is not production analysis. It is a metadata-schema planning milestone only, not fixture creation, validation implementation, package creation, provider integration, route wiring, or runtime schema migration.

## 2. Future Metadata Schema Goals

The future metadata schema should support safe developer-only OpenAI Vision-style sandbox fixtures by helping future work:

- Identify fixture category and evidence type.
- Enforce a synthetic-only default.
- Document fixture purpose.
- Map fixtures to prompt families.
- Map fixtures to expected sandbox schema fields.
- Define expected result status.
- Define expected limitations.
- Define expected manual-review drivers.
- Define expected privacy and retention flags.
- Define expected cost/timeout behavior.
- Document approval state.
- Document package-distribution safety.
- Prevent private identifiers, real evidence, unsafe labels, provider payloads, object URLs, storage handles, and public image URLs from entering fixtures.

The metadata schema must not enable:

- Fixture file/image creation in Phase 4.24.
- Real evidence handling.
- Real upload parsing.
- Provider execution.
- Route behavior changes.
- Runtime schema/type migration.
- `LocalAnalysisResult` migration.
- Live receipt scoring.
- Production report generation.
- Customer-facing accusation generation.
- Downloadable package creation in Phase 4.24.

## 3. Future Top-Level Metadata Identity Fields

Future top-level metadata identity fields should include:

| Field | Required later | Purpose | Safety rule |
| --- | --- | --- | --- |
| `fixtureKey` | Yes | Stable fixture identifier used by future metadata and tests. | Stable, non-identifying, and never based on names, emails, order numbers, ticket IDs, tracking numbers, real dates, or URLs. |
| `fixtureVersion` | Yes | Fixture metadata version, separate from image/file version. | Must not contain real event dates. |
| `fixtureTitle` | Yes | Short reviewer-readable synthetic title. | Avoid customer identifiers and proof/fraud wording. |
| `fixtureDescription` | Yes | Synthetic scenario description. | Avoid identifiers, raw OCR, and final-claim language. |
| `fixtureCategory` | Yes | Allowed future synthetic fixture category. | Must use the allowed enum set. |
| `evidenceType` | Yes | Broad evidence type. | Must not imply real customer evidence. |
| `evidenceSubtype` | Yes | Narrow synthetic subtype. | Must describe only synthetic scenario shape. |
| `scenarioSlug` | Yes | Scenario-level key. | Must describe the synthetic scenario only. |
| `scenarioGroup` | Yes | Matrix grouping for future coverage. | Must use allowed scenario group values. |
| `schemaVersionTarget` | Yes | Planned future sandbox schema target. | Planning reference only; no runtime schema implementation. |
| `createdForPhase` | Yes | Phase that introduced or planned the metadata. | Phase label only, not a real event date. |
| `lastReviewedForPhase` | Yes | Last phase that reviewed metadata safety. | Phase label only. |
| `reviewOwner` | Yes | Internal role or reviewer group. | Not a customer name, ticket ID, or external person identifier. |
| `approvalStatus` | Yes | Approval lifecycle state. | Must block use until approved in a later implementation phase. |

Conceptual naming rules:

- `fixtureKey` must be stable and non-identifying.
- `fixtureKey` must not contain customer names, emails, order numbers, ticket IDs, tracking numbers, real dates, or public URLs.
- `scenarioSlug` must describe the synthetic scenario only.
- `fixtureTitle` and `fixtureDescription` must avoid customer identifiers and proof/fraud wording.

## 4. Future Category And Evidence Enum Planning

Allowed future `fixtureCategory` values:

- `synthetic-receipt-image`
- `synthetic-order-screenshot`
- `synthetic-product-photo`
- `synthetic-damaged-product-photo`
- `synthetic-packaging-shipping-context`
- `synthetic-mixed-evidence-set`
- `synthetic-unsupported-evidence`
- `synthetic-low-quality-image`
- `synthetic-cropped-partial-evidence`
- `synthetic-prompt-refusal-edge`
- `synthetic-provider-failure-simulation`
- `synthetic-altered-ai-uncertainty`

Disallowed categories:

- `real-customer-receipt`
- `real-customer-product-photo`
- `real-ticket-attachment`
- `production-upload-object`
- `public-image-url`
- `object-url`
- `storage-object-handle`
- `provider-payload-replay`
- `raw-ocr-dump`
- `unredacted-customer-evidence`

Allowed future `evidenceType` values:

- `receipt-image`
- `order-screenshot`
- `product-photo`
- `damaged-product-photo`
- `packaging-shipping-context`
- `mixed-evidence-set`
- `unsupported-evidence`
- `low-quality-image`
- `cropped-partial-evidence`
- `provider-failure-simulation`

Allowed future `evidenceSubtype` values should be constrained to generic synthetic subtypes such as `clean-layout`, `missing-context`, `low-quality`, `cropped`, `ambiguous-layout`, `visible-damage-context`, `packaging-context`, `unsupported-type`, `prompt-refusal-edge`, `timeout-simulation`, and `altered-ai-uncertainty-context`.

Allowed future `scenarioGroup` values:

- `baseline-synthetic-review`
- `missing-context-review`
- `quality-limitation-review`
- `unsupported-evidence-review`
- `provider-operational-limitation`
- `altered-ai-uncertainty-review`
- `privacy-redaction-gate`
- `package-distribution-safety`

Allowed future `syntheticStatus` values:

- `synthetic-only`
- `synthetic-generated`
- `synthetic-composited`
- `redacted-anonymized-later-approved`
- `blocked-real-evidence`

Allowed future `redactionStatus` values:

- `synthetic-not-applicable`
- `redaction-not-required`
- `redaction-required-before-use`
- `redacted-later-approved`
- `blocked-unredacted`

Allowed future `approvalStatus` values:

- `draft`
- `metadata-reviewed`
- `privacy-reviewed`
- `approved-for-sandbox`
- `approved-for-package-demo`
- `rejected`
- `retired`

Allowed future `expectedResultStatus` values:

- `completed`
- `unsupported`
- `refused`
- `provider-timeout`
- `provider-rate-limited`
- `provider-unavailable`
- `cost-limit-reached`
- `schema-validation-failed`
- `internal-sandbox-error`

Allowed future `packageDistributionStatus` values:

- `distributable-synthetic-demo`
- `internal-sandbox-only`
- `redacted-fixture-needs-approval`
- `non-distributable`
- `blocked-private-or-unsafe`

## 5. Future Prompt/Schema Linkage Fields

Future metadata fields that link fixtures to prompt and schema planning should include:

- `allowedPromptFamilies`
- `blockedPromptFamilies`
- `targetAnalysisModes`
- `expectedSchemaFields`
- `expectedObservationCategories`
- `expectedUncertaintySignalTypes`
- `expectedLimitationTypes`
- `expectedManualReviewDriverPriorities`
- `expectedFailureShape`
- `expectedUnsupportedShape`

Rules:

- Linkage fields must reference planning concepts only.
- Linkage fields must not wire runtime behavior.
- Linkage fields must not imply fixture execution.
- Linkage fields must not create production report expectations.
- Linkage fields should align with Phase 4.20 prompt/output contract planning and Phase 4.21 schema planning.

## 6. Future Expected-Output Metadata Fields

Future metadata fields for expected sandbox output behavior should include:

- `expectedResultStatus`
- `expectedVisualSummaryBehavior`
- `expectedObservationBehavior`
- `expectedUncertaintySignalBehavior`
- `expectedAlteredAiUncertaintyBehavior`
- `expectedConfidenceNoteBehavior`
- `expectedManualReviewDriverBehavior`
- `expectedLimitationBehavior`
- `expectedSafeSupportSummaryBehavior`
- `expectedPrivacyFlagBehavior`
- `expectedRetentionFlagBehavior`
- `expectedCostTimeoutBehavior`
- `disallowedOutputPatterns`

Rules:

- Expected outputs are test expectations only.
- Expected outputs are not truth labels about real evidence.
- Expected outputs must not use proof/fraud/fake/forged confirmation wording.
- Expected outputs must not recommend automatic denial/refund.
- Expected outputs must preserve observation-vs-signal separation.
- Expected outputs must avoid claim disposition, external verification, and customer-facing accusation language.

## 7. Altered/AI-Generated-Image Uncertainty Metadata Fields

Future metadata fields for altered-or-AI-generated-image uncertainty fixtures should include:

- `alteredAiUncertaintyApplicability`
- `expectedAlteredAiUncertaintyBand`
- `expectedAlteredAiUncertaintyRange`
- `expectedAlteredAiUncertaintyRationale`
- `expectedSupportingObservationCategories`
- `expectedManualReviewDriver`
- `alteredAiUncertaintySafetyNotes`

Allowed `expectedAlteredAiUncertaintyBand` values:

- `not-applicable`
- `low-review-concern`
- `medium-review-concern`
- `high-review-concern`
- `insufficient-quality`
- `unsupported-evidence-limitation`

Rules:

- Metadata must use "altered-or-AI-generated-image uncertainty."
- Metadata must say review signal only.
- Metadata must say manual-review driver only.
- Metadata must say not proof.
- Metadata must say not a final decision.
- Expected ranges are test expectations only, not truth labels.
- Low concern must not mean authenticity confirmed.
- High concern must not mean fake, forged, AI-generated, altered, or fraud confirmed.

Future expected ranges, if approved later, should be optional test ranges such as `minInclusive` and `maxInclusive`, never a truth assertion. A not-applicable, insufficient-quality, unsupported, refusal, timeout, rate-limit, cost-limit, schema-validation, or internal-error fixture should not require a numeric uncertainty value.

## 8. Privacy, Identifier, And Redaction Metadata Fields

Future privacy metadata fields should include:

- `syntheticStatus`
- `redactionStatus`
- `identifierPolicy`
- `identifierScanRequired`
- `identifierScanStatus`
- `containsCustomerName`
- `containsEmail`
- `containsPhone`
- `containsAddress`
- `containsOrderNumber`
- `containsTrackingNumber`
- `containsTicketId`
- `containsBarcodeOrQr`
- `containsExifLocation`
- `containsRawOcrText`
- `containsProviderPayload`
- `containsPublicUrl`
- `containsObjectUrl`
- `containsStorageHandle`
- `redactionApprovalReference`
- `privacyReviewStatus`

Rules:

- Synthetic fixtures should default all identifier-containing fields to false.
- Redacted/anonymized fixture metadata may only be used after a separate approved phase.
- Metadata must not reveal removed identifiers.
- Provider payload replay remains disallowed unless separately approved.
- Raw OCR dumps remain disallowed by default.
- Identifier scan status should block future fixture use when unknown, missing, or failed.

## 9. Retention And Ownership Metadata Fields

Future retention and ownership fields should include:

- `retentionPolicy`
- `retentionReviewStatus`
- `deletionRequired`
- `deletionPolicyReference`
- `sourcePolicy`
- `sourceDescription`
- `ownershipPolicy`
- `licenseStatus`
- `reviewOwner`
- `approvedBy`
- `approvalDate`
- `approvalNotes`

Rules:

- Synthetic fixture ownership must be documented.
- Redacted/anonymized fixtures require retention and deletion policy before introduction.
- License status must be known before downloadable package inclusion.
- Approval notes must not contain identifiers.
- `sourceDescription` should describe only the synthetic source method or later approved source class, not real people, orders, tickets, or provider payloads.

## 10. Package/Distribution Metadata Fields

Future package-safety metadata fields should include:

- `packageDistributionStatus`
- `safeForDownloadablePackage`
- `safeForDemoMode`
- `safeForSelfHostedInstall`
- `safeForPublicRepository`
- `requiresProviderAccess`
- `requiresEnvSecrets`
- `requiresStorage`
- `containsNonDistributableContent`
- `distributionNotes`
- `licenseStatus`
- `sampleDataLabel`

Allowed `packageDistributionStatus` values:

- `distributable-synthetic-demo`
- `internal-sandbox-only`
- `redacted-fixture-needs-approval`
- `non-distributable`
- `blocked-private-or-unsafe`

Rules:

- Downloadable/self-hosted packages must not include real evidence, private fixtures, provider payloads, secrets, object URLs, storage handles, unsafe demo data, or live-provider assumptions.
- Safe package fixtures must be synthetic, labeled, privacy-scanned, and license-cleared.
- `.env.example` only may be referenced in future package guidance, with no secrets.
- Provider features should be disabled unless explicitly configured.
- `sampleDataLabel` should clearly say synthetic demo data when package-safe.

## 11. Cost And Timeout Expectation Metadata Fields

Future cost/timeout expectation fields should include:

- `expectedCostBucket`
- `expectedInputSizeBucket`
- `expectedOutputSizeBucket`
- `expectedTimeoutBehavior`
- `expectedRetryPolicy`
- `expectedProviderFailureBehavior`
- `expectedOperationalLimitation`

Rules:

- Cost/timeout expectations are operational only.
- Provider failure expectations must not imply customer risk.
- No automatic retry by default.
- Metadata must not expose provider payloads.
- Cost buckets should be generic values such as `none`, `low`, `medium`, `high`, `unknown`, or `blocked-by-limit`.

## 12. Required Vs Optional Metadata Field Groups

Required future metadata groups should include:

- Top-level identity.
- Fixture category/evidence type.
- Synthetic/redaction status.
- Prompt/schema linkage.
- Expected result status.
- Expected limitation behavior.
- Privacy/identifier policy.
- Retention policy.
- Approval status.
- Package-distribution status.
- Disallowed output patterns.

Optional future metadata groups may include:

- Altered/AI uncertainty expected band when applicable.
- Provider failure expectation fields when applicable.
- Unsupported/failure shape expectations when applicable.
- Redaction approval references only after a separate approved phase.
- Cost/timeout expectations where applicable.

Optional does not mean unreviewed. Optional groups should become required when a fixture category or expected result status depends on them.

## 13. Metadata Validation Expectations

Future metadata validation should ensure:

- Required fields are present.
- Enum values are allowed.
- `fixtureKey` format is valid.
- No private identifiers appear.
- No public URLs, object URLs, or storage handles appear.
- No provider payload dumps appear.
- No raw OCR dumps appear.
- Redacted fixtures are blocked unless separately approved.
- Package distribution status is explicit.
- Unsafe/prohibited wording is absent except in disallowed-output-pattern sections.
- Altered/AI uncertainty labels use uncertainty framing.
- Expected outputs do not include proof/fraud/fake/forged confirmation language.
- Package-safe fixtures meet package distribution requirements.

Future validation should fail closed. If metadata cannot be validated, future fixture use should be blocked rather than treated as incomplete-but-usable.

## 14. Relationship To Existing Routes, Fixture Policy, Validation Plan, And Package Direction

Existing `POST /api/analysis/ocr` remains exact `fixtureKey` only. Phase 4.24 does not modify it.

Existing `POST /api/analysis/mock-provider` remains synthetic/mock-only and adapter-only. Phase 4.24 does not modify it.

Metadata schema planning must not modify either existing route.

The mock provider adapter remains the test boundary before live provider behavior.

Future metadata should align with Phase 4.20 prompt/output contract planning.

Future metadata should align with Phase 4.21 schema planning.

Future metadata should align with Phase 4.22 fixture policy planning.

Future metadata should align with Phase 4.23 validation/probe planning.

Metadata schema planning should support future downloadable-package safety decisions.

`analyzeEvidenceFile` and `LocalAnalysisResult` remain unchanged.

Metadata schema planning should not be wired into live receipt scoring, live receipt reports, `ClaimReviewWorkflow`, `ProductPhotoReviewPanel`, uploads, storage, persistence, provider calls, or production routes without a later approved milestone.

## 15. Future Approval Gates

Required gates before future metadata schema implementation or fixture creation:

- Robert explicitly approves metadata schema implementation.
- Robert separately approves fixture creation.
- Metadata field groups are selected.
- Enum/value sets are confirmed.
- Package-safety requirements are confirmed.
- Fixture storage location is approved.
- Privacy scan approach is approved.
- Redaction process is approved before any anonymized/redacted fixture.
- Retention/deletion policy is approved.
- No SDK/env/provider calls are introduced unless separately approved.
- No real evidence is introduced unless separately approved after privacy/retention milestone.
- No route/runtime wiring is introduced unless separately approved.

Metadata schema implementation and fixture creation should remain separate approval gates. Package creation should remain a third separate gate.

## 16. Phase Gate Recommendation

Before Phase 4.25, all of these must remain true:

- No live OCR.
- No OpenAI SDK.
- No provider SDKs.
- No environment variables.
- No provider calls.
- No upload implementation.
- No storage implementation.
- No persistence.
- No runtime schema/types.
- No validators/probes implemented except narrow semantic checker coverage if needed.
- No fixture files/images added.
- No real evidence.
- No real customer data.
- No anonymized/redacted real fixtures added.
- No provider payloads.
- No customer identifiers.
- No package artifacts.
- No scoring migration.
- No UI changes.
- No live receipt behavior changes.
- No deployment.
- Existing OCR route remains exact `fixtureKey` only.
- Existing mock-provider route remains synthetic/mock-only and adapter-only.

Recommended next safe options after Phase 4.24:

Option A: Phase 4.25 OpenAI Vision sandbox validation/probe implementation plan only, still no implementation.

Option B: Phase 4.25 synthetic fixture metadata schema implementation plan only, still no runtime schema/types and no fixture files/images.

Option C: Phase 4.25 downloadable package safety planning for sandbox/demo data only.

Do not recommend live OpenAI Vision implementation yet unless Robert explicitly asks to start that path.

## Specialist Review Findings

Product Strategy Agent: Metadata schema planning advances Robert's future AI/photo intelligence direction while keeping all outputs framed as uncertainty and manual-review support. The package-safety layer also supports the downloadable/self-hosted direction without creating artifacts.

Architecture and Maintainability Agent: Metadata belongs between fixture policy and future schema/fixture implementation. It should remain separate from `LocalAnalysisResult`, existing route response contracts, receipt scoring, runtime schema/types, UI, upload, and provider boundaries until a later approved implementation slice.

Receipt Intelligence Agent: Receipt behavior remains unchanged. Future synthetic receipt-image metadata may describe sandbox visual review expectations, but it must not replace the existing OCR fixture harness, OCR extraction contract, receipt parser, receipt scoring, or report behavior.

Integration Readiness Agent: Phase 4.24 adds no SDKs, env vars, providers, provider calls, uploads, storage, persistence, route changes, runtime schema/types, or package artifacts. Future metadata should document provider-disabled defaults and operational failure expectations before provider work.

Scoring and Safety Reviewer Agent: Metadata must keep expected outputs away from proof, fraud, fake, forged, denial/refund, or final-decision language. Altered-or-AI-generated-image uncertainty stays review-signal-only and not proof.

Privacy and Evidence Safety Agent: Synthetic-only defaults, identifier flags, redaction gates, retention policy, provider-payload blocks, raw OCR blocks, URL/storage-handle blocks, and package distribution status are required before any future fixture can be considered safe.

QA Harness Agent: Future validation should check required fields, enums, fixture keys, privacy flags, package-distribution status, expected-output safety wording, altered/AI uncertainty wording, route/runtime isolation, and package safety before fixture use or package creation.

Deployment and Release Agent: This milestone is documentation/source-of-truth plus narrow semantic checker coverage only. Commit and push are appropriate only after checks pass, protected runtime files remain untouched, no package artifacts are created, and no deployment occurs.

## Stop Conditions

Stop and do not commit/push if:

- Any metadata schema/types are implemented.
- Any validation/probe implementation is added beyond narrow semantic checker coverage.
- Any fixture files/images are added.
- Any OpenAI SDK or provider SDK is added.
- Any environment variable is added.
- Any provider call is implemented.
- Any real upload path is implemented.
- Any runtime schema/types are added.
- Any package artifact is added.
- Existing OCR route behavior changes.
- Existing mock-provider route behavior changes.
- Multipart/binary files are accepted.
- Storage/persistence is added.
- Real evidence or real identifiers are accepted.
- Anonymized/redacted real fixtures are added.
- Protected runtime files are modified.
- `ClaimReviewWorkflow` is modified.
- `ProductPhotoReviewPanel` is routed.
- `analyzeEvidenceFile` behavior changes.
- `LocalAnalysisResult` changes.
- Receipt behavior changes.
- Required checks fail.
- Scope expands beyond Phase 4.24 synthetic fixture metadata schema planning.

## Closeout Criteria

Phase 4.24 is ready to close when:

- This synthetic fixture metadata schema planning document exists.
- `ROADMAP.md`, `NEXT_STEPS.md`, `REPO_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `AGENT_LOG.md` reflect Phase 4.24 planning-only status.
- Semantic coverage includes metadata schema planning safety wording signals.
- No fixture files/images are added.
- No runtime/source/route/component/package/config/deployment files changed, except narrow semantic-checker coverage.
- No metadata schema/types are implemented.
- No validation/probe implementation is added beyond narrow semantic checker coverage.
- No OpenAI SDK, provider SDK, environment variable, provider call, upload path, storage, persistence, UI wiring, real evidence, live scoring, `ClaimReviewWorkflow` wiring, `ProductPhotoReviewPanel` routing, `LocalAnalysisResult` migration, `analyzeEvidenceFile` changes, OCR route behavior changes, mock-provider route behavior changes, package artifact, or receipt behavior changes were added.
- The next recommended task is validation/probe implementation planning with no implementation, metadata schema implementation planning with no runtime schema/types and no fixture files/images, or downloadable package safety planning for sandbox/demo data only.
