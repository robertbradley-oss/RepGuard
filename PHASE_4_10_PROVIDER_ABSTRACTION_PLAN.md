# Phase 4.10 Provider Abstraction Plan

Date: 2026-05-31

Primary agent role: Architecture and Maintainability Agent

Supporting reviews: Product Strategy, Receipt Intelligence, Integration Readiness, Scoring and Safety, Privacy and Evidence Safety, QA Harness, Deployment and Release

## Purpose And Scope

Phase 4.10 is a provider abstraction planning-only milestone. ClaimGuard needs a provider abstraction before implementation so future OCR, vision, local, mock, and photo-intelligence providers can be evaluated and replaced without changing receipt behavior, leaking raw evidence, overfitting to one provider response shape, or turning provider output into a ClaimGuard decision.

This milestone designs the future boundary at the documentation level only. It does not add OCR providers, OpenAI Vision implementation, Google/AWS/Tesseract implementation, SDKs, environment variables, provider abstraction code, real uploads, multipart parsing, binary parsing, storage, persistence, UI, real evidence processing, live OCR, live AI/Vision analysis, or photo intelligence implementation. It does not wire `ClaimReviewWorkflow`, route `ProductPhotoReviewPanel`, change `analyzeEvidenceFile`, change `LocalAnalysisResult`, change receipt parser/scoring/report behavior, deploy, or start Phase 4.11.

Phase 4.10 keeps the current route and contract boundaries intact:

- `POST /api/analysis/ocr` remains a JSON-only synthetic fixture route skeleton.
- The route accepts exactly `{ "fixtureKey": "..." }`.
- The route source warning remains the active implementation guardrail.
- The Phase 4.2 fixture harness remains synthetic-only.
- The Phase 4.3 `ocr-extraction-contract` remains the normalization boundary.

## Abstraction Goals

The future provider abstraction should:

- Stay provider-neutral.
- Allow providers to be replaced without changing ClaimGuard review semantics.
- Normalize provider failures into safe operational limitations.
- Expose timeout and cost visibility without turning cost into an evidence score.
- Define a privacy-first payload boundary before evidence leaves ClaimGuard.
- Prevent raw provider output from being treated as a ClaimGuard decision.
- Translate every provider output into ClaimGuard review signals, limitations, and manual-review drivers.
- Remain compatible with the existing `ocr-extraction-contract`.
- Keep OCR extraction, vision reasoning, scoring, privacy, and UI display as separate layers.
- Preserve `External Verification: Not performed` unless a later approved external integration performs verification.

Provider abstraction should support future implementation, but it must not become implementation during this milestone.

## Future Provider Categories

Future provider categories should stay separate because they answer different evidence questions.

OCR text/field extraction provider:

- Reads receipt/order evidence.
- Extracts text blocks, layout cues, pages/images processed, and structured candidate fields.
- Feeds `ocr-extraction-contract`.
- Does not produce case decisions.

Multimodal vision reasoning provider:

- Reviews visual context, screenshots, receipt layout, product photo context, and image limitations.
- Produces visual observations, uncertainty notes, and manual-review drivers.
- Does not replace OCR field extraction when precise receipt text matters.

Local/mock OCR provider:

- Supports development, baseline comparisons, privacy-friendly prototypes, and fallback experiments.
- Uses the same normalized output/failure framing as external providers.
- Must not be treated as production-quality without approved testing.

Future image-forensics/photo-intelligence provider:

- May later produce altered-image or AI-generated-image uncertainty signals.
- May later use a confidence-style 1-100 output if approved.
- Must frame outputs as uncertainty, limitations, and review priority only.

Synthetic/mock provider for tests and route hardening:

- Should come before any live provider adapter.
- Should use synthetic fixtures and safe failure cases.
- Should prove contract boundaries, no-retention markers, safety language, and protected import isolation.

## Future Adapter Interface Planning

Phase 4.10 does not add TypeScript interfaces. The future implementation should plan interface concepts before writing code.

Likely provider adapter concepts:

- Provider name and provider type.
- Provider category: OCR extraction, vision reasoning, local/mock OCR, photo-intelligence, synthetic/mock.
- Provider mode: synthetic, local, sandbox, or live.
- Supported evidence types.
- Supported input kinds, such as receipt image, order screenshot, PDF receipt, product photo, or unknown.
- Input constraints, including MIME type, byte size, page count, image dimensions, and one-evidence-item limits.
- Timeout budget and timeout status.
- Cost estimate fields, such as estimated units, page/image count billed, estimated cents, and budget status.
- Redaction status before provider call.
- Retention status after provider call.
- Provider request summary that excludes raw payloads.
- Provider result summary that excludes raw provider responses by default.
- Provider failure summary.
- Normalized confidence and uncertainty fields.
- Safety limitations.
- Manual-review drivers.
- Privacy markers showing whether file bytes, raw OCR, raw provider payload, provider response IDs, logs, and derived summaries were retained.

The future adapter should return provider-neutral data for normalization. It should not return a provider-specific response object to app UI, receipt scoring, or case review surfaces.

## Future OCR Provider Result Shape

The future OCR provider result shape should be designed to hand off into `ocr-extraction-contract`.

Planned OCR result fields:

- Provider category and mode.
- Evidence kind hint.
- Processing status.
- Extracted text blocks.
- Provider-reported confidence when available.
- Structured candidate fields.
- Pages or images processed.
- Page/image count attempted and completed.
- Incomplete extraction flags.
- Unsupported evidence flags.
- Timeout and failure flags.
- Provider limitations.
- Provider warnings summarized without raw payloads.
- Normalized confidence and field-level confidence.
- Manual-review drivers.
- Privacy markers and retention markers.

The normal app output should not include raw provider payloads. Raw OCR and provider-specific response bodies should remain excluded unless a later retention/redaction policy explicitly approves a different path.

Future OCR provider adapters should feed the provider-neutral OCR extraction contract. They should not bypass it, replace it, mutate `LocalAnalysisResult`, call `analyzeEvidenceFile`, or change live receipt report behavior.

## Future Vision Provider Result Shape

The future OpenAI Vision-style provider result shape should be separate from OCR extraction.

Planned vision result fields:

- Visual context summary.
- Screenshot or layout observations.
- Receipt-layout observations.
- Product photo observations.
- Product context or requested-view completeness notes.
- Altered-image or AI-generated-image uncertainty signal.
- Confidence-style 1-100 uncertainty output only if approved in a later phase.
- Limitations and uncertainty notes.
- Manual-review drivers.
- Safety posture marker.
- Privacy and redaction markers.

Vision output must not include accusation language, final decision language, direct customer-facing fraud claims, or proof claims. A high confidence-style uncertainty output should mean "reviewer should look closer," not "the image is synthetic," "the evidence is altered," or "the customer did something wrong."

Future vision results should be combined with OCR results only in a later review-signal layer after explicit planning. They should not change receipt parser, scoring, report adapter, upload, or case workflow behavior during provider abstraction work.

## Failure Normalization

The abstraction should define a common failure model before live provider implementation.

Common failure categories:

- Timeout.
- Provider unavailable.
- Provider malformed response.
- Unsupported evidence type.
- Input too large.
- Page count too high.
- Image dimension or pixel count too high.
- Redaction failure.
- Provider safety refusal.
- Rate limit.
- Cost limit.
- Internal normalization exception.
- Policy-blocked processing.

Failure outputs should include:

- Failure category.
- Operational status.
- Whether provider processing ran.
- Whether any partial result exists.
- Whether retry is allowed.
- Whether manual review is recommended.
- Safe limitation text.
- Redacted provider summary when available.

Failures must be operational limitations or manual-review drivers, not customer-risk conclusions. Provider timeout, provider refusal, empty OCR, malformed response, or unsupported input must never become evidence of wrongdoing.

## Privacy And Redaction Boundary

The provider abstraction must define privacy before implementation.

Redact or minimize before provider calls:

- Customer names.
- Addresses.
- Emails.
- Phone numbers.
- Full order identifiers unless the exact value is explicitly approved for extraction.
- Tracking numbers.
- Payment details.
- Loyalty/member identifiers.
- Ticket, case, claim, and evidence identifiers.
- Internal support notes.
- Customer messages.
- Support policy decisions.
- Prior review scores or risk labels.
- Raw metadata beyond what is required for processing.
- Filenames, paths, object URLs, storage handles, provider trace URLs, and private background details.

Never log:

- Evidence bytes.
- Raw OCR text from real evidence.
- Raw provider request bodies.
- Raw provider responses.
- Provider payloads.
- Full private identifiers.
- File names or local paths.
- Object URLs or storage handles.
- Payment details, addresses, emails, phone numbers, or tracking numbers.

Safe summaries may include:

- Field presence.
- Field confidence.
- Page or image count.
- Provider category.
- Processing status.
- Generic limitations.
- Redaction applied/not-applied status.
- Retention markers.
- Manual-review drivers.

Retention defaults:

- File retained: false.
- Raw OCR retained: false.
- Raw provider payload retained: false.
- Provider payload logged: false.
- Provider request IDs stored: false unless a later audit policy approves a redacted operational reference.

Deletion expectations:

- Temporary bytes should be discarded after processing.
- Temporary provider artifacts should not be retained by ClaimGuard by default.
- Any later storage path requires retention, deletion, access-control, audit, incident-response, and export policies.

Future storage prerequisites:

- Authentication.
- Organization/team access model.
- Evidence access-control policy.
- Retention and deletion policy.
- Raw OCR visibility policy.
- Provider payload logging policy.
- Audit-log schema that excludes raw evidence.
- Redaction review.
- Incident and rollback procedure.

## Cost And Timeout Boundary

Provider abstraction should make cost and timeout visible before live provider use.

Recommended timeout planning:

- Synchronous OCR route work should start with a short ceiling, likely around 8 to 12 seconds.
- Vision reasoning should have a separate timeout budget from OCR extraction.
- Large PDFs, multi-image cases, or expensive reasoning should wait for queued/background planning.

Cost metering fields should include:

- Provider category.
- Provider mode.
- Estimated request units.
- Pages processed.
- Images processed.
- Estimated cost in cents when available.
- Budget status: within budget, near limit, blocked by budget, or unknown.
- Retry count.
- Partial result marker.

Per-request provider budget:

- One evidence item per request for the first live-provider milestone.
- Page count and image count limits before provider calls.
- Byte-size and pixel-count limits before provider calls.
- No automatic retry by default.
- At most one later approved retry for safe idempotent provider failures after duplicate-cost handling exists.

Queue/background processing considerations:

- Do not queue raw evidence until storage, retention, deletion, audit, and access-control policies exist.
- Queue payloads should use approved short-lived references only after storage policy exists.
- Background processing should use the same redaction, no-retention, timeout, and failure-normalization rules.

Abuse prevention prerequisites:

- Authentication before live provider use.
- Authorization and organization/team context.
- Rate limits.
- File-size and page-count limits.
- MIME sniffing.
- Provider cost budget.
- Operational logging that excludes raw evidence.

## Mock-Before-Live Rule

Phase 4.11 should be mock provider adapter planning only, or a mock provider adapter skeleton only if Robert explicitly approves implementation.

Mock provider work should come before live provider SDKs because it can prove:

- Adapter boundary shape.
- Provider result normalization.
- Failure normalization.
- Timeout and cost metadata shape.
- Privacy/redaction markers.
- No-retention markers.
- Semantic checker coverage.
- Protected import isolation.
- Route safety without real evidence.

Future live provider integration should not happen until:

- The abstraction boundary is planned.
- The mock adapter path is tested.
- Provider payload safety is reviewed.
- Secret and environment handling is planned.
- Real evidence retention/deletion policy is approved.
- Provider cost and timeout constraints are approved.
- Auth and abuse controls are planned.
- Receipt regression gates are defined.

## Relationship To Existing Route And Contract

The existing `POST /api/analysis/ocr` route remains synthetic fixture-key only.

The existing route must not be wired to live providers yet. Its current source-level warning must remain durable:

```ts
// Synthetic fixture route skeleton only. Do not wire this route to uploads,
// UI, providers, storage, or real evidence without a separately approved milestone.
```

The existing `ocr-extraction-contract` remains the normalization boundary for OCR extraction. Future provider adapters should feed the contract, not replace it. A future contract extension may be planned later, but it should preserve the current safety posture:

- Confidence is a review signal.
- Provider failures are operational-only.
- External verification is not performed.
- Manual review remains the final posture.
- Raw provider payloads are excluded from normal output.

`analyzeEvidenceFile` and `LocalAnalysisResult` remain unchanged. Receipt parser, scoring, report mapping, upload behavior, `ClaimReviewWorkflow`, and `ProductPhotoReviewPanel` remain protected until a separate implementation slice explicitly opens them.

## Safety Language Rules

Safety rules for every future provider boundary:

- OCR confidence is a review signal only.
- Vision confidence is a review signal only.
- Field mismatch is a manual-review driver only.
- Altered-image or AI-generated-image confidence is an uncertainty signal only.
- Provider failures are operational limitations only.
- No proof language.
- No fake or forged accusation language.
- No fraud-confirmation language.
- No automatic deny/refund wording.
- No final claim decision.
- No single fraud score.
- No external verification claim unless a later approved integration performs verification.
- No provider output should directly produce customer-facing claim language without a separate safety-reviewed wording contract.

Preferred wording:

- "Manual review recommended."
- "Provider unavailable."
- "OCR confidence is limited."
- "Field extraction is incomplete."
- "This is a review-support signal."
- "No external verification was performed."
- "Additional eligible proof-of-purchase evidence may be needed."
- "Image consistency signal needs reviewer comparison."

## Specialist Review Findings

Product Strategy Agent: Provider abstraction should protect ClaimGuard's broader evidence-intelligence direction and keep providers as replaceable evidence sources, not product decision makers.

Architecture and Maintainability Agent: The future adapter boundary should separate provider category, mode, input constraints, timeout, cost, result summary, failure summary, redaction, retention, and manual-review drivers before any code appears.

Receipt Intelligence Agent: OCR provider output should feed `ocr-extraction-contract`; receipt parser/scoring/report behavior, `analyzeEvidenceFile`, and `LocalAnalysisResult` must remain unchanged.

Integration Readiness Agent: No live provider work is appropriate until mock-provider planning or a mock adapter skeleton proves boundaries, cost/timeout handling, secret planning, and privacy review.

Scoring and Safety Reviewer Agent: Provider confidence must never become proof, a fraud score, an automated support outcome, or a customer accusation.

Privacy and Evidence Safety Agent: Redaction, no-retention defaults, no raw provider payload logging, deletion expectations, and storage prerequisites must be explicit before real evidence leaves the current boundary.

QA Harness Agent: Phase 4.11 should include mock-provider fixtures and semantic/probe coverage before any live provider adapter.

Deployment and Release Agent: Phase 4.10 should be docs/source-of-truth only. Commit/push is allowed only after checks pass and protected runtime files remain untouched. No deployment.

## Phase Gate Recommendation

Recommended next task:

Phase 4.11 mock provider adapter planning only, or mock provider adapter skeleton only if Robert explicitly approves implementation.

Phase 4.11 should not add live providers, SDKs, environment variables, or real evidence processing unless Robert explicitly overrides this.

Before Phase 4.11, these must remain true:

- No live OCR.
- No providers.
- No SDKs.
- No environment variables.
- No provider abstraction implementation.
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

## Stop Conditions

Stop future work if:

- Provider abstraction code is added during a planning-only slice.
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

Phase 4.10 is ready to close when:

- This provider abstraction planning document exists.
- `ROADMAP.md`, `NEXT_STEPS.md`, `REPO_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `AGENT_LOG.md` reflect Phase 4.10 planning-only status.
- No runtime/source/route/component/package/config/deployment files changed, except allowed source-of-truth documentation and narrow semantic-checker coverage.
- No providers, SDKs, environment variables, provider abstraction code, uploads, storage, persistence, UI wiring, real evidence, live scoring, `ClaimReviewWorkflow` wiring, `ProductPhotoReviewPanel` routing, `LocalAnalysisResult` migration, `analyzeEvidenceFile` changes, or receipt behavior changes were added.
- Required checks pass.
- The next recommended task is Phase 4.11 mock provider adapter planning only, or a separately approved mock adapter skeleton, not live provider implementation.
