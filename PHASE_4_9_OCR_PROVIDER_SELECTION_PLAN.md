# Phase 4.9 OCR Provider Selection Plan

Date: 2026-05-31

Primary agent role: Product Strategy Agent

Supporting reviews: Architecture and Maintainability, Receipt Intelligence, Integration Readiness, Scoring and Safety, Privacy and Evidence Safety, QA Harness, Deployment and Release

## Purpose And Scope

Phase 4.9 is a provider selection planning-only milestone. ClaimGuard needs this planning checkpoint before implementation because provider choice affects privacy, evidence data flow, retention, cost, latency, timeout behavior, reviewer safety language, future abstraction design, and receipt-regression risk.

This milestone does not add OCR providers, SDKs, environment variables, provider abstraction code, uploads, multipart parsing, binary parsing, storage, persistence, UI, real evidence processing, live OCR, live AI/Vision analysis, or photo intelligence implementation. It does not wire `ClaimReviewWorkflow`, route `ProductPhotoReviewPanel`, change `analyzeEvidenceFile`, change `LocalAnalysisResult`, change receipt parser/scoring/report behavior, deploy, or start Phase 4.10.

Phase 4.9 compares provider categories and recommends a staged provider strategy only. The current `POST /api/analysis/ocr` route remains a JSON-only synthetic fixture route skeleton that accepts exactly `fixtureKey` and uses the Phase 4.2 fixture harness plus the Phase 4.3 extraction contract. It remains unwired from uploads, UI, providers, storage, persistence, real evidence, and live receipt behavior.

## Current Planning Baseline

Phase 4.0 established that stronger OCR, AI/Vision, and product-photo intelligence must become review signals with confidence, uncertainty, limitations, and manual-review guidance, not proof, accusation, or automated support outcomes.

Phase 4.1 established a provider-neutral OCR boundary as the right architectural direction before provider selection.

Phase 4.2 added a synthetic OCR fixture harness covering clean receipt, Amazon-like order, missing fields, conflicts, noisy OCR, incomplete receipt-like text, unsupported non-receipt text, ambiguous marketplace screen text, synthetic provider timeout, and empty OCR output.

Phase 4.3 added a provider-neutral extraction contract that normalizes those synthetic fixtures into structured receipt fields, confidence signals, manual-review drivers, limitations, unsupported outcomes, provider-failure outcomes, and safe summaries.

Phase 4.4 and Phase 4.5 planned server-side route boundaries and route skeleton requirements. Phase 4.6 implemented a synthetic-only route skeleton. Phase 4.7 tightened the route to exact `fixtureKey` requests. Phase 4.8 added durable source-level warning coverage.

## Provider Categories To Compare

ClaimGuard should compare categories before choosing brands:

- General multimodal vision models, such as OpenAI Vision-style image analysis, for visual reasoning over screenshots, receipt layouts, product-photo context, and uncertainty signals.
- OCR-specialized providers, such as Google Cloud Vision, Google Document AI, or AWS Textract, for text extraction, layout reconstruction, tables, key-value pairs, and structured document fields.
- Local/browser/server OCR options, such as Tesseract-style OCR, for low-cost development, local privacy posture, and fallback testing.
- Hybrid pipelines that combine OCR-specialized extraction with a separate multimodal reasoning layer.
- Future image-forensics/photo-intelligence tools for altered-image or AI-generated-image risk signals, always framed as uncertainty and manual-review cues.

Official references consulted for current provider capabilities:

- [OpenAI Images and Vision guide](https://platform.openai.com/docs/guides/images-vision)
- [OpenAI Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs)
- [Google Cloud Vision OCR guide](https://cloud.google.com/vision/docs/ocr)
- [Google Document AI Enterprise Document OCR](https://cloud.google.com/document-ai/docs/enterprise-document-ocr)
- [AWS Textract documentation](https://docs.aws.amazon.com/textract/)
- [Tesseract documentation](https://tesseract-ocr.github.io/tessdoc/)

## Provider Options

| Option | Best Fit | ClaimGuard Strength | ClaimGuard Concern | Planning Verdict |
| --- | --- | --- | --- | --- |
| OpenAI Vision-style multimodal analysis | Visual reasoning, screenshots, layout/context, product photo observations, uncertainty summaries | Strong reasoning over mixed visual evidence and structured reviewer summaries | Not the first choice for precise receipt OCR when exact field extraction matters; requires strict prompt/output safety and privacy controls | Use later as a reasoning layer, not Phase 4.9 implementation |
| Google Cloud Vision / Document AI | OCR, document text, layout information, broader document processing | Strong candidate for receipt/order screenshots, text extraction, and layout-aware document processing | Provider setup, privacy, retention, cost, quota, and cloud data-flow review required | Candidate OCR-specialized provider for future evaluation |
| AWS Textract | Document text, forms, tables, key-value extraction | Strong candidate for receipts, invoices, tables, forms, and structured document extraction with confidence signals | Cloud data egress, provider-specific response shape, cost and timeout planning required | Candidate OCR-specialized provider for future evaluation |
| Tesseract/local OCR | Local OCR, development fallback, low-cost synthetic testing | Privacy-friendly for local processing and useful baseline/fallback | Likely weaker for messy screenshots, dense layouts, mobile order pages, and structured receipt fields | Keep as development/test fallback and baseline, not final production assumption |
| Hybrid pipeline | OCR-specialized extraction plus multimodal reasoning | Best match for ClaimGuard's evidence-review posture: exact extraction first, contextual reasoning second | More architecture planning required to keep providers separated and avoid overclaiming | Recommended staged target |

## ClaimGuard Evaluation Criteria

Each future provider evaluation should score options against ClaimGuard-specific criteria:

- Receipt OCR accuracy.
- Amazon/order screenshot structure understanding.
- Product damage photo usefulness.
- Ability to reason over screenshots/photos.
- Structured JSON output suitability.
- Confidence/uncertainty support.
- Timeout behavior.
- Cost predictability.
- Privacy posture.
- Data retention concerns.
- Vendor lock-in risk.
- Ease of provider-neutral abstraction.
- Future scalability.
- Suitability for manual-review evidence workflows.
- Risk of overclaiming or unsafe model outputs.

## Provider Comparison Summary

OpenAI Vision-style analysis is strongest where ClaimGuard needs visual context, screenshot reasoning, product-photo context, layout inconsistency review, and future altered or AI-generated image uncertainty signals. It should not be the first precision receipt OCR provider and must never be asked to produce proof, wrongdoing conclusions, or support outcomes.

Google Cloud Vision and Document AI are stronger candidates for OCR-specialized extraction. Cloud Vision supports OCR for images, while Document AI is oriented toward document OCR, layout, and document-processing workflows. They are plausible future choices when ClaimGuard needs receipt text, PDF pages, and layout-aware extraction.

AWS Textract is also a strong OCR-specialized candidate for document text plus structured data, forms, and tables. It is attractive for receipt/invoice-like evidence and field confidence, but its provider-specific response model should be normalized behind ClaimGuard's internal contract.

Tesseract/local OCR should remain useful for low-cost development, local privacy posture, regression baselines, and fallback experiments. It should not be treated as production-quality for messy receipt photos, dense marketplace screenshots, or mobile order pages until synthetic and real-world approved testing proves it.

A hybrid pipeline best matches ClaimGuard's direction: use OCR-specialized extraction for receipt text/fields when precision matters, then optionally use a multimodal reasoning layer for layout context, screenshot interpretation, product-photo context, and uncertainty signals.

## Recommended Staged Strategy

Recommended strategy:

1. Keep ClaimGuard's internal OCR extraction contract as the source of truth.
2. Use OCR-specialized extraction for receipt text and structured receipt fields when precision matters.
3. Use OpenAI Vision-style reasoning later for visual analysis over screenshots, receipt layout inconsistencies, product photo context, and altered/AI-generated-image uncertainty signals.
4. Treat all provider outputs as evidence sources, not decision makers.
5. Keep local/Tesseract-style OCR as a development baseline and possible privacy-friendly fallback, not the final production assumption.
6. Build a synthetic/mock provider adapter before any live provider adapter.
7. Preserve manual review as the final decision point.

The safest future direction is not a single-provider bet. ClaimGuard should keep OCR extraction, vision reasoning, scoring, privacy, and UI display as separate layers.

In short: OCR-specialized extraction first, OpenAI Vision-style reasoning later, and ClaimGuard's internal OCR extraction contract as the source of truth.

External Verification: Not performed remains the correct default unless a later approved integration actually verifies evidence against an external source.

## OpenAI Vision Role

OpenAI Vision-style analysis should fit as a future reasoning layer, not Phase 4.9 implementation.

Potential future uses:

- Visual reasoning over receipt screenshots where layout and context matter.
- Marketplace/order screenshot interpretation.
- Receipt layout inconsistency review.
- Product photo context, requested-view completeness, and damage visibility context.
- Altered-image or AI-generated-image uncertainty signals with a confidence-style 1-100 output.

Required constraints:

- No direct wiring to live uploads yet.
- No provider calls in Phase 4.9.
- Future sandbox only after provider abstraction planning.
- Output must be structured as uncertainty, confidence, limitations, and review signals only.
- Output must not produce fraud conclusions, customer accusations, final claim decisions, or proof that an image is altered, synthetic, or genuine.

## OCR-Specialized Provider Role

OCR-specific providers are better candidates for the first future precision extraction layer.

Potential future uses:

- Merchant/platform extraction.
- Order or invoice identifiers.
- Purchase and order dates.
- Totals, subtotal, tax, shipping, and payment cues.
- Line items and product rows.
- Amazon/order summary sections.
- PDF and document layout extraction.

Required constraints:

- OCR provider output should feed the provider-neutral OCR extraction contract.
- Provider output should not directly produce ClaimGuard decisions.
- Field confidence is a review signal only.
- Field mismatch is a manual-review driver only.
- Raw provider payloads must not be logged or retained without approved policy.

## Local OCR Role

Local OCR should remain part of the strategy, but with careful expectations.

Good uses:

- Development fallback.
- Synthetic test baseline.
- Privacy-friendly prototype option.
- Local/manual QA comparison point.
- Potential fallback when provider processing is not allowed.

Limitations:

- Likely weaker for messy receipts, dense screenshots, mobile order pages, and complex layouts.
- Timeout and device-performance variability may remain significant.
- Not a final production-quality assumption without benchmark evidence.

Local OCR should not become a hidden final decision path. Its output should follow the same confidence, limitation, and manual-review framing as external providers.

## Hybrid Pipeline Recommendation

A future hybrid pipeline should look like this:

1. OCR provider extracts text blocks, layout cues, and structured receipt fields.
2. ClaimGuard normalizes the output through `ocr-extraction-contract`.
3. A vision model optionally reviews layout, screenshot context, or product-photo context in a separate evidence module.
4. A later scoring or review-signal layer combines signals carefully.
5. Manual review remains the final decision point.
6. No single provider output becomes a fraud verdict, claim outcome, or automatic support action.

The OCR layer should answer: "What fields can be read and with what confidence?"

The vision layer should answer: "What visual context, limitations, or uncertainty should a reviewer consider?"

The ClaimGuard layer should answer: "Which review signals and limitations should be presented safely?"

## Provider Abstraction Implications

The next planning milestone should design, but not implement:

- Provider adapter interface.
- Provider result type.
- Provider failure type.
- Timeout behavior.
- Cost metering fields.
- Provider capability declarations.
- Retention and logging rules.
- Redaction boundary.
- Prompt/output safety rules.
- Raw payload omission policy.
- Synthetic/mock provider adapter before live provider adapter.
- Provider-neutral fixture mapping.
- Provider-specific response normalization boundaries.

The abstraction should ensure provider replacement does not affect `analyzeEvidenceFile`, `LocalAnalysisResult`, receipt UI, upload flow, or live report output until a separately approved migration exists.

Phase 4.10 should keep the internal OCR extraction contract as source of truth and design provider adapters around that boundary.

## Safety And Privacy Requirements

Safety requirements:

- OCR confidence is a review signal only.
- Vision confidence is a review signal only.
- Field mismatch is a manual-review driver only.
- Altered-image or AI-generated-image confidence is an uncertainty signal only.
- No proof language.
- No evidence-authenticity conclusion.
- No fake, forged, or customer-accusation conclusion.
- No fraud-confirmation language.
- No automatic deny/refund/approval/rejection wording.
- No final claim decision.
- No single fraud score.
- No provider output should imply external verification happened.

Privacy requirements:

- No raw provider payload logging.
- No raw real OCR retention without approved policy.
- No real evidence processing until explicitly approved.
- No customer identifiers, ticket IDs, case IDs, claim IDs, evidence IDs, filenames, paths, object URLs, storage handles, provider trace URLs, raw metadata, payment details, addresses, phone numbers, emails, tracking numbers, or private background details in fixtures, docs, logs, prompts, screenshots, or commits.
- Evidence bytes should not leave the browser or synthetic route boundary until a later data-flow and retention milestone approves that path.
- Provider errors must be normalized into operational limitations, not evidence-risk claims.

## Specialist Review Findings

Product Strategy Agent: A hybrid provider strategy best preserves ClaimGuard's evidence-intelligence direction. Provider choice should support receipt precision and broader visual reasoning without turning AI into a decision maker.

Architecture and Maintainability Agent: The next planning step should define adapter/result/failure/timeout/cost/redaction contracts. No provider abstraction code should be added in Phase 4.9.

Receipt Intelligence Agent: OCR-specialized extraction should lead for receipt fields and Amazon/order screenshots. Receipt behavior, parser/scoring/report mapping, `analyzeEvidenceFile`, and `LocalAnalysisResult` must remain unchanged.

Integration Readiness Agent: Live provider work remains blocked. No SDK, credential, env var, provider payload, provider adapter, upload handling, storage, persistence, or real evidence path belongs in Phase 4.9.

Scoring and Safety Reviewer Agent: Provider confidence must stay separate from evidence reliability score, review priority, and final case disposition. Avoid a single fraud score and avoid proof or accusation language.

Privacy and Evidence Safety Agent: Provider selection is mainly a data-flow decision. No raw OCR, provider payloads, real evidence, or identifiers should be retained or logged without a later policy.

QA Harness Agent: Phase 4.10 should start with synthetic/mock provider adapter planning and fixture gates before any live provider tests.

Deployment and Release Agent: Phase 4.9 should be docs/source-of-truth only. Commit/push is allowed only after checks pass and protected runtime files remain untouched. No deployment.

## Phase Gate Recommendation

Phase 4.10 should be provider abstraction planning only.

Phase 4.10 should design the provider adapter interface, result shape, failure shape, timeout behavior, cost fields, redaction boundary, retention/logging policy, prompt/output safety rules, and synthetic/mock adapter plan. It should not add live providers, SDKs, env vars, provider abstraction implementation, uploads, storage, persistence, real evidence processing, or live AI/Vision/photo analysis.

Before Phase 4.10 starts, these must remain true:

- No live OCR.
- No providers.
- No SDKs.
- No env vars.
- No provider abstraction implementation.
- No upload implementation.
- No storage implementation.
- No persistence.
- No real evidence.
- No real customer data.
- No provider payloads.
- No customer identifiers.
- No scoring migration.
- No UI changes.
- No live receipt behavior changes.
- No deployment.
- Protected runtime files remain untouched.

## Stop Conditions

Stop future work if:

- Any live provider work is implemented.
- Any SDK, credential, env var, package dependency, provider adapter, provider abstraction code, upload path, storage path, persistence layer, or deployment config appears.
- Any multipart, binary, object URL, image URL, data URL, storage handle, provider payload, raw OCR, real evidence, or customer identifier path appears.
- Protected runtime files are modified.
- `ClaimReviewWorkflow` is modified.
- `ProductPhotoReviewPanel` is routed.
- `analyzeEvidenceFile` behavior changes.
- `LocalAnalysisResult` changes.
- Receipt parser/scoring/report behavior changes.
- Safety wording implies proof, customer wrongdoing, external verification, automatic support action, or final claim outcome.
- Required checks fail or cannot be interpreted safely.

## Closeout Criteria

Phase 4.9 is ready to close when:

- This provider selection planning document exists.
- `ROADMAP.md`, `NEXT_STEPS.md`, `REPO_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `AGENT_LOG.md` reflect Phase 4.9 planning-only status.
- No runtime/source/route/component/script/package/config/deployment files changed, except allowed source-of-truth documentation.
- No providers, SDKs, env vars, provider abstraction code, uploads, storage, persistence, UI wiring, real evidence, live scoring, `ClaimReviewWorkflow` wiring, `ProductPhotoReviewPanel` routing, `LocalAnalysisResult` migration, `analyzeEvidenceFile` changes, or receipt behavior changes were added.
- Required checks pass.
- The next recommended task is Phase 4.10 provider abstraction planning only, not live provider implementation.
