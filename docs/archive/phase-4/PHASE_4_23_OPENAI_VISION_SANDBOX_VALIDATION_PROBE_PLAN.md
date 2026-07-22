# Phase 4.23 OpenAI Vision Sandbox Validation Probe Plan

Date: 2026-06-01

Primary agent role: QA Harness Agent

Supporting reviews: Product Strategy, Architecture and Maintainability, Receipt Intelligence, Integration Readiness, Scoring and Safety, Privacy and Evidence Safety, Deployment and Release

## 1. Purpose And Scope

Phase 4.23 is an OpenAI Vision sandbox validation/probe planning-only milestone. ClaimGuard needs validation/probe planning before any OpenAI Vision-style sandbox implementation because future sandbox behavior must be testable before it can safely touch prompts, schema code, fixture metadata, provider routes, SDKs, uploads, storage, persistence, downloadable packages, or real evidence workflows.

This milestone is planning-only. No validators or probes are implemented yet except narrow semantic checker coverage for this planning document. No fixtures are added. This milestone does not add OpenAI SDKs, provider SDKs, environment variables, provider calls, provider implementation, live OCR, real uploads, multipart parsing, binary file parsing, storage, persistence, UI, route behavior changes, runtime schema/types, real evidence processing, production analysis, or live AI/photo analysis. It does not wire `ClaimReviewWorkflow`, does not route `ProductPhotoReviewPanel`, does not change `analyzeEvidenceFile`, does not change `LocalAnalysisResult`, does not change receipt parser/scoring/report behavior, does not change existing `POST /api/analysis/ocr` behavior, does not change existing `POST /api/analysis/mock-provider` behavior, does not deploy, and does not start Phase 4.24.

This is not live AI. It is not production analysis. It is a validation/probe planning milestone only, not a validation implementation milestone, fixture creation milestone, or provider-integration milestone.

## 2. Future Validation/Probe Goals

Future validation/probe coverage should protect developer-only OpenAI Vision-style sandbox testing for:

- Prompt/output safety language.
- Schema identity and enum constraints.
- Observation-vs-signal separation.
- Altered-or-AI-generated-image uncertainty wording.
- Unsupported evidence handling.
- Provider refusal handling.
- Provider timeout handling.
- Provider unavailable handling.
- Provider rate-limit handling.
- Cost-limit handling.
- Malformed provider response handling.
- Schema-validation-failure handling.
- Privacy/retention metadata.
- Fixture-policy enforcement.
- No real evidence defaults.
- No runtime wiring.
- No upload/storage/persistence paths.
- No SDK/env/provider calls until approved.
- No unsafe package/distribution artifacts.

Future validation/probe coverage must not enable:

- Live provider execution.
- Real customer evidence processing.
- Real upload parsing.
- Public image URL processing.
- Object URL retention.
- Storage persistence.
- Customer-facing accusations.
- Automatic deny/refund recommendations.
- Live receipt scoring.
- `LocalAnalysisResult` migration.
- Production report generation.

## 3. Future Validation Categories

| Validation category | Purpose | Future inputs | Expected pass condition | Expected fail condition | Protected safety boundary | Related planning source |
| --- | --- | --- | --- | --- | --- | --- |
| Semantic safety validation | Keep sandbox text review-only and non-accusatory. | Docs, prompt templates, schema examples, future fixture metadata, package samples. | Wording frames outputs as limitations, uncertainty, or manual-review support. | Proof, accusation, final decision, automatic disposition, or single fraud score language appears outside explicit disallowed-wording docs. | Customer-safe review support. | Phase 4.19, 4.20, 4.21, 4.22. |
| Prompt safety validation | Ensure prompts request bounded structured output only. | Future prompt templates and prompt fixtures. | Prompt separates observations, uncertainty, limitations, privacy, and manual-review drivers. | Prompt asks for final decisions, proof, customer blame, public URLs, raw provider payloads, or unsupported real evidence. | Prompt/output contract. | Phase 4.20. |
| Output schema validation | Ensure sandbox output follows the planned shape. | Future schema examples and sandbox responses. | Required fields exist and prohibited fields are absent by status. | Missing required status fields or inclusion of raw identifiers/provider payloads. | Schema predictability. | Phase 4.21. |
| Enum/value validation | Keep identity and status values allowlisted. | Future schema objects and metadata. | `providerMode`, `providerFamily`, `analysisMode`, `fixtureScope`, and `resultStatus` use allowed values. | Unknown values, live mode, provider-specific mode, or production case status appears. | Sandbox identity lock. | Phase 4.21. |
| Required-field validation | Prevent partial outputs from being treated as analysis. | Future completed/unsupported/refusal/failure outputs. | Status-specific required fields exist. | Required limitation, safe summary, privacy flags, or status metadata is absent. | Complete safe output. | Phase 4.21. |
| Unsupported/failure-state validation | Normalize unavailable analysis into limitations only. | Unsupported, refusal, timeout, unavailable, rate-limit, cost-limit, malformed, validation-failed, and internal-error outputs. | Failures include status, limitation, safe summary, privacy/retention flags, and no evidence conclusion. | Failure output includes visual risk conclusion or altered/AI value when unavailable. | Operational limitation boundary. | Phase 4.20, 4.21. |
| Observation/signal separation validation | Keep observations distinct from uncertainty and decisions. | Future output examples and schema fixtures. | Observations are direct context notes; uncertainty signals reference observations where possible. | Observations become conclusions or manual-review drivers become dispositions. | Evidence reasoning separation. | Phase 4.20, 4.21. |
| Altered/AI uncertainty wording validation | Keep 1-100 values review-only. | Future altered/AI uncertainty outputs and fixture expectations. | Field uses altered-or-AI-generated-image uncertainty, review-signal-only, not proof, nullable/omitted when not applicable. | Field becomes AI-generated confidence, fake image score, forgery score, proof, or decision language. | Photo intelligence safety. | Phase 4.20, 4.21, 4.22. |
| Privacy/identifier validation | Block private data from docs, fixtures, examples, outputs, and packages. | Docs, future fixture metadata, future prompt fixtures, future output examples, package artifacts. | No real identifiers, raw OCR dumps, provider payloads, public/object URLs, storage handles, EXIF/location metadata. | Identifier-like data or raw payload appears without an approved privacy phase. | Evidence privacy. | Phase 4.19, 4.22. |
| Retention metadata validation | Prove no silent evidence retention is implied. | Future schema output and metadata examples. | Privacy/retention flags are present and default-off for files, raw OCR, provider payloads, object URLs, storage, persistence. | Missing flags or any default-off flag true without approval. | Retention discipline. | Phase 4.20, 4.21, 4.22. |
| Cost/timeout metadata validation | Keep operational metadata separate from evidence risk. | Future provider-operation simulations and output examples. | Cost/timeout fields are present where applicable and described as operational only. | Cost or timeout is treated as customer risk or claim signal. | Provider operation boundary. | Phase 4.10, 4.20, 4.21. |
| Fixture-policy validation | Enforce Phase 4.22 fixture eligibility before fixture use. | Future fixture names, metadata, approval logs, and fixture directories. | Category, naming, metadata, synthetic/redacted status, approval gates, limitations, and distribution status are valid. | Disallowed fixture content, missing metadata, or missing approval gate. | Fixture safety. | Phase 4.22. |
| Provider-payload logging validation | Prevent replay or retention of raw provider data. | Future outputs, logs, fixtures, examples, and package artifacts. | No raw request/response bodies, request IDs, stack traces, dashboard links, or replay dumps. | Provider payload or raw provider error data appears. | Provider privacy. | Phase 4.10, 4.20, 4.22. |
| Route/runtime wiring validation | Keep planning and sandbox code away from live routes until approved. | Future diffs and import graphs. | Existing routes remain unchanged, sandbox stays unwired, analyzer/report/UI paths untouched. | Route behavior change, runtime import, upload/storage path, or UI wiring appears. | Runtime isolation. | Phase 4.15 through 4.22. |
| Package/distribution safety validation | Ensure downloadable packages do not ship unsafe artifacts. | Future package contents, release artifacts, sample data, setup docs. | Package includes only approved synthetic samples and safe defaults with no secrets or private evidence. | Real evidence, private fixture metadata, secrets, provider payloads, unsafe demo data, or live-provider assumptions appear. | Downloadable package safety. | Phase 4.22 and product packaging direction. |

## 4. Future Probe Categories

| Probe category | Purpose | Future target files or artifact types | Future allowed patterns | Future blocked patterns | Pass/fail behavior | Block commit/push | Block package creation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No-SDK/env/package probe | Keep SDKs/secrets/dependencies out until approved. | Package files, env examples, source imports, docs. | Existing dependencies and safe `.env.example` placeholders only. | OpenAI/provider SDK imports, real env vars, API keys, new provider dependencies. | Fail on unexpected SDK/env/package surface. | Yes. | Yes. |
| No-provider-call probe | Prevent live provider execution. | Source, routes, scripts, future sandbox code. | Mock-only calls and documented future plans. | Provider endpoint calls, provider clients, credential use, external network execution. | Fail on provider-call implementation before approval. | Yes. | Yes. |
| No-upload/storage/persistence probe | Keep evidence handling unwired. | Routes, components, scripts, storage adapters. | No upload/storage/persistence references in sandbox planning. | Multipart parsing, binary parsing, database writes, storage handles, object URL handling. | Fail on new handling path. | Yes. | Yes. |
| No-real-evidence fixture probe | Block real evidence in fixtures. | Future fixture directories and metadata. | Synthetic-only fixtures or separately approved redacted metadata. | Real customer evidence, real attachments, real receipts/photos. | Fail on real evidence unless separately approved. | Yes. | Yes. |
| No-private-identifier probe | Block private identifiers. | Docs, fixtures, metadata, prompt/output examples, packages. | Generic synthetic labels and placeholder-free metadata. | Customer names, emails, phone numbers, addresses, order numbers, tracking numbers, ticket IDs. | Fail on identifier-like values. | Yes. | Yes. |
| No-provider-payload dump probe | Block payload replay. | Logs, fixtures, docs, output examples, packages. | High-level provider limitation labels only. | Raw provider request/response, provider request IDs, stack traces, dashboard links. | Fail on payload-like data. | Yes. | Yes. |
| No-public-url/object-url/storage-handle probe | Block external evidence references. | Requests, metadata, docs, packages. | Generic policy language only. | Public image URLs, object URL values, storage handles, local file URLs. | Fail on concrete URL/handle values. | Yes. | Yes. |
| No-runtime-wiring probe | Preserve analyzer/report/UI boundaries. | Source imports, diffs, route trees. | Planning docs and semantic checker only. | `analyzeEvidenceFile`, `LocalAnalysisResult`, report-adapter, UI, upload, or route wiring. | Fail on protected import/diff. | Yes. | Yes. |
| No-route-behavior-change probe | Preserve existing API route behavior. | OCR route, mock-provider route, route probes. | Exact `fixtureKey` OCR route; synthetic/mock-only mock-provider route. | Request shape changes, live provider branches, upload acceptance. | Fail on route contract drift. | Yes. | Yes. |
| Prompt safety probe | Check future prompts. | Prompt templates and prompt fixture metadata. | Structured output, limitation, privacy, review-only wording. | Proof, accusation, final decision, raw OCR/payload, live evidence language. | Fail on unsafe prompt instruction. | Yes. | Yes, if prompts ship. |
| Output schema safety probe | Check future output examples. | Schema examples, sandbox response examples. | Allowed status values, required fields, prohibited field absence. | Raw identifiers, provider payloads, disposition fields, missing limitations. | Fail on schema safety violation. | Yes. | Yes. |
| Observation-vs-signal separation probe | Keep reasoning layers separate. | Output examples and future schema tests. | Observations, signals, confidence notes, limitations, manual-review drivers as separate fields. | Observations as conclusions or drivers as dispositions. | Fail on collapsed reasoning layers. | Yes. | Yes. |
| Altered/AI uncertainty wording probe | Keep 1-100 field safe. | Output examples, prompt templates, fixture expectations. | Altered-or-AI-generated-image uncertainty, review signal, not proof. | AI-generated confidence, fake image score, forgery score, confirmed altered, automatic denial/refund. | Fail on unsafe wording or invalid applicability/value. | Yes. | Yes. |
| Unsupported evidence limitation probe | Ensure unsupported remains limitation only. | Unsupported output examples and tests. | `unsupported` status, limitation, safe summary, no altered/AI value. | Suspiciousness or customer-risk conclusion. | Fail on unsupported overclaiming. | Yes. | Yes. |
| Refusal handling probe | Ensure refusal is output limitation only. | Refusal examples and tests. | `refused` status, limitation, no provider raw refusal text. | Evidence conclusion from refusal. | Fail on refusal overclaiming. | Yes. | Yes. |
| Timeout handling probe | Ensure timeout is operational. | Timeout examples and tests. | `provider-timeout`, timeout metadata, operational limitation. | Customer-risk inference or altered/AI value. | Fail on timeout overclaiming. | Yes. | Yes. |
| Rate-limit handling probe | Ensure rate limits are operational. | Rate-limit examples and tests. | `provider-rate-limited`, cost/rate metadata, limitation. | Evidence-risk inference. | Fail on rate-limit overclaiming. | Yes. | Yes. |
| Provider-unavailable handling probe | Ensure unavailable states are operational. | Unavailable examples and tests. | `provider-unavailable`, limitation, safe summary. | Customer-risk inference. | Fail on unavailable overclaiming. | Yes. | Yes. |
| Cost-limit handling probe | Ensure cost limits are operational. | Cost-limit examples and tests. | `cost-limit-reached`, cost metadata, no retry assumption. | Customer-risk inference or disposition. | Fail on cost-limit overclaiming. | Yes. | Yes. |
| Malformed provider response probe | Ensure malformed output is blocked. | Malformed response simulations. | Schema validation failure or internal limitation. | Improvised partial evidence conclusion. | Fail on unsafe fallback output. | Yes. | Yes. |
| Schema-validation-failure probe | Ensure invalid output is not used. | Schema-invalid examples. | `schema-validation-failed`, safe summary, no partial unsafe output. | Downstream-use-ready result from invalid output. | Fail on invalid output acceptance. | Yes. | Yes. |
| Privacy/retention flag probe | Check privacy defaults. | Output examples and package samples. | `privacyFlags` and `retentionFlags` present with default-off retention. | Missing flags or true retention without approval. | Fail on missing/unsafe flags. | Yes. | Yes. |
| Fixture naming/metadata probe | Enforce fixture policy. | Future fixture metadata and names. | Phase 4.22 naming pattern and required metadata fields. | Missing metadata, disallowed status, identifiers, unsafe labels. | Fail on fixture-policy violation. | Yes. | Yes. |
| Downloadable-package safety probe | Protect installable artifacts. | Future archives, package folders, sample data, setup docs. | Synthetic demos, safe defaults, no secrets, provider disabled by default. | Private fixtures, raw OCR, provider payloads, secrets, unsafe demo labels. | Fail package creation and release. | Yes, if artifact is in repo. | Yes. |

## 5. Semantic Safety Wording Scans

Future OpenAI Vision sandbox semantic scans must guard against unsafe use of:

- Fraud-confirmation language.
- Proof language.
- Fake/forged accusation language.
- Automatic deny/refund wording.
- Final claim decision wording.
- Single fraud score wording.
- Customer-facing blame language.
- "AI-generated confidence" without uncertainty framing.
- "fake image score."
- "forgery score."
- "confirmed AI-generated."
- "confirmed altered."
- "manipulation proven."

Allowed exception handling:

- Prohibited labels may appear only inside explicit "must not use," "disallowed wording," or safety-rule documentation sections.
- The semantic checker should distinguish prohibited-example documentation from product/runtime language.
- Product/runtime wording, prompt text, output examples, fixture labels, package sample data, and customer-facing docs should not use prohibited labels except to explicitly say they are disallowed.

## 6. Altered/AI-Generated-Image Uncertainty Validation

Future validation for the 1-100 uncertainty field must ensure:

- Field is named and described as "altered-or-AI-generated-image uncertainty."
- Field is review-signal-only.
- Field is manual-review-driver-only.
- Field is not proof.
- Field is not a final decision.
- Field is not a fraud score.
- Field is nullable/omitted when not applicable.
- High uncertainty does not imply automatic denial/refund.
- Low uncertainty does not imply authenticity is confirmed.
- Value range is 1-100 only when applicable.
- Confidence notes remain separate from claim truth.

Validation should fail if a high value is interpreted as proof of alteration, proof of AI generation, proof of fraud, a customer accusation, or an automatic support outcome. Validation should also fail if a low value is interpreted as verified authenticity, originality, eligibility, approval, or a reason to skip manual review.

## 7. Observation-Vs-Signal Separation Validation

Future validation must preserve separation between:

- Direct visual observations.
- Inferred uncertainty signals.
- Confidence notes.
- Limitations.
- Manual-review drivers.
- Safe support summaries.

Validation must ensure:

- Observations are not conclusions.
- Uncertainty signals link to observations where possible.
- Limitations remain separate from risk signals.
- Manual-review drivers do not become dispositions.
- Safe summaries do not accuse customers.
- Unsupported/failure outputs do not create visual risk conclusions.

Validation should fail if a direct observation says or implies that evidence is altered, AI-generated, deceptive, valid, invalid, approved, denied, or externally verified. Those concepts must remain outside observation text and must still be framed as uncertainty, limitation, or human-review guidance when allowed.

## 8. Privacy And Identifier Scans

Future privacy scans should cover:

- Customer names.
- Emails.
- Phone numbers.
- Addresses.
- Order numbers.
- Tracking numbers.
- Ticket IDs.
- Barcodes/QR code references that can encode identifiers.
- Raw unredacted OCR text.
- EXIF/location metadata.
- Provider payload dumps.
- Object URLs.
- Public image URLs.
- Storage handles.
- Screenshots of real customer accounts.
- Real Amazon/customer order pages.

Rules:

- Real identifiers are blocked by default.
- Redacted/anonymized fixture usage requires a separate approved phase.
- Provider payload replay requires a separate approved phase.
- Raw OCR dumps are blocked by default.
- Identifier scans must apply to docs, future fixture metadata, future prompt fixtures, future schema examples, and future package artifacts.

## 9. Fixture-Policy Enforcement Validation

Future validation against Phase 4.22 fixture policy must ensure:

- Fixture category is allowed.
- Fixture naming convention is followed.
- Fixture metadata required fields are present.
- Synthetic/redacted status is explicit.
- Redaction approval gate is documented for any later anonymized fixture.
- Disallowed content is absent.
- Expected limitation behavior is documented.
- Expected manual-review behavior is documented.
- Prohibited truth labels are absent.
- Altered/AI labels use uncertainty framing.
- Fixture package/distribution status is safe.

Validation should block a fixture if its name, metadata, expected output, or package-distribution status suggests real customer evidence, unapproved redacted/anonymized evidence, public/object URL ingestion, storage handle use, provider payload replay, raw OCR retention, or final claim decision behavior.

## 10. Unsupported/Failure-State Probes

Future probe scenarios should include:

- Unsupported evidence category.
- Ambiguous evidence category.
- Provider refusal.
- Provider timeout.
- Provider unavailable.
- Provider rate limit.
- Cost limit reached.
- Malformed provider response.
- Schema validation failed.
- Internal sandbox error.

Each probe should assert:

- Required status value.
- Required limitation.
- Required safe summary.
- No fraud/fake/forged/proof wording.
- No customer accusation.
- No automatic deny/refund.
- No altered/AI uncertainty value unless applicable.
- Provider failures do not imply customer risk.
- Unsupported evidence is an evidence limitation only.
- Failure states are operational limitations only.

These probes should block commit/push when they fail once implemented. They should also block package creation when outputs or examples are included in downloadable artifacts.

## 11. Schema And Output Validation Probes

Future schema/output probes should validate:

- `providerMode` remains `sandbox`.
- `providerFamily` remains `openai-vision-style`.
- `schemaVersion` is present.
- `resultStatus` is allowed.
- `analysisMode` is allowed.
- `fixtureScope` is allowed.
- Required fields exist by result status.
- Prohibited fields are absent by result status.
- Enum values are allowed.
- `privacyFlags` are present.
- `retentionFlags` are present.
- `costMetadata` is present where applicable.
- `timeoutMetadata` is present where applicable.
- `providerFailureReason` is present where applicable.
- `unsupportedEvidenceReason` is present where applicable.
- Safe support summaries pass wording checks.

Output probes should also assert that completed outputs do not contain raw OCR dumps, provider payloads, customer identifiers, public image URLs, object URLs, storage handles, claim disposition fields, receipt scoring fields, `LocalAnalysisResult` fields, or customer-facing accusation fields.

## 12. Route/Runtime/Package Guard Scans

Future guard scans should cover:

- OpenAI SDK or provider SDK imports.
- Environment variable additions.
- Package dependency additions.
- Provider call patterns.
- Fetch calls to provider endpoints.
- Multipart parsing.
- Binary file parsing.
- Upload route additions.
- Storage route additions.
- Object URL handling.
- Persistence/database writes.
- Route behavior changes.
- Analyzer/runtime imports.
- `LocalAnalysisResult` migration.
- `analyzeEvidenceFile` changes.
- `ClaimReviewWorkflow` wiring.
- `ProductPhotoReviewPanel` routing.
- Receipt parser/scoring/report behavior changes.

Rules:

- These scans must block commit/push when violated before an approved implementation milestone.
- These scans must also block package creation when violated unexpectedly.
- Package/config/deployment/env diffs should be treated as protected until Robert explicitly opens package/distribution implementation or provider integration.

## 13. Downloadable-Package Safety Checks

Future validation for downloadable/self-hosted ClaimGuard packages should ensure downloadable builds do not include:

- Real customer evidence.
- Anonymized/redacted fixtures without approval.
- Private fixture metadata.
- Raw OCR dumps.
- Provider payload dumps.
- Secrets.
- Env files with real values.
- API keys.
- Object URLs.
- Storage handles.
- Public image URLs pointing to non-synthetic evidence.
- Unsafe demo data.
- Live-provider assumptions.
- Customer-facing accusation examples.
- Unsafe "fake/fraud/proof" labels outside disallowed-wording docs.

Package-safety checks should require:

- `.env.example` only, with no secrets.
- Synthetic demo data only.
- Explicit fixture distribution status.
- Clear sample-data labeling.
- No real customer identifiers.
- Safe default configuration.
- Local/self-hosted setup notes.
- Provider features disabled unless explicitly configured.
- Retention defaults documented.
- Update/distribution notes documented later.
- License/distribution notes documented later.

Future package checks should run before any package archive, installer, release bundle, self-hosted template, or downloadable artifact is created. Until those checks exist, downloadable distribution should remain a planning consideration only.

## 14. Future Validation/Probe Execution Strategy

Recommended future execution groups:

- Semantic checker group.
- Route/runtime guard group.
- Privacy/identifier group.
- Fixture-policy group.
- Schema/output group.
- Unsupported/failure-state group.
- Package-safety group.

Recommended run points:

- Before committing sandbox docs.
- Before fixture creation.
- Before schema/type implementation.
- Before route implementation.
- Before provider SDK/env work.
- Before package creation.
- Before deployment or release.

Blocking behavior:

- Safety/privacy failures block commit.
- Runtime boundary failures block commit.
- Package-safety failures block package creation.
- Fixture-policy failures block fixture merge.
- Provider-call/env failures block implementation unless explicitly approved.

## 15. Relationship To Existing Routes, Mock Adapter, Fixture Policy, And Schema Plan

Existing `POST /api/analysis/ocr` remains exact `fixtureKey` only. Phase 4.23 does not modify it.

Existing `POST /api/analysis/mock-provider` remains synthetic/mock-only and adapter-only. Phase 4.23 does not modify it.

Validation/probe planning must not modify either existing route.

The mock provider adapter remains the test boundary before live provider behavior.

Future validation should enforce Phase 4.20 prompt/output contract planning.

Future validation should enforce Phase 4.21 schema planning.

Future validation should enforce Phase 4.22 fixture policy planning.

`analyzeEvidenceFile` and `LocalAnalysisResult` remain unchanged.

Validation/probe planning should not be wired into live receipt scoring.

## 16. Future Approval Gates

Required gates before future validation/probe implementation:

- Robert explicitly approves validation/probe implementation phase.
- Target validation categories are selected.
- Protected file rules are confirmed.
- Future fixture policy is confirmed.
- Future schema plan is confirmed.
- Package-safety requirements are confirmed.
- Semantic checker update scope is confirmed.
- No SDK/env/provider calls are introduced unless separately approved.
- No real evidence is introduced unless separately approved after privacy/retention milestone.
- No route/runtime wiring is introduced unless separately approved.

Future validation/probe implementation should start with semantic, privacy, fixture-policy, and route/runtime guard checks before any schema/type implementation or sandbox route work.

## 17. Phase Gate Recommendation

Before Phase 4.24, all of these must remain true:

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
- No validation/probe implementation except narrow semantic checker coverage if needed.
- No real evidence.
- No real customer data.
- No anonymized/redacted real fixtures added.
- No provider payloads.
- No customer identifiers.
- No scoring migration.
- No UI changes.
- No live receipt behavior changes.
- No deployment.
- Existing OCR route remains exact `fixtureKey` only.
- Existing mock-provider route remains synthetic/mock-only and adapter-only.

Recommended next safe options after Phase 4.23:

Option A: Phase 4.24 synthetic fixture metadata schema planning only, still no fixture files/images.

Option B: Phase 4.24 OpenAI Vision sandbox validation/probe implementation plan, still no implementation.

Option C: Phase 4.24 OpenAI Vision sandbox skeleton implementation plan, still no SDK/env/provider calls.

Do not recommend live OpenAI Vision implementation yet unless Robert explicitly asks to start that path.

## Specialist Review Findings

Product Strategy Agent: Validation/probe planning protects the future AI/photo intelligence direction while preserving review-support framing. The 1-100 altered-or-AI-generated-image uncertainty concept remains useful only as a manual-review signal, not a proof or disposition engine.

Architecture and Maintainability Agent: Future probes should guard route/runtime boundaries, keep sandbox output separate from `LocalAnalysisResult`, and prevent package/config/provider changes from entering before an approved implementation slice.

Receipt Intelligence Agent: Receipt behavior remains unchanged. Future validation must keep live receipt scoring, parser behavior, reports, OCR route behavior, and receipt fixtures separate from sandbox validation.

Integration Readiness Agent: Phase 4.23 does not introduce SDKs, environment variables, provider calls, uploads, storage, persistence, runtime schema/types, or deployment. Future validation should block those surfaces until explicitly approved.

Scoring and Safety Reviewer Agent: Safety scans must block proof language, fake/forged accusations, single fraud score wording, final claim decisions, and automatic deny/refund recommendations outside explicit disallowed-wording documentation.

Privacy and Evidence Safety Agent: Privacy scans must apply to docs, future fixture metadata, prompt fixtures, schema examples, output examples, logs, and downloadable package artifacts. Real evidence and identifiers remain blocked by default.

QA Harness Agent: The validation/probe matrix should eventually become grouped checks: semantic, route/runtime, privacy/identifier, fixture-policy, schema/output, unsupported/failure-state, and package-safety.

Deployment and Release Agent: Downloadable-package safety is now part of planning. Package creation should be blocked until scans prove no real evidence, private metadata, provider payloads, secrets, unsafe demo data, or live-provider assumptions ship.

## Stop Conditions

Stop and do not commit/push if:

- Any validation/probe implementation is added beyond narrow semantic checker coverage.
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
- Scope expands beyond Phase 4.23 OpenAI Vision sandbox validation/probe planning.

## Closeout Criteria

Phase 4.23 is ready to close when:

- This OpenAI Vision sandbox validation/probe planning document exists.
- `ROADMAP.md`, `NEXT_STEPS.md`, `REPO_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `AGENT_LOG.md` reflect Phase 4.23 planning-only status.
- Semantic coverage includes validation/probe safety wording signals.
- No fixture files/images are added.
- No runtime/source/route/component/package/config/deployment files changed, except narrow semantic-checker coverage.
- No validation/probe implementation is added beyond narrow semantic checker coverage.
- No OpenAI SDK, provider SDK, environment variable, provider call, upload path, storage, persistence, UI wiring, real evidence, live scoring, `ClaimReviewWorkflow` wiring, `ProductPhotoReviewPanel` routing, `LocalAnalysisResult` migration, `analyzeEvidenceFile` changes, OCR route behavior changes, mock-provider route behavior changes, or receipt behavior changes were added.
- The next recommended task is Phase 4.24 synthetic fixture metadata schema planning, validation/probe implementation planning with no implementation, or sandbox skeleton implementation planning with no SDK/env/provider calls.
