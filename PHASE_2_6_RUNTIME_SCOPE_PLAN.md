# Phase 2.6 Runtime-Facing Scope Plan

This is the Phase 2.6.0 docs-only runtime-facing scope plan. It defines what the first possible live-facing product-photo slice could be, what must be resolved first, what stays blocked, and what explicit approval gates are required before any implementation.

It does not implement, wire, route, or enable anything. No code, routes, components, analyzer/runtime files, upload files, report adapter, `LocalAnalysisResult`, receipt parser/scoring/fixtures, providers, storage, integrations, case queues, real photos, real metadata fixtures, or deployment are touched.

Phase 2.6.1 follow-up: `PHASE_2_6_GATE_WIRING_DESIGN_SPIKE.md` resolves the docs-only guard-wiring design. It recommends a thin default-off pre-analyzer wrapper as the safest future Phase 2.6.2 implementation path, with a privacy-safe File-to-hints adapter, additive `UnsupportedEvidenceResult`, receipt-preservation probes, and gate-wiring probes. Product-photo runtime remains non-live and no implementation is authorized by this note.

Phase 2.5 is closed. Both dev-only harnesses (`/dev/pre-analysis-evidence-gate`, `/dev/product-photo-adapter-readiness`) exist as production-disabled, unlinked, synthetic-only review surfaces. Product-photo runtime remains non-live; `runtimeLive` is false, `manualReviewOnly` is true, `analyzeEvidenceFile` remains the live receipt analyzer entrypoint, `LocalAnalysisResult` remains receipt-shaped, and receipt behavior is unchanged. Latest pushed commit at planning time: `84ad4a7`.

## Live Pipeline Reference (current, unchanged)

`analyzeEvidenceFile(file: File): Promise<LocalAnalysisResult>` runs, in order:

1. `getEvidenceTypeFromFile(file)` — classify (product-photo-like image cues collapse to `receipt`; never returns `damage-photo`).
2. `extractOcr(file)` — OCR.
3. `parseReceiptText` → `inspectMetadata` → `inspectImageHeuristics` → `buildReviewSignals` → `scoreAnalysis`.
4. returns a receipt-shaped `LocalAnalysisResult`.

`ClaimReviewWorkflow` calls `analyzeEvidenceFile(selectedFile)` then `mapLocalAnalysisToReport(result)`.

`buildPreAnalysisEvidenceGateDecision` (the gate) is decision-only and currently called by nothing in the live pipeline. Conceptually it would sit **between step 1 and step 2** — after lightweight classification, before OCR/metadata.

## 1. What Phase 2.6 Is

Phase 2.6 is the **first runtime-facing planning phase** for product-photo evidence. It defines the safe sequencing from today's no-live evidence gates to an eventual, narrowly-scoped live behavior, while preserving receipt behavior and customer-safe/manual-review-only semantics. Phase 2.6.0 is planning only; no live behavior is enabled.

## 2. Is Phase 2.6 the First Runtime-Facing Product-Photo Phase?

Yes. Every prior Phase 2 slice was no-live (scaffold, heuristic boundaries, adapter/gate contracts, dev harnesses). Phase 2.6 is the first phase whose later sub-slices could touch a live path — and therefore the first that requires explicit Robert approval and privacy/data-flow review before any code.

## 3. The Safest First Runtime-Facing Slice

The safest eventual first runtime slice is a **guard-only pre-analysis evidence gate wiring**: classify unsupported / product-photo-like / legacy `damage-photo` files as unsupported/quarantine **before** OCR and metadata run, while leaving receipt/PDF/screenshot/default behavior unchanged. The guard only **blocks**; it never analyzes a product photo, never produces a product-photo report, and never routes to `ProductPhotoReviewPanel`.

Critically, even this "guard-only" slice is consequential: the current pipeline always returns a receipt-shaped `LocalAnalysisResult`, so any non-allow outcome needs a result/UI state that does not exist yet. That design decision must be resolved (docs-only) **before** any wiring. Phase 2.6.0 therefore recommends the gate path but does not authorize implementation.

## 4. Runtime-Facing Sequence Options Considered

- **Option A — Guard-only pre-analysis gate live wiring.** Wire the gate to stop product-photo-like/unsupported files before OCR/metadata; preserve receipt/default path; no product-photo analysis. Safest behavior-blocking step. Requires resolving the unsupported-result shape and minimal UI state first.
- **Option B — Shared result model first.** Introduce a discriminated/shared evidence result envelope before any live route changes. Larger contract surface; higher risk of mixing receipt and product-photo shapes too early. Defer until a guard-only slice proves the need.
- **Option C — Live report adapter preparation only.** Prepare a product-photo/unsupported-safe report mapping without UI/upload wiring. Useful later, but premature before a result shape exists.
- **Option D — Upload classification boundary without analysis.** Branch at upload to mark product-photo-like files unsupported. Overlaps with Option A but pushes the decision into UI/upload mechanics (more protected surface) instead of a small pre-analyzer guard.
- **Option E — Pause / more dev-harness + GUI browser QA first.** Zero runtime risk; appropriate if Robert prefers more confidence before any live wiring.

**Recommendation:** Option A is the right eventual target, but it must be preceded by a docs-only design spike (Phase 2.6.1) that resolves the result/UI-state and branch-location questions. If Robert prefers maximal caution, Option E (pause) is acceptable.

## 5. What Must Happen Before Product-Photo Can Touch Live Upload or `analyzeEvidenceFile`

- Explicit Robert approval to open a runtime slice.
- A resolved decision on **where the gate branch lives**: (i) inside `analyzeEvidenceFile` after classify / before OCR, (ii) a thin new pre-analyzer wrapper that runs the gate and only calls `analyzeEvidenceFile` for allow-receipt-default-path, or (iii) in `ClaimReviewWorkflow` before calling `analyzeEvidenceFile`. Preference: a thin wrapper or an in-function early branch that keeps `analyzeEvidenceFile`'s receipt body and `LocalAnalysisResult` shape unchanged for the allow path.
- A **privacy-safe File→hints adapter** that derives only filename string, MIME type, and declared category — never image bytes, EXIF, object URLs, or metadata — to feed the gate.
- A defined **unsupported/quarantine result** that is additive and NOT forced into receipt `LocalAnalysisResult` fields.
- Receipt-preservation probes (receipt image, PDF, order screenshot, null/default, receipt-like product-name) proving the allow path is byte-for-byte unchanged.
- A default-off feature flag so the wiring can land dormant and be probe-verified before enabling.

## 6. What Must Happen Before Product-Photo Can Appear in `ClaimReviewWorkflow`

- A product-photo / unsupported-evidence **display state model** exists and is reviewed (manual-review-only, no proof/verification/outcome wording).
- The gate's unsupported/quarantine outcome maps to a customer-safe "unsupported evidence / manual review" UI state — not a product-photo analysis result and not `ProductPhotoReviewPanel` (which remains a separate, still-unwired surface).
- Duplicate-ID/responsive/browser-QA concerns are resolved for any new rendered state.
- Receipt UI behavior is provably unchanged for receipt inputs.

## 7. What Must Happen Before `LocalAnalysisResult` Changes

- A shared/discriminated evidence-result contract is explicitly approved, with planned impacts on receipt report, UI, `/test-evidence`, scoring, parser, fixtures, and privacy.
- Backward-compatibility and migration probes exist.
- Until then, `LocalAnalysisResult` stays receipt-shaped, and the first guard-only slice must avoid migrating it (see Section 8).

## 8. Shared Result Model / `LocalAnalysisResult` Decision

- The first guard-only slice should **avoid** `LocalAnalysisResult` migration. The unsupported/quarantine outcome should be represented by a small additive result (e.g. a separate `UnsupportedEvidenceResult` returned only on the non-allow path, surfaced via a thin wrapper or a discriminated union owned by a new entrypoint) rather than by overloading receipt fields.
- A full shared evidence result model is needed only when product-photo analysis results (not just gate blocks) must flow through report/UI. That is a later, separately-approved slice.
- `LocalAnalysisResult` should remain receipt-shaped until explicitly migrated because receipt report mapping, `/test-evidence`, scoring, parsing, and privacy redaction all depend on its current shape.
- Risk of mixing too early: forcing product-photo or unsupported data into receipt fields would corrupt receipt scoring/report semantics, leak product-photo concerns into receipt privacy redaction, and make rollback hard. Keep the shapes separate behind a discriminator.

## 9. Upload / UI / Report Sequencing Decisions

- **Upload classification before UI display.** The guard decision (block vs allow) should be resolved at the analysis-entry boundary before any new UI state is shown; UI display of an unsupported state is a later sub-step.
- **`ClaimReviewWorkflow` stays untouched initially.** The first guard-only slice prefers a wrapper/early-branch so the workflow keeps calling one entrypoint; UI changes are deferred to a later approved sub-slice.
- **Live report adapter stays receipt-only initially.** `mapLocalAnalysisToReport(result: LocalAnalysisResult)` is not modified by the guard-only slice; an unsupported/quarantine outcome would use a small dedicated mapping later, not the receipt adapter.
- **Future unsupported/quarantine UI/report state** must be manual-review-only, state plainly that the file is unsupported for automated receipt analysis, request a clearer/eligible document, and avoid any proof/verification/outcome wording.

## 10. Privacy / Data-Flow Gates

- No real customer photos processed until a privacy/data-flow review is approved.
- No raw EXIF/metadata extraction for product-photo-like files in the guard-only slice (the whole point is to stop before OCR/metadata).
- The guard must read only privacy-safe hints (filename, MIME, declared category) — no image bytes, image buffers, object URLs, image/data URLs, or storage handles.
- No provider calls (no OpenAI Vision, Google Vision, AWS, or other AI/OCR vision).
- No screenshots, logs, prompts, or fixtures containing private evidence; privacy-safe summaries only.
- Existing receipt metadata internals (original filename, exact size/modified time/dimensions, EXIF) must never be exposed on any new product-photo/unsupported surface.

## 11. Required Future Checks (for any Phase 2.6 implementation slice)

- `npm.cmd run lint`.
- `npm.cmd run build`.
- `npm.cmd run check:report-semantics`.
- `npm.cmd run check:product-photo-probes`.
- `git diff --check`.
- Receipt-preservation probes (receipt/PDF/screenshot/null/default unchanged).
- Gate-wiring probes (allow path unchanged; non-allow path blocks before OCR/metadata; gate not given image bytes/EXIF).
- No-provider/storage/integration/case-queue import scans.
- Unsafe-wording scans and privacy/raw-marker scans.
- Browser QA if any UI/rendered state changes.
- Proof that `analyzeEvidenceFile`'s receipt body, `LocalAnalysisResult` shape, and `mapLocalAnalysisToReport` signature are unchanged for the allow path.

## 12. Stop Conditions

Stop any Phase 2.6 implementation if:

- The product-photo analyzer is called live.
- Upload accepts real product photos for analysis.
- OCR or metadata runs on product-photo-like files in the guard-only slice.
- `ClaimReviewWorkflow` renders a product-photo result without an approved display-state model.
- `LocalAnalysisResult` changes without an explicit, approved migration plan.
- Receipt behavior changes unexpectedly for receipt/PDF/screenshot/default inputs.
- A provider/storage/integration/case-queue path appears.
- Unsafe wording implies proof, external verification, customer wrongdoing, automatic disposition, approval, rejection, denial, or final outcome.
- A real photo or real metadata fixture appears.
- `runtimeLive` / `manualReviewOnly` semantics become unclear, or any gate is hidden/ambiguous.
- The guard is given image bytes, EXIF, object URLs, or storage handles.
- Required checks fail or cannot be interpreted safely.

## 13. Recommended Phase 2.6.1

Recommended next milestone: **Phase 2.6.1 — docs-only guard-only gate-wiring design spike** (still no implementation). It should resolve, in docs only:

- The exact branch location (in-function early branch vs thin pre-analyzer wrapper vs workflow-level), with a recommendation that keeps `analyzeEvidenceFile`'s receipt body and `LocalAnalysisResult` shape unchanged on the allow path.
- The privacy-safe `File`→gate-hints adapter contract (filename/MIME/declared-category only).
- The additive unsupported/quarantine result shape (not a `LocalAnalysisResult` migration) and the minimal customer-safe UI/report state it would later need.
- The default-off feature-flag design and the exact receipt-preservation + gate-wiring probes required.
- The exact allowed/protected files and checks for a future Phase 2.6.2 guard-only implementation.

Allowed files for Phase 2.6.1 (docs-only): `PHASE_2_6_RUNTIME_SCOPE_PLAN.md`, `PRODUCT_PHOTO_RUNTIME_BLOCKERS_PLAN.md`, `PRODUCT_PHOTO_UNSUPPORTED_BOUNDARY_PLAN.md`, `NEXT_STEPS.md`, `ROADMAP.md`, `AGENT_LOG.md`. Protected: all `src/`, scripts, package, fixtures, routes, components, and runtime files.

Alternative Phase 2.6.1 (if Robert prefers caution): **pause** and run a recorded GUI multi-viewport browser-QA pass on the two existing dev harnesses before any runtime-facing design spike. Either path keeps product-photo runtime, upload, UI, live report mapping, `analyzeEvidenceFile`, `LocalAnalysisResult`, receipt behavior, providers, storage, integrations, case queues, and deployment blocked.

Do not begin guard-only implementation (Phase 2.6.2) until the 2.6.1 design spike is accepted and Robert explicitly opens the implementation slice with named allowed/protected files.

Phase 2.6.1 result: `PHASE_2_6_GATE_WIRING_DESIGN_SPIKE.md` recommends Phase 2.6.2 as a default-off, unwired thin wrapper/probe implementation. It should add no UI/upload/report adapter routing and should preserve `analyzeEvidenceFile`, `LocalAnalysisResult`, and receipt behavior unchanged.
