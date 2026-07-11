<p align="center">
  <img src="docs/assets/repguard-logo.png" alt="RepGuard" width="760">
</p>

# RepGuard

RepGuard is an evidence and claim review workspace for organizing support cases, uploaded evidence, and risk signals.

It is built as a practical prototype for reviewing receipts, documents, photos, and case context without turning review signals into automatic claim decisions.

## Why It Exists

Support claim reviews can involve scattered evidence, unclear receipt details, customer-safe wording concerns, and manual risk checks. RepGuard brings those pieces into a focused workspace so evidence can be reviewed more consistently.

The goal is to help support teams organize case context, identify review signals, and prepare clearer next steps while keeping final decisions in a manual review workflow.

## Core Features

- Evidence upload and review workflow for images and PDFs
- Claim and case review workspace with a case command center
- Risk signals and review indicators for manual support review
- Receipt, document, and product-photo analysis paths
- OCR and receipt parsing for local evidence review
- Customer-safe report language and support guidance
- Local and sandbox analysis flows for prototype validation
- Dashboard-style case review surfaces for evidence, status, and review context

## Tech Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- Tesseract.js
- PDF.js
- Exifr
- Lucide React

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
```

## Current Status

RepGuard is an active prototype for exploring claim review, evidence organization, and support-case risk workflows.

It is focused on internal review support, local analysis behavior, and safer report language. It is not a production claim decision system.

## Related Projects

- RepStack: review collection and pay-period tracking app
- RepReport: review parser and export helper
- RepOS: customer support workflow system prototype
