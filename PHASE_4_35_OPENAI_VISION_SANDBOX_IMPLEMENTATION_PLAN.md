# Phase 4.35 OpenAI Vision Sandbox Implementation Plan

Date: 2026-06-04

Primary agent role: Integration Readiness Agent

Supporting reviews: Product Strategy, Architecture and Maintainability, Receipt Intelligence, Scoring and Safety, Privacy and Evidence Safety, QA Harness, Deployment and Release

## 1. Purpose And Scope

Phase 4.35 is the final real OpenAI Vision sandbox implementation planning milestone before any API-credit-using sandbox work. ClaimGuard needs this checkpoint because the next live-provider slice will introduce real cost, secret handling, provider request construction, response validation, package-default, and privacy responsibilities even if it remains developer-only and synthetic-only.

This milestone is implementation planning only. No live provider behavior is implemented. No OpenAI SDK, provider SDK, environment variable, provider call, API-credit usage, upload handling, multipart parsing, binary customer-upload parsing, storage, persistence, UI, route behavior, runtime schema/type migration, package artifact, or real evidence processing is added.

This is not live AI. It is not production analysis. It is not live OCR. It is not a production route. It is not a customer-facing evidence decision path.

The existing `POST /api/analysis/ocr` behavior remains unchanged. The existing `POST /api/analysis/mock-provider` behavior remains unchanged. `analyzeEvidenceFile` remains unchanged. `LocalAnalysisResult` remains unchanged. Receipt parser, scoring, report behavior, upload flow, `ClaimReviewWorkflow`, and `ProductPhotoReviewPanel` remain protected.

Altered-or-AI-generated-image uncertainty remains a review signal only. A future 1-100 value may help reviewers prioritize uncertainty, but it is not proof, not a final claim decision, not a customer accusation, not an authenticity conclusion, and not a fraud score.

## 2. Future Implementation Objective

The first future real OpenAI Vision sandbox implementation should prove a tiny provider-backed developer path while preserving the existing synthetic sandbox boundary.

The future implementation should:

- Remain developer-only.
- Remain synthetic-fixture-only.
- Require explicit Robert approval before API-credit usage.
- Use approved synthetic fixture keys only.
- Produce sandbox-only structured outputs.
- Validate outputs against the sandbox schema expectations from Phase 4.21.
- Run through fixture-runner, semantic, and boundary checks.
- Avoid uploads, UI, production routes, receipt scoring, and `LocalAnalysisResult`.
- Normalize provider failures as operational limitations.
- Keep provider output separate from receipt reports and support workflow output.

The future implementation must not:

- Process real evidence.
- Accept uploads.
- Accept public image URLs, object URLs, data URLs, file URLs, or storage handles.
- Retain provider payloads.
- Produce `LocalAnalysisResult`.
- Change receipt scoring.
- Make claim decisions.
- Generate customer accusations.
- Run automatically in production.
- Start without separate API-credit approval.

## 3. Exact Future File-Change Boundary

Future first implementation may change only sandbox and checker surfaces that are explicitly approved for that phase.

Future allowed file areas may include:

- A sandbox-only provider adapter module under `src/lib/analysis/vision-sandbox/`, such as a local OpenAI Vision sandbox adapter.
- A sandbox-only provider client wrapper under `src/lib/analysis/vision-sandbox/`, with timeout and cost metadata boundaries.
- A sandbox-only provider response normalizer that converts provider output into the existing sandbox-only shape.
- A sandbox-only provider failure mapper for timeout, rate-limit, unavailable, refusal, malformed, schema-validation, and cost-limit states.
- A sandbox-only schema validation bridge that checks provider output against Phase 4.21 expectations without migrating runtime app types.
- A sandbox-only local developer script under `scripts/`, manually invoked for approved synthetic fixture keys.
- `scripts/check-vision-sandbox-boundaries.mjs` for no-real-evidence, no-route, no-upload, no-payload-retention, and package-safety coverage.
- `scripts/check-report-semantics.mjs` for safety wording and planning/implementation coverage.
- A package script for a local sandbox provider test only if Robert approves provider config and API-credit scope.
- Source-of-truth docs.
- `.env.example` only if Robert separately approves that file in a provider configuration implementation phase.

Future protected files should remain:

- `src/app/api/analysis/ocr/route.ts`.
- `src/app/api/analysis/mock-provider/route.ts`.
- `src/lib/analysis/analyzer.ts`.
- `src/lib/analysis/types.ts`.
- `src/lib/analysis/receipt-parser.ts`.
- `src/lib/analysis/scoring.ts`.
- `src/lib/analysis/report-adapter.ts`.
- UI components, including `ClaimReviewWorkflow`, `ProductPhotoReviewPanel`, and upload flow components.
- Storage, persistence, integration, and case queue areas.
- Production config and deployment files unless `.env.example` is separately approved.
- Fixture assets and fixture metadata, except documentation-reference corrections only.

## 4. SDK Vs Fetch Adapter Decision

Option A: use the official OpenAI SDK in the future first live sandbox phase.

Benefits:

- Provider-supported request and response helpers.
- Better alignment with current OpenAI platform behavior.
- Less custom HTTP plumbing.
- Easier future migration to more OpenAI capabilities.

Risks:

- Adds a provider dependency to the downloadable package.
- May imply live-provider readiness sooner than intended.
- Requires package/dependency review and lockfile change.
- Requires strict checks to prevent broad runtime imports.

Package and dependency implications:

- `package.json` and `package-lock.json` would change.
- Downloadable/self-hosted installs would include the SDK unless dependency loading is carefully scoped.
- Package-safety checks must prove the provider remains disabled by default.

Secret and environment handling:

- Still requires a separately approved config boundary.
- Must not commit real keys.
- Must fail closed when config is absent.

Timeout, response validation, and testability:

- Timeout behavior must be explicit and tested around the SDK call.
- Raw SDK responses must be normalized immediately.
- Tests must prove no raw provider payload logging or retention.

Compatibility:

- Works with a provider adapter boundary if the SDK is contained inside the sandbox-only adapter module.

Option B: use a minimal fetch-based sandbox provider adapter in the future first live sandbox phase.

Benefits:

- Avoids adding a provider dependency in the first API-credit slice.
- Keeps package/downloadable impact smaller.
- Makes timeout control explicit through `AbortController`.
- Keeps request and response validation directly visible in the sandbox adapter.
- Easier to prove no SDK import has leaked into runtime paths.

Risks:

- More custom provider request code.
- More responsibility for API shape drift.
- Requires careful handling of HTTP errors, malformed responses, and provider changes.
- May need later migration to the official SDK.

Package and dependency implications:

- No new package dependency is required for the first live sandbox path.
- Package-safety posture is simpler because provider code remains local and disabled unless configured.

Secret and environment handling:

- Still requires separately approved config and no committed real values.
- Provider remains disabled when config is absent.

Timeout, response validation, and testability:

- Timeout and response validation are explicit.
- The adapter can normalize failures before exposing sandbox output.
- Tests can mock `fetch` without provider SDK setup.

Compatibility:

- Fits a provider adapter boundary if provider-specific request construction stays isolated.

Recommendation for the first live sandbox phase:

Prefer Option B, a minimal fetch-based sandbox provider adapter, for the first API-credit-using developer-only synthetic sandbox phase. It has the smallest package footprint, keeps timeout and validation behavior explicit, and is easier to keep out of production runtime. Revisit the official OpenAI SDK after the synthetic-only provider boundary, payload-retention rules, cost metadata, and checker coverage have passed at least one approved API-credit-using slice.

Do not implement either option in Phase 4.35.

## 5. Future Provider Request Flow

Future provider request flow should be:

- Developer manually selects an approved synthetic fixture key.
- Sandbox validates the fixture key against `fixtures/vision-sandbox/metadata/synthetic-fixture-registry.json`.
- Sandbox resolves approved synthetic fixture metadata through the existing registry module.
- Sandbox resolves the approved synthetic fixture asset or simulation reference through the existing resolver.
- Sandbox verifies package, privacy, and retention safety before any provider request is built.
- Sandbox selects the prompt family from approved fixture metadata and Phase 4.20 prompt planning.
- Sandbox builds a provider request for synthetic fixture content only.
- Sandbox applies strict timeout, tiny batch, and cost-limit controls.
- Provider call occurs only after explicit API-credit approval.
- Provider response is normalized into a sandbox-only candidate result.
- Candidate result is schema-checked against Phase 4.21 expectations.
- Candidate result is safety-checked for observation/signal/limitation/manual-review separation.
- Output is emitted as sandbox-only result.
- No production report, receipt score, claim decision, or customer-facing message is generated.

## 6. Future Provider Response Handling

Response handling must:

- Separate observations from uncertainty signals.
- Preserve limitations.
- Preserve manual-review-only framing.
- Normalize provider failures as operational limitations.
- Avoid raw provider payload logging by default.
- Avoid provider payload retention by default.
- Avoid raw OCR retention by default.
- Avoid customer identifiers.
- Avoid proof, fraud, fake, forged, confirmed-authentic, or wrongdoing conclusions.
- Avoid automatic denial, approval, rejection, refund, or policy disposition.
- Keep output separate from `LocalAnalysisResult`.
- Fail closed when output cannot be validated safely.

Provider failure output must not imply customer risk. Timeout, rate-limit, unavailable, malformed, refusal, schema-validation, or cost-limit states should return limitation-only developer output.

## 7. Synthetic-Only First-Call Policy

First live provider calls must be:

- Synthetic fixtures only.
- Approved fixture keys only.
- Small batch only.
- Manually triggered.
- Developer-only.
- No uploads.
- No real evidence.
- No anonymized or redacted real fixtures.
- No public image URLs.
- No object URLs.
- No data URLs or file URLs.
- No storage handles.
- No provider payload replay.
- No automatic retries.
- No production route.
- No UI.
- No receipt scoring.
- No `LocalAnalysisResult`.

The first approved provider-backed run should use the smallest representative fixture set, such as one receipt-like synthetic fixture and one altered-or-AI-generated-image uncertainty fixture, only after Robert approves API-credit usage.

## 8. API Credit Approval Policy

No API credits may be used until Robert explicitly approves an API-credit-using phase.

The first API-credit-using phase must state that credits may be spent. The first run should use a tiny synthetic batch, no automatic retry by default, cost metadata, timeout metadata, rate-limit handling, and explicit stop conditions.

Stop immediately if:

- Unexpected usage occurs.
- Provider errors repeat.
- A response cannot be schema-validated safely.
- Output contains unsafe wording.
- Provider behavior requires real evidence, upload handling, or route behavior.
- Cost metadata is missing.
- Timeout metadata is missing.
- The provider path cannot prove it is disabled by default.

## 9. Future Env And Config Requirements

Future config requirements:

- `.env.example` may be added only after Robert approves provider configuration implementation.
- No real `.env` file may be committed.
- No `.env.local` file may be committed.
- No secrets may be committed.
- Provider behavior must be disabled if config is absent.
- Local and self-hosted users provide their own key later.
- Provider config is not required for the current skeleton.
- No provider config is added in Phase 4.35.
- Future config must remain package-safe and disabled by default.

Do not add real provider values, secret names with real values, platform screenshots, copied console output, or provider account details to docs, fixtures, scripts, or logs.

## 10. Prompt, Schema, And Fixture-Runner Integration

Future implementation should integrate with the existing plan stack:

- Use Phase 4.20 prompt/output contract for prompt family boundaries and safe output fields.
- Use Phase 4.21 schema plan for sandbox identity, result statuses, observations, uncertainty signals, limitations, privacy/retention metadata, cost/timeout metadata, and failure shapes.
- Use Phase 4.22 fixture policy for synthetic-only fixture eligibility.
- Use Phase 4.23 validation/probe plan for safety, privacy, package, and runtime boundary checks.
- Use Phase 4.24 metadata schema plan for required fixture metadata expectations.
- Use Phase 4.27 fixture metadata as the approved fixture key registry.
- Use Phase 4.29 synthetic fixtures as the only first-call assets.
- Use Phase 4.31 skeleton modules for registry access, fixture resolution, sandbox output shape, and guard status concepts.
- Use Phase 4.32 fixture-runner validation to compare fixture coverage, failure handling, and guard status.
- Use Phase 4.33 developer readiness doc for safe local commands and non-capabilities.
- Use Phase 4.34 provider config plan for opt-in, disabled defaults, API credit, env guidance, privacy, retention, and package defaults.

The first live-provider result should not replace the existing deterministic stub. It should be a separately named sandbox provider path whose output is normalized and compared against the sandbox-only expectations.

## 11. Package And Downloadable Safety

Future first live sandbox implementation package safety rules:

- Provider disabled by default.
- No secrets.
- No real provider config.
- No provider payloads shipped.
- No real evidence shipped.
- Synthetic fixtures clearly labeled.
- No unsafe demo outputs.
- No live-provider assumptions during install, build, lint, or default checks.
- Package checks must pass before release.
- Provider features require explicit local configuration later.
- Downloadable/self-hosted use must fail closed when provider config is absent.

The package should remain useful without provider access. Synthetic fixtures and deterministic stub checks should continue to work without credentials and without API credits.

## 12. Future Checks For First Live Sandbox Implementation

The first live sandbox implementation should require:

- Existing full suite.
- `npm.cmd run lint`.
- `npm.cmd run build`.
- `npm.cmd run check:report-semantics`.
- `npm.cmd run check:product-photo-probes`.
- `npm.cmd run check:vision-sandbox-boundaries`.
- `npm.cmd run check:vision-sandbox-skeleton`.
- `npm.cmd run check:vision-sandbox-fixture-runner`.
- A future provider sandbox check script.
- No real evidence scan.
- No provider payload logging scan.
- No raw OCR retention scan.
- No route behavior change scan.
- No receipt behavior change scan.
- No `LocalAnalysisResult` scan.
- No `analyzeEvidenceFile` behavior scan.
- No unsafe wording scan.
- No package artifact or secrets scan.
- API-credit usage acknowledgement scan.
- Cost metadata scan.
- Timeout metadata scan.
- Provider disabled-by-default scan.
- Package-safety scan.

Any future provider sandbox check should prove tiny synthetic fixture scope, manual triggering, no automatic retry by default, operational-only failure normalization, schema validation, and no provider payload retention.

## 13. Phase 4.36 Recommendation

Recommended next safe phase:

Phase 4.36 real OpenAI Vision sandbox implementation approval checkpoint. This should ask Robert to explicitly approve whether API credits may be used and whether provider configuration implementation may begin. It should name the chosen adapter option, approved fixture count, cost ceiling, timeout ceiling, retry policy, config-file scope, and stop conditions before any implementation starts.

Alternative safe phase:

Phase 4.36 provider configuration skeleton implementation, no provider calls and no real environment values. This alternative may define disabled-by-default local configuration shape only if Robert approves that skeleton scope.

Do not recommend live implementation without explicit Robert approval for API-credit-using work.

## 14. Stop Conditions For First API-Credit-Using Implementation

Stop the first API-credit-using implementation if:

- Robert has not approved API-credit usage.
- Robert has not approved provider configuration implementation.
- Provider key or config is missing, unsafe, or likely to be committed.
- Implementation would process real evidence.
- Implementation would accept uploads.
- Implementation would accept public URLs, object URLs, data URLs, file URLs, or storage handles.
- Implementation would change the existing OCR route.
- Implementation would change the existing mock-provider route.
- Implementation would change `analyzeEvidenceFile`.
- Implementation would use `LocalAnalysisResult` as sandbox output.
- Implementation would alter receipt scoring.
- Implementation would retain raw provider payloads.
- Implementation would retain raw OCR.
- Implementation would produce proof, fraud, fake, forged, confirmed-authentic, or customer-accusation language.
- Implementation would make claim decisions.
- Package-safety checks fail.
- Fixture-runner checks fail.
- Boundary checks fail.
- Cost metadata is missing.
- Timeout metadata is missing.
- Provider output cannot be schema-validated safely.

## 15. Specialist Review Findings

Product Strategy Agent: The future OpenAI Vision sandbox path supports ClaimGuard's AI/photo intelligence direction while keeping altered-or-AI-generated-image uncertainty as a manual-review signal only, not proof and not a final claim decision.

Architecture and Maintainability Agent: The first provider path should be a separately named sandbox adapter under `src/lib/analysis/vision-sandbox/`, with request building, response normalization, failure mapping, and validation isolated from routes, UI, receipt scoring, and `LocalAnalysisResult`.

Receipt Intelligence Agent: Receipt behavior remains protected. Existing OCR route behavior, parser, scoring, report adapter, `analyzeEvidenceFile`, and `LocalAnalysisResult` must remain outside the first provider-backed sandbox path.

Integration Readiness Agent: Phase 4.35 does not implement provider behavior. The next phase must explicitly approve API-credit usage, provider config, adapter choice, tiny fixture scope, timeout/cost/rate policy, and disabled-by-default behavior.

Scoring and Safety Reviewer Agent: Provider output must keep observations, uncertainty signals, limitations, and manual-review drivers separate. It must not create proof, fraud, fake, forged, automatic disposition, or customer accusation language.

Privacy and Evidence Safety Agent: First calls must be synthetic-only. No real evidence, anonymized/redacted real fixtures, public URLs, object URLs, storage handles, raw OCR retention, provider payload retention, customer identifiers, or secrets are allowed.

QA Harness Agent: Future implementation needs a dedicated provider sandbox check in addition to the existing semantic, boundary, skeleton, fixture-runner, and product-photo probes. Checks must prove no route/runtime/receipt drift and no provider payload logging.

Deployment and Release Agent: Commit and push are appropriate only for this documentation/checker milestone after checks pass. No deployment, package artifact, release bundle, provider setup, or live AI work is part of Phase 4.35.

## 16. Closeout Criteria

Phase 4.35 is ready to close when:

- This real OpenAI Vision sandbox implementation planning document exists.
- `ROADMAP.md`, `NEXT_STEPS.md`, `REPO_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `AGENT_LOG.md` reflect Phase 4.35 planning-only status.
- Semantic and sandbox-boundary checks cover this document.
- No live OpenAI implementation is added.
- No provider configuration is implemented.
- No OpenAI SDK or provider SDK is added.
- No env var, env file, or secret is added.
- No provider call or API-credit-using behavior is added.
- No API route is added or changed.
- No upload, storage, persistence, UI, runtime schema/type migration, fixture asset/metadata change, package artifact, real evidence, anonymized/redacted real fixture, or provider payload is added.
- Existing OCR route behavior remains unchanged.
- Existing mock-provider route behavior remains unchanged.
- `analyzeEvidenceFile` remains unchanged.
- `LocalAnalysisResult` remains unchanged.
- Receipt parser, scoring, report behavior, upload flow, `ClaimReviewWorkflow`, and `ProductPhotoReviewPanel` remain unchanged.
- Required checks and safety scans pass.
