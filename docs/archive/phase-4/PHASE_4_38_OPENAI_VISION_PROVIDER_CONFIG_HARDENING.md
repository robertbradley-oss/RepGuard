# Phase 4.38 OpenAI Vision Provider Config Hardening

## 1. Purpose And Scope

Phase 4.38 is OpenAI Vision provider configuration skeleton hardening and `.env.example` / package-safety review. This is hardening/review only. It preserves the Phase 4.36 Choice A boundary: no provider calls, no API-credit usage, no live OpenAI calls, no synthetic fixture provider calls, no real evidence, no uploads, no routes, no provider SDKs, no OpenAI SDK, no storage, no persistence, no receipt behavior changes, no `analyzeEvidenceFile` changes, and no `LocalAnalysisResult` changes.

The altered-or-AI-generated-image uncertainty direction remains a review signal for manual-review prioritization only. It is not proof, not a final claim decision, not a customer accusation, and not an automated support outcome.

## 2. Provider Configuration Hardening Summary

The provider configuration skeleton remains sandbox-only and inert. `resolveVisionSandboxProviderConfig` continues to accept candidate values as data only and still returns disabled defaults even when unsafe candidates are supplied.

Phase 4.38 hardens candidate validation so guard reasons are reported for:

- provider enabled attempts.
- provider call attempts.
- request execution attempts.
- API-credit usage attempts.
- model selection attempts.
- live cost-limit attempts.
- payload logging attempts.
- raw OCR retention attempts.
- evidence scope broader than synthetic-fixture-only.
- retry attempts greater than 1.
- timeout above the ceiling.
- fixture batch size above 1.
- package-safety unsafe mode.
- secrets or env-config-required attempts.
- unknown provider family or mode.

The guard output remains a limitation and review-readiness signal only. It cannot enable provider behavior.

## 3. Disabled Defaults Preserved

The disabled-by-default provider config is preserved:

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

## 4. `.env.example` Decision

`.env.example` is added in Phase 4.38 because Robert approved the provider configuration skeleton track and this phase explicitly includes `.env.example` / package-safety review.

.env.example is added as an example-only package-safety file, not as live provider setup.

The added `.env.example` is package-safe:

- contains no secrets.
- contains no real values.
- does not enable provider calls.
- does not imply API credits may be used.
- clearly states provider calls and API-credit usage requires separate Robert approval.
- makes provider disabled by default clear.
- states the current sandbox works without provider configuration.
- states no real evidence should be used.
- leaves the provider API key blank.
- avoids live setup language.

This example file is documentation/configuration guidance only. The skeleton does not read it, and no runtime code reads provider environment values.

## 5. Boundary Check Updates

The boundary checker now treats `.env.example` as an inspected text file while continuing to block real root `.env*` files other than `.env.example`.

Boundary coverage includes:

- real `.env` file drift.
- secrets or API-key-like values.
- provider SDK imports and dependencies.
- provider call/network patterns.
- provider enabled by default.
- request execution enabled by default.
- API-credit usage enabled by default.
- payload logging enabled by default.
- raw OCR retention enabled by default.
- evidence scope broader than synthetic fixtures.
- route/runtime/receipt integration drift.
- package artifact drift.
- `.env.example` unsafe enablement or nonblank provider API key values.

## 6. Package And Downloadable Safety

Package and downloadable safety remains protected:

- no secrets.
- provider disabled by default.
- no provider payloads.
- no real evidence.
- no real environment files.
- no package artifacts.
- no live-provider assumptions.
- self-hosted users may configure providers only after later approved guidance.
- current package/demo state remains synthetic-only and safe.

The current project remains useful without provider access, provider credentials, or API credits.

## 7. Relationship To Current Sandbox

The sandbox skeleton remains script/module-only. The fixture runner remains synthetic-only. The provider config skeleton does not call providers, does not read secrets, does not read real environment values, does not change routes, does not change uploads, does not change receipt scoring, does not use `LocalAnalysisResult`, and does not change `analyzeEvidenceFile`.

Existing `POST /api/analysis/ocr` remains unchanged. Existing `POST /api/analysis/mock-provider` remains unchanged. Receipt parser, scoring, report behavior, upload flow, `ClaimReviewWorkflow`, and `ProductPhotoReviewPanel` remain protected.

## 8. Specialist Review Findings

Product Strategy Agent: Phase 4.38 supports future AI/photo intelligence readiness while preserving altered-or-AI-generated-image uncertainty as a manual-review signal only.

Architecture and Maintainability Agent: Config hardening remains isolated under `src/lib/analysis/vision-sandbox/` and does not create route, UI, upload, storage, receipt, or runtime coupling.

Receipt Intelligence Agent: Receipt behavior remains protected. `analyzeEvidenceFile`, `LocalAnalysisResult`, parser, scoring, report behavior, OCR route behavior, and mock-provider route behavior are unchanged.

Integration Readiness Agent: The safe `.env.example` improves developer/package readiness without authorizing API-credit usage or provider execution.

Scoring and Safety Reviewer Agent: No output creates evidence conclusions, fraud scores, final decisions, or customer accusations. Observation, signal, limitation, and manual-review language remain separated.

Privacy and Evidence Safety Agent: No real evidence, customer data, provider payload, raw OCR retention, storage handle, public/object URL, or secret is introduced.

QA Harness Agent: Probe, semantic, and boundary checks now validate the Phase 4.38 disabled defaults, unsafe candidate reporting, safe env example, package safety, and route/runtime isolation.

Deployment and Release Agent: Commit and push are appropriate only after checks pass. No deployment, package artifact, release bundle, or live provider setup is part of Phase 4.38.

## 9. Phase 4.39 Recommendation

Preferred next phase: Phase 4.39 provider configuration developer usage documentation and API-credit approval readiness.

Alternative: Phase 4.39 first API-credit-using OpenAI Vision sandbox implementation, synthetic fixtures only, only if Robert explicitly approves Choice B.

Do not recommend API-credit-using implementation unless Robert explicitly approves Choice B.

## 10. Closeout Criteria

Phase 4.38 is complete only if:

- provider configuration remains inert.
- no live OpenAI implementation is added.
- no OpenAI SDK or provider SDK is added.
- no real env value or real env file is added.
- no secret is added.
- no provider call is added.
- no API-credit-using behavior is added.
- provider remains disabled by default.
- request execution remains disabled by default.
- evidence scope remains synthetic-fixture-only.
- payload logging remains disabled by default.
- raw OCR retention remains disabled by default.
- no route behavior changes are added.
- no upload, storage, persistence, runtime wiring, UI wiring, real evidence path, anonymized/redacted real fixture, provider payload, package artifact, protected runtime change, receipt behavior change, `analyzeEvidenceFile` change, or `LocalAnalysisResult` change is added.
- required checks pass.
