# Phase 4.22 OpenAI Vision Sandbox Fixture Policy Plan

Date: 2026-06-01

Primary agent role: Privacy and Evidence Safety Agent

Supporting reviews: Product Strategy, Architecture and Maintainability, Receipt Intelligence, Integration Readiness, Scoring and Safety, QA Harness, Deployment and Release

## 1. Purpose And Scope

Phase 4.22 is an OpenAI Vision sandbox fixture-policy planning-only milestone. ClaimGuard needs a fixture policy before any OpenAI Vision-style sandbox implementation because future visual sandbox tests must know which fixture inputs are allowed, which are forbidden, how fixture metadata is reviewed, how redacted/anonymized fixture approval works, and how altered-or-AI-generated-image uncertainty remains a review signal instead of a proof claim.

This milestone is planning-only. No fixtures are added yet. It does not add OpenAI SDKs, provider SDKs, environment variables, provider calls, provider implementation, live OCR, real uploads, multipart parsing, binary file parsing, storage, persistence, UI, route behavior changes, runtime schema/types, real evidence processing, production analysis, or live AI/photo analysis. It does not wire `ClaimReviewWorkflow`, does not route `ProductPhotoReviewPanel`, does not change `analyzeEvidenceFile`, does not change `LocalAnalysisResult`, does not change receipt parser/scoring/report behavior, does not change existing `POST /api/analysis/ocr` behavior, does not change existing `POST /api/analysis/mock-provider` behavior, does not deploy, and does not start Phase 4.23.

This is not live AI. It is not production analysis. It is a fixture-policy milestone only, not a fixture-creation milestone and not a provider-integration milestone.

## 2. Future Fixture-Policy Goals

The future fixture policy should support developer-only OpenAI Vision-style sandbox testing for:

- Synthetic receipt visual review.
- Synthetic order screenshot review.
- Synthetic product photo review.
- Synthetic damaged-product review.
- Synthetic altered-or-AI-generated-image uncertainty review.
- Mixed synthetic evidence review.
- Unsupported or ambiguous evidence handling.
- Provider failure and timeout limitation handling.
- Prompt, output, and schema validation.
- Privacy and retention guard behavior.
- Manual-review driver generation.

The future fixture policy must not support:

- Real customer receipt processing.
- Real customer product photo processing.
- Real ticket attachment processing.
- Public image URL ingestion.
- Storage handle processing.
- Production upload object processing.
- Raw provider payload replay.
- Raw unredacted OCR retention.
- Final claim decisions.
- Live receipt scoring.
- Customer-facing accusation generation.

## 3. Future Allowed Synthetic Fixture Categories

Future synthetic fixture categories are allowed only after a separate approved fixture-creation milestone. Phase 4.22 defines policy only.

| Category | Purpose | Intended future prompt family | Intended future schema fields exercised | Privacy status | Disallowed contents | Manual-review relevance | Expected limitation behavior | Expected safety wording behavior |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Synthetic receipt image fixtures | Exercise visual receipt layout and quality review without live OCR. | Synthetic receipt visual review. | `evidenceType`, `visualSummary`, `layoutObservations`, `qualityObservations`, `limitations`, `manualReviewDrivers`. | Synthetic only. | Customer names, emails, phone numbers, addresses, order numbers, raw OCR dumps, public URLs, provider payloads. | Helps reviewers see whether a receipt-like image needs clearer proof-of-purchase review. | Must include sandbox-only and no-external-verification limits. | Review-support language only; no proof of purchase or authenticity claim. |
| Synthetic order screenshot fixtures | Exercise screenshot layout, missing context, and order-screen ambiguity. | Synthetic order screenshot review. | `documentOrPhotoContext`, `screenshot-context` observations, `unsupportedEvidenceReason`, `limitations`. | Synthetic only. | Real Amazon/customer account pages, real order numbers, tracking numbers, emails, addresses, barcodes, QR codes. | Helps reviewers decide whether screenshot context is enough to request approved evidence. | Missing context and screenshot incompleteness are limitations. | Must not say an order is verified or invalid. |
| Synthetic product photo fixtures | Exercise product-photo context without real customer photos. | Synthetic product photo review. | `product-context` observations, `confidenceNotes`, `manualReviewDrivers`, `privacyFlags`. | Synthetic only. | Faces, homes, addresses, labels, serials, barcodes, QR values, original filenames, metadata. | Helps reviewers understand whether product context is visible enough for manual review. | Must call out that visible context cannot establish ownership, timing, or claim outcome. | Must avoid accusation or automatic disposition language. |
| Synthetic damaged-product photo fixtures | Exercise visible damage-context review. | Synthetic damaged-product review. | `damage-context` observations, `manualReviewDrivers`, `limitations`, `safeSupportSummary`. | Synthetic only. | Real customer submitted photos, private backgrounds, addresses, labels, serials, metadata. | Helps reviewers identify visible issue context and what is still unknown. | Must state image cannot establish cause, timing, custody, or policy outcome. | Must say visible issue may warrant review, not that a claim is valid or invalid. |
| Synthetic packaging/shipping-context image fixtures | Exercise package, label-like, and shipping-context ambiguity. | Product photo or mixed evidence review. | `visibleContextSummary`, `product-context`, `missing-context`, `privacyFlags`. | Synthetic only. | Real tracking labels, recipient names, addresses, tracking numbers, carrier account details. | Helps reviewers request safer supporting evidence when shipping context matters. | Tracking/order verification remains unavailable. | Must not verify shipment or customer identity. |
| Synthetic mixed-evidence fixture sets | Exercise relationships across multiple synthetic evidence objects. | Mixed synthetic evidence review. | `evidenceClassification`, `observations`, `uncertaintySignals`, `manualReviewDrivers`, `limitations`. | Synthetic only. | Real case bundles, ticket IDs, customer identifiers, real attachments. | Helps reviewers see whether evidence types create review questions without scoring a claim. | Must preserve per-evidence limitations and sandbox-only scope. | Must not produce final claim decision or single risk score. |
| Synthetic unsupported-evidence fixtures | Exercise unsupported categories and refusal paths. | Unsupported or ambiguous evidence handling. | `resultStatus: unsupported`, `unsupportedEvidenceReason`, `limitations`, `safeSupportSummary`. | Synthetic only. | Real unsupported uploads, real customer files, executable payloads, private documents. | Helps reviewers request eligible evidence safely. | Unsupported means evidence limitation only. | Must not imply suspicious behavior. |
| Synthetic low-quality/compressed image fixtures | Exercise quality limitations and uncertainty applicability. | Receipt, product photo, damaged-product, or altered-or-AI-generated-image uncertainty review. | `qualityObservations`, `confidenceNotes`, `alteredOrAiGeneratedImageUncertainty.applicability`, `limitations`. | Synthetic only. | Real compressed customer files, real EXIF/location metadata. | Helps reviewers know when image quality blocks reliable review. | Low quality should reduce confidence and may block 1-100 value applicability. | Must say insufficient quality, not customer wrongdoing. |
| Synthetic cropped/partial evidence fixtures | Exercise missing-context limitations. | Receipt, order screenshot, product photo, or mixed evidence review. | `contentBoundaries`, `missing-context`, `manualReviewDrivers`. | Synthetic only. | Real partial receipts/orders, identifiers, private backgrounds. | Helps reviewers decide whether to request fuller eligible evidence. | Cropping is a limitation and may make analysis incomplete. | Must not treat missing context as proof of alteration. |
| Synthetic prompt-refusal edge fixtures | Exercise refusal-safe output paths. | Prompt refusal and unsupported evidence handling. | `resultStatus: refused`, `limitations`, `provider-output-limitation`, `privacyFlags`. | Synthetic only. | Real sensitive content, private identifiers, provider raw refusal text. | Helps reviewers know the sandbox output is unavailable. | Refusal is an output limitation only. | Must not infer risk from refusal. |
| Synthetic provider-failure simulation fixtures | Exercise operational failure outputs. | Provider failure or timeout limitation handling. | `providerFailureReason`, `timeoutMetadata`, `costMetadata`, `limitations`, `retentionFlags`. | Synthetic only. | Raw provider payloads, provider request IDs, stack traces, URLs, dashboard links. | Helps reviewers separate operational limits from evidence review. | Failure, timeout, rate limit, and cost limit are operational only. | Must not imply customer risk. |
| Synthetic altered-or-AI-generated-image uncertainty fixtures | Exercise the future 1-100 uncertainty field safely. | Synthetic altered-or-AI-generated-image uncertainty review. | `alteredOrAiGeneratedImageUncertainty`, `uncertaintySignals`, `confidenceNotes`, `manualReviewDrivers`, `limitations`. | Synthetic only. | Real customer photos, labels that assert truth about real evidence, EXIF/location data. | Helps reviewers prioritize review when synthetic indicators are present. | Not-applicable, insufficient-quality, and unsupported states must omit or null the value. | Must say review signal only, not proof, not final decision, and not automatic denial/refund. |

## 4. Future Redacted/Anonymized Fixture Approval Policy

This milestone does not add redacted/anonymized fixtures. Synthetic fixtures are preferred by default.

Redacted/anonymized real-world-style fixtures may be introduced only after a separate approved phase with all of these gates:

- Explicit Robert approval.
- Documented source.
- Documented redaction process.
- Removal of customer names.
- Removal of emails.
- Removal of phone numbers.
- Removal of addresses.
- Removal of order numbers.
- Removal of tracking numbers.
- Removal of ticket IDs.
- Removal of barcodes/QR codes if they can encode identifiers.
- Removal of EXIF/location metadata.
- Removal of raw unredacted OCR text.
- Retention/deletion policy.
- Fixture ownership policy.
- Legal/privacy review checkpoint.
- QA private-identifier scan.
- No provider payload replay unless separately approved.

Redacted/anonymized metadata may document that redaction occurred, but it must not reveal removed identifiers or retain raw unredacted OCR.

## 5. Disallowed Fixture Categories

The future fixture policy must reject or avoid:

- Real customer receipts.
- Real customer product photos.
- Real support ticket attachments.
- Real emails.
- Real customer names.
- Customer emails.
- Customer phone numbers.
- Customer addresses.
- Real order numbers.
- Real tracking numbers.
- Real ticket IDs.
- Public image URLs.
- Object URLs.
- Storage object handles.
- Provider payload dumps.
- Raw OCR dumps containing identifiers.
- Screenshots of real customer accounts.
- Screenshots of real Amazon/customer order pages.
- Receipts from actual customers.
- Product photos submitted by actual customers.
- Unredacted EXIF/location metadata.
- Any fixture that can identify a real person, customer, address, ticket, order, or shipment.

## 6. Fixture Naming And Organization Policy

Future fixture naming should be planned before files are created. No fixture directories or fixture files are added in Phase 4.22.

Conceptual naming pattern:

```text
vision-sandbox__synthetic__product-photo__low-quality-damage-context__v1__completed
```

Future fixture names should include:

- Fixture category.
- Evidence type.
- Synthetic/redacted status.
- Scenario slug.
- Version.
- Expected result status.

Naming rules:

- No customer names.
- No order numbers.
- No ticket IDs.
- No tracking numbers.
- No real merchant identifiers unless generic/synthetic.
- No dates that map to real customer events.
- No public URLs.
- No provider payload references.

## 7. Fixture Metadata Policy

Future fixture metadata should be required for every fixture before sandbox use.

Required future metadata fields:

- `fixtureKey`
- `fixtureCategory`
- `evidenceType`
- `syntheticStatus`
- `redactionStatus`
- `identifierPolicy`
- `sourcePolicy`
- `retentionPolicy`
- `allowedPromptFamilies`
- `expectedResultStatus`
- `expectedSchemaFields`
- `expectedLimitations`
- `expectedManualReviewDrivers`
- `expectedPrivacyFlags`
- `expectedRetentionFlags`
- `expectedCostTimeoutBehavior`
- `disallowedOutputPatterns`
- `reviewOwner`
- `approvalStatus`
- `schemaVersionTarget`

Metadata rules:

- Metadata must not contain real identifiers.
- Metadata must not include raw provider payloads.
- Metadata must not include raw OCR dumps.
- Metadata must not include object URLs or storage handles.
- Redacted/anonymized metadata must document redaction but not reveal removed identifiers.
- `approvalStatus` must distinguish draft, reviewed, approved, rejected, and retired states.
- `reviewOwner` must be a role or internal reviewer label, not a customer name or ticket identifier.

## 8. Fixture Scenario Matrix

Future fixture scenario groups should be defined before fixture creation:

| Scenario group | Future purpose | Expected status | Expected limitation behavior | Expected manual-review behavior | Prohibited output behavior | Privacy/safety checks |
| --- | --- | --- | --- | --- | --- | --- |
| Clean synthetic receipt | Baseline visual receipt review. | `completed` | Sandbox-only and no external verification. | Low-priority review support. | No proof-of-purchase confirmation. | No identifiers, no raw OCR dump. |
| Suspicious-layout synthetic receipt | Exercise layout uncertainty. | `completed` | Layout concern is a review signal only. | Manual review may compare approved evidence. | No fraud, forgery, or final decision language. | Synthetic-only labels. |
| Partial/cropped synthetic receipt | Exercise missing context. | `completed` or `unsupported` | Missing context limits reliability. | Request clearer eligible evidence. | No accusation about cropping intent. | No hidden identifiers in cropped areas. |
| Low-quality synthetic receipt | Exercise quality limitation. | `completed` or `unsupported` | Image quality limits analysis. | Request clearer evidence if needed. | No authenticity or proof claim. | Compression fixture is synthetic. |
| Synthetic order screenshot with missing context | Test incomplete order screen. | `completed` or `unsupported` | Screenshot cannot verify order. | Request eligible proof-of-purchase context. | No order verification. | No real account screenshot. |
| Synthetic order screenshot with layout mismatch | Test screenshot layout uncertainty. | `completed` | Layout mismatch is uncertainty only. | Human review compares policy evidence. | No customer accusation. | No real merchant/customer data. |
| Synthetic product photo normal context | Baseline product photo context. | `completed` | Cannot establish ownership, timing, or claim outcome. | Low-priority context review. | No automatic approval. | No private background/metadata. |
| Synthetic product photo unclear context | Test incomplete product context. | `completed` | Missing context limits reliability. | Request clearer or additional evidence. | No suspiciousness conclusion. | No identifiers or real labels. |
| Synthetic damaged product with clear visible issue | Test visible issue summary. | `completed` | Visible issue cannot establish cause. | Manual review may inspect policy fit. | No claim validation. | Synthetic photo only. |
| Synthetic damaged product with ambiguous visible issue | Test ambiguity. | `completed` or `unsupported` | Ambiguity limits confidence. | Manual review or clearer evidence. | No customer blame. | Synthetic only. |
| Synthetic altered-or-AI-generated-image uncertainty low concern | Test low review-priority uncertainty. | `completed` | Low concern is not proof of originality. | Low-priority review context only. | No "genuine" or verification claim. | Synthetic only. |
| Synthetic altered-or-AI-generated-image uncertainty medium concern | Test mid-priority uncertainty. | `completed` | Medium concern is incomplete and review-only. | Manual review recommended. | No automatic denial/refund. | Synthetic only. |
| Synthetic altered-or-AI-generated-image uncertainty high concern | Test high review-priority uncertainty. | `completed` | High concern is not proof. | Higher-priority manual review. | No proof, accusation, or final decision. | Synthetic only. |
| Unsupported file/evidence category | Test unsupported status. | `unsupported` | Unsupported evidence limitation only. | Request eligible evidence. | No suspiciousness inference. | No real files. |
| Ambiguous evidence category | Test uncertain category. | `unsupported` or `completed` with limits. | Ambiguity must be explicit. | Human categorization needed. | No overconfident category label. | No identifiers. |
| Provider timeout simulation | Test timeout output. | `provider-timeout` | Operational limitation only. | Manual review proceeds without sandbox output. | No evidence-risk inference. | No provider payload. |
| Provider unavailable simulation | Test unavailable output. | `provider-unavailable` | Operational limitation only. | Manual review proceeds without sandbox output. | No customer-risk inference. | No raw error payload. |
| Provider rate-limit simulation | Test rate-limit output. | `provider-rate-limited` | Operational limitation only. | Retry policy must be approved separately. | No evidence conclusion. | No provider IDs. |
| Cost-limit simulation | Test cost-limited output. | `cost-limit-reached` | Operational limitation only. | Manual review or approved retry path. | No customer-risk inference. | No billing/provider details. |
| Malformed provider response simulation | Test normalization failure. | `schema-validation-failed` or `internal-sandbox-error` | Output unavailable or invalid. | Human review only. | No improvised evidence conclusion. | No raw provider payload replay. |
| Schema-validation-failure simulation | Test schema guard. | `schema-validation-failed` | Validation limitation only. | Block output from downstream use. | No partial unsafe output. | No raw payload or identifiers. |

## 9. Altered/AI-Generated-Image Uncertainty Fixture Policy

Future fixtures may test low concern uncertainty, medium concern uncertainty, high concern uncertainty, not-applicable uncertainty, insufficient-quality uncertainty, and unsupported-evidence uncertainty limitation.

Rules:

- Fixture labels must use "altered-or-AI-generated-image uncertainty."
- Labels must not use "fake image," "fraud image," "forgery," or "confirmed AI-generated."
- Expected values must be used only as schema/test expectations, not truth labels about real evidence.
- High uncertainty fixtures must still be framed as review-priority scenarios, not proof.
- Fixtures must not train or imply automatic denial/refund.
- Fixtures must not include real customer photos.
- A low concern expectation must not imply that an image is genuine, verified, unaltered, safe, or approved.
- A not-applicable expectation must explain why the field is unavailable or omitted.

## 10. Privacy And Retention Fixture Rules

Future fixture privacy and retention rules:

- Synthetic fixtures preferred by default.
- Real evidence forbidden by default.
- Redacted/anonymized fixtures require separate approval.
- No customer identifiers.
- No raw OCR dumps with identifiers.
- No provider payload dumps.
- No public URLs.
- No object URLs.
- No storage handles.
- No EXIF/location metadata.
- No retention of raw originals after redaction approval.
- Deletion policy required before redacted fixtures are introduced.
- Fixture review log required before redacted fixtures are introduced.
- Private identifier scan required for any redacted/anonymized fixture.

## 11. Fixture QA/Probe Requirements

Before any fixture creation or fixture use, future probes/checks should prove:

- No real evidence fixture scan.
- No private identifier scan.
- No public URL/object URL/storage handle scan.
- No provider payload scan.
- No raw OCR dump scan.
- Fixture naming convention scan.
- Fixture metadata required-field scan.
- Allowed category enum scan.
- Redaction approval gate scan.
- Altered/AI-generated uncertainty label scan.
- Unsafe wording scan.
- Prohibited truth-label scan.
- Expected output safety scan.
- Unsupported/failure fixture behavior scan.
- No upload/storage route scan.
- No SDK/env/provider call scan.
- No runtime wiring scan.

The initial QA harness may be manual or semantic-only until Robert approves fixture files and metadata files.

## 12. Relationship To Existing Routes, Mock Adapter, And Schema Plan

Existing `POST /api/analysis/ocr` remains exact `fixtureKey` only. Phase 4.22 does not modify it.

Existing `POST /api/analysis/mock-provider` remains synthetic/mock-only and adapter-only. Phase 4.22 does not modify it.

Fixture-policy planning must not modify either existing route.

The mock provider adapter remains the test boundary before live provider behavior.

Future fixtures should align with Phase 4.20 prompt/output contract planning and Phase 4.21 schema planning.

`analyzeEvidenceFile` and `LocalAnalysisResult` remain unchanged.

Fixture policy should not be wired into live receipt scoring.

## 13. Future Approval Gates

Required gates before future fixture creation:

- Robert explicitly approves fixture creation phase.
- Fixture categories are selected.
- Storage location is approved.
- Metadata format is approved.
- Privacy scan approach is approved.
- Redaction process is approved if any anonymized fixtures are considered.
- Retention/deletion policy is approved.
- No live provider usage is introduced unless separately approved.
- No real customer evidence is introduced unless separately approved after privacy/retention milestone.
- Fixture QA/probe requirements are implemented or manually verified.

Stop if any fixture creation proposal requires real customer evidence, route behavior change, provider calls, upload handling, storage, persistence, runtime schema/types, or customer-facing decision output before those are separately approved.

## 14. Phase Gate Recommendation

Before Phase 4.23, all of these must remain true:

- No live OCR.
- No OpenAI SDK.
- No provider SDKs.
- No environment variables.
- No provider calls.
- No upload implementation.
- No storage implementation.
- No persistence.
- No runtime schema/types.
- No fixture files/images added.
- No real evidence.
- No real customer data.
- No anonymized/redacted real fixtures added yet.
- No provider payloads.
- No customer identifiers.
- No scoring migration.
- No UI changes.
- No live receipt behavior changes.
- No deployment.
- Existing OCR route remains exact `fixtureKey` only.
- Existing mock-provider route remains synthetic/mock-only and adapter-only.

Recommended next safe options after Phase 4.22:

Option A: Phase 4.23 OpenAI Vision sandbox validation/probe planning only.

Option B: Phase 4.23 OpenAI Vision sandbox skeleton implementation plan, still no SDK/env/provider calls.

Option C: Phase 4.23 synthetic fixture metadata schema planning only, still no fixture files/images.

Do not recommend live OpenAI Vision implementation yet unless Robert explicitly asks to start that path.

## Specialist Review Findings

Product Strategy Agent: The fixture policy supports future AI/photo intelligence while keeping all output framed as review support. The 1-100 altered-or-AI-generated-image uncertainty concept is preserved as prioritization context, not proof or disposition.

Architecture and Maintainability Agent: Fixture policy should remain separate from route code, runtime schema/types, `LocalAnalysisResult`, receipt scoring, and UI. The policy should feed future sandbox planning, not live application behavior.

Receipt Intelligence Agent: Receipt behavior remains unchanged. Future synthetic receipt visual fixtures should not replace the existing OCR fixture harness or receipt parser/scoring path.

Integration Readiness Agent: Phase 4.22 correctly avoids SDKs, environment variables, provider calls, uploads, storage, persistence, runtime wiring, and deployment. Future fixture creation must still precede live provider integration.

Scoring and Safety Reviewer Agent: Fixture policy must prohibit final claim decisions, accusation language, single fraud scores, and automatic denial/refund implications. Uncertainty values are test expectations only.

Privacy and Evidence Safety Agent: Synthetic fixtures should be the default. Any redacted/anonymized real-world-style fixture needs explicit Robert approval, documented source/redaction/retention, identifier scans, and legal/privacy checkpoint before use.

QA Harness Agent: Future fixture QA should include naming, metadata, identifier, URL/object/storage handle, provider payload, raw OCR, redaction gate, unsafe wording, altered/AI label, unsupported/failure behavior, SDK/env/provider call, and runtime wiring scans.

Deployment and Release Agent: This milestone is documentation/source-of-truth plus narrow semantic coverage only. Commit and push are appropriate only if checks pass, protected runtime files remain untouched, and no deployment occurs.

## Stop Conditions

Stop and do not commit/push if:

- Any fixture files/images are added.
- Any OpenAI SDK or provider SDK is added.
- Any environment variable is added.
- Any provider call is implemented.
- Any real upload path is implemented.
- Any runtime schema/types are added.
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
- Scope expands beyond Phase 4.22 OpenAI Vision sandbox fixture-policy planning.

## Closeout Criteria

Phase 4.22 is ready to close when:

- This OpenAI Vision sandbox fixture-policy planning document exists.
- `ROADMAP.md`, `NEXT_STEPS.md`, `REPO_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `AGENT_LOG.md` reflect Phase 4.22 planning-only status.
- Semantic coverage includes fixture-policy safety wording signals.
- No fixture files/images are added.
- No runtime/source/route/component/package/config/deployment files changed, except narrow semantic-checker coverage.
- No OpenAI SDK, provider SDK, environment variable, provider call, upload path, storage, persistence, UI wiring, real evidence, live scoring, `ClaimReviewWorkflow` wiring, `ProductPhotoReviewPanel` routing, `LocalAnalysisResult` migration, `analyzeEvidenceFile` changes, OCR route behavior changes, mock-provider route behavior changes, or receipt behavior changes were added.
- The next recommended task is Phase 4.23 validation/probe planning, sandbox skeleton implementation planning with no SDK/env/provider calls, or synthetic fixture metadata schema planning with no fixture files/images.
