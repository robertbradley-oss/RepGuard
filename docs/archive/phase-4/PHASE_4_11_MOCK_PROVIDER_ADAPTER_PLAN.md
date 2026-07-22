# Phase 4.11 Mock Provider Adapter Plan

Date: 2026-05-31

Primary agent role: Architecture and Maintainability Agent

Supporting reviews: Product Strategy, Receipt Intelligence, Integration Readiness, Scoring and Safety, Privacy and Evidence Safety, QA Harness, Deployment and Release

## Purpose And Scope

Phase 4.11 is a mock provider adapter planning-only milestone. ClaimGuard needs a mock adapter plan before live provider adapters so the future provider boundary can be tested with synthetic inputs, safe failure states, privacy markers, timeout and cost metadata, and review-support wording before any external OCR or vision provider can touch evidence.

This milestone is planning only. It does not add OCR providers, OpenAI Vision implementation, Google/AWS/Tesseract implementation, SDKs, environment variables, provider abstraction code, mock provider adapter code, uploads, multipart parsing, binary parsing, storage, persistence, UI, real evidence processing, live OCR, live AI/Vision analysis, photo intelligence implementation, deployment, or Phase 4.12 work.

Current boundaries remain unchanged:

- `POST /api/analysis/ocr` remains a JSON-only synthetic fixture route skeleton.
- The route accepts an exact JSON body containing only `fixtureKey`.
- The route source warning remains the implementation guardrail.
- The Phase 4.2 fixture harness remains synthetic-only.
- The Phase 4.3 `ocr-extraction-contract` remains the OCR normalization boundary.
- `analyzeEvidenceFile`, `LocalAnalysisResult`, `ClaimReviewWorkflow`, `ProductPhotoReviewPanel`, receipt parser, scoring, report mapping, upload behavior, and receipt behavior remain unchanged.

## Mock-Before-Live Rationale

The next implementation should be mock-only before any OpenAI Vision, Google, AWS, Tesseract, or external provider work. Mock adapter work can prove the shape of the provider boundary without moving real evidence, adding credentials, or overfitting ClaimGuard to a provider response.

A future mock adapter should prove:

- Provider interface shape.
- Result normalization.
- Timeout and failure modeling.
- Cost and usage metadata modeling.
- Privacy and retention flags.
- Safety wording constraints.
- Route isolation.
- Probe coverage.

The mock adapter should be treated as a boundary test source, not a production analysis path. It should help ClaimGuard learn how provider output will become review signals, limitations, and manual-review drivers while keeping live providers blocked.

## Future Mock Adapter Categories

Future mock adapters should cover the provider categories from Phase 4.10 with synthetic behavior only:

- Mock OCR provider for receipt text blocks, structured receipt fields, field confidence, and OCR limitations.
- Mock multimodal vision reasoning provider for visual context, screenshot/layout observations, product-photo observations, and uncertainty placeholders.
- Mock provider failure source for unavailable, malformed, refused, and internal normalization cases.
- Mock timeout source for elapsed-time and timed-out status behavior.
- Mock unsupported evidence source for out-of-scope file kind or evidence kind responses.
- Mock cost/usage metadata source for synthetic page/image counts, unit estimates, estimated cents, and budget status.
- Mock redaction-status source for synthetic/not-applicable redaction and privacy marker behavior.

These categories should remain provider-free and should not reference real provider payloads, trace IDs, dashboard links, customer records, or evidence files.

## Future File And Module Boundary

Suggested future implementation files for Phase 4.12, if Robert explicitly approves implementation:

- `src/lib/analysis/providers/mock-provider-adapter.ts`
- `src/lib/analysis/providers/mock-provider-adapter.probe.ts`

Alternative names are acceptable if they stay equally narrow and explicit. Phase 4.11 does not create these files.

The future mock adapter module must stay isolated from:

- Live route upload flow.
- `analyzeEvidenceFile`.
- `LocalAnalysisResult`.
- `report-adapter`.
- UI components.
- Storage.
- Environment/config/secrets.
- Provider SDKs.
- Case queues, integrations, persistence, and live receipt behavior.

The future module should be imported only by its own probe at first. If a later route milestone uses it, the route connection must be separately approved and covered by route isolation probes.

## Future Mock Adapter Input Shape

The future mock adapter should accept only synthetic/developer test inputs:

- Synthetic fixture key.
- Provider mode: mock/synthetic only.
- Evidence type hint, such as receipt, order screenshot, product photo, or unknown.
- Requested mock behavior: success, timeout, unavailable, malformed, unsupported, or empty result.

The future mock adapter must reject:

- Real files.
- Base64 images.
- URLs.
- Object URLs.
- Storage handles.
- Customer identifiers.
- Raw real OCR text.
- Provider payloads.
- Ticket, order, or customer fields.
- Filenames, local paths, payment details, addresses, emails, phone numbers, tracking values, and case or claim identifiers.

The input should not require a provider name, credential, storage reference, upload object, `File`, `Blob`, bytes, or live evidence handle.

## Future Mock OCR Output Shape

The future mock OCR provider output should be provider-neutral and compatible with the existing OCR extraction contract.

Planned mock OCR output fields:

- Provider name, provider type, and provider mode.
- Processing status.
- Evidence kind hint.
- Extracted text block candidates.
- Candidate structured fields.
- Simulated provider confidence when useful.
- Synthetic page or image count metadata.
- Synthetic timeout metadata.
- Synthetic cost and usage metadata.
- Provider limitation list.
- Failure status when applicable.
- Manual-review drivers.
- Privacy and retention markers.
- Handoff compatibility with `ocr-extraction-contract`.

The mock OCR adapter should feed the existing OCR extraction contract rather than bypassing it. It should not mutate `LocalAnalysisResult`, call `analyzeEvidenceFile`, replace the receipt parser, or change receipt report behavior.

## Future Mock Vision Output Shape

The future mock vision provider output should remain separate from receipt OCR extraction.

Planned mock vision output fields:

- Provider name, provider type, and provider mode.
- Visual context summary.
- Screenshot and layout observations.
- Product photo observations.
- Product context or requested-view completeness notes.
- Altered-image or AI-generated-image uncertainty signal placeholder.
- Confidence-style 1-100 uncertainty value only as a synthetic placeholder.
- Limitations.
- Manual-review drivers.
- Safety posture marker.
- Privacy and retention markers.

Mock vision output must avoid accusation language, final decision language, proof language, direct customer-facing claim language, and any wording that treats the uncertainty value as a truth finding. A high uncertainty placeholder should mean reviewer attention is warranted, not that an image is synthetic, altered, or associated with customer wrongdoing.

## Failure And Timeout Simulation

Future mock cases should model:

- Timeout.
- Provider unavailable.
- Malformed provider response.
- Unsupported evidence.
- Empty output.
- Rate limit or cost limit.
- Redaction failure.
- Safety refusal.
- Internal normalization error.

Every failure must normalize into operational limitations or manual-review drivers, not customer-risk conclusions. Provider timeout, unavailable status, malformed output, unsupported evidence, empty output, redaction failure, safety refusal, and cost limit states should all be boring operational or evidence-coverage limits.

Safe failure wording:

- "Provider unavailable."
- "Manual review recommended."
- "Analysis output could not be normalized."
- "Unsupported evidence for this synthetic mock path."
- "No external verification was performed."
- "This is an operational limitation, not a customer-risk signal."

## Privacy And Retention Flags

Future mock output metadata should include these defaults:

- File retained: false.
- Raw OCR retained: false.
- Provider payload retained: false.
- Provider payload logged: false.
- Redaction performed: synthetic/not applicable.
- External network called: false.
- Storage used: false.
- Environment used: false.

The mock adapter should never log raw OCR, provider request bodies, provider raw responses, file names, local paths, object URLs, customer identifiers, order identifiers, addresses, emails, phone numbers, payment values, tracking values, private metadata, or screenshots.

## Relationship To Existing Route And Contract

The existing `POST /api/analysis/ocr` route remains exact fixture-key only.

The existing route should not call the mock adapter unless separately approved in Phase 4.12. Phase 4.11 does not change route code or route behavior.

The existing `ocr-extraction-contract` remains the receipt OCR normalization boundary. Future mock OCR adapter output should feed that contract or an approved extension of it. Future mock vision adapter output should stay separate from receipt scoring until a later approved signal-combination phase.

`analyzeEvidenceFile` and `LocalAnalysisResult` remain unchanged. Receipt parser, scoring, report adapter, upload behavior, `ClaimReviewWorkflow`, and `ProductPhotoReviewPanel` remain protected.

## Future Phase 4.12 QA And Probe Requirements

A future Phase 4.12 mock adapter skeleton should include probes and scans for:

- Mock adapter import/isolation.
- Mock OCR success.
- Mock vision success.
- Mock timeout failure.
- Mock unavailable failure.
- Mock malformed response.
- Mock unsupported evidence.
- Mock privacy flags.
- No external network call.
- No environment usage.
- No provider SDK/package scan.
- No upload/storage/object URL scan.
- No protected runtime import scan.
- Unsafe wording scan.
- Private identifier rejection scan.
- No `LocalAnalysisResult` migration scan.
- No `analyzeEvidenceFile` change scan.

Required Phase 4.12 checks should include lint, build, report semantics, product-photo probes, diff check, protected code diff scan, route/provider/env/package diff scan, protected import scan, upload/storage/object URL scan, unsafe wording scan, and private identifier scan.

## Safety Language Rules

Future mock adapter output and documentation must preserve these rules:

- OCR confidence is review signal only.
- Vision confidence is review signal only.
- Altered/AI-generated-image confidence is uncertainty signal only.
- Field mismatch is manual-review driver only.
- Provider failures are operational limitations only.
- Unsupported evidence is an evidence limitation only.
- No proof language.
- No fake/forged accusation language.
- No fraud-confirmation language.
- No automatic deny/refund wording.
- No final claim decision.
- No single fraud score.
- No external verification claim unless a later approved integration performs verification.

## Specialist Review Findings

Product Strategy Agent: Mock-before-live protects ClaimGuard's evidence intelligence direction by letting the team test provider behavior without turning AI/OCR into a decision maker.

Architecture and Maintainability Agent: The future adapter should be an isolated provider test boundary, likely under `src/lib/analysis/providers/`, with its own probe and no live runtime imports.

Receipt Intelligence Agent: Mock OCR output should feed `ocr-extraction-contract`; receipt parser/scoring/report behavior, `analyzeEvidenceFile`, and `LocalAnalysisResult` must remain unchanged.

Integration Readiness Agent: Live provider work remains blocked. No SDK, credential, env var, provider payload, provider adapter implementation, upload handling, storage, persistence, or real evidence path belongs in Phase 4.11.

Scoring and Safety Reviewer Agent: OCR, vision, and altered-image confidence must remain review or uncertainty signals only. No mock output should become proof, a claim outcome, or a single fraud score.

Privacy and Evidence Safety Agent: The future mock adapter should accept only synthetic keys/modes/hints and reject raw files, base64, URLs, object URLs, storage handles, identifiers, raw OCR, and provider payloads.

QA Harness Agent: Phase 4.12 needs adapter probes plus protected import, package/env, network, upload/storage/object URL, wording, identifier, `LocalAnalysisResult`, and `analyzeEvidenceFile` scans.

Deployment and Release Agent: Phase 4.11 is docs/source-of-truth only. Commit/push is allowed only after checks pass, protected runtime files remain untouched, and no deployment occurs.

## Phase Gate Recommendation

Before Phase 4.12, all of these must remain true:

- No live OCR.
- No providers.
- No SDKs.
- No environment variables.
- No provider abstraction implementation.
- No mock adapter implementation during Phase 4.11.
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
- No deployment.

Recommended next task:

Phase 4.12 mock provider adapter skeleton implementation, if Robert explicitly approves implementation.

Phase 4.12 should remain mock-only, provider-free, SDK-free, env-free, upload-free, storage-free, UI-free, persistence-free, and real-evidence-free. It should implement only the isolated mock adapter skeleton and probe coverage described here, not live AI/Vision/photo analysis.

## Stop Conditions

Stop future work if:

- Mock provider adapter code is added during Phase 4.11.
- Provider abstraction code is added during Phase 4.11.
- Any live provider work is implemented.
- Any SDK, credential, environment variable, package dependency, provider call, external call, upload path, storage path, persistence layer, or deployment config appears without explicit approval.
- Any multipart, binary, object URL, image URL, data URL, storage handle, provider payload, raw OCR, real evidence, or customer identifier path appears.
- Protected runtime files are modified.
- `ClaimReviewWorkflow` is modified.
- `ProductPhotoReviewPanel` is routed.
- `analyzeEvidenceFile` behavior changes.
- `LocalAnalysisResult` changes.
- Receipt parser/scoring/report behavior changes.
- Safety wording implies proof, customer wrongdoing, external verification, automatic support action, or final claim outcome.
- Required checks fail or cannot be interpreted safely.

## Closeout Criteria

Phase 4.11 is ready to close when:

- This mock provider adapter planning document exists.
- `ROADMAP.md`, `NEXT_STEPS.md`, `REPO_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `AGENT_LOG.md` reflect Phase 4.11 planning-only status.
- No runtime/source/route/component/package/config/deployment files changed, except allowed source-of-truth documentation and narrow semantic-checker coverage.
- No providers, SDKs, environment variables, provider abstraction code, mock adapter code, uploads, storage, persistence, UI wiring, real evidence, live scoring, `ClaimReviewWorkflow` wiring, `ProductPhotoReviewPanel` routing, `LocalAnalysisResult` migration, `analyzeEvidenceFile` changes, or receipt behavior changes were added.
- Required checks pass.
- The next recommended task is Phase 4.12 mock provider adapter skeleton implementation only if Robert explicitly approves it, not live provider implementation.
