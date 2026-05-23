# ClaimGuard Next Steps

This roadmap keeps ClaimGuard focused on a polished mock-first MVP before any real integrations are added.

## 1. Polish MVP Dashboard

- Tighten desktop and mobile spacing.
- Improve empty, loading, and selected-case states.
- Make the risk score, red flags, and support action hierarchy easier to scan.
- Add stronger visual distinction between low, medium, and high risk.

## 2. Improve Upload-To-Analysis Workflow Using Mock Data

- Add mock upload states: idle, file selected, analyzing, complete, and needs review.
- Let the selected mock file type influence the displayed report.
- Add a clear "Run mock analysis" action.
- Keep all uploaded files local to the browser for now.

## 3. Add Mock Receipt Analysis Engine

- Create deterministic mock analysis functions for receipt-like inputs.
- Return authenticity score, risk level, risk signals, evidence summary, and recommended action.
- Include receipt-specific signals such as date clarity, total consistency, merchant visibility, and proof-of-purchase verification needs.
- Do not connect real OCR or AI yet.

## 4. Add Mock Product-Photo Analysis Engine

- Create deterministic mock analysis functions for product damage photos.
- Return photo-specific risk signals such as lighting mismatch, damage visibility, metadata availability, and image clarity.
- Use careful wording like "risk signal" and "manual review recommended."
- Do not connect real computer vision or AI yet.

## 5. Add Case History

- Add a case detail view or selectable recent-case workflow.
- Track mock review status, evidence type, score, risk level, and recommended support action.
- Add filters for risk level, channel, status, and submission date.
- Keep case data mocked until the data model is planned.

## 6. Plan Database Schema

- Draft tables or collections for cases, customers, evidence files, analysis reports, risk signals, and review actions.
- Identify which fields are required for auditability and support workflows.
- Plan retention and privacy expectations before implementation.
- Do not add a database until the user approves the architecture.

## 7. Plan Real OCR And AI Vision Integration Later

- Define provider-neutral interfaces for OCR and image analysis.
- Decide what evidence should be sent to external services and what should stay local.
- Add safety checks so AI output cannot accuse customers or state that fraud is confirmed.
- Plan human review and confidence thresholds before connecting real models.
- Do not connect real AI, OCR, Gmail, Vercel APIs, databases, or payment systems yet.
