# Phase 4.15 Mock Adapter Route Integration Plan

Date: 2026-05-31

Primary agent role: Architecture and Maintainability Agent

Supporting reviews: Product Strategy, Receipt Intelligence, Integration Readiness, Scoring and Safety, Privacy and Evidence Safety, QA Harness, Deployment and Release

## Purpose And Scope

Phase 4.15 is a planning-only milestone for possible future mock adapter route integration.

This milestone plans how a later approved slice could expose the existing Phase 4.12 mock provider adapter through an API boundary while keeping ClaimGuard synthetic-only, mock-only, provider-free, and manual-review-safe.

Phase 4.15 does not implement route integration. It does not change the current `POST /api/analysis/ocr` route behavior. After Phase 4.15, the existing OCR route still accepts an exact JSON body containing only `fixtureKey`, still uses the Phase 4.2 OCR fixture harness and Phase 4.3 OCR extraction contract, and still is not wired to `runMockOcrProvider` or `runMockVisionProvider`.

This milestone does not add OpenAI Vision implementation, Google/AWS/Tesseract implementation, OCR providers, SDKs, environment variables, real uploads, multipart parsing, binary parsing, storage, persistence, UI, real evidence processing, live OCR, live AI/Vision/photo analysis, `ClaimReviewWorkflow` wiring, `ProductPhotoReviewPanel` routing, `analyzeEvidenceFile` changes, `LocalAnalysisResult` changes, receipt parser/scoring/report changes, deployment, or Phase 4.16 work.

No live provider, upload, storage, UI, or real evidence path is added.

## Current Route And Adapter Boundary

Current route:

- `POST /api/analysis/ocr` is a JSON-only synthetic fixture route skeleton.
- The request body must contain exactly `fixtureKey`.
- The route rejects multipart, non-JSON content, unexpected fields, URLs, storage handles, provider payloads, private identifier fields, file-like shapes, binary-like shapes, and unknown fixture keys.
- The route imports only the synthetic OCR fixture harness and the OCR extraction contract.
- The route has a source-level warning not to wire uploads, UI, providers, storage, or real evidence without a separately approved milestone.

Current mock adapter:

- `runMockOcrProvider` and `runMockVisionProvider` live in `src/lib/analysis/providers/mock-provider-adapter.ts`.
- The adapter accepts only `providerMode`, `evidenceTypeHint`, `behavior`, and optional synthetic `fixtureKey`.
- The adapter rejects file-like input, base64-like input, URLs, object/data/image/file URLs, storage handles, private identifiers, provider payloads, raw real OCR, and non-synthetic modes.
- The adapter is imported by its own probe and the non-live analysis probe runner only.

## Future Integration Purpose

A future mock adapter route integration may be useful because it could:

- Test provider abstraction behavior through an API boundary.
- Simulate mock OCR provider results through a route response.
- Simulate mock vision provider results through a route response.
- Test failure and timeout handling through route responses.
- Test privacy and retention flags through route responses.
- Test future evidence-intelligence routing without live providers.
- Exercise route validation, response shaping, and safety wording before any live provider work exists.

That usefulness does not justify wiring during Phase 4.15. Route integration should happen only after Robert explicitly approves a separate implementation milestone.

## Future Request Shape Options

### Option A: Keep `/api/analysis/ocr` Unchanged And Add A Separate Mock Route

Future route example name: `/api/analysis/mock-provider`.

This would keep the existing OCR route exact fixture-key only and create a clearly separate synthetic mock-provider boundary for both mock OCR and mock vision.

Advantages:

- Preserves current OCR route regression safety.
- Avoids mixing OCR fixture contract behavior with broader mock vision behavior.
- Makes mock vision obviously separate from receipt scoring and live receipt analysis.
- Keeps future route probes focused on a new route without changing the current route's exact body rule.

Tradeoffs:

- Adds another API route surface if implementation is later approved.
- Requires a separate route probe, semantic coverage, and source-of-truth guidance.

Recommendation: safest future option if a route integration skeleton is approved.

### Option B: Extend `/api/analysis/ocr` With An Explicit Synthetic Mode

Possible future shape, not implemented:

```json
{
  "mode": "mock-provider",
  "providerType": "mock-ocr",
  "providerMode": "mock-synthetic",
  "behavior": "success",
  "fixtureKey": "clean-receipt-ocr"
}
```

Advantages:

- Keeps OCR-related mock behavior near the current OCR route.
- Could be useful if the future milestone only exposes mock OCR and never exposes mock vision.

Tradeoffs:

- Breaks the current exact `fixtureKey` request rule.
- Increases regression risk for the existing synthetic OCR route.
- Makes it easier to accidentally treat a developer mock-provider path as a production OCR path.
- Becomes awkward for mock vision, which should stay separate from receipt scoring and OCR extraction.

Recommendation: not the first choice. Consider only after a separate milestone approves changing the current route request contract and proves no fixture-key regression.

### Option C: Keep Mock Adapter Tests Probe-Only And Route-Free

This keeps `runMockOcrProvider` and `runMockVisionProvider` reachable only from developer probes and local code review.

Advantages:

- Lowest implementation risk.
- No new route surface.
- No chance of route callers confusing mock output with production analysis.
- Current `POST /api/analysis/ocr` route remains unchanged.

Tradeoffs:

- Does not test route-level validation, response shaping, or HTTP failure behavior.
- Less useful for future API-boundary planning.

Recommendation: safe default until Robert explicitly asks for route integration skeleton implementation.

## Recommended Future Request Shape

If Phase 4.16 later implements a mock route skeleton, use a separate route such as `/api/analysis/mock-provider` rather than extending the existing OCR route.

The future request should be JSON-only, small, exact-body, and synthetic-only:

```json
{
  "providerType": "mock-ocr",
  "providerMode": "mock-synthetic",
  "evidenceTypeHint": "receipt",
  "behavior": "success",
  "fixtureKey": "clean-receipt-ocr"
}
```

For mock vision, the future route should require no fixture key unless an approved synthetic vision fixture harness exists:

```json
{
  "providerType": "mock-vision",
  "providerMode": "mock-synthetic",
  "evidenceTypeHint": "product-photo",
  "behavior": "success"
}
```

These shapes are planning examples only. They are not implemented in Phase 4.15.

## Future Accepted Inputs

A future mock route or mock mode may accept only:

- Synthetic fixture key.
- Provider type: `mock-ocr` or `mock-vision`.
- Synthetic behavior key: `success`, `timeout`, `unavailable`, `malformed-response`, `unsupported-evidence`, `empty-output`, `rate-cost-limit`, `redaction-failure`, `safety-refusal`, or `internal-normalization-error`.
- Evidence type hint: `receipt`, `order-screenshot`, `product-photo`, or `unknown`.
- Mock/synthetic mode only.

The future request validator must reject:

- Real files.
- Base64 images.
- URLs.
- Object URLs.
- Data URLs.
- Image URLs.
- File URLs.
- Storage handles.
- Customer identifiers.
- Raw real OCR text.
- Provider payloads.
- Ticket, order, or customer fields.
- Non-synthetic provider modes.
- Multipart uploads.
- Binary uploads.
- File-like objects, blobs, bytes, filenames, local paths, payment details, addresses, emails, phones, tracking values, case identifiers, claim identifiers, evidence identifiers, provider request identifiers, provider response identifiers, and private metadata.

Unknown fields should fail closed. Nested objects and arrays should be rejected unless a later approved synthetic contract explicitly allowlists them.

## Future Response Behavior

A future mock route response should:

- Return provider-like mock result summaries.
- Include privacy and retention flags.
- Include failure and timeout operational limitations.
- Include manual-review drivers.
- Include OCR extraction contract output only for mock OCR when appropriate.
- Include mock vision uncertainty signals separately.
- Include provider mode, provider type, synthetic-only markers, and no-external-network markers.
- Return validation failures as safe operational route errors.

A future mock route response must never return:

- Live provider payloads.
- Raw provider responses.
- Raw real OCR text.
- Real evidence bytes or image data.
- A fraud score.
- A final claim decision.
- Proof wording.
- Fabricated-evidence or forged-evidence accusation language.
- Customer-wrongdoing conclusions.
- Automatic denial, refund, approval, or rejection wording.
- `LocalAnalysisResult`.
- Receipt report adapter output.
- Upload state.
- Storage handles.
- Provider trace URLs or provider request IDs.

A future mock route must never return `LocalAnalysisResult`.

Mock OCR response planning:

- May expose normalized OCR extraction contract fields or a route-safe summary of them.
- Must preserve OCR confidence as a review signal only.
- Must preserve no-retention and no-external-verification markers.

Mock vision response planning:

- Must remain separate from OCR extraction and receipt scoring.
- May expose `imageConsistencyUncertainty` as a synthetic `1-100` review-only uncertainty value.
- Must not imply that alteration, AI generation, or customer wrongdoing is proven.

## Route Isolation Requirements

Future integration must not touch:

- Upload flow.
- `ClaimReviewWorkflow`.
- `ProductPhotoReviewPanel`.
- `analyzeEvidenceFile`.
- `LocalAnalysisResult`.
- `report-adapter`.
- Receipt parser, scoring, or live fixtures.
- Storage.
- Env/config/secrets.
- Provider SDKs.
- Case queues, integrations, persistence, authentication, billing, or deployment config.

If a future implementation uses a separate route, the existing `/api/analysis/ocr` route must retain its exact `fixtureKey` behavior unless a separate regression-approved milestone changes it.

## Future Probe Requirements

If route integration is implemented later, probes must cover:

- Route import/isolation.
- Mock OCR route success.
- Mock vision route success.
- Timeout failure route response.
- Unavailable failure route response.
- Malformed response route response.
- Unsupported evidence route response.
- Empty output route response.
- Rate/cost limit route response.
- Redaction failure route response.
- Safety refusal route response.
- Internal normalization failure route response.
- Exact body validation.
- Disallowed input rejection.
- Privacy flags.
- No env marker.
- No network marker.
- No storage marker.
- Unsafe wording route response scan.
- No `LocalAnalysisResult` response-shape scan.
- No route-to-upload/UI/protected runtime import scan.
- No provider SDK/package scan.
- No existing `/api/analysis/ocr` behavior regression if a separate route is chosen.
- Current fixture-key route still rejects unexpected fields.
- Current fixture-key route still imports only the fixture harness and OCR extraction contract.

Required future checks should include lint, build, report semantics, non-live analysis probes, diff check, protected code diff scan, route/provider/env/package diff scan, protected import scan, upload/storage/object URL scan, unsafe wording scan, and private identifier scan.

## Safety And Privacy Rules

Future route integration must preserve:

- OCR confidence is a review signal only.
- Vision confidence is a review signal only.
- Altered/AI-generated-image uncertainty is a review signal only.
- Provider/mock failures are operational limitations only.
- Unsupported evidence is an evidence limitation only.
- No proof language.
- No fabricated-evidence or forged-evidence accusation language.
- No fraud-confirmation language.
- No automatic deny/refund wording.
- No final claim decision.
- No single fraud score.
- No real evidence.
- No real customer data.
- No provider payloads.
- No storage.
- No persistence.
- No environment variables.
- No external network calls.
- No live receipt behavior changes.

Every future route output should be framed for reviewer support and developer boundary testing only.

## Phase Gate Recommendation

Before Phase 4.16, all of these must remain true:

- No live OCR.
- No providers.
- No SDKs.
- No environment variables.
- No route integration implementation.
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
- Existing OCR route remains exact fixture-key only.
- Existing mock adapter behavior remains unchanged.
- `analyzeEvidenceFile` and `LocalAnalysisResult` remain unchanged.

Recommended safe next options after Phase 4.15:

Option A: Phase 4.16 mock adapter route integration skeleton implementation, only if Robert explicitly approves and only if it remains mock-only.

Option B: Phase 4.16 OpenAI Vision sandbox planning only, with no SDK, env var, provider implementation, route wiring, upload wiring, storage, persistence, or real evidence processing.

Option C: Phase 4.16 provider abstraction interface skeleton planning only.

Do not recommend or start live OpenAI Vision implementation unless Robert explicitly asks to start that path with privacy, retention, provider, secret-handling, route, upload, and receipt-regression scope.

## Specialist Review Findings

Product Strategy Agent: A future mock route may help prove API-boundary behavior, but it must remain a developer/synthetic path and must not imply live evidence intelligence.

Architecture and Maintainability Agent: The safest future implementation option is a separate mock-provider route, not changing the current exact fixture-key OCR route.

Receipt Intelligence Agent: The existing OCR route, OCR extraction contract, receipt parser, receipt scoring, receipt reports, `analyzeEvidenceFile`, and `LocalAnalysisResult` must remain unchanged.

Integration Readiness Agent: Route integration planning must not become provider integration. No SDK, env var, credential, external network, storage, persistence, or provider payload work belongs in Phase 4.15.

Scoring and Safety Reviewer Agent: Mock OCR confidence, mock vision confidence, and image uncertainty must stay review-only signals and must never become proof, a fraud score, a final claim decision, or automatic support action.

Privacy and Evidence Safety Agent: Future request validation must reject real evidence, customer identifiers, URLs, storage handles, provider payloads, raw real OCR, multipart, and binary uploads.

QA Harness Agent: Future route integration needs route-level probes for accepted synthetic cases, rejected inputs, privacy flags, unsafe wording, protected imports, package/provider isolation, and existing OCR route regression safety.

Deployment and Release Agent: Phase 4.15 is documentation/source-of-truth only. Commit and push are appropriate only after required checks pass, protected runtime files remain untouched, and no deployment occurs.

## Stop Conditions

Stop future work if:

- Route integration is implemented during Phase 4.15.
- The existing OCR route no longer remains exact fixture-key only.
- Mock adapter behavior changes.
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
