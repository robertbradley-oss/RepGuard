# Phase 4.30 OpenAI Vision Sandbox Skeleton Plan

Date: 2026-06-01

Primary agent role: Architecture and Maintainability Agent

Supporting reviews: Product Strategy, Receipt Intelligence, Integration Readiness, Scoring and Safety, Privacy and Evidence Safety, QA Harness, Deployment and Release

## 1. Purpose And Scope

Phase 4.30 is an OpenAI Vision sandbox skeleton planning-only milestone. ClaimGuard needs this checkpoint before skeleton implementation because the future sandbox will sit near several sensitive boundaries: synthetic fixtures, provider abstraction, prompt/output shape, route options, package distribution, and review-signal wording. Planning the skeleton first keeps those boundaries explicit before any module, script, or route can be created.

This milestone is planning-only. No sandbox skeleton code is implemented. No new route is implemented. No existing route behavior is changed. No OpenAI SDKs, provider SDKs, environment variables, provider calls, upload handling, multipart parsing, binary file parsing, storage, persistence, UI, runtime schema/types, package artifacts, fixture files, fixture metadata changes, real evidence processing, production analysis, or live AI/Vision/photo analysis are added.

This is not live AI. It is not production analysis. It is not provider integration. It is skeleton-planning only for a future developer-only synthetic fixture sandbox.

`ClaimReviewWorkflow` is not wired. `ProductPhotoReviewPanel` is not routed. `analyzeEvidenceFile` remains unchanged. `LocalAnalysisResult` remains unchanged. Receipt parser, scoring, report adapter, live receipt behavior, upload flow, existing OCR route behavior, and existing mock-provider route behavior remain unchanged.

The future altered-or-AI-generated-image uncertainty direction remains a 1-100 review signal concept only. It is not proof, not a final decision, not a claim disposition, not a customer accusation, and not a fraud score.

## 2. Phase 4.24-4.29 Readiness Review

The completed Phase 4.24 through Phase 4.29 package established the minimum planning and artifact foundation needed before skeleton implementation planning:

- Phase 4.24 planned synthetic fixture metadata schema requirements: stable fixture identity, allowed evidence categories, prompt/schema linkage, expected-output metadata, altered-or-AI-generated-image uncertainty metadata, privacy flags, retention fields, package-distribution fields, and approval gates.
- Phase 4.25 planned validation/probe implementation: no SDK/env/provider calls, no uploads/storage/object URLs, no runtime or route boundary drift, no real evidence, no identifiers, no provider payload/raw OCR, safety wording, altered/AI uncertainty wording, observation/signal separation, fixture metadata policy, and package-safety checks.
- Phase 4.26 implemented `check:vision-sandbox-boundaries` as a local static boundary check. It remains unwired from runtime and scans provider/package/env, protected route/runtime drift, fixture metadata policy, privacy, wording, and package artifact boundaries.
- Phase 4.27 added `fixtures/vision-sandbox/metadata/synthetic-fixture-registry.json` with 12 package-safe synthetic metadata entries and no images or evidence files.
- Phase 4.28 planned synthetic fixture creation, allowed directories, file types, naming, content, license/origin, QA checks, stop conditions, and package-safe fixture requirements.
- Phase 4.29 added 9 hand-authored synthetic SVG fixtures and 3 synthetic markdown simulations under `fixtures/vision-sandbox/`, all matched to Phase 4.27 metadata and documented as package-safe synthetic demo artifacts.

Readiness strengths:

- Synthetic fixture metadata and assets exist.
- Validation boundaries exist and are already runnable.
- Existing OCR and mock-provider routes remain isolated.
- The mock provider adapter remains synthetic/mock-only.
- Sandbox output planning remains separate from receipt scoring and `LocalAnalysisResult`.
- Package/downloadable safety is already part of the planning and validation vocabulary.

Gaps before skeleton implementation:

- No skeleton module structure exists yet.
- No fixture resolver or registry access module exists yet.
- No sandbox-shaped stub response builder exists yet.
- No sandbox result normalizer exists yet.
- No route option has been approved.
- No runtime schema/types are approved.
- Validation probes will need to cover any future skeleton files before Phase 4.31 can close.
- Any future skeleton must still choose script/module-only first unless Robert explicitly approves a route.

## 3. Future Sandbox Skeleton Purpose

The future skeleton should be a developer-only boundary for synthetic fixture testing. It should let ClaimGuard exercise the planned OpenAI Vision-style sandbox shape without provider execution, customer evidence, upload handling, route wiring, or production scoring.

The future skeleton may eventually:

- Load or reference synthetic fixture metadata.
- Reference synthetic fixture assets by approved fixture key only.
- Select a prompt family conceptually.
- Produce stubbed or fixture-derived sandbox-shaped responses.
- Exercise validation probes.
- Demonstrate unsupported evidence shapes.
- Demonstrate provider-timeout simulation shapes.
- Demonstrate schema-validation-failure simulation shapes.
- Keep observation, uncertainty signal, limitation, and manual-review driver fields separate.
- Remain separate from production receipt analysis.

The future skeleton must not:

- Call OpenAI.
- Call any provider.
- Import provider SDKs.
- Read provider environment variables.
- Accept customer uploads.
- Parse real binary uploads.
- Accept public image URLs.
- Accept object URLs.
- Store evidence.
- Persist customer data.
- Alter receipt scoring.
- Produce `LocalAnalysisResult`.
- Make claim decisions.
- Route into production UI.
- Expose customer-facing accusations.
- Emit proof, fake, forged, wrongdoing-confirming, automatic disposition, refund, approval, or rejection wording.

## 4. Future Module Boundary Plan

These are planning boundaries only. No modules are implemented in Phase 4.30.

| Future module | Purpose | Allowed inputs | Disallowed inputs | Allowed outputs | Allowed dependencies | Disallowed dependencies | Runtime boundary | Package-safety boundary | Future test/probe expectations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sandbox fixture registry access | Read approved synthetic metadata entries. | `fixtureKey`, registry JSON read-only reference. | Customer files, upload objects, provider payloads, raw OCR, identifiers. | Metadata summary with package-safe flags. | Node file read only if script-only, JSON parser, fixture metadata. | Routes, analyzers, UI, providers, env vars, storage. | Developer-only, not imported by live runtime. | Must respect `safeForDownloadablePackage`, `safeForDemoMode`, `safeForSelfHostedInstall`. | Fixture key allowlist, required fields, package flags, no identifier leakage. |
| Sandbox fixture resolver | Map fixture key to approved synthetic asset or simulation reference. | Approved `fixtureKey`, expected file path under `fixtures/vision-sandbox/`. | Public URLs, object URLs, data URLs, storage handles, uploaded file paths. | Internal synthetic fixture reference or safe missing-fixture limitation. | Path helpers, registry access. | Upload parsers, browser APIs, storage clients, provider clients. | Developer-only resolver; no production upload path. | Must block non-fixture directories and private fixtures. | Path traversal guard, directory allowlist, extension allowlist, asset/metadata match. |
| Sandbox prompt family selector | Choose a conceptual prompt family for a synthetic fixture. | Metadata `allowedPromptFamilies`, `analysisMode`. | Raw prompt injection text, customer instructions, provider config. | Prompt family key only, not provider prompt payload. | Registry metadata. | OpenAI SDK, provider templates, network calls. | Planning/stub only. | Must not require live provider configuration. | Allowed enum probe, no provider prompt body generated. |
| Sandbox stub response builder | Create sandbox-shaped stub output from metadata and fixture expectations. | Fixture metadata summary, selected prompt family, safe simulation status. | Real OCR text, provider payloads, customer identifiers, image bytes. | Stubbed sandbox-shaped output with observations, signals, limitations, manual-review drivers. | Local constants, metadata, simulation markdown summaries. | `LocalAnalysisResult`, report adapter, scoring, provider SDKs. | Separate from receipt runtime. | Output must be synthetic-only and demo-safe. | Shape probe, unsupported/failure cases, safe wording, privacy flags. |
| Sandbox schema-shape guard | Validate the stub output shape. | Stub output object. | Live provider response body, route request, uploads. | Validation status and limitation list. | Local assertions. | Runtime schema/type migration unless separately approved. | Developer-only validation, no live route behavior. | Fail closed before package demos. | Required fields, allowed enums, no receipt score fields, no provider payload fields. |
| Sandbox privacy guard | Ensure no private identifiers or real evidence markers appear. | Metadata/output strings, fixture references. | Raw customer evidence, raw OCR, provider payloads. | Pass/fail status and blocked reason. | Local regex/string checks. | Network, storage, uploads. | Local static/runtime-development check only. | Blocks package-unsafe sample data. | Identifier scan, URL/object/storage scan, raw OCR/provider payload scan. |
| Sandbox package-safety guard | Confirm fixture/output can be included in demos or self-hosted installs. | Metadata package flags, fixture file reference, output summary. | Secrets, env values, private fixtures, package artifacts. | Package-safety status. | Metadata registry. | Archive/build/package creation tooling in Phase 4.31. | Developer-only guard. | Must fail if package status is missing or unsafe. | `safeForDownloadablePackage`, demo/self-hosted flags, no artifact creation. |
| Sandbox unsupported/failure response builder | Produce limitation-only unsupported, timeout, refusal, schema-validation, or internal-error stubs. | Synthetic scenario key, failure type enum. | Provider error bodies, stack traces, request IDs. | Limitation-only failure output. | Local constants and metadata. | Provider clients, logs, raw payload replay. | Separate from claim decisions. | Safe for package demos if synthetic. | Failure shape probes, no customer-risk signal, no altered/AI value when not applicable. |
| Sandbox result normalizer | Normalize future skeleton outputs into a sandbox-only shape. | Stub/failure output. | `LocalAnalysisResult`, live receipt report output, provider payload. | Sandbox-only normalized result. | Local skeleton types only if approved later. | Receipt analyzer, report adapter, scoring, UI. | Must remain outside live receipt runtime. | Must not become package artifact generator. | No receipt fields, no decision fields, no live analysis imports. |

## 5. Future Route Boundary Options

No route is implemented in Phase 4.30. Future route choices must be approved separately.

| Option | Benefits | Risks | Safety boundaries | Approval requirements | Phase 4.31 recommendation |
| --- | --- | --- | --- | --- | --- |
| No route yet; script/module-only sandbox first | Safest first implementation; easiest to keep provider-free, upload-free, and runtime-free. | No HTTP surface for manual route testing. | Fixture key only, local script/module execution, no runtime import, no upload, no provider config. | Robert approves Phase 4.31 skeleton implementation as script/module-only. | Recommended default. |
| Developer-only local script | Can exercise fixture registry, resolver, stub output, validation, and package-safety checks without API exposure. | Script output could drift if not covered by checks. | No provider SDK/env, no uploads, no storage, no production UI, synthetic fixture keys only. | Robert approves script location and output scope. | Acceptable if kept narrow. |
| Internal API route using fixtureKey only | Allows local HTTP testing of sandbox-shaped output. | Route behavior increases review burden and could be mistaken for production analysis. | JSON-only `fixtureKey`, no files, no URLs, no provider mode except sandbox, no public/customer inputs, no UI wiring. | Separate explicit route approval. | Not default for Phase 4.31. |
| Mock-provider route extension only if separately approved | Reuses existing synthetic/mock route pattern. | Could blur mock provider adapter and OpenAI Vision sandbox responsibilities. | Must not change existing mock-provider behavior unless a named route-extension milestone opens it. | Explicit approval to modify `/api/analysis/mock-provider`. | Do not choose for Phase 4.31 by default. |
| Separate `/api/analysis/vision-sandbox` route only if separately approved | Clean separation from OCR and mock-provider routes. | New route surface, new probes, stronger privacy and package safety obligations. | FixtureKey-only, developer-only, no uploads, no providers, no storage, no UI, no customer data. | Explicit approval for new route implementation and probe plan. | Defer until script/module skeleton passes. |

Recommended default for Phase 4.31: script/module-only sandbox skeleton, no API route.

## 6. Future Input Boundary

Allowed future inputs should remain:

- `fixtureKey`.
- Synthetic fixture metadata reference.
- Synthetic fixture asset reference from the approved fixture registry.
- `analysisMode` enum.
- `providerMode: "sandbox"` or equivalent sandbox-only marker.
- Developer-only flags that are safe, non-provider, and non-customer.

Disallowed future inputs:

- Real customer files.
- Multipart uploads.
- Binary uploads.
- Public image URLs.
- Object URLs.
- Data URLs.
- File URLs.
- Storage handles.
- Provider payloads.
- Raw OCR dumps.
- Customer identifiers.
- Ticket, order, claim, evidence, tracking, or account identifiers.
- Live provider config.
- Production upload objects.
- Browser `File` or `Blob` objects.
- Raw EXIF or metadata payloads.
- Case queue or integration handles.

## 7. Future Output Boundary

Future outputs may include:

- Sandbox-shaped stub output.
- Unsupported evidence output.
- Provider-timeout simulation output.
- Schema-validation-failure simulation output.
- Fixture metadata summary.
- Validation status.
- Limitation list.
- Manual-review driver list.
- Safe support summary.
- Privacy and retention flags.
- Package-safety status.
- Altered-or-AI-generated-image uncertainty field only when applicable and framed as a review signal.

Future outputs must not include:

- `LocalAnalysisResult`.
- Live receipt report output.
- Receipt score breakdown.
- Claim disposition.
- Automatic disposition wording.
- Approval or rejection wording.
- Customer-facing accusation.
- Fraud confirmation.
- Proof/fake/forged conclusion.
- Provider payloads.
- Raw identifiers.
- Real OCR text.
- Raw image bytes.
- Storage or integration handles.
- Production report adapter fields.

## 8. Relationship To Synthetic Fixtures And Metadata

The skeleton should reference fixtures only through approved synthetic fixture keys.

Synthetic fixture metadata remains non-identifying. Synthetic assets remain synthetic. No real, anonymized, or redacted customer evidence is allowed in Phase 4.31 unless a separate future privacy and retention milestone explicitly approves it, and Phase 4.30 does not recommend that path.

Package-safe status must be respected:

- `safeForDownloadablePackage` must be true before a fixture can be considered package-demo eligible.
- `safeForDemoMode` must be true before demo usage.
- `safeForSelfHostedInstall` must be true before self-hosted sample usage.
- `packageDistributionStatus` must not be missing.
- Unsafe or internal-only fixtures must fail closed.

Fixture metadata must not become runtime scoring input. Fixture assets must not be exposed as production upload examples. Fixture loading should remain developer-only until separately approved.

The Phase 4.27 registry and Phase 4.29 assets are readiness inputs for future development checks, not production evidence and not customer-facing examples.

## 9. Relationship To Validation And Probe Checks

Phase 4.26 boundary checks should guard future skeleton implementation. Phase 4.30 updates planning coverage so Phase 4.31 can be checked without weakening existing gates.

Future skeleton implementation must pass checks for:

- No SDK/env/provider calls.
- No upload, storage, public URL, object URL, data URL, or file URL handling.
- No real evidence.
- No private identifiers.
- No provider payload dumps.
- No raw OCR dumps.
- No route behavior changes unless explicitly approved.
- No runtime receipt scoring changes.
- No `LocalAnalysisResult` migration.
- No `analyzeEvidenceFile` changes.
- Unsafe wording scan.
- Altered-or-AI-generated-image uncertainty wording scan.
- Observation/signal/limitation/manual-review separation.
- Package-safety scan.
- Fixture registry safety check.
- Synthetic-only asset check.
- No protected runtime imports.

Any future skeleton files should be added to `check:vision-sandbox-boundaries` or an approved follow-up probe before Phase 4.31 closes.

## 10. Relationship To Existing Routes And Mock Adapter

Existing `POST /api/analysis/ocr` remains exact `fixtureKey` only. Phase 4.30 does not modify it.

Existing `POST /api/analysis/mock-provider` remains synthetic/mock-only and adapter-only. Phase 4.30 does not modify it.

Phase 4.31 should not modify either route unless Robert explicitly approves a route implementation option.

The mock provider adapter remains the test boundary before live provider behavior. The OpenAI Vision sandbox skeleton should follow provider abstraction and mock-before-live plans, but it must not implement provider behavior.

`analyzeEvidenceFile` and `LocalAnalysisResult` remain unchanged. Skeleton output must remain separate from live receipt scoring, receipt reports, receipt parsing, `ClaimReviewWorkflow`, `ProductPhotoReviewPanel`, upload behavior, and production UI.

## 11. Package And Downloadable Safety Plan

The future skeleton must be safe by default in downloadable and self-hosted packages:

- Do not ship secrets.
- Do not require provider access.
- Do not assume live provider config.
- Do not include real evidence.
- Do not include private fixtures.
- Do not include provider payloads.
- Do not include raw OCR dumps.
- Do not include unsafe demo labels.
- Mark synthetic fixtures clearly.
- Keep provider features disabled unless configured in a later approved phase.
- Preserve future `.env.example`-only guidance with no secrets if package setup is later approved.
- Avoid package artifact generation in Phase 4.30 and Phase 4.31.

Future package checks should block archives, installers, release bundles, self-hosted templates, or downloadable artifacts until a separate package/distribution phase approves them.

## 12. Future QA And Probe Requirements For Skeleton Implementation

Before Phase 4.31 implementation:

- Confirm `main` is clean and synced.
- Re-read this Phase 4.30 plan.
- Re-read `docs/archive/phase-4/PHASE_4_26_SANDBOX_VALIDATION_PROBES.md`.
- Re-read existing OCR and mock-provider route probes.
- Confirm no route option is approved unless Robert explicitly says so.

During and after Phase 4.31 implementation, required checks should include:

- Existing full check suite.
- `npm.cmd run lint`.
- `npm.cmd run build`.
- `npm.cmd run check:report-semantics`.
- `npm.cmd run check:product-photo-probes`.
- `npm.cmd run check:vision-sandbox-boundaries`.
- `git diff --check`.
- No SDK/env/package additions.
- No route behavior changes.
- No upload/storage additions.
- No protected runtime imports.
- No real identifiers.
- Fixture registry safety check.
- Package-safety check.
- Unsafe wording check.
- Synthetic-only asset check.
- No provider payload check.
- No `LocalAnalysisResult` usage check.
- No `analyzeEvidenceFile` changes.
- Protected code diff scan.
- Fixture metadata change scan.
- Fixture/image addition scan.
- Runtime schema/type addition scan.
- Package artifact addition scan.

## 13. Phase 4.31 Implementation Recommendation

Recommended next safe phase:

Phase 4.31 OpenAI Vision sandbox skeleton implementation, no SDK/env/provider calls, no route behavior, no upload handling, no storage, no persistence, no UI, no runtime schema/types unless separately approved, and no real evidence.

Preferred option:

Option A: script/module-only sandbox skeleton, no API route. This should create the smallest developer-only boundary for fixture-key lookup, synthetic metadata summary, sandbox-shaped stub/failure outputs, privacy/package guards, and local validation probes.

Alternative options:

Option B: developer-only fixtureKey API route skeleton, only if Robert explicitly approves a route.

Option C: additional validation/probe hardening before skeleton implementation, if route, fixture, package, or privacy boundaries feel under-guarded after review.

Do not recommend live OpenAI Vision implementation yet unless Robert explicitly asks to start that path.

## 14. Stop Conditions For Phase 4.31

Stop Phase 4.31 if implementation would require:

- OpenAI SDK.
- Provider SDKs.
- Environment variables.
- Provider calls.
- Real evidence.
- Upload parsing.
- Multipart parsing.
- Binary parsing.
- Public URL handling.
- Object URL handling.
- Data URL handling.
- Storage or persistence.
- Route behavior changes without approval.
- `LocalAnalysisResult`.
- `analyzeEvidenceFile`.
- Receipt scoring/report changes.
- UI wiring.
- Package artifacts.
- Deployment.
- Fixture file or metadata changes unless separately approved.
- Real customer data.
- Anonymized or redacted real fixtures.
- Provider payloads.
- Customer identifiers.

Required safety/privacy constraints:

- No live OCR.
- No OpenAI SDK.
- No provider SDKs.
- No env vars.
- No provider calls.
- No upload implementation.
- No storage implementation.
- No persistence.
- No runtime schema/types unless separately approved.
- No new route implementation unless separately approved.
- No route behavior changes.
- No fixture changes.
- No real evidence.
- No real customer data.
- No anonymized/redacted real fixtures.
- No provider payloads.
- No customer identifiers.
- No package artifacts.
- No scoring migration.
- No UI changes.
- No live receipt behavior changes.
- No deployment.

Protected files for Phase 4.31 unless only inspected:

- `src/app/api/analysis/ocr/route.ts`
- `src/app/api/analysis/mock-provider/route.ts`
- `src/components/ClaimReviewWorkflow.tsx`
- `src/components/ProductPhotoReviewPanel.tsx`
- `src/lib/analysis/analyzer.ts`
- `src/lib/analysis/types.ts`
- `src/lib/analysis/report-adapter.ts`
- Upload flow files.
- Receipt parser/scoring/live fixtures.
- Package/config/deployment/env files.
- Runtime type/schema files.
- Fixture asset directories.
- Fixture metadata registry.

Validation/probe files may change only for narrow planning or future skeleton coverage.

## Specialist Review Findings

Product Strategy Agent: Phase 4.30 supports Robert's future AI/photo intelligence direction while preserving uncertainty framing. The 1-100 altered-or-AI-generated-image uncertainty concept remains a review signal, not proof, not a fraud score, and not a claim decision.

Architecture and Maintainability Agent: The safest skeleton is script/module-only first. Keep fixture registry access, fixture resolution, prompt family selection, stub output building, guards, unsupported/failure builders, and result normalization separated. Do not collapse skeleton output into receipt types or existing routes.

Receipt Intelligence Agent: Existing receipt analysis remains protected. The OCR route stays exact `fixtureKey` only. Receipt parser, scoring, reports, `analyzeEvidenceFile`, and `LocalAnalysisResult` remain unchanged.

Integration Readiness Agent: Provider integration is not ready to start. No SDKs, env vars, provider config, provider calls, provider payloads, live OCR, or route-level provider behavior belong in Phase 4.31.

Scoring and Safety Reviewer Agent: Skeleton output must not create claim disposition, customer accusation, proof, fake/forged conclusion, automatic disposition wording, or receipt score migration. Manual-review language and limitation framing are required.

Privacy and Evidence Safety Agent: Synthetic fixture keys, metadata, and assets remain the only allowed evidence references. Real evidence, anonymized/redacted customer fixtures, public/object URLs, storage handles, raw OCR, provider payloads, customer identifiers, and private metadata stay blocked.

QA Harness Agent: Phase 4.31 should extend or use the static validation boundaries before closing. Required probes should cover no SDK/env/package drift, no route behavior changes, no upload/storage paths, no protected imports, fixture safety, output safety, and package-safety flags.

Deployment and Release Agent: Commit and push are appropriate for this documentation/source-of-truth milestone only after checks pass. No deployment, package archive, installer, release bundle, or self-hosted artifact should be created.

## Closeout Criteria

Phase 4.30 is ready to close when:

- This OpenAI Vision sandbox skeleton planning document exists.
- `ROADMAP.md`, `NEXT_STEPS.md`, `REPO_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `AGENT_LOG.md` reflect Phase 4.30 planning-only status.
- Semantic and sandbox boundary checks cover the Phase 4.30 planning document.
- No sandbox skeleton code is implemented.
- No new route is implemented.
- No existing route behavior changes.
- No runtime schema/types are added.
- No fixture files/images are added or changed.
- No fixture metadata is changed.
- No OpenAI SDK, provider SDK, env var, provider call, upload path, storage, persistence, UI wiring, real evidence, provider payload, package artifact, deployment, receipt behavior change, `analyzeEvidenceFile` change, or `LocalAnalysisResult` change is added.
- Required checks pass.
- The next recommended task is Phase 4.31 script/module-only OpenAI Vision sandbox skeleton implementation, no SDK/env/provider calls, no route behavior unless separately approved, and no real evidence.
