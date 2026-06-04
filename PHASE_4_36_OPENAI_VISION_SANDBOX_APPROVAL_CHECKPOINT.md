# Phase 4.36 OpenAI Vision Sandbox Approval Checkpoint

## 1. Purpose And Scope

Phase 4.36 exists as the real OpenAI Vision sandbox implementation approval checkpoint before any API-credit-using provider work begins. It converts the Phase 4.35 implementation plan into explicit approval choices Robert can make without accidentally authorizing live calls, secrets, uploads, production route behavior, or real evidence processing.

This milestone is approval checkpoint documentation only. No live provider behavior is implemented. No OpenAI SDK, provider SDK, environment variable, env file, secret, provider call, API-credit usage, upload handling, multipart parsing, binary customer-upload parsing, storage, persistence, UI, route behavior, runtime schema/type migration, package artifact, real evidence processing, anonymized/redacted real fixture, or provider payload is added.

This is not live AI and not production analysis. It does not alter `POST /api/analysis/ocr`, `POST /api/analysis/mock-provider`, `analyzeEvidenceFile`, `LocalAnalysisResult`, receipt parser behavior, receipt scoring, receipt reports, `ClaimReviewWorkflow`, `ProductPhotoReviewPanel`, upload flow, package output, deployment, or customer-facing claim behavior.

The altered-or-AI-generated-image uncertainty direction remains a review signal only. Any future 1-100 value must be framed as uncertainty for manual review, not proof, not a final claim decision, not a customer accusation, not external verification, and not an automated support outcome.

## 2. Current Readiness Summary

The current sandbox foundation appears ready for an approval decision, not for unapproved API-credit use.

- The script/module-only OpenAI Vision sandbox skeleton exists under `src/lib/analysis/vision-sandbox/`.
- The fixture runner exists at `src/lib/analysis/vision-sandbox/fixture-runner.ts`.
- The synthetic fixture metadata registry exists at `fixtures/vision-sandbox/metadata/synthetic-fixture-registry.json`.
- Synthetic SVG assets and markdown simulations exist under `fixtures/vision-sandbox/assets/` and `fixtures/vision-sandbox/simulations/`.
- The provider configuration plan exists in `PHASE_4_34_OPENAI_VISION_PROVIDER_CONFIG_PLAN.md`.
- The real OpenAI Vision sandbox implementation plan exists in `PHASE_4_35_OPENAI_VISION_SANDBOX_IMPLEMENTATION_PLAN.md`.
- Boundary checks exist through `scripts/check-vision-sandbox-boundaries.mjs`.
- Package-safety checks exist through metadata flags, sandbox output guards, fixture-runner validation, and boundary scans.
- Semantic safety checks exist through `scripts/check-report-semantics.mjs`.
- No provider calls exist.
- No API credits have been used.
- No provider configuration has been implemented.
- No real evidence is supported.
- Production receipt flow is unchanged.

Current sandbox capabilities include approved synthetic fixture validation, sandbox-shaped stub output, analysis-mode fallback behavior, unsupported/failure simulations, privacy and retention markers, package-safety markers, and altered-or-AI-generated-image uncertainty wording as a manual-review signal only.

Current sandbox non-capabilities remain intentional: no OpenAI call, no provider call, no API key usage, no env var requirement, no upload path, no real evidence, no provider payload retention, no persistence, no `LocalAnalysisResult`, no receipt scoring integration, no production route, and no customer claim decision.

## 3. Approval Choices

Robert must choose one of these options before work proceeds beyond this checkpoint:

### Choice A: Provider Configuration Skeleton Only

Approve provider configuration skeleton implementation only, with no provider calls and no API-credit usage.

This may allow disabled-by-default configuration shape planning or implementation, package-safety guard hardening, checker coverage, and documentation. It does not authorize a provider adapter that can execute a network request.

### Choice B: First API-Credit-Using OpenAI Vision Sandbox

Approve first API-credit-using OpenAI Vision sandbox implementation for synthetic fixtures only.

Only Choice B authorizes API-credit-using work. If Robert chooses B, the next phase must explicitly restate the fixture count, cost ceiling, timeout ceiling, retry policy, config-file scope, adapter choice, manual trigger command, logging/retention defaults, and stop conditions before any call is made.

### Choice C: Pause Live Provider Work

Pause live provider work and continue hardening sandbox/probes.

This keeps all work credit-free and can improve boundary checks, fixture-runner checks, output validation, developer docs, package-safety docs, and local/self-hosted setup planning.

### Choice D: Downloadable/Self-Hosted Provider Setup Guide First

Plan a downloadable/self-hosted provider setup guide before implementation.

This would document package/distribution safety, local user-owned key setup, disabled defaults, update/licensing considerations, and customer-safe setup expectations before configuration or provider code begins.

## 4. Work Allowed Without API-Credit Approval

The following work may continue without spending API credits, if separately approved as a named phase:

- Provider configuration skeleton with no calls.
- `.env.example` planning or implementation if Robert approves that file, with no secrets and no real provider values.
- Boundary checker hardening.
- Fixture-runner hardening.
- Sandbox output validation hardening.
- Developer documentation.
- Package-safety documentation.
- Local self-hosted setup planning.
- Approval and stop-condition documentation.
- Static scans proving no provider SDK, env var, secret, route behavior, upload path, storage, persistence, real evidence, or package artifact was added.

## 5. Work Blocked Without API-Credit Approval

The following work is blocked until Robert explicitly approves API-credit usage:

- Any real OpenAI call.
- Any provider request builder that can execute.
- Any provider adapter that sends network requests.
- API key usage.
- Synthetic fixture provider calls.
- Cost metadata derived from live provider calls.
- Response normalization from live provider output.
- Live provider timeout/retry behavior.
- Any API-credit-spending test.
- Any provider payload capture, replay, logging, or retention.
- Any route or UI behavior that can trigger provider execution.

## 6. First API-Credit-Using Phase Rules

If Robert later approves API-credit-using work, the first live phase must be:

- Developer-only.
- Synthetic fixture only.
- Tiny batch only.
- Manually triggered.
- Approved fixture keys only.
- No uploads.
- No UI.
- No production route.
- No real evidence.
- No anonymized/redacted real fixtures.
- No automatic retry by default.
- Strict timeout.
- Cost metadata required.
- Timeout metadata required.
- No raw provider payload logging by default.
- No raw provider payload retention by default.
- No raw OCR retention.
- No `LocalAnalysisResult`.
- No receipt scoring integration.
- No claim decision.
- No customer accusation.

The first live slice should keep the Phase 4.35 adapter recommendation: a minimal fetch-based sandbox adapter is preferred over adding the OpenAI SDK for the first API-credit-using developer-only synthetic phase because it has a smaller package impact and clearer timeout/validation control. That preference is not implementation approval.

## 7. Provider Configuration Skeleton Readiness

Provider configuration skeleton implementation appears ready as a next safe phase only if Robert approves Choice A or a similarly explicit configuration-skeleton scope.

It is ready only under these constraints:

- No API calls are implemented.
- Provider behavior remains disabled by default.
- No real env values are added.
- No secrets are added.
- `.env.example` is added only if Robert explicitly approves it.
- Package-safety checks pass.
- Boundary checks continue to block live calls.
- Future config remains sandbox-only.
- Missing config fails closed and does not alter build, lint, local install, routes, UI, receipt behavior, or developer probes.

The configuration skeleton should not add OpenAI SDK, provider SDKs, live request execution, live response normalization, provider payload logging, or API-credit-spending tests.

## 8. API-Credit-Using Readiness

The technical foundation appears ready for Robert to decide whether a carefully scoped first live sandbox phase should be approved.

API-credit usage remains blocked until Robert explicitly approves it. The first live calls must use synthetic fixtures only. Provider configuration must be safe before the first call. Stop conditions must be enforced before and during the run.

The current readiness is therefore:

- Technically ready to ask for explicit API-credit approval.
- Not authorized to use credits yet.
- Not authorized to process real evidence.
- Not authorized to wire routes, UI, uploads, storage, persistence, receipt scoring, `analyzeEvidenceFile`, or `LocalAnalysisResult`.
- Not authorized to ship provider-enabled package behavior.

## 9. Stop And Rollback Conditions

Stop the next provider-related phase if any of these conditions appears:

- Unexpected API usage.
- Repeated provider failures.
- Malformed output that cannot be safely validated.
- Unsafe wording.
- Evidence/privacy boundary violation.
- Real evidence path appears.
- An anonymized/redacted real fixture appears.
- Route, runtime, receipt, upload, UI, or report behavior drifts.
- Package-safety failure.
- Fixture-runner failure.
- Boundary-check failure.
- Cost behavior is missing.
- Timeout behavior is missing.
- Provider payload logging or retention appears by default.
- `LocalAnalysisResult` or `analyzeEvidenceFile` becomes part of sandbox output.

Rollback expectation:

- Revert the provider implementation commit if unsafe behavior appears.
- Do not patch around safety gates to force live behavior.
- Do not weaken boundary, semantic, fixture, privacy, package, or receipt-preservation checks to make live work pass.

## 10. Package And Downloadable Safety Checkpoint

Future provider features must remain safe for downloadable and self-hosted ClaimGuard distribution:

- Provider disabled by default.
- No secrets in package.
- No real env files.
- No provider payloads.
- No real evidence.
- No anonymized/redacted real fixtures without a separate approved phase.
- Synthetic fixtures labeled clearly.
- Local/self-hosted users provide their own key later, only after approved setup guidance exists.
- `.env.example` only after approval, with placeholders only and no real values.
- Package checks must block unsafe config, package artifacts, secrets, provider payloads, real evidence, object URLs, storage handles, and live-provider assumptions.
- Build, lint, install, and default local developer checks must not require provider access or API credits.

## 11. Recommended Next Phase

Preferred recommendation: Phase 4.37 provider configuration skeleton implementation, no provider calls and no API-credit usage.

This is the safest next step because it can prove disabled defaults, config shape, package safety, and boundary checker coverage before any API-credit-using request path exists.

Alternative recommendation: Phase 4.37 first API-credit-using OpenAI Vision sandbox implementation, synthetic fixtures only, only if Robert explicitly approves API-credit use.

Do not recommend API-credit-using implementation unless Robert explicitly approves it first. If Robert approves Choice B, the implementation phase must restate the adapter option, approved fixture count, cost ceiling, timeout ceiling, retry policy, config-file scope, manual trigger, logging/retention policy, and rollback conditions before any call.

## 12. Specialist Review Findings

Product Strategy Agent: The checkpoint supports ClaimGuard's AI/photo intelligence direction while keeping altered-or-AI-generated-image uncertainty as a confidence-style manual-review signal only, not proof of alteration, not proof of AI generation, and not a final claim decision.

Architecture and Maintainability Agent: The next safe implementation path is configuration skeleton first, isolated to sandbox-only boundaries. Provider execution should remain separate from routes, UI, upload flow, receipt scoring, `analyzeEvidenceFile`, and `LocalAnalysisResult`.

Receipt Intelligence Agent: Receipt behavior remains protected. Existing OCR route behavior, mock-provider route behavior, parser, scoring, report adapter, `analyzeEvidenceFile`, and `LocalAnalysisResult` are unchanged and must stay outside provider sandbox output.

Integration Readiness Agent: The project is ready to ask Robert for explicit approval choices. Only Choice B authorizes API-credit usage. Choice A can support provider configuration skeleton work without live calls.

Scoring and Safety Reviewer Agent: All future output must keep observation, signal, limitation, confidence, and manual-review driver fields separate. The 1-100 altered-or-AI-generated-image uncertainty value must never become proof, a claim outcome, a customer accusation, or a fraud score.

Privacy and Evidence Safety Agent: First calls must be synthetic-only. Real evidence, anonymized/redacted real fixtures, public URLs, object URLs, storage handles, raw OCR, provider payload retention, customer identifiers, and secrets remain blocked.

QA Harness Agent: Existing semantic, product-photo, sandbox-boundary, skeleton, and fixture-runner checks are the required baseline. Any future live sandbox phase needs additional provider-specific checks for manual triggering, tiny fixture scope, timeout/cost metadata, and no raw payload retention.

Deployment and Release Agent: Commit and push are appropriate for this documentation/checker milestone only after checks pass. No deployment, package artifact, release bundle, provider setup, or live AI work belongs in Phase 4.36.

## 13. Closeout Criteria

Phase 4.36 is complete only if:

- This approval checkpoint document exists.
- Source-of-truth docs record Phase 4.36 as documentation/checkpoint only.
- Semantic and sandbox-boundary checks cover this document.
- No live OpenAI implementation is added.
- No provider configuration is implemented.
- No OpenAI SDK or provider SDK is added.
- No env var, env file, or secret is added.
- No provider call or API-credit-using behavior is added.
- No route behavior, upload handling, storage, persistence, runtime wiring, UI wiring, runtime schema/type migration, fixture asset/metadata change, package artifact, real evidence, anonymized/redacted real fixture, provider payload, receipt behavior change, `analyzeEvidenceFile` change, or `LocalAnalysisResult` change is added.
- Required checks pass.
- The next recommended task remains provider configuration skeleton implementation with no provider calls and no API-credit usage, unless Robert explicitly approves API-credit work.
