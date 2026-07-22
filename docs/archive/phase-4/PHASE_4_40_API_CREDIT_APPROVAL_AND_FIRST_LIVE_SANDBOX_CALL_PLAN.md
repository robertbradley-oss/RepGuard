# Phase 4.40 API-Credit Approval And First Live Sandbox Call Plan

## Purpose And Scope

Phase 4.40 exists before Choice B implementation. It is decision/planning only: no live provider behavior, no OpenAI SDK, no provider call, no API-credit usage, no real environment value, no secret, no upload route, no UI wiring, no storage, no persistence, no fixture change, no package artifact, no deployment, no receipt behavior change, no `analyzeEvidenceFile` change, and no `LocalAnalysisResult` change.

This document plans the first possible API-credit-using sandbox call after Robert makes a separate explicit approval decision. It is not live AI and not production analysis. It describes observations, review signals, limitations, and manual-review safety expectations only. It does not authorize execution by itself.

## Choice B Definition

Choice B: Approve first API-credit-using OpenAI Vision sandbox implementation for synthetic fixtures only.

If Robert later approves Choice B in plain language, that approval would authorize a later phase to implement:

- One tiny manually triggered synthetic-only provider call path inside the OpenAI Vision sandbox.
- API-credit usage for approved synthetic fixtures only.
- Sandbox-only provider configuration use, still default-disabled outside the explicitly approved local run.
- Sandbox-only response normalization and validation against the existing OpenAI Vision sandbox output shape.
- Cost metadata captured when available, timeout metadata captured, and provider failure normalization for manual review of the integration.

Choice B would not authorize:

- Real customer evidence, anonymized customer evidence, redacted customer evidence, account screenshots, ticket content, private order data, or any non-synthetic fixture.
- Production routes, upload behavior, UI behavior, public app workflow, storage, persistence, object URLs, public URLs, provider payload retention, raw provider payload retention, raw OCR retention, or provider payload logging.
- Receipt scoring, `LocalAnalysisResult` output, `analyzeEvidenceFile` routing, `ClaimReviewWorkflow` wiring, `ProductPhotoReviewPanel` routing, report-adapter migration, parser/scoring changes, or customer-facing claim decisions.
- Automatic retry, broad fixture batches, recurring calls, uncontrolled API-credit usage, package artifacts, deployment, or live-provider assumptions for downloadable/self-hosted use.

## Recommended Approval Position

The technical foundation appears ready for a tiny synthetic-only first call, but only after Robert explicitly approves Choice B. Provider defaults are safe and disabled, boundary checks exist, fixture runner exists, package safety has been reviewed, and the sandbox already has synthetic fixture metadata/assets plus deterministic stub output coverage.

The recommended position is:

- Ask Robert whether he approves Choice B before writing any API-credit-using implementation.
- If Robert approves Choice B, Phase 4.41 can implement the first API-credit-using OpenAI Vision sandbox implementation as the narrowest possible developer-only synthetic fixture run.
- If Robert does not approve Choice B, Phase 4.41 should continue hardening config/checkers, documentation, and package-safety guardrails with still no API credits.

API-credit work remains blocked unless Robert explicitly approves Choice B.

## First Live Synthetic-Only Sandbox Call Plan

The first live sandbox call should be developer-only, manually triggered, and exactly one fixture. It should not be exposed through a route, UI, upload path, report path, workflow, storage path, or deployment. There must be no route exposure unless separately approved.

Recommended execution sequence for a later approved phase:

1. Confirm `git status --short --branch` is clean and synced.
2. Confirm provider disabled by default, request execution disabled by default, and API-credit usage disabled by default.
3. Confirm Robert explicitly approved Choice B in the active thread.
4. Confirm provider key not committed, no real env file staged, and local config must not be logged.
5. Run `npm.cmd run check:vision-sandbox-boundaries`, `npm.cmd run check:vision-sandbox-skeleton`, and `npm.cmd run check:vision-sandbox-fixture-runner`.
6. Enable the smallest local execution path only for the manual run and only in an uncommitted local environment or a separately approved implementation file path.
7. Execute exactly one fixture call with strict timeout, no automatic retry, no uploads, no UI, no public URLs, no object URLs, no storage handles, no raw payload logging, no raw OCR retention, and no repeated calls.
8. Stop after first result.
9. Validate output shape, wording, limitations, retention markers, cost metadata captured, timeout metadata captured, and provider failure behavior if the call fails.
10. Run boundary checks required before and after call, plus report semantics and fixture-runner checks.

## Fixture Selection

Preferred first fixture: `synthetic-clean-receipt-baseline`.

Reason: it is the lowest-risk proof-of-plumbing case. It should exercise the provider request, response normalization, schema shape validation, manual-review-safe summary, cost metadata, timeout metadata, and package-safety markers without starting from a hard altered-or-AI-generated-image uncertainty scenario.

Acceptable fallback only if the baseline fixture is unavailable: `synthetic-product-photo-normal-context`, because it is still package-safe and synthetic, but it should remain a visual context observation exercise rather than a product-photo runtime launch.

Do not use the first live provider call for real evidence, anonymized evidence, redacted evidence, account screenshots, private customer data, batch fixtures, or unsupported/failure fixtures. Avoid first-call fixtures that test high altered/AI uncertainty until the provider path is proven safe and the wording guardrails have already passed once with a simpler case.

## Provider Configuration Requirements

The later approved implementation must preserve these defaults:

- Provider disabled by default.
- Provider calls disabled by default.
- Request execution disabled by default.
- API-credit usage disabled by default.
- Payload logging disabled.
- Raw OCR retention disabled.
- Evidence scope synthetic-fixture-only.
- Package mode downloadable-safe-disabled.

Provider key not committed is mandatory. `.env.example` only remains example-only and contains no real value. Real `.env`, `.env.local`, provider credentials, local config, API keys, and request metadata must not be committed or logged. Model choice, timeout, retry, max batch, estimated usage, and stop behavior must be documented before the first call.

## API-Credit Controls

API-credit use requires explicit Robert approval for Choice B. The later approved first call must use:

- Tiny batch only: exactly one fixture.
- No automatic retry.
- Strict timeout.
- Stop after first result.
- No repeated calls without review.
- No batch expansion without another approval.
- Usage/cost metadata captured when available.
- Provider failure normalized as an integration limitation, not as evidence meaning.

Stop if usage is unexpected, if provider errors repeat, if output shape fails validation, if output wording is unsafe, if any real/private evidence appears in the request path, if the provider key appears in logs or diffs, or if any route/UI/upload/storage/persistence path becomes involved.

## Output Validation

The first result must pass:

- Schema shape validation.
- Semantic safety scan.
- Altered-or-AI-generated-image uncertainty wording scan.
- Observation-vs-signal separation check.
- Manual-review-only wording review.
- Limitation and confidence review.
- Retention marker review.
- Package-safety review.
- No proof/fraud/fake/forged wording.
- No automatic deny/refund wording.
- No receipt scoring output.
- No `LocalAnalysisResult` output.
- No customer-facing accusation wording.
- No external-verification claim.

Output can describe observations, uncertainty, limitations, provider failure states, timeout state, cost metadata, and manual-review drivers. It must not present a final claim decision, a customer accusation, or a conclusion about evidence authenticity.

## Stop And Rollback Conditions

Stop and rollback conditions for a later approved implementation:

- Robert has not explicitly approved Choice B in plain language.
- Any provider SDK, provider call, request execution, or API-credit behavior appears before approval.
- Any real evidence, anonymized evidence, private identifier, customer data, public URL, object URL, storage handle, raw OCR, raw provider payload, or provider secret appears.
- Any route behavior, upload behavior, UI wiring, persistence, receipt scoring, `analyzeEvidenceFile`, or `LocalAnalysisResult` path is touched.
- Any package artifact or deployment work appears.
- Any safety wording says or implies proof, fraud confirmation, authenticity confirmation, automatic denial, automatic refund, or customer wrongdoing.
- A required check fails.

Rollback should revert provider implementation commit if one exists, remove any uncommitted local execution changes, rotate the key if it was exposed, delete local logs containing provider metadata, re-run safety scans, and update the phase doc. Do not weaken safety gates to make the first call pass.

## Package/Downloadable Safety

Package/downloadable safety remains blocked around secrets and live assumptions:

- No secrets in repo.
- `.env.example` only.
- Provider disabled by default.
- API-credit usage disabled by default.
- No live-provider assumptions in downloadable package.
- No committed `.env`, `.env.local`, provider key, request payload, response payload, logs, screenshots, raw OCR, or fixture derived from a provider response.
- Self-hosted users must provide their own key only in a later explicitly approved setup phase.

The first API-credit-using path must be safe to omit from a package or ship disabled without making the app unusable.

## Specialist Review Findings

Product Strategy: Choice B is the right decision point because it separates business approval for API-credit usage from implementation mechanics. The first call should prove sandbox plumbing only, not product value claims.

Architecture: The existing disabled provider config and sandbox modules are good enough for a tiny approved implementation, but the first call should remain script/module-only and outside routes, uploads, UI, and receipt runtime.

Receipt Intelligence: Receipt behavior must remain unchanged. The baseline receipt fixture is acceptable because it tests sandbox normalization without touching the shipped receipt analyzer.

Scoring/Safety: Model output must remain review-support signal language with limitations and manual-review markers. It must not become a score, verdict, or external verification claim.

Privacy/Evidence Safety: Synthetic-only scope is the hard boundary. No real, anonymized, or redacted customer evidence should enter the first provider call.

QA Harness: Boundary checks, fixture-runner checks, report semantics, and diff checks should run before and after any approved call. A single fixture is enough for the first live plumbing proof.

Deployment/Release: Do not deploy. Do not create package artifacts. Commit only the approved implementation slice after checks pass, and keep secrets out of git.

## Phase 4.41 Recommendation

If Robert explicitly approves Choice B in plain language, the recommended next task is Phase 4.41 first API-credit-using OpenAI Vision sandbox implementation. It should implement one tiny manually triggered synthetic-only call for `synthetic-clean-receipt-baseline`, with disabled defaults, no route/UI/upload/storage/persistence wiring, no real evidence, no package artifacts, no deployment, and full before/after checks.

If Robert does not approve Choice B, the recommended next task is Phase 4.41 provider config/checker hardening, still no API credits. That path may improve safety scans, package-safety docs, local disabled config checks, and first-call validation planning, but must not implement provider calls.

Do not start API-credit-using implementation unless Robert explicitly approves Choice B in plain language.

## Closeout Criteria

Phase 4.40 is complete when this document and source-of-truth updates record the approval decision boundary, first-call plan, fixture selection, provider config requirements, API-credit controls, output validation, rollback conditions, package safety, and Phase 4.41 recommendation, while all checks confirm no live provider behavior or API-credit behavior was added.
