# Phase 2.7.2 Unsupported Evidence Display Mapping Probe Plan

This is a docs-only Phase 2.7.2 planning artifact. It does not implement, wire, route, enable, render, or deploy anything.

Phase 2.7.1 is pushed. Product-photo runtime remains non-live. The default-off `analyzeEvidenceFileWithPreAnalysisGate` wrapper remains unwired from live callers. Unsupported-evidence reviewer state exists as documentation only. `analyzeEvidenceFile` remains the live receipt analyzer entrypoint, `LocalAnalysisResult` remains receipt-shaped, receipt behavior is unchanged, and no unsupported-evidence UI exists.

## Plan Goal

Define a future non-live display/mapping probe that can validate unsupported-evidence display semantics before any runtime caller, upload flow, live report adapter, or UI surface changes.

The future probe should answer one narrow question:

```text
Can a derived unsupported-evidence stop state be mapped into reviewer-facing display fields with safe wording, no receipt score, no product-photo report, no proof-of-purchase framing, no private data, and no receipt behavior changes?
```

The answer must be proven with synthetic inputs only. The future probe must not make unsupported evidence visible in the live app.

## What The Future Probe Should Validate

The future probe should validate a pure, non-live mapping from a sanitized unsupported-evidence result shape into the documented `unsupportedEvidenceReview` display state.

Required validation:

- Each unsupported outcome maps to the correct neutral reviewer label.
- Each unsupported outcome maps to manual-review-only guidance.
- Customer-safe wording is present and non-accusatory.
- Confidence and uncertainty are represented as `Not analyzed`, `Routing inconclusive`, or equivalent non-score labels.
- `External Verification: Not performed` and `Verification Status: Not externally verified` remain explicit.
- No receipt score, receipt score breakdown, receipt risk band, receipt parser output, or receipt report shape appears.
- No product-photo report, product-photo analyzer signal, product-photo score, product-photo report view-model, or `ProductPhotoReviewPanel` output appears.
- No proof-of-purchase wording appears for unsupported evidence.
- No OCR, metadata, analyzer, report adapter, upload/UI/report/scoring/parser/fixture, provider/storage/integration/case-queue, or ProductPhotoReviewPanel path is invoked.
- Receipt allow-path reports remain outside this unsupported mapping and continue to use the existing receipt-only report flow.

The future probe should be about display semantics and boundaries, not visual layout and not runtime routing.

## Unsupported Evidence Without A Receipt Score

Unsupported evidence must be represented as a stop state, not as a scored evidence report.

Allowed fields:

- `reviewerLabel`
- `evidenceTypeDisplay`
- `reviewSummary`
- `recommendedSupportAction`
- `customerSafeWording`
- `uncertaintyLabel`
- `confidenceSummary`
- `manualReviewGuidance`
- `limitations`
- `externalVerification`
- `verificationStatus`
- boolean no-live/no-score/no-report markers

Required markers:

- `receiptScoreShown: false`
- `receiptReportShown: false`
- `productPhotoReportShown: false`
- `proofOfPurchaseLanguageShown: false`
- `manualReviewOnly: true`
- `runtimeLive: false`
- `productPhotoRuntimeLive: false`

Forbidden fields:

- `score`
- `riskLevel`
- `riskBand`
- `scoreBreakdown`
- `receiptScore`
- `evidenceReliabilityScore`
- `receiptReliabilityScore`
- `merchant`
- `total`
- `purchaseDate`
- `lineItems`
- `ocrText`
- receipt parser fields
- product-photo analyzer fields
- product-photo report view-model fields

If a future mapper needs any of those forbidden fields, stop and return to docs planning before implementation.

## Unsupported Evidence Without Proof-Of-Purchase Wording

The unsupported-evidence state must not ask the reviewer to judge whether the current file proves purchase. It can request an eligible receipt document if available, but it must not say the unsupported evidence proves or fails proof of purchase.

Allowed support action:

```text
Manual review only. Request an eligible receipt document or route the file to a reviewer.
```

Allowed customer-safe copy:

```text
We could not run automated receipt analysis on this file type. Please provide an eligible receipt document if available, or our team can review the submitted evidence manually.
```

Forbidden framing:

- Do not call unsupported evidence proof of purchase.
- Do not say proof of purchase is missing, failed, valid, invalid, accepted, or rejected.
- Do not say the file proves or disproves a purchase.
- Do not make any claim disposition recommendation.

## Unsupported Evidence Without A Product-Photo Report

Product-photo-like unsupported evidence must still remain unsupported.

Required product-photo-like wording:

```text
This file appears product-photo-like from lightweight routing hints, but product-photo runtime is not live. Use manual review or request an eligible receipt document.
```

Forbidden behavior:

- Do not call product-photo analyzer helpers.
- Do not map to `ProductPhotoReportViewModel`.
- Do not render or route to `ProductPhotoReviewPanel`.
- Do not show product-photo signal categories, image quality summaries, metadata summaries, label summaries, visual damage summaries, or product-photo scores.
- Do not display uploaded images, object URLs, image URLs, data URLs, image bytes, raw EXIF, raw metadata, original filenames, or private backgrounds.

The future probe should include a product-photo-like unsupported case that proves the output is still an unsupported stop state.

## Manual Review Guidance

Manual-review guidance should be clear enough for support work and restrained enough to avoid acting like a decision engine.

Required guidance examples:

- `Manual review only.`
- `Request an eligible receipt document if available.`
- `Route the submitted evidence to a reviewer if the claim workflow allows manual evidence review.`
- `Do not treat this state as an automated evidence result.`
- `Do not use this state as a final claim outcome.`

Forbidden guidance:

- Automatic denial.
- Approval, rejection, or claim disposition language.
- Customer-accusation language.
- Fraud, fake, forged, valid, invalid, verified, or proof conclusions.

## Confidence And Uncertainty Display

Unsupported evidence must not use analysis confidence. The future mapper should expose a small uncertainty label instead.

Recommended mapping:

| Outcome | Uncertainty label | Confidence summary |
| --- | --- | --- |
| `unsupported-evidence` | `Not analyzed` | `Confidence is not assigned because automated analysis did not run.` |
| `legacy-damage-photo-quarantine` | `Not analyzed` | `Confidence is not assigned because legacy photo terminology was quarantined before analysis.` |
| `product-photo-like-unsupported` | `Not analyzed` | `Confidence is not assigned because product-photo runtime is not live.` |
| `unknown-inconclusive` | `Routing inconclusive` | `Lightweight routing hints were insufficient for automated receipt analysis.` |

Forbidden display:

- Numeric confidence.
- Percent confidence.
- Evidence Reliability Score.
- Receipt Reliability Score.
- Product-photo score.
- Risk bands that look like receipt analysis output.
- Any conclusion that the evidence is true, altered, claim-supporting, or not claim-supporting.

## Recommended Future Location

This Phase 2.7.2 artifact is docs-only. A later implementation should not be only another doc; it should be an executable non-live probe so the contract is enforceable.

Recommended first future implementation shape, only after explicit approval:

- A small isolated mapper module, for example `src/lib/analysis/unsupported-evidence-review-state.ts`.
- A colocated executable probe, for example `src/lib/analysis/unsupported-evidence-review-state.probe.ts`.
- Registration in `scripts/run-product-photo-probes.cjs`, if the probe follows the existing product-photo readiness probe pattern.
- Semantic/privacy/import coverage in `scripts/check-report-semantics.mjs`.

Why this should be a probe first:

- It validates display semantics without adding rendered UI.
- It keeps unsupported evidence away from `ClaimReviewWorkflow`, upload, and live report mapping.
- It avoids putting unsupported outcomes into `LocalAnalysisResult`.
- It gives later UI work a tested derived state contract.

Why this should not be a dev-only harness first:

- A route or visual harness would create a UI surface before the mapping contract is executable.
- Browser layout is not the first risk; semantic leakage into receipt/product-photo report concepts is.
- A dev-only harness may be useful later, after the pure mapper/probe passes and Robert explicitly approves rendered verification.

Why this should not live in `/test-evidence`:

- `/test-evidence` is receipt/manual QA oriented.
- Adding unsupported evidence there risks implying the live receipt workflow supports unsupported result display.

## Future Synthetic Cases

A future probe should use literal synthetic cases only:

- Generic unsupported evidence.
- Legacy `damage-photo` quarantine.
- Product-photo-like unsupported evidence.
- Unknown inconclusive routing.
- Hostile unsupported input attempting to inject receipt score fields.
- Hostile unsupported input attempting to inject product-photo report fields.
- Hostile unsupported input attempting to inject proof-of-purchase wording.
- Hostile unsupported input attempting to inject customer accusation or final outcome wording.
- Hostile private sentinel fields such as raw filename, path, object URL, raw OCR, raw EXIF, raw metadata, customer ID, order ID, ticket ID, claim ID, evidence ID, provider payload, storage handle, integration handle, or case queue handle.
- Long customer-safe wording and limitations for future display wrapping checks.

No real evidence, real metadata fixture, screenshot, image, OCR output, PDF text, customer data, ticket data, order data, claim data, or private filename may appear.

## Receipt Preservation Requirements

The future probe must not change receipt behavior. It should assert the boundary indirectly and leave live receipt paths untouched.

Required preservation:

- `analyzeEvidenceFile` remains unchanged.
- `LocalAnalysisResult` remains unchanged and receipt-shaped.
- `mapLocalAnalysisToReport(result: LocalAnalysisResult)` remains receipt-only.
- Receipt completed reports continue to show receipt-specific score and report content only for receipt results.
- Unsupported-evidence mapping does not import receipt parser, receipt scoring, receipt fixtures, OCR, metadata, or live report adapter code.
- `/`, `/test-evidence`, and existing receipt workflow behavior remain unchanged unless a separate receipt-maintenance task explicitly opens them.

If a future unsupported mapper requires receipt report adapter fields, stop.

## Required Future Checks

For a future implementation slice, run:

- `git status --short --branch`.
- `npm.cmd run lint`.
- `npm.cmd run build`.
- `npm.cmd run check:report-semantics`.
- `npm.cmd run check:product-photo-probes`.
- `git diff --check`.
- Targeted import scans for `analyzeEvidenceFile`, `LocalAnalysisResult`, receipt parser/scoring/fixtures, live report adapter mapping, upload modules, `ClaimReviewWorkflow`, `ProductPhotoReviewPanel`, product-photo analyzer/report view-model, providers, storage, integrations, case queues, OCR, metadata, package changes, and deployment files.
- Targeted wording/privacy scans for receipt score, product-photo report, proof-of-purchase framing, proof/verification/final-outcome/customer-accusation language, raw OCR, raw EXIF, raw metadata, object/data/image URLs, paths, IDs, provider payloads, storage handles, and integration handles.

Browser checks are not required for a pure mapper/probe implementation because no rendered UI exists. Browser checks become required immediately if Robert later approves a rendered dev-only host or UI state.

## Allowed Future Implementation Files

Allowed only after Robert explicitly opens the implementation slice:

- `src/lib/analysis/unsupported-evidence-review-state.ts`
- `src/lib/analysis/unsupported-evidence-review-state.probe.ts`
- `scripts/run-product-photo-probes.cjs`, only to register the new probe.
- `scripts/check-report-semantics.mjs`, only to add semantic/privacy/import coverage.
- `NEXT_STEPS.md`
- `ROADMAP.md`
- `REPO_SOURCE_OF_TRUTH.md`
- `AGENT_LOG.md`

Optional only after the mapper/probe passes and Robert explicitly asks for visual verification:

- A separate unlinked, production-disabled dev-only route with literal synthetic derived states.
- That route must not use `/test-evidence`, live upload, live analyzer calls, report adapter mapping, ProductPhotoReviewPanel, product-photo analyzer output, real evidence, image URLs, object URLs, raw metadata, or private identifiers.

## Protected Surfaces

Protected until Robert explicitly approves a future implementation slice:

- `src/lib/analysis/analyzer.ts`
- `src/lib/analysis/types.ts`
- `src/lib/analysis/report-adapter.ts`
- `src/lib/analysis/receipt-parser.ts`
- `src/lib/analysis/scoring.ts`
- `src/lib/analysis/pre-analysis-evidence-gate-runtime.ts`, unless the future prompt explicitly opens wrapper maintenance.
- `src/lib/test-evidence/`
- `src/components/ClaimReviewWorkflow.tsx`
- `src/components/UploadPanel.tsx`
- `src/components/ProductPhotoReviewPanel.tsx`
- `src/app/page.tsx`
- `src/app/test-evidence/`
- Upload files
- Live report mapping
- Product-photo analyzer/routing/report-view-model files
- Providers, storage, integrations, case queues
- OCR/metadata code
- Fixtures
- Package scripts/dependencies, except the probe runner caveat above
- Deployment files

## Stop Conditions

Stop any future implementation if:

- Product-photo runtime becomes live.
- The wrapper is wired into live callers.
- `analyzeEvidenceFile` changes.
- `LocalAnalysisResult` changes or receives unsupported/product-photo fields.
- Receipt analysis behavior changes.
- Unsupported evidence is mapped through the receipt report adapter.
- A receipt score or receipt report is shown for unsupported evidence.
- Product-photo report output or ProductPhotoReviewPanel routing appears.
- Product-photo analyzer, product-photo routing adapter, providers, storage, integrations, case queues, OCR, or metadata paths are imported or called.
- Upload, live UI, live report mapping, `/`, or `/test-evidence` changes.
- Real evidence, real metadata fixtures, private identifiers, raw OCR, raw EXIF, raw metadata, filenames, paths, URLs, screenshots, provider payloads, storage handles, integration handles, or case workflow identifiers appear.
- Wording implies proof, external verification happened, wrongdoing, customer accusation, automatic disposition, approval, rejection, denial, final claim outcome, or proof-of-purchase status for unsupported evidence.
- Required checks fail or cannot be interpreted safely.

## Phase 2.7.2 Decision

Phase 2.7.2 should remain planning-only. The safest next implementation, if Robert later approves it, is a pure non-live mapper/probe for derived unsupported-evidence review state. It should not add rendered UI until the mapping semantics, privacy rules, and no-score/no-product-photo-report boundaries are executable and passing.

Recommended next safe task:

```text
/claimguardagent review and, if approved, commit the docs-only Phase 2.7.2 unsupported-evidence display/mapping probe plan if docs-safe checks pass; do not push, deploy, implement UI, wire runtime, change upload/report mapping, route ProductPhotoReviewPanel, edit analyzer entrypoints, or change receipt behavior
```
