# Phase 4.5 Server-Side OCR Route Skeleton Plan

This is a planning-only Phase 4.5 checkpoint under `ROADMAP.md` heading "Phase 4: Stronger OCR and AI Integrations".

It prepares an implementation-ready plan for a future synthetic-only/mock-provider server-side OCR route skeleton. It does not implement a route, add OCR providers, add SDKs, add environment variables, add uploads, add storage, add persistence, process real evidence, add UI, wire live analyzer paths, deploy, or start Phase 4.6.

## Current State

Phase 4.0 documented AI/OCR/photo intelligence readiness. Phase 4.1 documented the provider-neutral OCR/provider architecture. Phase 4.2 implemented the non-live synthetic OCR fixture harness in `src/lib/analysis/ocr-fixture-harness.ts` with probe coverage. Phase 4.3 implemented the non-live provider-neutral OCR extraction contract in `src/lib/analysis/ocr-extraction-contract.ts` with probe coverage. Phase 4.4 documented future server-side OCR route and data-flow requirements in `PHASE_4_4_SERVER_SIDE_OCR_ROUTE_DATA_FLOW_PLAN.md`.

The latest pushed checkpoint before this milestone is `7f8090b` (`docs: plan phase 4.4 server-side ocr route data flow`).

Current boundaries remain unchanged:

- No server-side OCR route exists.
- No OCR provider calls, SDKs, env vars, uploads, storage, persistence, real evidence handling, live scoring, or integrations have been added.
- `ClaimReviewWorkflow` remains unwired.
- `ProductPhotoReviewPanel` remains unrouted.
- `analyzeEvidenceFile` behavior remains unchanged.
- `LocalAnalysisResult` remains unchanged and receipt-shaped.
- Receipt behavior remains unchanged.
- `/case-command-center` remains directly reachable, unlinked from `/`, static/local, synthetic-only, non-persistent, off-white/parchment, and manual-review framed.

## Purpose And Scope

The future server-side OCR route skeleton should exist before any provider integration so ClaimGuard can test validation, isolation, safe failure states, privacy markers, output shape, and route-level review language without moving real evidence or committing to a provider.

Phase 4.5 does:

- Define the future skeleton route boundary.
- Define accepted and rejected synthetic request shapes.
- Define the future output contract using the existing Phase 4.2 fixture harness and Phase 4.3 extraction contract.
- Define validation and safe failure behavior.
- Define isolation rules for live analyzer, UI, upload, receipt, and case-command-center paths.
- Define Phase 4.6 probes/checks and pass/fail gates.
- Confirm privacy and safety wording rules before implementation.

Phase 4.5 does not:

- Create `POST /api/analysis/ocr`.
- Add any route file, app route, API handler, provider adapter, upload handler, UI, source runtime path, package dependency, environment variable, storage path, persistence layer, or deployment change.
- Process real evidence or accept real customer files.
- Change receipt analysis, scoring, parsing, report mapping, `LocalAnalysisResult`, or any live workflow behavior.

## Future Phase 4.6 Implementation Boundary

The planned Phase 4.6 route skeleton is:

- `POST /api/analysis/ocr`

The Phase 4.6 skeleton must remain:

- Mock-only.
- Provider-free.
- SDK-free.
- Env-free.
- Storage-free.
- Persistence-free.
- UI-free.
- Upload-flow-free.
- Live-analyzer-free.
- Receipt-behavior-free.

Phase 4.6 should prove route shape and safety controls only. It should not make server OCR live, should not expose a real upload flow, and should not become a receipt analyzer migration.

## Future Accepted Inputs

The Phase 4.6 route may accept JSON-only synthetic request bodies.

Allowed request forms:

- A fixture case key from an allowlist matching `SYNTHETIC_OCR_FIXTURE_CASES`.
- A synthetic OCR fixture-like payload only if it matches the Phase 4.2 fixture constraints and contains no customer identifiers or binary content.
- Optional synthetic mode marker, such as `processingMode: "synthetic-contract-only"`, if useful for route validation.

The route must explicitly reject:

- Binary file uploads.
- Real customer files.
- Real evidence images or PDFs.
- Multipart form data.
- Object URLs, image URLs, data URLs, or storage handles.
- Customer identifiers, including names, addresses, emails, phone numbers, order numbers, tracking numbers, ticket IDs, case IDs, claim IDs, or evidence IDs.
- Raw provider payloads or provider response replay bodies.
- Requests that ask for retention, persistence, logging of OCR text, final support disposition, or receipt report output.

Real file upload support is rejected for Phase 4.6. Upload support requires a later privacy, retention, deletion, auth, size-limit, MIME-sniffing, logging, and incident-response milestone.

## Future Output Contract

The future skeleton should return provider-neutral, review-support-only OCR extraction signals derived from:

- The existing OCR fixture harness: `src/lib/analysis/ocr-fixture-harness.ts`.
- The existing OCR extraction contract: `src/lib/analysis/ocr-extraction-contract.ts`.

The response should include:

- Extracted text block summary.
- Structured fields.
- Field confidence.
- Extraction confidence.
- Manual-review drivers.
- Limitations.
- Safe summary.
- Unsupported reason, when applicable.
- Provider failure reason, when the synthetic failure fixture is used.
- Review signal level.
- Requires manual review.
- Privacy markers showing synthetic-only, provider-free, storage-free, persistence-free, and real-evidence-free handling.

The response must not include:

- A fraud score.
- A conclusion that evidence is fabricated, altered, or forged.
- A final claim decision.
- Automatic deny/refund wording.
- Live receipt report output.
- `LocalAnalysisResult`.
- Customer-facing accusation language.
- External verification claims.
- Raw OCR retention markers that imply storage happened.

## Future Route Isolation Rules

Phase 4.6 must not import into or modify:

- `src/components/ClaimReviewWorkflow.tsx`.
- `src/components/ProductPhotoReviewPanel.tsx`.
- `src/lib/analysis/analyzer.ts`.
- `src/lib/analysis/types.ts`.
- `src/lib/analysis/report-adapter.ts`.
- Upload flow files.
- Receipt parser, scoring, live fixtures, or report behavior.
- Case command center route or shell files.
- Production UI paths.

The future route may import the Phase 4.2 fixture harness and Phase 4.3 extraction contract only for synthetic/mock route behavior. If the route needs helper functions, those helpers should stay route-local or inside a new route-skeleton-only module that is not imported by live analyzer, UI, upload, report, or case workflow paths.

The future route must not call:

- `analyzeEvidenceFile`.
- `extractOcr`.
- `parseReceiptText`.
- `scoreAnalysis`.
- `mapLocalAnalysisToReport`.
- Product-photo analyzer, routing adapter, or review panel code.

## Future Validation Behavior

Phase 4.6 validation should be route-first and reject unsupported input before any fixture lookup or normalization.

Required validation:

- Method validation: only `POST` is allowed.
- Content-type validation: only `application/json` is allowed.
- JSON body validation: malformed JSON returns a safe validation failure.
- Fixture key allowlist: fixture keys must match known synthetic fixture keys.
- Synthetic payload validation: if allowed, the payload must match the approved synthetic shape and must not contain forbidden private keys.
- Oversized JSON body consideration: define a small maximum request size suitable for fixture-only testing.
- Customer identifier denial: reject fields or values that look like customer names, addresses, emails, phone numbers, order numbers, tracking numbers, ticket IDs, case IDs, claim IDs, evidence IDs, or provider request IDs.
- Binary/multipart denial: reject `multipart/form-data`, file-like keys, `File`, `Blob`, buffers, byte arrays, object URLs, image URLs, data URLs, and storage handles.

Malformed, unknown, or unsupported requests should return operational validation or unsupported-skeleton states, not customer-risk conclusions.

## Future Failure Behavior

Phase 4.6 should model every failure as a route limitation, validation issue, unsupported synthetic input, operational fixture state, or manual-review fallback.

Planned behavior:

- Invalid method: return method-not-allowed with no analysis result.
- Invalid content type: return unsupported content type with JSON-only requirement.
- Malformed JSON: return malformed request with no fixture processing.
- Missing fixture key: return missing synthetic fixture key.
- Unknown fixture key: return unknown synthetic fixture key.
- Unsupported synthetic fixture: return unsupported synthetic OCR extraction with manual-review fallback.
- Synthetic provider timeout fixture: return provider-failure/operational limitation using the existing synthetic timeout fixture.
- Empty OCR output fixture: return empty-output limitation and manual-review requirement.
- Internal normalization exception: return normalization unavailable and manual-review fallback, with no raw exception details, no private payload echo, and no customer-risk conclusion.

Failure responses should preserve:

- `requiresManualReview: true` when evidence cannot be normalized.
- `reviewSignalLevel: "operational"` for synthetic provider timeout/unavailable states.
- Safe limitations describing route or extraction limits.
- No final decision language.
- No automatic support action language.

## Phase 4.6 QA And Probe Requirements

Phase 4.6 should add focused tests/probes before commit:

- Route module import/isolation probe.
- Synthetic accepted fixture probe.
- Synthetic rejected input probe.
- Timeout/failure fixture probe.
- Unsafe wording scan.
- No provider/env/package scan.
- No protected runtime import scan.
- No upload/storage/object URL scan.
- No `LocalAnalysisResult` migration scan.
- No `analyzeEvidenceFile` change scan.
- No receipt parser/scoring/report behavior scan.
- No `ClaimReviewWorkflow` or `ProductPhotoReviewPanel` wiring scan.

Required checks for Phase 4.6:

- `git status --short --branch`.
- `git log -1 --oneline`.
- `git diff --stat`.
- `npm.cmd run lint`.
- `npm.cmd run build`.
- `npm.cmd run check:report-semantics`.
- `npm.cmd run check:product-photo-probes`.
- `git diff --check`.
- Protected code diff scan.
- Route/provider/env/package diff scan.
- Unsafe wording scan.

## Safety Language Rules

OCR confidence is a review signal, not proof.

Field mismatch is a manual-review driver, not a fraud verdict.

Synthetic provider timeout is an operational limitation, not customer risk.

Unsupported content is an evidence limitation, not suspicious behavior by itself.

Amazon-like structure validation is a readiness and structure hint only. It should support reviewer comparison of order/date/total cues and section presence, not source verification or external validation.

The route skeleton and docs must avoid:

- Fraud-confirmation language.
- Evidence-truth conclusions.
- Accusation language that labels evidence as fabricated, altered, or forged as a conclusion.
- Automatic deny/refund wording.
- Final-outcome language.
- A single fraud score.
- Claims that OCR, AI, or photo intelligence proves customer intent or evidence authenticity.

Future AI/photo intelligence may eventually produce a confidence-style 1-100 output for possible AI-generated or altered-photo indicators, but it must always be framed as uncertainty, review priority, and limitations. It must not be framed as proof of alteration, proof that an image is synthetic, evidence of customer intent, or a final claim outcome.

## Privacy Rules

Phase 4.6 must remain synthetic-only.

It must include:

- No real evidence.
- No real customer data.
- No customer names, addresses, emails, phone numbers, order numbers, tracking numbers, ticket IDs, case IDs, claim IDs, or evidence IDs.
- No file retention.
- No raw OCR retention.
- No provider payload retention.
- No logs containing OCR text.
- No object URLs.
- No storage.
- No persistence.
- No provider request IDs or trace URLs.
- No raw exception detail that echoes request bodies.

Route logs, if any, should be limited to operational skeleton status and should not include synthetic OCR text blocks or structured field values unless a later logging policy explicitly allows redacted aggregate counts.

## Phase Gate Recommendation

Phase 4.6 may implement the route skeleton only if all of these are true:

- The skeleton remains JSON-only.
- The skeleton remains synthetic-only.
- The skeleton remains mock-only.
- The skeleton remains provider-free, SDK-free, env-free, upload-free, storage-free, persistence-free, UI-free, live-analyzer-free, and receipt-behavior-free.
- The route accepts only allowlisted synthetic fixture keys or an explicitly approved synthetic fixture-like payload.
- The route rejects real files, binary uploads, multipart data, object URLs, storage handles, provider payloads, and customer identifiers.
- The route uses the Phase 4.2 fixture harness and Phase 4.3 extraction contract as the only OCR source/normalization path.
- Probes cover accepted, rejected, timeout/failure, unsupported, empty, and normalization-exception paths.
- Protected runtime, UI, upload, report, receipt, case command center, provider, package, config, and env files remain untouched.
- Safety/privacy scans pass.
- Receipt behavior remains unchanged.

Phase 4.6 should not start during Phase 4.5. The next task should be an explicit Phase 4.6 synthetic-only route skeleton implementation request if Robert wants to proceed.

## Specialist Review Findings

Primary agent: Architecture & Maintainability Agent, because this milestone defines a future route boundary and isolation plan.

Specialist review findings:

- Product Strategy Agent: The route skeleton should advance evidence intelligence without narrowing ClaimGuard into a receipt-only tool or jumping to live provider work.
- Architecture & Maintainability Agent: The future route should be isolated, route-local, and contract-driven through Phase 4.2 and 4.3 only.
- Receipt Intelligence Agent: Receipt behavior, parser/scoring/report mapping, `analyzeEvidenceFile`, and `LocalAnalysisResult` must remain unchanged.
- Integration Readiness Agent: Provider work remains blocked; no SDK, env var, provider payload, provider metadata, or real OCR integration belongs in Phase 4.6.
- Scoring & Safety Reviewer Agent: Confidence and review signal levels must not become a fraud score, final decision, or customer accusation.
- Privacy & Evidence Safety Agent: JSON-only synthetic inputs are the correct first route boundary; real files, identifiers, logs, retention, storage, and object URLs remain blocked.
- QA Harness Agent: Phase 4.6 needs route-level probes plus import/privacy/protected-file scans before commit.
- Deployment & Release Agent: Phase 4.5 has no deployment. Phase 4.6 should require clean status, full checks, and explicit commit/push discipline.

## Stop Conditions

Stop Phase 4.6 immediately if:

- Any real route behavior accepts file uploads, multipart data, object URLs, storage handles, or real evidence.
- Any OCR provider, SDK, env var, credential, provider payload, or provider trace appears.
- Any protected runtime, UI, upload, receipt, report, scoring, parser, fixture, package, config, deployment, storage, persistence, integration, or case-queue file is modified outside the approved skeleton scope.
- `ClaimReviewWorkflow` is modified.
- `ProductPhotoReviewPanel` is routed.
- `analyzeEvidenceFile` behavior changes.
- `LocalAnalysisResult` changes.
- Receipt behavior changes.
- Safety wording implies proof, wrongdoing, external verification, automatic action, or final claim disposition.
- Required checks fail.

## Closeout Criteria

Phase 4.5 is ready to close when:

- This document exists and covers the Phase 4.6 route skeleton boundary, accepted/rejected inputs, output contract, isolation rules, validation/failure behavior, QA/probes, safety language, privacy rules, phase gate, and stop conditions.
- `ROADMAP.md`, `NEXT_STEPS.md`, `REPO_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `AGENT_LOG.md` reflect Phase 4.5 planning-only status.
- No runtime/source/route/component/script/package/config/deployment files changed, except source-of-truth documentation.
- Required checks pass.
- The next recommended task is Phase 4.6 synthetic-only/mock-provider route skeleton implementation, not live OCR/provider implementation.
