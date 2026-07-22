# Phase 4.34 OpenAI Vision Provider Configuration Plan

Date: 2026-06-01

Primary agent role: Integration Readiness Agent

Supporting reviews: Product Strategy, Architecture and Maintainability, Receipt Intelligence, Scoring and Safety, Privacy and Evidence Safety, QA Harness, Deployment and Release

## 1. Purpose And Scope

Phase 4.34 is an OpenAI Vision provider configuration planning milestone. ClaimGuard needs this plan before live OpenAI Vision sandbox implementation because provider configuration creates new operational, cost, privacy, package-distribution, and developer-safety responsibilities even before any provider call is made.

This milestone is documentation/planning only. No provider configuration is implemented. No OpenAI SDK, provider SDK, environment variable, provider call, API-credit-using behavior, upload handling, multipart parsing, binary customer-upload parsing, storage, persistence, UI, route behavior, runtime schema/type migration, package artifact, or real evidence processing is added.

This is not live AI. It is not production analysis. It is not a live OpenAI Vision implementation. It is not provider-backed OCR. It is not a customer-facing evidence decision path.

The existing `POST /api/analysis/ocr` behavior remains unchanged. The existing `POST /api/analysis/mock-provider` behavior remains unchanged. `analyzeEvidenceFile` remains unchanged. `LocalAnalysisResult` remains unchanged. Receipt parser, scoring, report behavior, upload flow, `ClaimReviewWorkflow`, and `ProductPhotoReviewPanel` remain protected.

Altered-or-AI-generated-image uncertainty remains a review signal only. A future 1-100 value may help reviewers prioritize uncertainty, but it is not proof, not a final claim decision, not a customer accusation, not an authenticity conclusion, and not a fraud score.

## 2. Future Provider Configuration Goals

Future provider configuration should support a developer-only OpenAI Vision-style sandbox in a later approved phase while preserving ClaimGuard's safety posture.

Future goals:

- Allow developer-only sandbox provider configuration only after Robert approves the implementation phase.
- Keep provider features disabled by default.
- Make every API-credit-using path explicit and intentional.
- Protect local, self-hosted, and downloadable package defaults.
- Prevent accidental provider calls during install, build, tests, and local checks.
- Prevent accidental real evidence processing.
- Prevent provider payload retention.
- Keep provider output sandbox-only at first.
- Keep provider output separate from receipt scoring, receipt reports, and `LocalAnalysisResult`.
- Preserve observation, uncertainty signal, limitation, and manual-review separation.

Configuration should serve integration readiness, not production routing. The first live-provider slice, if later approved, should prove a narrow synthetic-only developer boundary before any customer evidence or production route is considered.

## 3. Provider Opt-In Model

Future provider features should require explicit opt-in. Absence of approved configuration should mean the provider path is disabled and no provider call can occur.

Future opt-in should require:

- Robert approval before provider configuration implementation.
- Separate Robert approval before any API-credit-using work.
- Documented provider mode.
- Documented model choice.
- Documented timeout limit.
- Documented retry policy.
- Documented cost and rate limit.
- Documented synthetic-only test scope.
- Documented no-real-evidence boundary.
- Documented logging and retention policy.

Provider opt-in should never be inferred from installed dependencies, package installation, existing synthetic fixtures, or build-time environment. Provider-enabled behavior should require a deliberate developer action in a later approved phase, with checks proving the disabled default remains intact.

## 4. API Credit Usage Planning

Current state: the existing script/module-only sandbox uses zero API credits. It does not call OpenAI, does not call any provider, and does not require provider credentials.

Future credit planning:

- Credits are used only when real provider calls are made.
- Future synthetic provider sandbox calls may use credits only after a separately approved API-credit-using phase.
- Real customer evidence must not use credits until a separate approved privacy, retention, and evidence-handling milestone.
- Manual approval is required before the first API-credit-using phase.
- First provider-backed runs should use small synthetic fixture batches.
- Automatic retry should be disabled by default.
- Cost metadata should be recorded per developer run.
- Timeout metadata should be recorded per developer run.
- Rate-limit and cost-limit behavior should normalize to operational limitations.
- Stop conditions must be documented for unexpected usage, repeated failures, unplanned retries, or surprising cost growth.

Provider failure, timeout, rate limit, or cost limit output must remain operational-only. It should not imply customer risk, evidence quality, alteration, or claim outcome.

## 5. Future Environment Variable Guidance

Future environment guidance should be `.env.example` planning only until a later approved phase. Phase 4.34 does not create `.env.example`, `.env`, `.env.local`, or any configuration file.

Guidance for a later approved phase:

- Add `.env.example` only after Robert approves provider configuration implementation.
- Never include real secrets.
- Never commit API keys.
- Local and self-hosted customers provide their own key later.
- Provider behavior remains disabled when key or configuration is absent.
- No production provider configuration is introduced in this phase.
- No provider configuration is required for the current synthetic sandbox.
- Real environment values must never ship in a downloadable package.

Potential future setting names may be discussed conceptually in the implementation plan, but this phase intentionally avoids adding them to actual project config, runtime code, scripts, or env files.

## 6. Model And Provider Selection Strategy

OpenAI Vision-style analysis remains the first likely live sandbox provider family because the planned sandbox output depends on visual understanding, structured observation, uncertainty-signal separation, and safe explanation.

Future provider selection should prioritize:

- Image understanding quality for synthetic receipt, order screenshot, product-photo, damaged-product, and altered-or-AI-generated-image uncertainty scenarios.
- Structured output reliability.
- Cost control.
- Latency and timeout predictability.
- Provider adapter boundaries that allow later provider swaps.
- Clear provider failure normalization.
- Privacy and retention controls.

Provider choice should remain swappable. The future adapter boundary should keep provider-specific prompts, model names, response parsing, cost metadata, and failure handling outside receipt scoring and outside `LocalAnalysisResult`.

AI output is one evidence source, not the decision maker. Model output must not create a final claim decision, customer-facing accusation, automated disposition, approval, rejection, refund guidance, or proof of alteration.

## 7. Timeout, Retry, Rate, And Cost Defaults

Future default planning:

- Use a strict timeout ceiling for each provider call.
- Use no automatic retry by default.
- Keep first fixture batches small.
- Keep image/page limits small.
- Require cost metadata per provider-backed run.
- Require timeout metadata per provider-backed run.
- Normalize rate-limit and cost-limit responses as operational limitations.
- Normalize provider failures as operational limitations.
- Confirm that provider failure does not imply customer risk.
- Stop repeated failure runs until a developer explicitly reviews the cause.
- Stop unexpected-cost runs until cost limits and fixture scope are re-approved.

Retries can multiply cost and accidental provider usage, so retry behavior should be opt-in only after the initial provider-backed synthetic sandbox is stable.

## 8. Logging, Payload Retention, And Privacy Defaults

Future provider configuration should default to privacy-minimal behavior.

Future defaults:

- No raw provider payload logging by default.
- No provider payload retention by default.
- No raw OCR retention by default.
- No customer identifiers.
- No public image URLs.
- No object URL retention.
- No storage handles.
- No real evidence in the first provider sandbox.
- Synthetic-only initial calls.
- Redacted or anonymized fixtures require separate approval.
- Real customer evidence requires a separate privacy and retention milestone.
- Provider failure output must be operational-only.

Provider prompt and response handling should preserve observation, signal, limitation, and manual-review separation. If a future provider output cannot be validated safely, it should fail closed as a sandbox limitation rather than producing partial evidence conclusions.

## 9. Relationship To Current Sandbox

The current OpenAI Vision-style sandbox remains script/module-only. It references approved synthetic fixture metadata and assets, builds deterministic sandbox-shaped stubs, validates fixture-runner behavior, and simulates unsupported or provider/failure states without any provider execution.

Future provider configuration must not:

- Change the existing OCR route.
- Change the existing mock-provider route.
- Change `analyzeEvidenceFile`.
- Change `LocalAnalysisResult`.
- Wire into receipt scoring.
- Wire into receipt reports.
- Wire into UI.
- Wire into uploads.
- Wire into `ClaimReviewWorkflow`.
- Route `ProductPhotoReviewPanel`.
- Process real evidence.

Provider configuration should first apply only to a developer-only sandbox path in a later approved phase. The current fixture runner and synthetic metadata registry should remain synthetic-only and package-safe.

## 10. Downloadable And Self-Hosted Package Safety

ClaimGuard's future downloadable or self-hosted package must be safe by default.

Package safety rules:

- Downloadable packages must not ship secrets.
- Provider features must remain disabled by default.
- `.env.example` may be added only later and must contain no real values.
- Local and self-hosted users provide their own provider configuration later.
- Synthetic demo fixtures remain safe and clearly labeled.
- No provider payloads are included in the package.
- No real evidence is included in the package.
- No unsafe demo labels are included.
- No live-provider assumptions are required for installation, build, or local checks.
- Package-safety checks must block unsafe config, secrets, provider payloads, real evidence, private identifiers, package artifacts, and live-provider assumptions.

Any future package or distribution work must prove that provider absence is a safe default, not a broken install state.

## 11. Future Approval Gates

Before provider configuration implementation:

- Robert explicitly approves provider configuration implementation.
- Robert separately approves API-credit-using work before any provider call.
- Model/provider choice is documented.
- Timeout, cost, and rate policies are documented.
- `.env.example` scope is approved.
- No real environment values are introduced.
- Provider disabled-by-default behavior is defined.
- Synthetic-only test scope is defined.
- Logging and retention policy is defined.
- Package-safety requirements are confirmed.
- Boundary checks are updated.
- No real evidence is introduced.

Before real customer evidence processing:

- A separate privacy and retention milestone is approved.
- Evidence handling, logging, payload retention, deletion, support audit, and customer-data boundaries are documented.
- Real evidence cannot be used as a fixture or provider test input by default.

## 12. Phase 4.35 Recommendation

Recommended next safe phase:

Phase 4.35 real OpenAI Vision sandbox implementation planning only, focused on exact file changes, adapter choice, provider-call boundaries, API-credit usage approval, synthetic-only first-call rules, timeout/cost/rate policies, package-default behavior, and checker updates.

Alternative safe phase:

Phase 4.35 provider configuration implementation skeleton, no provider calls and no real environment values. This alternative should only add disabled-by-default configuration shape if Robert explicitly approves that implementation slice.

Do not recommend live OpenAI Vision implementation yet unless Robert explicitly approves API-credit-using work. Do not process real customer evidence until a separate approved privacy and retention milestone.

## 13. Specialist Review Findings

Product Strategy Agent: Provider configuration planning supports Robert's AI/photo intelligence direction while preserving uncertainty framing. The future 1-100 altered-or-AI-generated-image uncertainty value remains a manual-review signal, not proof, not a final claim decision, and not a customer accusation.

Architecture and Maintainability Agent: Provider configuration should remain behind an adapter boundary and apply first to a developer-only sandbox path. It must stay separate from receipt scoring, `LocalAnalysisResult`, routes, UI, and upload flow until separately approved.

Receipt Intelligence Agent: Receipt behavior remains protected. The existing OCR route, parser, scoring, report adapter, `analyzeEvidenceFile`, and `LocalAnalysisResult` are unchanged and should remain outside provider configuration planning.

Integration Readiness Agent: Provider configuration is not implemented in Phase 4.34. Future implementation needs explicit opt-in, disabled defaults, model selection, timeout/cost/rate policy, `.env.example` scope approval, and separate API-credit approval.

Scoring and Safety Reviewer Agent: Future provider output must preserve observation versus signal versus limitation separation. Model output cannot create a final decision, claim disposition, accusation, automatic denial, or proof of alteration.

Privacy and Evidence Safety Agent: Synthetic-only first calls are required. No real evidence, anonymized/redacted real fixture, provider payload retention, raw OCR retention, customer identifier, object URL, public URL, storage handle, or secret is allowed in this phase.

QA Harness Agent: Checker coverage should include Phase 4.34 planning signals and keep no-SDK, no-env-file, no-provider-call, no-route-change, no-upload/storage, package-safety, and wording scans active.

Deployment and Release Agent: Commit and push are appropriate only if the diff remains documentation/checker-only and all required checks pass. No deployment, package artifact, installer, release bundle, or provider setup is part of this phase.

## 14. Closeout Criteria

Phase 4.34 is ready to close when:

- This provider configuration planning document exists.
- `ROADMAP.md`, `NEXT_STEPS.md`, `REPO_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `AGENT_LOG.md` reflect Phase 4.34 planning-only status.
- Semantic and sandbox-boundary checks cover this document.
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
