# Phase 2.6.1 Gate Wiring Design Spike

This is a docs-only design spike for the first possible guard-only runtime-facing product-photo boundary. It does not implement, wire, route, or enable anything. No code, routes, React components, analyzer/runtime files, upload files, report adapter mapping, `LocalAnalysisResult`, receipt parser/scoring/fixtures, providers, storage, integrations, case queues, real photos, real metadata fixtures, deployment, or product-photo runtime behavior are changed.

Phase 2.6.0 is closed and pushed at `6420e82` (`docs: plan phase 2.6 runtime scope`). Product-photo runtime remains non-live. The existing `pre-analysis-evidence-gate` is decision-only and unwired. `analyzeEvidenceFile(file: File): Promise<LocalAnalysisResult>` remains the live receipt analyzer entrypoint and currently runs:

1. `getEvidenceTypeFromFile(file)`.
2. `extractOcr(file)`.
3. `parseReceiptText`, `inspectMetadata`, `inspectImageHeuristics`, `buildReviewSignals`, and `scoreAnalysis`.
4. returns a receipt-shaped `LocalAnalysisResult`.

The future guard-only slice must stop product-photo-like, legacy `damage-photo`, and unsupported files before OCR/metadata without analyzing product photos, producing product-photo reports, routing to `ProductPhotoReviewPanel`, or changing receipt behavior.

## Main Decision

Recommended branch location: **add a thin pre-analyzer wrapper entrypoint in a future Phase 2.6.2 implementation**.

Suggested future name:

- `analyzeEvidenceFileWithPreAnalysisGate`

The wrapper would:

1. Build privacy-safe gate hints from the `File` without reading bytes.
2. Run `buildPreAnalysisEvidenceGateDecision(hints)` only when a default-off flag is explicitly enabled.
3. If the gate outcome is `allow-receipt-default-path`, call the existing `analyzeEvidenceFile(file)` unchanged.
4. If the gate outcome is non-allow, return an additive `UnsupportedEvidenceResult` and stop before OCR/metadata.
5. If the flag is disabled, fail closed to the current receipt path by calling `analyzeEvidenceFile(file)` unchanged and recording no live product-photo behavior.

This preserves `analyzeEvidenceFile` as the receipt-only body and avoids modifying `LocalAnalysisResult`. It also gives Phase 2.6.2 a narrow place to prove gate behavior without touching upload, UI, live report adapter mapping, scoring, parser, fixtures, or product-photo display.

## Branch Location Options Compared

| Option | Shape | Benefit | Risk | Decision |
| --- | --- | --- | --- | --- |
| Thin wrapper around `analyzeEvidenceFile` | New entrypoint owns gate decision and calls `analyzeEvidenceFile` only on allow | Keeps receipt body unchanged; additive unsupported result can live outside `LocalAnalysisResult`; easiest rollback | A later caller must opt into the wrapper before behavior becomes live | Recommended |
| Early branch inside `analyzeEvidenceFile` | Add gate before `extractOcr(file)` in the current entrypoint | Guarantees all current callers pass through the gate | Forces `analyzeEvidenceFile` away from `Promise<LocalAnalysisResult>` or pressures unsupported outcomes into receipt fields | Defer |
| Separate product-photo entrypoint | Keep receipt analyzer untouched and add a product-photo-specific analysis path | Clean for future product-photo analysis | Premature; does not solve guard-only stop-before-OCR for the current live receipt path | Not for Phase 2.6.2 |
| Workflow-level branch in `ClaimReviewWorkflow` | UI checks gate before calling analyzer | Avoids analyzer edits | Touches protected upload/UI state first and risks display/report coupling before result model is ready | Not for first slice |

The wrapper is the safest compromise because it is runtime-facing but not UI-facing. It can be implemented dormant, verified directly by probes, and only later substituted into a caller after a separate approval.

## Receipt Allow Path Preservation

For allow outcomes, the wrapper must call `analyzeEvidenceFile(file)` with the original file and return the exact `LocalAnalysisResult` from that call. It must not clone, rewrite, re-score, remap, redact, or normalize the receipt result.

Preservation rules:

- `analyzeEvidenceFile` body stays unchanged.
- `LocalAnalysisResult` stays receipt-shaped.
- `mapLocalAnalysisToReport(result: LocalAnalysisResult)` stays receipt-only.
- Receipt OCR, parser, metadata, image heuristics, scoring, report adapter, `/test-evidence`, and fixtures stay unchanged.
- The wrapper may only branch before `analyzeEvidenceFile` is called; it may not intercept or mutate the allow-path result.

Receipt-like files should therefore behave exactly as they do today. The wrapper is allowed to add a new discriminated outer return type only for the new wrapper entrypoint, not to migrate the existing receipt result.

## Non-Allow Stop Behavior

For non-allow outcomes, the future wrapper must not call:

- `analyzeEvidenceFile`
- `extractOcr`
- `inspectMetadata`
- `parseReceiptText`
- `scoreAnalysis`
- `mapLocalAnalysisToReport`
- product-photo analyzer or adapter builders
- `ProductPhotoReviewPanel`
- providers, storage, integrations, or case queues

Non-allow outcomes must return `UnsupportedEvidenceResult` directly. This result is a stop signal, not an analysis report and not a product-photo report.

## Privacy-Safe File-To-Hints Adapter

Suggested future name:

- `buildPreAnalysisEvidenceGateHintsFromFile`

The adapter should be tiny, synchronous, and local to the future gate-wrapper module unless there is a clear reason to share it.

Allowed inputs from `File`:

- `file.name` as a filename hint only.
- `file.type` as a MIME/type hint only.
- a caller-supplied declared category/source hint, if one exists in a future approved caller.

Allowed derived hints:

- broad file type category such as `image`, `pdf`, `document`, `screenshot`, or `unknown`.
- declared evidence category such as `receipt`, `pdf-receipt`, `order-screenshot`, `screenshot`, `product-photo`, `damage-photo`, `unsupported`, or `unknown`.
- simple booleans such as `receiptLikeHint`, `pdfReceiptLikeHint`, `screenshotLikeHint`, or `productPhotoLikeHint`, derived only from filename/MIME/declared category.

Blocked inputs and derivations:

- File bytes, Blob contents, ArrayBuffer, streams, image buffers, pixel inspection, OCR text, PDF text, EXIF, raw metadata, exact dimensions, exact modified time, object URLs, image URLs, data URLs, previews, retained fingerprints, provider output, storage handles, integration handles, case queue handles, customer IDs, ticket IDs, order IDs, claim IDs, evidence IDs, browser storage, network calls, or logs containing private evidence.

Privacy rationale:

- The guard's job is to stop unsupported evidence before OCR/metadata. Reading bytes or metadata would defeat that boundary.
- Filename/MIME/declared category hints are enough for a conservative stop/allow decision and can be tested with synthetic data.
- The adapter must never echo raw private filenames into user-facing copy, logs, or committed fixtures.

## Additive UnsupportedEvidenceResult

Suggested future shape:

```ts
type UnsupportedEvidenceResult = {
  resultKind: "unsupported-evidence";
  boundary: "pre-analysis-evidence-gate";
  outcome:
    | "unsupported-evidence"
    | "legacy-damage-photo-quarantine"
    | "product-photo-like-unsupported"
    | "unknown-inconclusive";
  evidenceType: "unsupported" | "product-photo" | "damage-photo" | "unknown";
  evidenceLabel: string;
  runtimeLive: false;
  productPhotoRuntimeLive: false;
  manualReviewOnly: true;
  allowReceiptDefaultPath: false;
  ocrInvoked: false;
  metadataInvoked: false;
  analyzerInvoked: false;
  adapterInvoked: false;
  uiUploadReportScoringParserFixturePathsInvoked: false;
  providersStorageIntegrationsCaseQueuesInvoked: false;
  externalVerification: "Not performed";
  verificationStatus: "Not externally verified";
  reviewSummary: string;
  recommendedSupportAction: string;
  customerSafeWording: string;
  reasons: string[];
  limitations: string[];
};
```

The future wrapper return type may be:

```ts
type GuardedEvidenceAnalysisResult =
  | { resultKind: "receipt-analysis"; result: LocalAnalysisResult }
  | UnsupportedEvidenceResult;
```

Rules:

- No receipt score.
- No receipt risk band.
- No product-photo analysis.
- No product-photo report.
- No `ProductPhotoReviewPanel` route.
- No forced migration of `LocalAnalysisResult`.
- Wording must be manual-review-only and customer-safe.
- Unknown/inconclusive must not overclaim. Prefer "The file could not be routed to automated receipt analysis with lightweight hints only" over any proof or policy conclusion.

## Default-Off Flag

Suggested future flag name:

- `ENABLE_PRE_ANALYSIS_EVIDENCE_GATE_RUNTIME_GUARD`

Default:

- `false`.

Behavior when false:

- The wrapper calls `analyzeEvidenceFile(file)` unchanged.
- Product-photo-like files continue to follow the current behavior until Robert explicitly approves enabling the guard.
- No unsupported result is returned live.

Behavior when true:

- The wrapper builds privacy-safe hints, runs the gate, and stops non-allow outcomes before OCR/metadata.
- Allow outcomes call `analyzeEvidenceFile(file)` unchanged.

Fail-closed rules:

- If the flag is missing, malformed, or not exactly enabled, treat it as false.
- If the gate returns an unrecognized non-allow outcome, return `UnsupportedEvidenceResult` with `manualReviewOnly: true`, no OCR/metadata, and no product-photo analysis.
- If any future change enables product-photo analyzer behavior, report mapping, or `ProductPhotoReviewPanel` routing through this flag, stop the task.

## Receipt Preservation Probes

Future Phase 2.6.2 should add narrow probes that prove the wrapper preserves current receipt behavior. The probes should use synthetic file-like objects and existing mockable boundaries where possible.

Required receipt preservation cases:

- Receipt-like image allow path calls `analyzeEvidenceFile(file)` exactly once and returns its `LocalAnalysisResult` unchanged.
- PDF receipt allow path calls `analyzeEvidenceFile(file)` exactly once and returns its `LocalAnalysisResult` unchanged.
- Order screenshot/default allow path calls `analyzeEvidenceFile(file)` exactly once and returns its `LocalAnalysisResult` unchanged when current behavior allows it.
- Unknown/default behavior is explicitly defined: either allow current receipt/default path when the flag is off, or return manual-review-only unsupported when the flag is on and hints are insufficient.
- `mapLocalAnalysisToReport(result: LocalAnalysisResult)` signature and receipt output remain unchanged.
- Receipt parser, scoring, and fixture files are not edited.
- Existing `check:product-photo-probes` still imports 11 modules or intentionally updates the count only when a new registered probe is added.

Suggested probe assertions:

- The allow-path object identity is preserved when the analyzer stub returns a known result.
- No unsupported result fields appear on `LocalAnalysisResult`.
- No receipt score/report wording changes.
- No product-photo display or adapter imports appear in the wrapper.

## Gate-Wiring Probes

Future Phase 2.6.2 should add gate-wiring probes for non-allow behavior:

- Product-photo-like synthetic file stops before OCR/metadata.
- Legacy `damage-photo`-like synthetic file quarantines before OCR/metadata.
- Unsupported MIME/category stops before OCR/metadata.
- Unknown inconclusive behavior is defined and manual-review-only.
- `analyzeEvidenceFile` is not called for non-allow outcomes.
- `extractOcr`, `inspectMetadata`, `parseReceiptText`, `scoreAnalysis`, and `mapLocalAnalysisToReport` are not called for non-allow outcomes.
- Product-photo analyzer is not imported or called.
- Product-photo routing adapter is not imported or called.
- `ProductPhotoReviewPanel` is not imported, routed to, or mentioned as the output surface.
- No upload/UI/live report adapter/provider/storage/integration/case queue imports appear.
- No raw metadata, object URL, image URL, file bytes, provider payload, customer ID, ticket ID, order ID, case ID, or raw private filename is emitted.
- Unsupported/quarantine wording stays customer-safe and does not imply proof, external verification, wrongdoing, automatic disposition, approval, rejection, or denial.

## Allowed Phase 2.6.2 Files

Recommended future implementation slice: **Phase 2.6.2 guard-only wrapper and probes, default-off and unwired from UI**.

Allowed files, if Robert explicitly opens Phase 2.6.2:

- `src/lib/analysis/pre-analysis-evidence-gate-runtime-wrapper.ts` for the thin wrapper, hints adapter, default-off flag, and additive result shape.
- `src/lib/analysis/pre-analysis-evidence-gate-runtime-wrapper.probe.ts` for receipt-preservation and gate-wiring probes.
- `scripts/run-product-photo-probes.cjs` only to register the new probe.
- `scripts/check-report-semantics.mjs` only to add semantic/import/privacy guards for the wrapper/probe.
- `PHASE_2_6_GATE_WIRING_DESIGN_SPIKE.md`, `PHASE_2_6_RUNTIME_SCOPE_PLAN.md`, `NEXT_STEPS.md`, `ROADMAP.md`, `PRODUCT_PHOTO_RUNTIME_BLOCKERS_PLAN.md`, and `AGENT_LOG.md` for status updates.

Allowed only if the implementation reveals a tiny type-only placement need and Robert explicitly approves it:

- `src/lib/analysis/types.ts` for type-only exported result aliases, with no `LocalAnalysisResult` migration.

## Protected Files

Protected for Phase 2.6.2 unless Robert explicitly opens a broader runtime/UI slice:

- `src/lib/analysis/analyzer.ts`.
- `src/lib/analysis/types.ts` except the type-only caveat above.
- `src/lib/analysis/report-adapter.ts`.
- `src/lib/analysis/receipt-parser.ts`.
- `src/lib/analysis/scoring.ts`.
- `src/lib/test-evidence/fixtures.ts`.
- `src/components/ClaimReviewWorkflow.tsx`.
- `src/components/UploadPanel.tsx`.
- `src/components/TestEvidenceHarness.tsx`.
- `src/components/ProductPhotoReviewPanel.tsx`.
- `src/app/page.tsx`.
- `src/app/layout.tsx`.
- `src/app/test-evidence/`.
- `src/app/dev/pre-analysis-evidence-gate/`.
- `src/app/dev/product-photo-adapter-readiness/`.
- upload files, live report mapping, receipt fixtures, product-photo analyzer, product-photo routing adapter, providers, storage, integrations, case queues, package dependencies, deployment files, real photos, and real metadata fixtures.

## Stop Conditions

Stop Phase 2.6.2 or any later guard work if:

- Product-photo analyzer is called live.
- Product-photo routing adapter is called live.
- OCR or metadata runs on a product-photo-like, legacy `damage-photo`, or unsupported non-allow file.
- `analyzeEvidenceFile` changes.
- `LocalAnalysisResult` changes or receives unsupported/product-photo fields.
- Receipt behavior changes for receipt image, PDF receipt, order screenshot, or current default cases.
- Upload/UI/live report adapter files are touched.
- `ClaimReviewWorkflow`, `UploadPanel`, or `ProductPhotoReviewPanel` is wired into the guard slice.
- Provider, storage, integration, case queue, database, auth, network, or deployment paths appear.
- Real photos, real metadata fixtures, image bytes, raw EXIF, object URLs, image/data URLs, private filenames, customer IDs, ticket IDs, order IDs, claim IDs, evidence IDs, or case IDs appear.
- Unsupported/quarantine copy is unclear, overconfident, accusatory, or implies proof, external verification, automatic disposition, approval, rejection, denial, or final claim outcome.
- Required checks fail or cannot be interpreted safely.

## Required Phase 2.6.2 Checks

If Robert opens Phase 2.6.2, run:

- `git status --short --branch` before editing.
- `npm.cmd run lint`.
- `npm.cmd run build`.
- `npm.cmd run check:report-semantics`.
- `npm.cmd run check:product-photo-probes`.
- `git diff --check`.
- targeted import/privacy scans for wrapper/probe files.
- final `git status --short --branch`.

Browser QA is not required for the guard-only wrapper if no route/component/rendered UI changes. It becomes required immediately if any rendered state, route, workflow, upload surface, or display component is touched in a later approved slice.

Commit discipline:

- Commit only after all required checks pass.
- Use a message such as `feat: add default-off pre-analysis gate wrapper` only for implementation.
- Do not push unless Robert explicitly requests a push checkpoint.

## Recommended Phase 2.6.2

Recommended next milestone: **Phase 2.6.2 default-off guard-only pre-analysis gate wrapper/probe implementation**.

Scope:

- Add the thin wrapper, hints adapter, additive unsupported result, default-off flag, and direct probes only.
- Keep the wrapper unwired from `ClaimReviewWorkflow`, upload, live report adapter mapping, and routes.
- Prove allow-path receipt results are unchanged.
- Prove non-allow outcomes stop before OCR/metadata and never call product-photo analyzer/report/UI paths.

Do not use Phase 2.6.2 to enable live UI behavior. A later, separately approved Phase 2.6.3 would be needed to decide whether any caller should opt into the wrapper and how unsupported results should surface to reviewers.

Suggested next prompt:

```text
/claimguardagent implement Phase 2.6.2 as a default-off guard-only pre-analysis gate wrapper/probe slice: add only src/lib/analysis/pre-analysis-evidence-gate-runtime-wrapper.ts, src/lib/analysis/pre-analysis-evidence-gate-runtime-wrapper.probe.ts, probe registration, semantic/import/privacy guards, and status docs; keep the wrapper unwired from ClaimReviewWorkflow, UploadPanel, routes, upload, live report adapter mapping, ProductPhotoReviewPanel, product-photo analyzer/routing adapter, providers, storage, integrations, case queues, real photos, and real metadata fixtures; preserve analyzeEvidenceFile and LocalAnalysisResult unchanged; prove receipt allow path returns the existing LocalAnalysisResult unchanged and non-allow product-photo-like/legacy damage-photo/unsupported cases stop before OCR/metadata; run lint, build, report-semantics, product-photo-probes, diff-check, final status, commit if safe, and do not push.
```
