# Phase 4.8 OCR Route Hardening And Fixture Testing

Date: 2026-05-31

Primary agent role: Architecture & Maintainability Agent

Supporting reviews: Product Strategy, Receipt Intelligence, Integration Readiness, Scoring/Safety, Privacy, QA, Deployment

## Scope

Phase 4.8 is a route-hardening and developer-only fixture testing documentation milestone for the existing synthetic OCR route skeleton.

This milestone does not add live OCR, providers, SDKs, env vars, uploads, multipart parsing, binary parsing, storage, persistence, real evidence processing, UI, upload-flow wiring, `ClaimReviewWorkflow` wiring, `ProductPhotoReviewPanel` routing, `analyzeEvidenceFile` changes, `LocalAnalysisResult` changes, receipt parser/scoring/report changes, deployment, Phase 4.9 work, or AI/Vision/photo analysis.

The only route/probe hardening added in Phase 4.8 is a developer-facing warning in `src/app/api/analysis/ocr/route.ts`, plus probe and semantic coverage proving the warning remains present.

## Route Status

`POST /api/analysis/ocr` exists.

It is:

- Synthetic-only.
- Mock-only.
- JSON-only.
- Exact fixture-key only.
- Provider-free.
- SDK-free.
- Env-free.
- Upload-free.
- Storage-free.
- Persistence-free.
- UI-free.
- Real-evidence-free.
- Receipt-scoring/report-output-free.

It is not live OCR. It is not connected to the upload flow, UI, providers, storage, persistence, receipt scoring, receipt report output, `ClaimReviewWorkflow`, `ProductPhotoReviewPanel`, `analyzeEvidenceFile`, or `LocalAnalysisResult`.

## Developer-Only Testing Purpose

The route exists only to let developers test the future OCR route boundary using synthetic fixture keys. It is a local development and probe surface for validation, isolation, safe response shape, no-retention markers, and review-support-only OCR language.

It must not be used for:

- Customer evidence.
- Real receipt uploads.
- Product damage photos.
- Support ticket attachments.
- Production OCR.
- Provider experiments.
- Customer-facing decisions.
- AI/Vision/photo-analysis experiments.

## Allowed Developer Test Request

The only allowed request style is:

- `POST`.
- `Content-Type: application/json`.
- A JSON object with exactly one field: `fixtureKey`.
- An allowlisted synthetic fixture key from `SYNTHETIC_OCR_FIXTURE_CASES`.

Allowed body shape:

```json
{ "fixtureKey": "clean-receipt-ocr" }
```

Safe local smoke example:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/analysis/ocr" -ContentType "application/json" -Body '{"fixtureKey":"clean-receipt-ocr"}'
```

Other synthetic fixture keys currently covered by the route probe include:

- `amazon-like-order-ocr`
- `missing-total-ocr`
- `missing-merchant-ocr`
- `conflicting-date-total-ocr`
- `noisy-ocr-text`
- `receipt-like-incomplete-ocr`
- `unsupported-non-receipt-text`
- `ambiguous-marketplace-screen-ocr`
- `provider-timeout-synthetic-failure`
- `empty-ocr-output`

Do not add customer-like examples, realistic private identifiers, real filenames, uploaded file examples, object URL examples intended to succeed, provider payload examples intended to succeed, or ticket/customer fields to allowed examples.

## Disallowed Request Examples

The route must reject:

- `multipart/form-data`.
- Binary uploads.
- Base64 images.
- Object URLs.
- Data URLs.
- Image URLs.
- File URLs.
- Storage handles.
- Provider payloads.
- Customer identifiers.
- Extra JSON fields.
- Raw OCR text from real evidence.
- Ticket, order, or customer fields.
- File-like fields.
- Byte-array fields.
- Retention or persistence requests.
- Final support disposition requests.

Disallowed request shapes include:

```json
{ "fixtureKey": "clean-receipt-ocr", "note": "extra field" }
```

```json
{ "fixtureKey": "clean-receipt-ocr", "imageUrl": "https://example.invalid/synthetic-image.png" }
```

```json
{ "fixtureKey": "clean-receipt-ocr", "bytes": [1, 2, 3] }
```

These examples are synthetic rejection examples only. They are not accepted request templates.

## Expected Response Behavior

Successful synthetic responses may include:

- Review-support-only OCR extraction signals.
- Extracted text blocks derived from synthetic fixtures.
- Structured receipt fields.
- Field confidence values.
- Extraction confidence values.
- Manual-review drivers.
- Limitations.
- Safe summaries.
- Unsupported reasons.
- Operational failure reasons for synthetic provider-unavailable cases.
- Review signal level.
- Manual-review requirement.
- No-retention markers.

Route responses must not include:

- Fraud score.
- Fake or forged conclusion.
- Final claim decision.
- Automatic deny or refund wording.
- Customer-facing accusation language.
- `LocalAnalysisResult`.
- Live receipt report output.
- Raw provider payload.
- Raw real OCR.
- External verification claims.

## Safety And Privacy Lock

OCR confidence is a review signal only.

Field mismatch is a manual-review driver only.

Unsupported content is an evidence limitation only.

Synthetic timeout is an operational limitation only.

The route must preserve:

- No proof language.
- No accusation language.
- No real evidence.
- No real customer data.
- No raw OCR retention.
- No provider payload retention.
- No object URLs.
- No storage.
- No persistence.
- No env vars.
- No external calls.
- No live receipt behavior changes.
- No product-photo runtime changes.

Future AI/photo confidence-style outputs, including possible 1-100 signals for AI-generated or altered-photo indicators, must be framed as uncertainty and review priority. They must not be framed as proof of alteration, proof that an image is synthetic, customer intent, or a final claim outcome.

## Route Hardening Review

Current route/probe coverage verifies:

- Exact body shape via `allowedRequestKeys`.
- Unexpected field rejection via `unexpectedFieldFails`.
- Content-type rejection via `unsupportedContentTypeFails`.
- Multipart rejection via `multipartFails`.
- Malformed JSON rejection via `malformedJsonFails`.
- Missing fixture-key rejection.
- Unknown fixture-key rejection.
- URL-like payload rejection.
- File-like and binary-like payload rejection.
- Storage-handle rejection.
- Customer identifier rejection.
- Unsafe wording absence in successful and failure responses.
- No single unsafe score field.
- No-retention markers.
- Provider/env/package absence.
- Protected runtime import isolation.
- Upload/storage/object URL absence.
- No `analyzeEvidenceFile` usage.
- No `LocalAnalysisResult` usage.
- Route/probe semantic coverage.

Phase 4.8 found coverage complete for route behavior and validation. The only hardening gap was developer clarity in the route source. The route now carries a warning that it is a synthetic fixture route skeleton only and must not be wired to uploads, UI, providers, storage, or real evidence without a separately approved milestone. The route probe and semantic checker verify that warning.

## Developer Warning Language

The route source now includes this guardrail:

```ts
// Synthetic fixture route skeleton only. Do not wire this route to uploads,
// UI, providers, storage, or real evidence without a separately approved milestone.
```

This warning is intended for future Codex and developer runs. It is not a UI message and does not change runtime behavior.

## Developer Fixture Testing Checklist

Before changing this route in a future milestone:

- Confirm the milestone explicitly opens route work.
- Confirm whether the milestone is docs-only, synthetic-only, mock-only, or live-provider approved.
- Keep request validation before fixture lookup or normalization.
- Keep accepted requests exact and allowlisted.
- Keep failed requests safe and non-accusatory.
- Keep response output review-support-only.
- Keep no-retention markers false.
- Re-run the route probe directly.
- Re-run `check:product-photo-probes`.
- Re-run `check:report-semantics`.
- Run provider/env/package, protected import, upload/storage/object URL, unsafe wording, and private identifier scans.

## Specialist Review Findings

Product Strategy: Phase 4.8 improves future developer usability without changing product behavior. The route remains a boundary-testing tool, not a customer or support-rep feature.

Architecture & Maintainability: The route is acceptably narrow. The developer warning reduces future scope drift, and the probe/semantic checker make that warning durable.

Receipt Intelligence: The route remains downstream of synthetic OCR fixtures and the provider-neutral extraction contract only. Receipt runtime, parser, scoring, and report output remain unchanged.

Integration Readiness: No provider, SDK, env var, external call, storage, persistence, ticket, email, drive, auth, database, or case queue work exists.

Scoring/Safety: Confidence and review levels remain support signals. No score or output should be treated as a claim outcome.

Privacy: No real evidence, private identifiers, raw OCR retention, provider payload retention, object URL creation, storage, persistence, or logs were added.

QA: Route behavior coverage is complete for the current skeleton. Phase 4.8 adds source-warning coverage and keeps the route probe registered in the non-live probe runner.

Deployment: No deployment is appropriate. The route remains a skeleton and should not be advertised as live OCR.

## Phase Gate Recommendation Before 4.9

Before Phase 4.9, these must remain true:

- The repo is clean and synced.
- Phase 4.8 docs and route warning coverage are committed.
- Route behavior remains synthetic-only and exact fixture-key only.
- Provider/env/package scans remain clean.
- Protected runtime files remain untouched.
- Receipt behavior remains unchanged.
- No real evidence or customer data path exists.

Recommended safe next options:

- Option A: Phase 4.9 provider selection planning only.
- Option B: Phase 4.9 OCR provider abstraction planning only.
- Option C: Phase 4.9 developer-only route access guard planning, if needed.

Phase 4.9 should not add a live provider unless Robert explicitly approves a named live/provider implementation slice.

## Stop Conditions

Stop future work if:

- Any real upload path is implemented.
- Multipart or binary files are accepted.
- Any provider, SDK, env var, credential, external call, provider payload, storage, or persistence appears.
- Real evidence or real identifiers are accepted.
- Protected runtime files are modified.
- `ClaimReviewWorkflow` is modified.
- `ProductPhotoReviewPanel` is routed.
- `analyzeEvidenceFile` behavior changes.
- `LocalAnalysisResult` changes.
- Receipt behavior changes.
- Checks fail.
- Scope expands beyond route hardening, developer-only fixture documentation, or explicitly approved future planning.
