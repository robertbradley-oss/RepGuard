# Phase 3.0 Case Workflow Readiness Plan

This is a planning-only Phase 3.0 checkpoint. It does not implement Phase 3 code, add routes, add components, wire `ClaimReviewWorkflow`, add live unsupported-evidence UI, route `ProductPhotoReviewPanel`, change upload/report/parser/scoring/fixtures, change receipt behavior, connect providers/storage/integrations/case queues/OCR/metadata, commit, push, or deploy.

Current pushed checkpoint: `3779ab0` (`docs: close phase 2 non-live readiness`). Phase 2 is closed as non-live unsupported/product-photo readiness. Product-photo and unsupported-evidence runtime remain non-live. The pre-analysis wrapper remains default-off and unwired. The workflow boundary helper remains probe-only, default-off, and unwired. The dev-only unsupported-evidence bridge remains synthetic-only and production-blocked. `ClaimReviewWorkflow` remains unwired. Unsupported-evidence live UI does not exist. `ProductPhotoReviewPanel` remains unrouted. `analyzeEvidenceFile` remains the receipt analyzer entrypoint. `LocalAnalysisResult` remains receipt-shaped. Receipt behavior remains unchanged. No deployment was performed.

## Phase 3.0 Decision

Phase 3 should build case-review workflow foundations before live unsupported-evidence opt-in, product-photo runtime, integrations, storage, auth, or dashboards.

The first Phase 3 implementation slice should not be live persistence or analyzer expansion. The safest first build target is a non-persistent local case review shell that can hold multiple evidence-review states without changing receipt analysis behavior. Before that implementation starts, Phase 3.1 should define the product/UX concept and design-system treatment for case review.

## Product Goal

Turn ClaimGuard from one-off evidence analysis into a case-review workflow for support and warranty teams.

The Phase 3 product experience should help a reviewer:

- Understand the customer claim at the case level.
- Review multiple pieces of evidence in one case.
- Distinguish completed receipt analysis from unsupported/manual-review evidence.
- Add internal notes without exposing private evidence by default.
- Record a manual decision or escalation status without implying automated final judgment.
- Draft customer-safe wording that explains next steps neutrally.
- Preserve a timeline of review actions for audit and handoff.

## Phase 3 Case Object Concept

The first case model should be planned as a local, non-persistent view model until Robert explicitly approves storage.

Recommended fields:

```ts
type ClaimGuardCaseConcept = {
  caseId: string;
  status:
    | "new"
    | "evidence-review"
    | "needs-more-information"
    | "manual-review"
    | "ready-for-support-decision"
    | "resolved"
    | "escalated";
  customerClaimSummary: string;
  evidenceItems: CaseEvidenceItemConcept[];
  reviewNotes: CaseReviewNoteConcept[];
  manualDecision: CaseManualDecisionConcept | null;
  recommendedSupportAction: string;
  customerSafeWording: string;
  timeline: CaseTimelineEventConcept[];
};
```

Planning rules:

- `caseId` should be a local synthetic display identifier during early Phase 3, not a database key.
- `status` should describe reviewer workflow position, not evidence truth.
- `customerClaimSummary` should be concise and redacted by default.
- `evidenceItems` should hold per-evidence review state summaries, not raw files or raw OCR.
- `reviewNotes` are internal reviewer notes and should not be customer-visible by default.
- `manualDecision` is a reviewer-entered support decision or escalation note, not an automated ClaimGuard outcome.
- `recommendedSupportAction` should guide the rep, not decide the claim.
- `customerSafeWording` should be editable and non-accusatory.
- `timeline` should record review actions and state changes using privacy-safe summaries.

## Evidence Model At Planning Level

Phase 3 should model evidence as a case-level list of heterogeneous evidence items. Each item should carry a type, source summary, analysis/review status, safe display summary, and limitations.

Recommended evidence categories:

- Receipt evidence: existing Phase 1 receipt analysis output, `LocalAnalysisResult` plus receipt report summary, only after the existing receipt analyzer runs.
- Unsupported/product-photo evidence: Phase 2 stopped/manual-review state, outside receipt reports and outside `ProductPhotoReviewPanel` until a later approved slice.
- Order screenshots: eligible for current receipt/default behavior only where the existing analyzer supports that path; otherwise planned as manual-review context.
- Shipping confirmations: planned as contextual evidence, not proof of purchase and not externally verified until an integration exists.
- Customer message/context: planned as reviewer context and customer summary text, not analyzer input in early Phase 3.

Recommended item concept:

```ts
type CaseEvidenceItemConcept = {
  evidenceId: string;
  evidenceType:
    | "receipt"
    | "unsupported-product-photo"
    | "order-screenshot"
    | "shipping-confirmation"
    | "customer-message"
    | "other-unsupported";
  reviewState:
    | "not-reviewed"
    | "receipt-analysis-complete"
    | "unsupported-manual-review"
    | "needs-clearer-copy"
    | "manual-review-complete";
  title: string;
  safeSummary: string;
  limitations: string[];
  recommendedReviewerAction: string;
  externalVerification: "Not performed";
  verificationStatus: "Not externally verified";
};
```

Early Phase 3 should not require `LocalAnalysisResult` migration. Receipt results can be adapted into an evidence-item summary at the workflow layer. Unsupported/product-photo stopped states should remain separate manual-review evidence items.

## UX Architecture

Phase 3 should move toward an evidence-first case workspace, not a generic queue dashboard.

Recommended shell:

- Case review shell: top-level case header with case id, status, customer claim summary, privacy posture, and reviewer workflow actions.
- Evidence list/sidebar: left or secondary column listing evidence items by type, review state, limitations, and manual-review priority.
- Selected evidence panel: central panel showing the selected evidence review state. Receipt evidence can show the existing receipt result summary; unsupported evidence should show a dedicated stopped/manual-review state only after separately approved implementation.
- Review summary panel: compact case-level synthesis of evidence items, missing information, review priority, and recommended next support action.
- Notes/manual decision panel: internal reviewer notes, manual decision, escalation reason, and reviewer-entered outcome. It must remain clearly human-entered.
- Customer-safe wording panel: editable response draft that avoids accusation, proof claims, and final automated disposition.
- Timeline/history area: audit trail of uploads, analysis completed, unsupported stopped state, note added, manual decision changed, customer wording drafted, and escalation/resolution events.

First viewport direction:

- The case identity and evidence review state should be visible immediately.
- The selected evidence should dominate the workspace.
- Review notes, wording, and audit history should support the main evidence review rather than compete with it.
- Desktop can use a three-region operational layout: evidence list, selected evidence, case summary/actions.
- Mobile should collapse to tabs or segmented sections: Evidence, Summary, Notes, Wording, History.

## Safety Boundaries

Phase 3 must inherit ClaimGuard's safety language and manual-review discipline.

- Never accuse customers.
- Never confirm wrongdoing.
- Never state that local analysis proves evidence truth.
- Never recommend automatic adverse action.
- Manual review remains required for uncertain, unsupported, product-photo-like, weak OCR, sparse, or context-limited evidence.
- Customer-safe wording should say what ClaimGuard could or could not review, what additional information may help, and that the team can review submitted evidence manually.
- Keep `External Verification: Not performed` unless a real approved integration performs external verification.
- Case status should describe workflow state, not customer intent.
- Timeline events should record review activity, not conclusions about customer behavior.

## Technical Boundaries

Phase 3.0 does not authorize implementation. Future Phase 3 implementation must remain scoped.

Explicitly not yet:

- No database.
- No auth, organizations, roles, or billing.
- No provider, storage, ticket, email, drive, or order-system integrations.
- No live product-photo analysis.
- No OCR or metadata expansion.
- No `LocalAnalysisResult` migration.
- No `analyzeEvidenceFile` changes.
- No live unsupported-evidence opt-in unless Robert explicitly approves a later default-off workflow/caller slice.
- No route/component additions during Phase 3.0.
- No deployment.

If a later Phase 3 implementation needs local mock state, it should be synthetic and browser-local only. Any persistence, retention, or export surface needs a separate privacy/data-flow plan first.

## What Phase 3 Inherits From Phase 1

Phase 3 should treat Phase 1 receipt analysis as one evidence module inside a case.

Inherited capabilities and boundaries:

- `analyzeEvidenceFile` remains the live receipt analyzer entrypoint.
- `LocalAnalysisResult` remains receipt-shaped.
- Receipt scores mean local evidence quality and internal consistency, not external truth.
- Receipt reports keep `Verification Status: Not externally verified` and `External Verification: Not performed`.
- Receipt OCR/parser/scoring/report/export behavior remains unchanged unless Robert opens a separate receipt-maintenance task.
- `/test-evidence` remains receipt QA.
- Privacy-safe receipt summaries are the model for future case-level summaries.

## What Phase 3 Inherits From Phase 2

Phase 3 should inherit Phase 2's non-live unsupported/product-photo readiness without making it live.

Keep:

- Dev-only unsupported-evidence bridge.
- Non-live mapper/probes.
- Semantic safety guards.
- Production blocking for dev-only routes.
- Default-off pre-analysis wrapper.
- Probe-only/default-off/unwired workflow boundary helper.
- Receipt preservation boundaries.
- Unsupported evidence as a stopped/manual-review state, not a receipt report.
- Product-photo panels as product-photo-specific surfaces, not generic unsupported-evidence UI.
- Product-photo runtime non-live until separately approved.

Phase 3 should use these as planning inputs for case evidence states, not as live workflow behavior.

## What Phase 3 Should Not Do Yet

Do not start these in early Phase 3:

- Real persistence or database schema implementation.
- Team/org dashboards.
- Ticket/email/drive/order-provider integrations.
- Billing or auth.
- Enterprise analytics.
- Real AI vision expansion.
- Product-photo runtime.
- Live unsupported-evidence UI.
- `ProductPhotoReviewPanel` routing.
- `ClaimReviewWorkflow` wiring.
- Receipt analyzer or result-shape migration.

## Recommended Phase 3 Sequence

1. Phase 3.0 planning: define case workflow readiness, inherited boundaries, and first build target.
2. Phase 3.1 design system/case workflow concept: produce the UX/product architecture for the case workspace, selected evidence states, notes, wording, and timeline without adding runtime code unless Robert explicitly approves design-only artifacts.
3. Phase 3.2 non-persistent local case shell: add a browser-local, synthetic or local-only case shell without database, auth, integrations, or live unsupported-evidence opt-in.
4. Phase 3.3 multi-evidence review layout: add evidence list/sidebar and selected evidence panel using safe local state and existing receipt summaries only.
5. Phase 3.4 notes/manual decision/customer-safe wording: add internal notes, manual decision, recommended action, and customer-safe wording, clearly reviewer-entered.
6. Phase 3.5 timeline/audit trail: add browser-local timeline/history events for review actions and state changes.
7. Phase 3.6 QA/polish: run browser checks, semantic/privacy checks, receipt preservation checks, and source-of-truth alignment before any release discussion.

## First Build Recommendation

After Phase 3.0, build Phase 3.1 before code.

Phase 3.1 should answer:

- What exact screen structure should the case review shell use?
- How should receipt evidence, unsupported/product-photo evidence, screenshots, shipping confirmations, and customer messages appear in the evidence list?
- What selected-evidence states are required before implementation?
- What copy is customer-safe versus internal-only?
- What manual decisions are allowed without implying automation?
- What timeline events are useful and privacy-safe?
- Which files would be eligible/protected in Phase 3.2?

Only after Phase 3.1 is accepted should Phase 3.2 implement a non-persistent local case shell.

## Future Phase 3.2 Implementation Boundaries

If Robert later opens Phase 3.2, the narrow implementation should:

- Use local React state only.
- Use synthetic case examples or current browser-local evidence state only.
- Keep `analyzeEvidenceFile` unchanged.
- Keep `LocalAnalysisResult` unchanged.
- Keep unsupported/product-photo runtime non-live.
- Keep `ProductPhotoReviewPanel` unrouted.
- Avoid database, auth, orgs, billing, providers, storage, integrations, OCR/metadata expansion, and deployment config.
- Add semantic/privacy checks for any customer-safe wording, manual decision labels, notes/export surfaces, and timeline text.
- Run lint, build, report semantics, product-photo probes, diff check, protected code scans, and browser checks.

## Stop Conditions

Stop future Phase 3 work if:

- Phase 3 implementation begins without an explicit named slice.
- `analyzeEvidenceFile` changes.
- `LocalAnalysisResult` changes or receives case/unsupported/product-photo fields.
- Unsupported evidence is mapped through receipt reports.
- `ClaimReviewWorkflow` is wired to unsupported evidence without explicit approval.
- `ProductPhotoReviewPanel` is routed.
- Product-photo runtime becomes live.
- Upload mechanics, parser, scoring, fixtures, OCR/metadata, providers, storage, integrations, auth, database, billing, package/deploy config, or live navigation change unexpectedly.
- Real evidence, raw OCR, raw metadata, filenames, paths, customer/order/ticket/claim/evidence IDs, provider payloads, storage handles, integration handles, or screenshots with private details appear in committed files.
- Wording implies proof, external verification happened, customer wrongdoing, automatic adverse action, approval/rejection, or final automated claim outcome.
- Required checks fail or cannot be interpreted safely.

## Phase 3.0 Closeout Criteria

Phase 3.0 is ready to close when:

- This planning document exists.
- `NEXT_STEPS.md`, `ROADMAP.md`, `REPO_SOURCE_OF_TRUTH.md`, and `AGENT_LOG.md` reflect Phase 3.0 planning-only status.
- No runtime/UI/code/route/component files changed.
- Required docs-safe checks pass.
- The next recommended task is Phase 3.1 design system/case workflow concept, not implementation.
