# Phase 4.20 OpenAI Vision Prompt Output Contract Plan

Date: 2026-05-31

Primary agent role: Integration Readiness Agent

Supporting reviews: Product Strategy, Architecture and Maintainability, Receipt Intelligence, Scoring and Safety, Privacy and Evidence Safety, QA Harness, Deployment and Release

## Purpose And Scope

Phase 4.20 is an OpenAI Vision sandbox prompt/output contract planning-only milestone. ClaimGuard needs this contract before any OpenAI Vision-style sandbox implementation because prompts and structured outputs are where provider behavior, reviewer safety language, privacy boundaries, refusal behavior, cost/timeout handling, and manual-review semantics become enforceable.

This is planning-only. This milestone does not add OpenAI SDKs, provider SDKs, environment variables, provider calls, provider implementation, live OCR, real uploads, multipart parsing, binary parsing, storage, persistence, UI, route behavior changes, real evidence processing, production analysis, or live AI/photo analysis. It does not wire `ClaimReviewWorkflow`, does not route `ProductPhotoReviewPanel`, does not change `analyzeEvidenceFile`, does not change `LocalAnalysisResult`, does not change receipt parser/scoring/report behavior, does not change existing `POST /api/analysis/ocr` behavior, does not change existing `POST /api/analysis/mock-provider` behavior, does not deploy, and does not start Phase 4.21.

This is not live AI. It is not production analysis. It is a contract-planning milestone only, not a provider-integration milestone.

## Current Baseline

The Phase 4.20 plan inherits these already-approved boundaries:

- Phase 4.9 recommends OCR-specialized extraction first and OpenAI Vision-style reasoning later for visual context, screenshot/layout observations, product-photo context, and altered-or-AI-generated-image uncertainty signals.
- Phase 4.10 plans provider abstraction concepts for provider mode, supported evidence types, privacy/redaction, cost/timeout, failure normalization, and review-support outputs.
- Phase 4.11 through Phase 4.18 establish mock-before-live as the implementation path and keep mock OCR/mock vision behavior synthetic-only.
- Phase 4.19 plans the future OpenAI Vision-style sandbox as developer-only, synthetic/anonymized-fixture-only, privacy-safe, review-signal-only, and separate from live receipt analysis.
- Existing `POST /api/analysis/ocr` remains exact `fixtureKey` JSON-only synthetic fixture route behavior.
- Existing `POST /api/analysis/mock-provider` remains synthetic/mock-only and adapter-only.
- The mock provider adapter remains the test boundary before live provider behavior.
- `analyzeEvidenceFile` and `LocalAnalysisResult` remain unchanged.
- Receipt behavior remains unchanged.

## Future Sandbox Prompt Goals

Future developer-only OpenAI Vision-style prompts may be planned only for synthetic/anonymized fixtures.

Prompts may later support:

- Screenshot/layout observations.
- Receipt visual/context observations.
- Order screenshot structure observations.
- Product-photo context observations.
- Damaged-product context observations.
- Altered-or-AI-generated-image uncertainty signals.
- Limitation reporting.
- Manual-review driver generation.
- Safe structured summaries.

Prompts must not support:

- Fraud confirmation.
- Fake or forged conclusions.
- Proof language.
- Customer accusations.
- Automatic denial or refund recommendations.
- Final claim decisions.
- Live receipt scoring.
- `LocalAnalysisResult` production reports.
- Customer-facing blame language.
- Unsupported evidence conclusions.

## Prompt Template Families

Future prompt template families should be defined before implementation. Each family must request structured output only, use synthetic/anonymized fixture inputs only, separate observations from conclusions, require limitations, and keep all outputs manual-review framed.

### Synthetic Receipt Visual Review

Purpose: review visual/layout context around a synthetic receipt-like image.

Allowed evidence type: synthetic receipt image or anonymized/redacted receipt fixture after separate approval.

Prohibited conclusions: no authenticity finding, no source verdict, no fraud finding, no customer accusation, no final claim outcome.

Required observations: visible receipt sections, readability limits, cropped areas, subtotal/tax/total visual presence, merchant/date/order visual cues when present, and layout consistency notes.

Required limitations: synthetic fixture scope, no external verification, no raw OCR reliance, no claim decision, and no support disposition.

Required uncertainty framing: visual context is a review signal only and should be compared with OCR/receipt fields later only after an approved signal-combination phase.

Required privacy behavior: do not return raw private identifiers, raw OCR text, filenames, paths, object URLs, storage handles, provider payloads, or unredacted customer details.

Required structured output fields: `providerMode`, `providerFamily`, `evidenceType`, `fixtureScope`, `visualSummary`, `observations`, `uncertaintySignals`, `confidenceNotes`, `manualReviewDrivers`, `limitations`, `safeSupportSummary`, `privacyFlags`, `retentionFlags`, and `schemaVersion`.

Manual-review driver requirements: call out unreadable/cropped/conflicting visual areas as manual-review drivers only.

### Synthetic Order Screenshot Review

Purpose: observe order screenshot structure and layout context without treating marketplace/order screenshots as externally verified evidence.

Allowed evidence type: synthetic order screenshot or anonymized/redacted order-screen fixture after separate approval.

Prohibited conclusions: no platform verification, no proof-of-purchase conclusion, no fraud finding, no automatic support action.

Required observations: order summary sections, totals area, item rows, shipping/payment redaction posture, screenshot crop limits, and marketplace ambiguity.

Required limitations: no external verification, screenshot may be incomplete, OCR may be separate, and provider output does not verify an order.

Required uncertainty framing: screenshot structure can guide reviewer comparison only.

Required privacy behavior: omit customer names, emails, phone numbers, addresses, order numbers, tracking numbers, payment details, ticket identifiers, raw OCR text, and provider payload dumps.

Required structured output fields: same base output fields plus `unsupportedEvidenceReason` when the screenshot is ambiguous or outside scope.

Manual-review driver requirements: missing totals, cropped order sections, marketplace ambiguity, or redaction gaps should become manual-review drivers, not conclusions.

### Synthetic Product Photo Review

Purpose: observe product-photo context, requested-view completeness, visible condition context, and image-quality limitations.

Allowed evidence type: synthetic product-photo fixture only, or anonymized/redacted fixture after separate approval.

Prohibited conclusions: no proof of damage, no proof of no damage, no customer blame, no denial/refund recommendation, no final claim decision.

Required observations: visible product area, requested view presence/absence, lighting, focus, occlusion, background/context limitations, and damage visibility context when synthetic examples include it.

Required limitations: image-only context is incomplete, product identity may be uncertain, metadata is not verified, no external verification was performed, and support policy remains outside model output.

Required uncertainty framing: product-photo observations are review signals only.

Required privacy behavior: do not return private backgrounds, faces, addresses, serial values, labels, barcodes, QR values, filenames, object URLs, or raw metadata.

Required structured output fields: base output fields plus `alteredOrAiGeneratedImageUncertainty` when applicable and `manualReviewDrivers` for missing views or quality limits.

Manual-review driver requirements: missing requested views, unclear damage area, poor focus, inconsistent context, or limited view completeness should guide reviewer attention only.

### Synthetic Damaged-Product Review

Purpose: observe synthetic damaged-product context without starting live product-photo analysis.

Allowed evidence type: synthetic damaged-product fixture only.

Prohibited conclusions: no confirmation that product damage occurred, no repair/return disposition, no customer accusation, no policy decision.

Required observations: claimed damage region visibility, surrounding product context, whether the view is close-up or contextual, lighting/focus, and limitations.

Required limitations: synthetic fixture only, image cannot establish event timing or cause, no product history, no claim outcome.

Required uncertainty framing: visible damage context is a manual-review driver only.

Required privacy behavior: omit private environments, people, addresses, labels, raw metadata, and identifiers.

Required structured output fields: base output fields plus damage-context `observations` and `limitations`.

Manual-review driver requirements: unclear area, missing before/after context, missing product identity context, or low image quality should become review drivers only.

### Synthetic Altered/AI-Generated-Image Uncertainty Review

Purpose: estimate whether synthetic fixture imagery has indicators that warrant closer manual review for possible alteration or AI generation.

Allowed evidence type: synthetic image fixture designed for sandbox prompt testing.

Prohibited conclusions: no proof that an image is fake, no proof that an image is AI-generated, no proof of alteration, no proof of fraud, no claim decision, no deny/refund recommendation, no customer-facing accusation.

Required observations: visible artifact categories, inconsistency categories, low-confidence areas, ambiguity, and missing context.

Required limitations: image-forensics uncertainty is incomplete, model output is not a forensic determination, and the value is not a fraud score.

Required uncertainty framing: "altered-or-AI-generated-image uncertainty" must be described as a "review signal only", a "manual-review driver", "not proof", and "not a final decision".

Required privacy behavior: omit identifiers, raw metadata, URLs, storage handles, provider payloads, and unredacted fixture payloads.

Required structured output fields: base output fields plus `alteredOrAiGeneratedImageUncertainty.value`, `scale`, `reviewSignalOnly`, `manualReviewDriver`, `notProof`, `notFinalDecision`, `supportingObservations`, and `limitations`.

Manual-review driver requirements: high uncertainty should increase review priority only and should not over-weight the case compared with other evidence.

### Mixed Synthetic Evidence Review

Purpose: summarize multiple synthetic evidence categories at a contract level without combining them into a final result.

Allowed evidence type: synthetic mixed evidence fixtures after a separate approved sandbox fixture policy.

Prohibited conclusions: no consolidated fraud score, no final claim decision, no automatic support action, no live receipt report output.

Required observations: per-evidence observations, per-evidence limitations, conflicts that require manual comparison, and unsupported categories.

Required limitations: no evidence combination scoring, no external verification, no production workflow output.

Required uncertainty framing: mixed evidence can surface review drivers only.

Required privacy behavior: do not include private identifiers, raw OCR, payload dumps, URLs, object URLs, storage handles, or case/ticket/customer identifiers.

Required structured output fields: base output fields plus per-evidence `observations`, `uncertaintySignals`, `limitations`, and `manualReviewDrivers`.

Manual-review driver requirements: conflicts must remain comparison prompts for reviewers, not conclusions.

### Unsupported Or Ambiguous Evidence Handling

Purpose: return a safe limitation output when a future sandbox fixture is unsupported, ambiguous, or outside the prompt family.

Allowed evidence type: synthetic unsupported/ambiguous fixture metadata only.

Prohibited conclusions: no risk conclusion, no altered/fake/fraud conclusion, no customer-facing accusation, no claim disposition.

Required observations: only the reason the evidence cannot be interpreted under the selected family.

Required limitations: unsupported evidence is an evidence limitation only.

Required uncertainty framing: unsupported does not mean suspicious.

Required privacy behavior: do not echo raw payloads, identifiers, filenames, paths, URLs, or provider details.

Required structured output fields: `unsupportedEvidenceReason`, `limitations`, `safeSupportSummary`, `manualReviewDrivers` if applicable, `privacyFlags`, `retentionFlags`, and `schemaVersion`.

Manual-review driver requirements: recommend requesting eligible evidence or reviewer inspection only when applicable.

### Provider Failure Or Timeout Limitation Handling

Purpose: return an operational limitation output when provider execution fails in a future sandbox.

Allowed evidence type: synthetic failure case only.

Prohibited conclusions: no customer-risk conclusion, no alteration inference, no fraud inference, no evidence-quality conclusion from the failure itself.

Required observations: none beyond operational status.

Required limitations: provider failure is operational-only and cannot support evidence conclusions.

Required uncertainty framing: failure means output is unavailable or incomplete.

Required privacy behavior: do not include raw provider responses, stack traces, provider request IDs, payloads, URLs, storage handles, or identifiers.

Required structured output fields: `providerFailureReason`, `timeoutMetadata` or `costMetadata` where applicable, `limitations`, `safeSupportSummary`, `privacyFlags`, `retentionFlags`, and `schemaVersion`.

Manual-review driver requirements: manual review may be recommended because automated sandbox output is unavailable, not because the evidence is risky.

## Prompt Safety Language Requirements

Future prompts must:

- Ask for uncertainty and review signals only.
- Forbid fraud conclusions.
- Forbid fake or forged accusations.
- Forbid proof language.
- Forbid automatic deny/refund wording.
- Require limitations.
- Require manual-review framing.
- Separate observations from conclusions.
- Identify low-confidence areas.
- Avoid customer-facing blame language.
- Request structured output only.
- Avoid returning raw private identifiers.
- Avoid creating support dispositions.
- Avoid presenting Vision output as the final claim answer.
- Avoid presenting a single fraud score.
- Avoid over-weighting image-generation/alteration uncertainty.

Future prompts should include a hard instruction that any unsupported evidence, provider refusal, timeout, cost limit, malformed output, or schema validation issue must become a limitation or operational status only.

## Future Structured Output Contract

The future conceptual output shape should be named `OpenAiVisionSandboxPromptOutputContract` in planning language only. Phase 4.20 does not implement TypeScript.

Planned fields:

- `providerMode`: `sandbox`.
- `providerFamily`: `openai-vision-style`.
- `evidenceType`.
- `fixtureScope`.
- `visualSummary`.
- `observations`.
- `uncertaintySignals`.
- `alteredOrAiGeneratedImageUncertainty`.
- `confidenceNotes`.
- `manualReviewDrivers`.
- `limitations`.
- `safeSupportSummary`.
- `privacyFlags`.
- `retentionFlags`.
- `costMetadata`.
- `timeoutMetadata`.
- `providerFailureReason`.
- `unsupportedEvidenceReason`.
- `schemaVersion`.

The output must stay separate from:

- `LocalAnalysisResult`.
- Live receipt report output.
- Receipt scoring.
- Claim disposition.
- Customer-facing messaging.
- Route response contracts for existing OCR/mock-provider routes.

No field should be treated as the Evidence Reliability Score, a support disposition, or a single fraud score.

## Altered/AI-Generated-Image Uncertainty Field

The future 1-100 field should be named around the required wording: "altered-or-AI-generated-image uncertainty".

It may represent:

- Degree of uncertainty concern for possible alteration or AI-generation indicators.
- A review-priority signal.
- A manual-review driver.

It must not represent:

- Proof that an image is fake.
- Proof that an image is AI-generated.
- Proof of alteration.
- Proof of fraud.
- Final claim decision.
- Deny/refund recommendation.
- Customer-facing accusation.
- Overall fraud score.

Required wording:

- "altered-or-AI-generated-image uncertainty".
- "review signal only".
- "manual-review driver".
- "not proof".
- "not a final decision".

Avoid wording:

- "AI-generated confidence" without uncertainty framing.
- "fake image score".
- "fraud score".
- "forgery score".
- "manipulation proven".
- "confirmed AI-generated".
- "confirmed altered".

Recommended structured subfields:

- `value`: integer 1-100.
- `scale`: `1-100`.
- `label`: low, medium, or high uncertainty concern.
- `reviewSignalOnly`: true.
- `manualReviewDriver`: true when value or limitations warrant reviewer attention.
- `notProof`: true.
- `notFinalDecision`: true.
- `supportingObservations`: observation references only.
- `limitations`: required.

The value must never be displayed or stored as a single fraud score.

## Observation Vs Conclusion Separation

Future output must separate:

- Direct visual observations.
- Inferred uncertainty signals.
- Confidence notes.
- Limitations.
- Manual-review drivers.
- Safe support summary.

Future outputs must not collapse observations into final conclusions. For example, a visual artifact observation may support an uncertainty signal, but it must not become "the image is altered" or "the claim is invalid." A low-confidence observation should stay low-confidence and should not be elevated into a claim outcome.

## Refusal And Unsupported Evidence Handling

Unsupported evidence should produce:

- `unsupportedEvidenceReason`.
- `limitations`.
- `safeSupportSummary`.
- `manualReviewDrivers` if applicable.
- No risk conclusion.
- No altered/fake/fraud conclusion.
- No customer-facing accusation.
- No claim disposition.

Unsupported evidence must be treated as an evidence limitation only.

Future prompt refusal or safety refusal should produce a safe limitation output rather than a blank or improvised analysis. The output should say that the sandbox could not produce eligible analysis under the approved contract and that manual review should use approved evidence and support policy.

## Provider Failure Timeout And Cost Handling

Future output behavior must cover:

- Provider timeout.
- Provider unavailable.
- Provider rate limit.
- Malformed provider response.
- Provider cost limit reached.
- Prompt refusal.
- Schema validation failure.

Provider failure must produce:

- `providerFailureReason`.
- `timeoutMetadata` or `costMetadata` where applicable.
- `limitations`.
- Operational-only wording.
- No customer-risk conclusion.
- No fraud or alteration inference from the failure itself.

Required operational wording examples:

- "Provider timeout; sandbox output unavailable."
- "Provider unavailable; this is an operational limitation."
- "Rate or cost limit reached; no evidence conclusion should be drawn."
- "Schema validation failed; output should not be used as analysis."

## Privacy-Safe Prompt And Output Constraints

Future prompts and outputs must:

- Avoid real customer evidence by default.
- Avoid raw private identifiers.
- Avoid customer names.
- Avoid emails.
- Avoid phone numbers.
- Avoid addresses.
- Avoid order numbers.
- Avoid tracking numbers.
- Avoid ticket IDs.
- Avoid raw unredacted OCR text.
- Avoid provider payload dumps.
- Avoid object URLs.
- Avoid storage handles.
- Avoid public image URLs.
- Avoid prompt/payload replay unless separately approved.
- Require redaction before anonymized fixture testing.

Future sandbox output must not echo private input values even when a prompt is testing rejection or limitation behavior. Privacy flags should indicate whether redaction was applied, whether raw evidence was used, whether raw OCR was retained, whether provider payloads were retained/logged, whether storage was used, and whether external network calls occurred.

## Relationship To Existing Routes And Mock Adapter

Existing `POST /api/analysis/ocr` remains exact `fixtureKey` only. Phase 4.20 does not modify it.

Existing `POST /api/analysis/mock-provider` remains synthetic/mock-only and adapter-only. Phase 4.20 does not modify it.

OpenAI Vision prompt/output planning must not modify either existing route.

The mock provider adapter remains the test boundary before live provider behavior. Future OpenAI Vision sandbox work should follow the Phase 4.10 provider abstraction plan and the Phase 4.11 through Phase 4.18 mock-before-live path.

`analyzeEvidenceFile` and `LocalAnalysisResult` remain unchanged. This contract should not be wired into live receipt scoring, live receipt report output, `ClaimReviewWorkflow`, `ProductPhotoReviewPanel`, upload flow, storage, persistence, or production UI.

## Future QA And Probe Requirements

Before any OpenAI Vision prompt/output contract implementation, future probes and checks should prove:

- No SDK/env/package until approved.
- No real evidence fixtures.
- No upload/storage route.
- No protected runtime imports.
- No `LocalAnalysisResult` migration.
- No `analyzeEvidenceFile` change.
- No OCR/mock-provider route behavior change.
- Unsafe wording scan.
- Private identifier scan.
- Prompt safety scan.
- Output schema safety scan.
- Altered/AI-generated wording scan.
- Observation-vs-conclusion separation scan.
- Unsupported evidence limitation probe.
- Timeout/failure behavior probe.
- Retention/privacy flag probe.
- Cost metadata probe.
- Provider payload logging scan.
- No route/UI wiring scan.

Future implementation checks should include lint, build, report semantics, product-photo probes, diff check, protected code diff scan, route/provider/env/package diff scan, protected import scan, upload/storage/object URL scan, unsafe wording scan, private identifier scan, prompt/output safety wording scan, and altered/AI-generated wording scan.

## Safety Wording Rules

Documented safety rules:

- Vision confidence is review signal only.
- Altered/AI-generated-image uncertainty is review signal only.
- Visual inconsistency is manual-review driver only.
- Provider failures are operational limitations only.
- Unsupported evidence is an evidence limitation only.
- No proof language.
- No fake/forged accusation language.
- No fraud-confirmation language.
- No automatic deny/refund wording.
- No final claim decision.
- No single fraud score.
- No customer-facing accusation.

Preferred wording:

- "Manual review recommended."
- "This is a review-support signal."
- "The observation is inconclusive."
- "The uncertainty value should guide reviewer attention only."
- "No external verification was performed."
- "Operational limitation only."
- "Evidence limitation only."

## Specialist Review Findings

Product Strategy Agent: The prompt/output contract protects ClaimGuard's long-term AI/photo intelligence direction while preventing the product from treating Vision as a verdict engine. The 1-100 altered-or-AI-generated-image uncertainty concept is acceptable only as review-priority context.

Architecture and Maintainability Agent: The future output shape must remain a separate sandbox contract, not an extension of `LocalAnalysisResult`, receipt scoring, existing route responses, or report-adapter output. Provider abstraction and mock-before-live remain the right sequence.

Receipt Intelligence Agent: Receipt OCR and receipt parsing remain the OCR-specialized lane. Future Vision prompts may observe receipt layout context only; they must not change receipt parser/scoring/report behavior.

Integration Readiness Agent: No live provider work is appropriate in Phase 4.20. The contract must precede SDK, env, route, upload, provider, retention, and real evidence implementation.

Scoring and Safety Reviewer Agent: The altered-or-AI-generated-image uncertainty field must use uncertainty framing, not confidence-as-proof framing. It must never become a fraud score, evidence truth label, or claim disposition.

Privacy and Evidence Safety Agent: Future prompts and outputs must default to synthetic/anonymized fixtures, reject or redact identifiers, avoid provider payload replay, and include retention/privacy flags before any sandbox implementation.

QA Harness Agent: Future implementation needs dedicated prompt safety, structured output, privacy, failure, unsupported evidence, cost/timeout, altered/AI-generated wording, and observation-vs-conclusion probes before provider calls.

Deployment and Release Agent: Phase 4.20 is documentation/source-of-truth plus narrow semantic coverage only. Commit and push are appropriate only after checks pass, protected runtime files remain untouched, and no deployment occurs.

## Phase Gate Recommendation

Before Phase 4.21, all of these must remain true:

- No live OCR.
- No OpenAI SDK.
- No provider SDKs.
- No environment variables.
- No provider calls.
- No upload implementation.
- No storage implementation.
- No persistence.
- No real evidence.
- No real customer data.
- No provider payloads.
- No customer identifiers.
- No scoring migration.
- No UI changes.
- No live receipt behavior changes.
- Existing OCR route remains exact `fixtureKey` only.
- Existing mock-provider route remains synthetic/mock-only and adapter-only.
- `analyzeEvidenceFile` and `LocalAnalysisResult` remain unchanged.
- No deployment occurs.

Recommended next safe options after Phase 4.20:

Option A: Phase 4.21 OpenAI Vision sandbox schema planning only.

Option B: Phase 4.21 OpenAI Vision sandbox test-fixture policy planning only.

Option C: Phase 4.21 OpenAI Vision sandbox skeleton implementation plan, still no SDK, environment variables, or provider calls.

Do not recommend live OpenAI Vision implementation yet unless Robert explicitly asks to start that path.

## Stop Conditions

Stop future work if:

- Any OpenAI SDK or provider SDK is added.
- Any environment variable is added.
- Any provider call is implemented.
- Any real upload path is implemented.
- Existing OCR route behavior changes.
- Existing mock-provider route behavior changes.
- Multipart or binary files are accepted.
- Storage or persistence is added.
- Real evidence or real identifiers are accepted.
- Protected runtime files are modified.
- `ClaimReviewWorkflow` is modified.
- `ProductPhotoReviewPanel` is routed.
- `analyzeEvidenceFile` behavior changes.
- `LocalAnalysisResult` changes.
- Receipt behavior changes.
- Output wording implies proof, customer wrongdoing, external verification, automatic support action, final claim outcome, or a single fraud score.
- Required checks fail or cannot be interpreted safely.

## Closeout Criteria

Phase 4.20 is ready to close when:

- This OpenAI Vision prompt/output contract planning document exists.
- `ROADMAP.md`, `NEXT_STEPS.md`, `REPO_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `AGENT_LOG.md` reflect Phase 4.20 planning-only status.
- Semantic coverage includes this planning document.
- No runtime/source/route/component/package/config/deployment files changed, except narrow semantic-checker coverage.
- No OpenAI SDK, provider SDK, environment variable, provider call, upload path, storage, persistence, UI wiring, real evidence, live scoring, `ClaimReviewWorkflow` wiring, `ProductPhotoReviewPanel` routing, `LocalAnalysisResult` migration, `analyzeEvidenceFile` changes, OCR route behavior changes, mock-provider route behavior changes, or receipt behavior changes were added.
- Required checks pass.
- The next recommended task is Phase 4.21 schema planning, test-fixture policy planning, or skeleton implementation planning without SDK/env/provider calls, not live provider implementation.
