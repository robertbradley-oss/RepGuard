# Phase 2.7.5 Workflow Caller Boundary Opt-In Design

This is a docs-only Phase 2.7.5 design checkpoint. It does not implement, wire, route, enable, render, commit, push, or deploy anything.

Phase 2.7.4 is pushed at `25fa381` (`docs: plan phase 2.7.4 live opt-in readiness`). Product-photo runtime remains non-live. The default-off `analyzeEvidenceFileWithPreAnalysisGate` wrapper remains unwired from live callers. The non-live unsupported-evidence mapper/probe exists, but unsupported evidence is not visible in the app and no live opt-in has started.

## Design Question

Where should a future default-off workflow/caller opt-in live so unsupported evidence can be stopped before receipt analysis without changing `analyzeEvidenceFile`?

## Decision

The future opt-in decision should be owned by the live workflow analysis boundary, not by the analyzer, upload flow, report adapter, or product-photo UI.

Specific future owner:

- `ClaimReviewWorkflow` analysis orchestration around `handleRunAnalysis`, or a workflow-local helper called only from that boundary.

This is the layer where the app already has:

- the selected file
- analysis state transitions
- receipt result state
- receipt report state
- error handling
- copy/export state

The opt-in must remain default-off until Robert explicitly approves a named implementation slice. Phase 2.7.5 does not authorize editing `ClaimReviewWorkflow`.

## Boundary Shape

The future caller boundary should make one explicit decision when the user starts analysis:

```text
If the workflow guard is disabled:
  keep the current receipt-only path:
  analyzeEvidenceFile(selectedFile) -> LocalAnalysisResult -> mapLocalAnalysisToReport(result)

If the workflow guard is enabled:
  call analyzeEvidenceFileWithPreAnalysisGate(selectedFile, caller options)
  if kind is receipt-analysis:
    use result as the same receipt LocalAnalysisResult
    map it through the existing receipt report adapter
  if kind is unsupported-evidence:
    keep it outside LocalAnalysisResult
    derive an unsupportedEvidenceReview state
    do not call mapLocalAnalysisToReport
```

This design keeps the opt-in at the workflow/caller boundary while preserving receipt analyzer and report semantics.

## Why Not Other Layers

Do not put the first opt-in inside `analyzeEvidenceFile`:

- It would mix unsupported stop states into the receipt analyzer body.
- It would pressure unsupported results into `LocalAnalysisResult`.
- It would make receipt parser/scoring/report behavior harder to prove unchanged.

Do not put the first opt-in inside upload:

- Upload should own file selection, validation, reset, and preview state, not analysis-result semantics.
- Upload changes would risk broad UI behavior changes before the unsupported state is proven.

Do not put the first opt-in inside `mapLocalAnalysisToReport`:

- Unsupported evidence is not a receipt report.
- The live report adapter should stay receipt-only.
- Receipt report fields should not become a carrier for unsupported stop states.

Do not route unsupported evidence to `ProductPhotoReviewPanel`:

- Unsupported evidence is a stop state.
- `ProductPhotoReviewPanel` is for derived product-photo view models, not stopped unsupported evidence.
- Product-photo runtime remains non-live.

## `analyzeEvidenceFile` Protection

`analyzeEvidenceFile` must remain the receipt analyzer entrypoint.

Future implementation must not:

- add pre-analysis gate logic inside `analyzeEvidenceFile`
- change the function signature
- return unsupported-evidence results from `analyzeEvidenceFile`
- import the unsupported mapper into the analyzer
- import workflow or UI concepts into the analyzer
- change receipt OCR, metadata, parser, scoring, or report fields as part of the opt-in

The wrapper may continue to delegate to `analyzeEvidenceFile` for receipt allow paths. That delegation is already isolated in `pre-analysis-evidence-gate-runtime.ts` and must remain separate from the analyzer body.

## `LocalAnalysisResult` Protection

`LocalAnalysisResult` must remain unchanged and receipt-shaped.

Future implementation must not add:

- unsupported evidence fields
- product-photo fields
- wrapper result discriminators
- UI state fields
- report adapter fields
- workflow-only flags

The future workflow state should be a union at the workflow boundary, not a migration of `LocalAnalysisResult`:

```text
Workflow analysis state =
  receipt completed state with LocalAnalysisResult and MockAnalysisReport
  OR unsupported stopped state with UnsupportedEvidenceReviewDisplay
```

That union should live in the workflow layer or a workflow-local helper only after Robert approves implementation.

## Unsupported Evidence Outside Receipt Reports

Unsupported-evidence output must remain separate from receipt reports.

Receipt allow path:

- `LocalAnalysisResult`
- `mapLocalAnalysisToReport(result)`
- existing completed receipt report UI
- existing privacy-safe receipt export behavior

Unsupported stop path:

- no receipt report adapter call
- no receipt score
- no receipt parser fields
- no receipt score breakdown
- no proof-of-purchase status
- no product-photo report
- no `ProductPhotoReviewPanel`
- no OCR or metadata processing for stopped non-allow files

If a future implementation needs a visible unsupported state, it should render a dedicated unsupported review state only after the caller boundary and browser/manual QA plan are approved.

## Mapper Usage Rule

The non-live mapper/probe may be used later only as a derived-state mapper, not as live receipt analysis.

Allowed future use, after explicit approval:

- A workflow boundary receives a wrapper `UnsupportedEvidenceResult`.
- A small adapter translates wrapper outcome plus safe synthetic/category context into the mapper input shape.
- `mapUnsupportedEvidenceReviewState` produces an `unsupportedEvidenceReview` display object.
- The workflow stores that derived object in a separate unsupported state branch.

Forbidden future use:

- importing the mapper into `analyzeEvidenceFile`
- importing the mapper into `mapLocalAnalysisToReport`
- importing the mapper into receipt parser, scoring, fixtures, or OCR/metadata code
- routing mapper output to `ProductPhotoReviewPanel`
- treating mapper output as a receipt report or product-photo report
- passing raw files, filenames, OCR, EXIF, metadata, IDs, object URLs, data URLs, or provider payloads into the mapper

The existing mapper/probe already proves the mapper stays import-free, non-live, no-score, no-report, no-ProductPhotoReviewPanel, and `LocalAnalysisResult`-independent. Future implementation must preserve those properties.

## Future Default-Off Guard Requirements

A future workflow/caller guard or feature flag must protect:

- default disabled behavior exactly matching the current receipt path
- receipt image allow path
- PDF receipt allow path
- order screenshot/default allow path
- unsupported/product-photo-like non-allow stop path before receipt analyzer calls
- no `mapLocalAnalysisToReport` call for unsupported outcomes
- no unsupported result stored in `LocalAnalysisResult`
- no ProductPhotoReviewPanel routing
- no upload mechanic changes
- no provider/storage/integration/case-queue calls
- no deployment/release config changes

The guard should be controlled by an explicit workflow/caller option or clearly named default-off flag. Do not enable it by environment or deployment config until a later release plan explicitly approves that route.

## Eligible Future Implementation Files

Only after Robert explicitly approves implementation, the narrow future file set could be:

- `src/components/ClaimReviewWorkflow.tsx`, limited to analysis-run branching, state typing, and rendering a separately approved unsupported state.
- A new workflow-local boundary helper under `src/lib/analysis/`, for example `src/lib/analysis/workflow-pre-analysis-gate-boundary.ts`, if it reduces component coupling and stays caller-owned.
- A colocated or nearby probe for that workflow boundary helper, if added.
- `scripts/check-report-semantics.mjs`, only to add import/privacy/wording guards for any new workflow boundary or unsupported display files.
- `scripts/run-product-photo-probes.cjs`, only if a new executable probe is added.
- `NEXT_STEPS.md`, `ROADMAP.md`, `REPO_SOURCE_OF_TRUTH.md`, and `AGENT_LOG.md` for status updates.

Optional later, after the caller boundary is accepted and Robert explicitly asks for visual verification:

- A synthetic-only, unlinked, production-disabled dev route for unsupported review display QA.
- That route must not be `/test-evidence`, must not use upload state, and must not use real evidence.

## Protected Files And Surfaces

Protected unless Robert explicitly names an exception in a future implementation prompt:

- `src/lib/analysis/analyzer.ts`
- `analyzeEvidenceFile`
- `src/lib/analysis/types.ts`
- `LocalAnalysisResult`
- `src/lib/analysis/report-adapter.ts`
- live report adapter mapping
- `src/lib/analysis/receipt-parser.ts`
- receipt parser
- `src/lib/analysis/scoring.ts`
- receipt scoring
- `src/lib/test-evidence/`
- receipt fixtures
- `src/components/ProductPhotoReviewPanel.tsx`
- ProductPhotoReviewPanel routing
- `src/components/UploadPanel.tsx`
- upload flow
- `src/app/page.tsx`
- `src/app/test-evidence/`
- provider code
- storage code
- integration code
- case queue code
- OCR/metadata processing code
- package scripts/dependencies unless probe registration is explicitly opened
- deployment/release config

For Phase 2.7.5 itself, `ClaimReviewWorkflow` is inspected only and remains protected from edits.

## Future Browser And Manual QA

Browser QA is not required for this docs-only design.

Before any future UI-facing unsupported state, browser/manual QA must prove:

- `/` still loads the existing receipt workflow.
- The current receipt upload, analyze, report, details drawer, and safe-copy actions still work for receipt allow paths.
- Default-off guard behavior is indistinguishable from the current receipt workflow.
- Unsupported/manual-review state appears only when the approved guard is explicitly enabled for QA.
- Unsupported state visibly says external verification was not performed.
- Unsupported state visibly says no automated receipt score was produced.
- No receipt score, score breakdown, proof-of-purchase status, product-photo report, or `ProductPhotoReviewPanel` appears for unsupported evidence.
- No image preview, file preview, object URL, data URL, raw OCR, raw metadata, filename, path, customer/order/ticket/claim/evidence ID, provider payload, storage handle, integration handle, or case queue handle is displayed in the unsupported state.
- Desktop and mobile layouts show no console errors, overlap, clipped labels, or confusing scroll behavior.
- `/test-evidence` remains receipt QA only unless a separate approved task changes it.

Manual QA must use synthetic or structurally redacted data only.

## Required Checks Before Any Future Implementation

Before any future implementation commit:

- `git status --short --branch`
- `npm.cmd run lint`
- `npm.cmd run build`
- `npm.cmd run check:report-semantics`
- `npm.cmd run check:product-photo-probes`
- `git diff --check`
- targeted import scan proving protected surfaces are not imported into the wrong layer
- targeted diff scan for `analyzeEvidenceFile`, `LocalAnalysisResult`, receipt parser, scoring, fixtures, live report adapter mapping, ProductPhotoReviewPanel routing, providers, storage, integrations, case queues, OCR/metadata, package/config/public/deployment files, and upload mechanics
- browser checks if any rendered state changes

For this docs-only Phase 2.7.5 checkpoint:

- `git status --short --branch`
- `git diff --check`
- `npm.cmd run check:report-semantics`
- protected code diff scan confirming no runtime/UI/code files changed

## Stop Conditions

Stop any future implementation if:

- the wrapper or mapper is wired into live runtime without Robert explicitly approving the implementation slice
- the opt-in moves inside `analyzeEvidenceFile`
- `LocalAnalysisResult` changes
- unsupported evidence is mapped through `mapLocalAnalysisToReport`
- unsupported evidence is stored in receipt report fields
- receipt parser, scoring, fixtures, OCR, metadata, or report behavior changes unexpectedly
- upload mechanics change before caller behavior and UI state are approved
- ProductPhotoReviewPanel routing appears for unsupported evidence
- product-photo runtime becomes live
- providers, storage, integrations, case queues, network calls, auth, database, or deployment config appear
- real evidence, raw OCR, raw EXIF, raw metadata, filenames, paths, IDs, object URLs, screenshots, provider payloads, storage handles, integration handles, or case workflow identifiers appear
- wording implies proof, verification happened, wrongdoing, customer accusation, approval, rejection, denial, automatic disposition, final claim outcome, or proof-of-purchase status for unsupported evidence
- required checks fail or cannot be interpreted safely

## Phase 2.7.5 Decision

Phase 2.7.5 remains docs-only. The future default-off opt-in should be owned by the workflow/caller analysis boundary around `ClaimReviewWorkflow`'s run-analysis path, or by a small workflow-local helper used only from that boundary. `analyzeEvidenceFile` remains receipt-only, `LocalAnalysisResult` remains receipt-shaped, unsupported-evidence output remains separate from receipt reports and `ProductPhotoReviewPanel`, and implementation remains blocked until Robert approves a named slice with exact files, checks, rollback posture, and browser/manual QA requirements.

Recommended next safe task:

```text
/claimguardagent review and, if approved, commit the docs-only Phase 2.7.5 workflow/caller boundary opt-in design if docs-safe checks pass; do not push, deploy, implement runtime, wire ClaimReviewWorkflow, add unsupported-evidence UI, route ProductPhotoReviewPanel, change upload/report/parser/scoring/fixtures, or change receipt behavior
```
