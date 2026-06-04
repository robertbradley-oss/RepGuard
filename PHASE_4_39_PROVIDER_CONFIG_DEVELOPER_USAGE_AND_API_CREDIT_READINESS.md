# Phase 4.39 Provider Config Developer Usage And API-Credit Readiness

## 1. Purpose And Scope

Phase 4.39 exists after the Phase 4.37 provider configuration skeleton and Phase 4.38 hardening work so developers have a safe usage and approval-readiness reference before any API-credit-using OpenAI Vision sandbox work is considered.

This milestone is documentation/readiness only. It adds no live provider behavior, no OpenAI SDK, no provider SDK, no provider call, no API-credit usage, no real environment value, no real env file, no secret, no upload handling, no multipart parsing, no binary customer-upload parsing, no storage, no persistence, no UI, no route behavior, no runtime schema/type migration, no package artifact, no provider payload, no real evidence processing, and no anonymized/redacted real fixture.

This is not live AI and not production analysis. Existing `POST /api/analysis/ocr`, existing `POST /api/analysis/mock-provider`, `analyzeEvidenceFile`, `LocalAnalysisResult`, receipt parser behavior, receipt scoring, receipt reports, upload flow, `ClaimReviewWorkflow`, and `ProductPhotoReviewPanel` remain unchanged.

The future altered-or-AI-generated-image uncertainty direction remains a review signal only. A future confidence-style 1-100 value must support manual review and must not be treated as proof, a final claim decision, a customer accusation, external verification, or an automated support outcome.

Any future provider output must keep observation, signal, limitation, and manual-review language separate.

## 2. Current Provider Configuration State

The provider configuration skeleton exists at `src/lib/analysis/vision-sandbox/provider-config.ts`. It is sandbox-only, inert, and disabled by default.

`.env.example` exists as an example-only package-safety file. It contains no secrets, no real provider values, and a blank provider API key placeholder. The provider configuration skeleton does not read `.env.example`, does not read `process.env`, and does not require environment configuration for current sandbox checks.

Current provider configuration defaults remain:

- `providerEnabled: false`
- `providerCallsAllowed: false`
- `requestExecutionAllowed: false`
- `apiCreditUsageAllowed: false`
- `payloadLoggingPolicy: "disabled"`
- `rawOcrRetentionPolicy: "disabled"`
- `evidenceScope: "synthetic-fixture-only"`
- `packageSafetyMode: "downloadable-safe-disabled"`
- no automatic retry
- max attempts 1
- strict timeout ceiling
- max fixture batch size 1
- secrets not required
- env config not required

The current sandbox works without provider configuration. The fixture runner, sandbox skeleton probe, boundary checker, and semantic checker run against synthetic fixtures and static source/docs only. No provider request can execute from the current provider config skeleton.

## 3. Safe `.env.example` Usage

`.env.example` is not a real environment file. It is package-safe developer guidance only.

Developers may read `.env.example` to understand disabled defaults. They must not treat it as permission to enable provider calls, use API credits, process real evidence, or configure live provider execution.

Safe `.env.example` rules:

- `.env.example` must not contain secrets.
- `.env.example` must not contain real API keys.
- `.env.example` must keep the provider API key blank.
- `.env.example` must keep provider, request execution, and API-credit flags disabled.
- Developers must not commit `.env` or `.env.local`.
- Copying `.env.example` is not part of Phase 4.39.
- Provider features remain disabled unless explicitly configured in a later approved phase.
- API-credit usage requires separate Robert approval under Choice B.
- Real evidence must not be used.

The current phase does not add setup instructions that ask a developer to create a local env file. Any future local/self-hosted setup guide must be separately approved and must keep secrets out of git.

## 4. Allowed Developer Actions Without Choice B

Without Choice B approval, developers may:

- Read `.env.example`.
- Inspect disabled provider config defaults.
- Run `npm.cmd run check:vision-sandbox-boundaries`.
- Run `npm.cmd run check:vision-sandbox-skeleton`.
- Run `npm.cmd run check:vision-sandbox-fixture-runner`.
- Run `npm.cmd run check:report-semantics`.
- Run lint/build and static scans that do not call providers.
- Inspect the synthetic-only fixture registry, fixture assets, and simulations.
- Update documentation when it preserves the no-live boundary.
- Update checkers narrowly when needed to harden documentation, package-safety, env, provider, privacy, or route/runtime boundaries.
- Continue package/downloadable safety planning.

These actions must stay local, synthetic-only, provider-free, SDK-free, secret-free, upload-free, storage-free, route-free, UI-free, and credit-free.

## 5. Blocked Developer Actions Without Choice B

Without Choice B approval, developers must not:

- Make OpenAI calls or other provider calls.
- Run API-credit-using tests.
- Use an API key.
- Set provider enabled true for execution.
- Enable request execution.
- Enable provider calls.
- Enable API-credit usage.
- Enable payload logging.
- Enable raw OCR retention.
- Process real evidence.
- Add upload route work.
- Add multipart or binary customer-upload parsing.
- Add production route or UI integration.
- Integrate provider output with receipt scoring.
- Use `LocalAnalysisResult` as sandbox output.
- Change `analyzeEvidenceFile`.
- Retain provider payloads.
- Add provider payload fixtures or replays.
- Add storage or persistence.
- Add package artifacts.

These actions remain blocked even for synthetic fixtures until Robert explicitly approves Choice B.

## 6. API-Credit Approval Readiness

The technical foundation is approaching readiness for Robert to decide whether the first API-credit-using sandbox phase should happen. It is not authorized to spend credits yet.

API-credit work remains blocked until Robert explicitly approves Choice B. If Choice B is approved later, the first API-credit phase must be:

- synthetic-only
- tiny batch only
- manually triggered
- developer-only
- approved fixture keys only
- no uploads
- no UI
- no production route
- no real evidence
- no anonymized/redacted real fixtures
- no automatic retry by default
- strict timeout
- cost metadata required
- timeout metadata required
- no raw provider payload logging by default
- no raw provider payload retention by default
- no raw OCR retention

The first API-credit-using run must stop on unsafe output, unexpected API usage, unexpected cost behavior, timeout drift, malformed provider output, provider payload retention, privacy boundary failure, route/runtime drift, or any real evidence path.

## 7. Package And Downloadable Safety

Provider configuration and future provider features must remain safe for downloadable and self-hosted ClaimGuard distribution.

Package/downloadable expectations:

- Provider disabled by default.
- No secrets in package.
- No real env files committed.
- `.env.example` only.
- No provider payloads.
- No real evidence.
- No anonymized/redacted real fixtures.
- Synthetic fixtures labeled clearly.
- Self-hosted users provide their own key only in a later approved setup phase.
- Current installs, builds, and checks must work without provider access or API credits.
- Package checks must block unsafe config, nonblank committed provider keys, provider-enabled defaults, package artifacts, provider payloads, real evidence, object URLs, storage handles, and live-provider assumptions.

Provider features must remain disabled by default unless explicitly configured in a later approved phase.

## 8. First API-Credit-Using Phase Prerequisites

Before Choice B work starts, all of these conditions must be true:

- Robert explicitly approves API-credit usage.
- The provider config skeleton remains disabled by default.
- Safe local config instructions are ready and approved.
- Boundary checks pass.
- Fixture-runner checks pass.
- Package-safety checks pass.
- No real evidence is present.
- No anonymized/redacted real fixtures are present.
- Synthetic fixtures are selected and named.
- Fixture count remains tiny.
- Cost limits are confirmed.
- Timeout limits are confirmed.
- Retry behavior is confirmed as no automatic retry by default.
- Payload logging remains disabled by default.
- Raw OCR retention remains disabled by default.
- Stop/rollback conditions are confirmed.

The first API-credit-using phase must restate the exact fixture keys, manual command, cost ceiling, timeout ceiling, retry policy, adapter choice, local config file scope, logging/retention policy, expected output fields, and rollback plan before any call is made.

## 9. Phase 4.40 Recommendation

Preferred next phase: Phase 4.40 API-credit usage approval decision and first live sandbox call plan.

That phase should ask Robert whether to approve Choice B. If Robert does not approve Choice B, it must remain a decision/planning phase with no provider calls and no API-credit usage.

Alternative next phase: Phase 4.40 provider config/checker hardening, still no API credits.

Do not recommend API-credit-using implementation unless Robert explicitly approves Choice B.

## 10. Specialist Review Findings

Product Strategy Agent: The documentation supports the future AI/photo intelligence direction while preserving altered-or-AI-generated-image uncertainty as a manual-review signal only, not proof, not a final claim decision, and not a customer accusation.

Architecture and Maintainability Agent: The current provider config skeleton remains isolated under `src/lib/analysis/vision-sandbox/` and remains pure data. Phase 4.39 adds no runtime coupling, route behavior, UI, upload, storage, persistence, receipt scoring, `analyzeEvidenceFile`, or `LocalAnalysisResult` usage.

Receipt Intelligence Agent: Receipt behavior remains protected. The existing OCR route, mock-provider route, parser, scoring, report behavior, `analyzeEvidenceFile`, and `LocalAnalysisResult` are unchanged.

Integration Readiness Agent: The project is ready for a Choice B approval decision, but API-credit usage remains blocked. Developers may inspect disabled config and run static/synthetic checks without using provider credentials.

Scoring and Safety Reviewer Agent: Future 1-100 altered-or-AI-generated-image uncertainty must stay a confidence-style review signal with limitations and manual-review drivers, never an evidence verdict, fraud score, or automated claim outcome.

Privacy and Evidence Safety Agent: Real evidence, anonymized/redacted real fixtures, customer identifiers, provider payloads, raw OCR retention, storage handles, public/object URLs, committed env files, and secrets remain blocked.

QA Harness Agent: The required baseline is lint, build, report semantics, product-photo probes, vision sandbox boundary, skeleton, and fixture-runner checks, plus targeted scans proving no SDK/provider/env/route/runtime/upload/storage/package drift.

Deployment and Release Agent: Commit and push are appropriate only if the diff stays documentation/readiness plus narrow checker coverage, all required checks pass, and no package artifact or deployment is created.

## 11. Closeout Criteria

Phase 4.39 is complete only if:

- This developer usage/readiness document exists.
- Source-of-truth docs record Phase 4.39 as documentation/readiness only.
- Semantic and sandbox-boundary checks cover Phase 4.39.
- No live OpenAI implementation is added.
- No OpenAI SDK or provider SDK is added.
- No real env value or real env file is added.
- No secret is added.
- No provider call is added.
- No API-credit-using behavior is added.
- Provider remains disabled by default.
- Request execution remains disabled by default.
- Evidence scope remains synthetic-fixture-only.
- Payload logging remains disabled by default.
- Raw OCR retention remains disabled by default.
- No route behavior changes are added.
- No upload, storage, persistence, runtime wiring, UI wiring, real evidence path, anonymized/redacted real fixture, provider payload, package artifact, protected runtime change, receipt behavior change, `analyzeEvidenceFile` change, or `LocalAnalysisResult` change is added.
- Required checks pass.
