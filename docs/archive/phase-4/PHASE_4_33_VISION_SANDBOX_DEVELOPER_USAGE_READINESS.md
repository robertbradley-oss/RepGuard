# Phase 4.33 Vision Sandbox Developer Usage Readiness

Date: 2026-06-01

Primary agent role: Integration Readiness Agent

Supporting reviews: Product Strategy, Architecture and Maintainability, Receipt Intelligence, Scoring and Safety, Privacy and Evidence Safety, QA Harness, Deployment and Release

## 1. Purpose And Scope

Phase 4.33 exists after Phase 4.31 and Phase 4.32 to document how developers may inspect the current OpenAI Vision-style sandbox skeleton and fixture runner without starting provider configuration or live evidence processing.

Phase 4.31 added the script/module-only sandbox skeleton under `src/lib/analysis/vision-sandbox/`. Phase 4.32 added fixture-runner validation for all 12 approved synthetic fixtures. Phase 4.33 is the developer usage and readiness checkpoint for that current state.

This milestone is documentation/readiness only. It adds no provider configuration, no OpenAI SDK, no provider SDK, no environment variable, no provider call, no API-credit-using behavior, no upload handling, no storage, no persistence, no UI, no route behavior, no runtime schema/type migration, no package artifact, and no real evidence processing.

This is not live AI. It is not production analysis. It is not a customer-facing route. It is not a claim decision tool. The sandbox remains a local developer validation surface for approved synthetic fixtures only.

The existing `POST /api/analysis/ocr` behavior is unchanged. The existing `POST /api/analysis/mock-provider` behavior is unchanged. `analyzeEvidenceFile` remains the live receipt analyzer entrypoint. `LocalAnalysisResult` remains receipt-shaped. Receipt parser, scoring, report adapter, upload flow, `ClaimReviewWorkflow`, and `ProductPhotoReviewPanel` remain protected.

## 2. Current Sandbox Capabilities

The current sandbox can safely:

- Reference approved synthetic fixture metadata from `fixtures/vision-sandbox/metadata/synthetic-fixture-registry.json`.
- Resolve approved synthetic fixture references under `fixtures/vision-sandbox/assets/` and `fixtures/vision-sandbox/simulations/`.
- Validate approved synthetic fixture references with `runVisionSandboxFixtureRunner`.
- Produce deterministic sandbox-shaped stub outputs through `buildVisionSandboxStubOutput`.
- Validate default analysis mode behavior and approved requested analysis modes.
- Validate incompatible analysis mode fallback to the fixture metadata mode.
- Simulate unsupported and provider/failure-style limitation states without provider execution.
- Validate privacy and retention markers, including no customer identifiers, no raw OCR returned, no provider payload returned, no file retention, no storage, and no persistence.
- Validate package-safety markers, including downloadable-package, demo-mode, and self-hosted-install flags.
- Run local npm checks without provider credentials or API credits.
- Stay separate from production receipt analysis and existing route behavior.

## 3. Current Sandbox Non-Capabilities

The sandbox does not:

- Call OpenAI.
- Call any provider.
- Use API credits.
- Require provider environment variables.
- Accept uploads.
- Parse real customer evidence.
- Process public image URLs, object URLs, data URLs, file URLs, or storage handles.
- Store or persist evidence.
- Return raw OCR dumps.
- Return provider payloads.
- Produce `LocalAnalysisResult`.
- Change receipt parser, scoring, report, or receipt route behavior.
- Make claim decisions.
- Provide customer-facing accusations.
- Produce a single wrongdoing score.
- Operate as a production route.
- Modify `/api/analysis/ocr`.
- Modify `/api/analysis/mock-provider`.

## 4. Safe Developer Commands

| Command | Purpose | Validates | Does not do | Providers/API credits | Real evidence | Expected safe result |
| --- | --- | --- | --- | --- | --- | --- |
| `npm.cmd run check:vision-sandbox-boundaries` | Static sandbox boundary check. | Provider/package/env guards, protected runtime diffs, privacy wording, fixture policy, altered-or-AI-generated-image uncertainty wording, package-safety markers. | Does not execute providers, routes, uploads, storage, or runtime analysis. | No provider use and no API credits. | Does not touch real evidence. | Prints that the OpenAI Vision sandbox boundary check passed. |
| `npm.cmd run check:vision-sandbox-skeleton` | Executes the developer skeleton probe. | Fixture registry access, reference resolution, sandbox-shaped outputs, unsupported/failure simulations, privacy/package/schema guards, isolation. | Does not call OpenAI, parse uploads, or produce production reports. | No provider use and no API credits. | Uses synthetic fixture metadata/assets only. | Prints that the sandbox skeleton check passed. |
| `npm.cmd run check:vision-sandbox-fixture-runner` | Executes fixture-runner validation. | All 12 approved fixture references, expected statuses, mode fallback, failure simulations, guard status, privacy/retention markers, package-safety markers. | Does not process customer evidence, call providers, or change runtime behavior. | No provider use and no API credits. | Uses approved synthetic fixtures only. | Prints that the fixture-runner check passed. |
| `npm.cmd run check:report-semantics` | Broad wording and boundary semantic check. | Receipt/report safety semantics, product-photo boundaries, mock provider and vision sandbox semantic markers, route isolation markers. | Does not run live analysis or route requests. | No provider use and no API credits. | Does not touch real evidence. | Prints that the report semantic smoke check passed. |
| `npm.cmd run check:product-photo-probes` | Product-photo and unsupported-evidence probe suite. | Non-live product-photo boundaries, unsupported evidence helpers, analyzer routing guard probes, receipt preservation markers. | Does not wire product-photo runtime or run provider-backed analysis. | No provider use and no API credits. | Synthetic/probe-only inputs. | Probe runner exits successfully. |
| `npm.cmd run lint` | Project linting. | TypeScript/React/script style rules covered by ESLint. | Does not execute provider calls or process evidence. | No provider use and no API credits. | Does not touch real evidence. | Exits with no lint errors. |
| `npm.cmd run build` | Next.js production build. | Compile-time and build-time integration safety for existing app code. | Does not deploy, create package artifacts, or enable provider features. | No provider use and no API credits. | Does not touch real evidence. | Build completes successfully. |

Developers should run the three vision sandbox checks together before relying on the sandbox state:

```powershell
npm.cmd run check:vision-sandbox-boundaries
npm.cmd run check:vision-sandbox-skeleton
npm.cmd run check:vision-sandbox-fixture-runner
```

## 5. Fixture And Metadata Usage Rules

- Only approved synthetic fixture keys from the registry may be used.
- Fixture assets remain synthetic, hand-authored, and non-identifying.
- Fixture metadata remains non-identifying and package-safe where marked distributable.
- No real customer evidence is allowed.
- No anonymized or redacted real fixtures are allowed yet.
- No public image URLs, object URLs, file URLs, data URLs, storage handles, or upload-derived paths are allowed.
- No provider payloads, provider request IDs, raw OCR dumps, account pages, ticket text, or customer identifiers are allowed.
- Package-distribution status must remain explicit through `packageDistributionStatus`, `safeForDownloadablePackage`, `safeForDemoMode`, and `safeForSelfHostedInstall`.
- Fixture metadata and fixture assets are not production upload examples and must not be wired into runtime scoring or customer workflows.
- Synthetic demo fixtures must remain clearly separated from provider configuration and customer evidence.

## 6. Safety Language Rules

Altered-or-AI-generated-image uncertainty is a review signal only. It may be represented as a confidence-style 1-100 uncertainty value in sandbox-shaped outputs, but only as an internal manual-review driver.

The sandbox language must preserve these rules:

- It is not proof.
- It is not a final decision.
- It is not a claim disposition.
- It is not a customer accusation.
- It is not a single wrongdoing score.
- A visual inconsistency is not confirmation of intentional alteration or AI generation.
- Unsupported evidence is an evidence limitation only.
- Provider/failure simulations are operational limitations only.
- No automatic approval, rejection, refund, or denial wording is allowed.
- No customer-facing accusation is allowed.
- Safe summaries must keep observations, uncertainty signals, limitations, and manual-review drivers separate.

## 7. Protected Boundaries

Phase 4.33 keeps these boundaries protected:

- No OpenAI/provider SDKs.
- No provider environment variables.
- No provider calls.
- No API-credit-using behavior.
- No upload, multipart, binary-file, storage, or persistence work.
- No route behavior changes.
- No new API route implementation.
- No UI wiring.
- No `ClaimReviewWorkflow` wiring.
- No `ProductPhotoReviewPanel` routing.
- No `analyzeEvidenceFile` usage by the sandbox.
- No `LocalAnalysisResult` output from the sandbox.
- No receipt parser, scoring, report adapter, receipt route, or receipt behavior changes.
- No runtime schema/type migration.
- No fixture asset changes.
- No fixture metadata changes.
- No package artifacts.
- No real evidence.
- No customer identifiers.

## 8. Package And Downloadable Safety

ClaimGuard is expected to support downloadable or self-hosted contexts later, so the sandbox must stay safe for local/package distribution.

Current package-safety rules:

- Synthetic fixtures marked distributable must remain safe for downloadable and self-hosted contexts.
- No secrets may be committed.
- No `.env` files with real values may be added.
- No provider payloads may be stored as fixtures.
- No private fixtures may be added.
- No unsafe demo data may be added.
- No live-provider assumptions may be required for local checks.
- Provider features remain disabled until a separately approved configuration phase.
- Package artifacts are not generated in Phase 4.33.
- Fixture metadata must keep package safety flags explicit and fail closed if package status is missing or unsafe.

## 9. Readiness Checkpoint

Current readiness status before provider configuration planning:

| Checkpoint question | Status |
| --- | --- |
| Are synthetic fixtures present? | Yes. Phase 4.29 added 9 synthetic SVG assets and 3 markdown simulations. |
| Is synthetic metadata present? | Yes. Phase 4.27 added 12 approved synthetic metadata entries. |
| Is the sandbox skeleton present? | Yes. Phase 4.31 added script/module-only sandbox modules. |
| Is fixture-runner validation present? | Yes. Phase 4.32 added `runVisionSandboxFixtureRunner` and `check:vision-sandbox-fixture-runner`. |
| Are boundary checks present? | Yes. `check:vision-sandbox-boundaries`, `check:vision-sandbox-skeleton`, and `check:vision-sandbox-fixture-runner` are available. |
| Are package-safety checks present? | Yes. Metadata flags and sandbox output package-safety markers are validated. |
| Are provider calls still absent? | Yes. No OpenAI/provider SDK, provider env var, provider call, or API-credit-using behavior exists in the sandbox. |
| Are route/runtime/receipt boundaries still protected? | Yes. Existing OCR and mock-provider routes, `analyzeEvidenceFile`, `LocalAnalysisResult`, and receipt behavior remain unchanged. |

Phase 4.33 readiness conclusion: the synthetic-only sandbox is ready for provider configuration planning only. It is not ready for live OpenAI Vision implementation, live upload handling, customer evidence processing, production route exposure, or API-credit-using execution.

## 10. Stop Conditions Before API-Credit-Using Work

Stop before implementation if any proposed next step would:

- Add OpenAI or provider SDKs.
- Add provider environment variables.
- Add provider calls.
- Use API credits.
- Implement provider configuration.
- Add or change API routes.
- Accept uploads, multipart input, binary input, URLs, or storage handles.
- Process real customer evidence.
- Add anonymized or redacted real fixtures.
- Add provider payload fixtures.
- Add package artifacts.
- Touch protected runtime files.
- Change `analyzeEvidenceFile`.
- Change or use `LocalAnalysisResult` as sandbox output.
- Change receipt parser, scoring, report, route, or upload behavior.
- Wire `ClaimReviewWorkflow` or `ProductPhotoReviewPanel`.
- Weaken safety wording from uncertainty/review signal into proof, disposition, or accusation language.

## 11. Specialist Review Findings

- Product Strategy Agent: The sandbox supports ClaimGuard's broader evidence-intelligence direction without collapsing the product into receipt-only analysis or starting live AI prematurely.
- Architecture and Maintainability Agent: The current skeleton remains module/script-only and isolated from routes, runtime analyzer paths, report adapters, UI, and package artifacts.
- Receipt Intelligence Agent: Receipt behavior is protected. `analyzeEvidenceFile`, `LocalAnalysisResult`, parser, scoring, and report behavior remain unchanged.
- Integration Readiness Agent: Provider configuration should not start until a separate planning-only phase defines opt-in, cost, timeout, safety, package defaults, and developer-only boundaries.
- Scoring and Safety Reviewer Agent: Altered-or-AI-generated-image uncertainty remains a review signal only, not proof, not a final decision, and not a single wrongdoing score.
- Privacy and Evidence Safety Agent: Only synthetic metadata/assets are allowed. No real evidence, identifiers, provider payloads, raw OCR, URLs, storage handles, or retained files are allowed.
- QA Harness Agent: Existing checks cover skeleton behavior, fixture-runner validation, boundary scanning, semantic safety, and product-photo preservation.
- Deployment and Release Agent: No deployment or package artifact is part of Phase 4.33. Commit/push is appropriate only if checks pass and the diff remains documentation/checker-only.

## 12. Next Phase Recommendation

Recommended next safe phase: Phase 4.34 OpenAI Vision provider configuration planning only.

Phase 4.34 should plan:

- API-credit usage policy.
- Provider opt-in boundaries.
- `.env.example` guidance without secrets or real values.
- Timeout, retry, and cost-limit defaults.
- Local/package-safe disabled defaults.
- Developer-only provider configuration boundaries.
- No real evidence processing until separately approved.
- No route behavior or upload wiring unless Robert explicitly opens that implementation scope.
- No live OpenAI Vision implementation yet unless Robert explicitly approves API-credit-using work.
