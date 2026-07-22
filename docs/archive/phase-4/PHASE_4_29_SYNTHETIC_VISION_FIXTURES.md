# Phase 4.29 Synthetic Vision Fixtures

Date: 2026-06-01

Primary agent role: QA Harness Agent

Supporting reviews: Product Strategy, Architecture and Maintainability, Receipt Intelligence, Integration Readiness, Scoring and Safety, Privacy and Evidence Safety, Deployment and Release

## 1. Purpose And Scope

Phase 4.29 creates the initial package-safe synthetic OpenAI Vision sandbox fixture assets planned in Phase 4.28 and matched to Phase 4.27 metadata.

This milestone creates synthetic SVG and markdown fixture files only. It does not add real receipts, real customer product photos, real screenshots, real account pages, anonymized/redacted customer evidence, provider payloads, raw OCR dumps, public URLs, object URLs, storage handles, EXIF/location metadata, SDKs, env vars, provider calls, upload parsing, storage, persistence, runtime schema/types, route behavior changes, UI wiring, package artifacts, deployment, live AI/Vision/photo analysis, receipt behavior changes, `analyzeEvidenceFile` changes, or `LocalAnalysisResult` changes.

Fixture content and future expected outputs keep observation, uncertainty signal, limitation, and manual-review guidance separate.

## 2. Created Synthetic SVG Assets

Created under `fixtures/vision-sandbox/assets/`:

- `synthetic-clean-receipt-baseline.svg`
- `synthetic-suspicious-layout-receipt.svg`
- `synthetic-partial-cropped-receipt.svg`
- `synthetic-order-screenshot-missing-context.svg`
- `synthetic-product-photo-normal-context.svg`
- `synthetic-damaged-product-ambiguous-context.svg`
- `synthetic-altered-ai-low-concern.svg`
- `synthetic-altered-ai-medium-concern.svg`
- `synthetic-altered-ai-high-concern.svg`

All SVG assets are hand-authored in-repo using simple shapes and generic labels. They contain no embedded raster images, no scripts, no external resources, no public URLs, no object URLs, no data URLs, no file URLs, no storage handles, no private identifiers, no provider payloads, no raw OCR dumps, no real brand marks, no real account screenshots, no customer evidence, and no EXIF/location metadata.

## 3. Created Synthetic Markdown Simulations

Created under `fixtures/vision-sandbox/simulations/`:

- `synthetic-unsupported-evidence.md`
- `synthetic-provider-timeout-simulation.md`
- `synthetic-schema-validation-failure.md`

Each markdown simulation includes metadata safety fields and describes only synthetic unsupported or operational limitation behavior. They contain no provider payloads, raw OCR, request identifiers, stack traces, public URLs, object URLs, data URLs, file URLs, storage handles, private identifiers, evidence conclusions, or claim outcomes.

## 4. Metadata Matching

Every created fixture matches a Phase 4.27 metadata `fixtureKey`:

- `synthetic-clean-receipt-baseline`
- `synthetic-suspicious-layout-receipt`
- `synthetic-partial-cropped-receipt`
- `synthetic-order-screenshot-missing-context`
- `synthetic-product-photo-normal-context`
- `synthetic-damaged-product-ambiguous-context`
- `synthetic-altered-ai-low-concern`
- `synthetic-altered-ai-medium-concern`
- `synthetic-altered-ai-high-concern`
- `synthetic-unsupported-evidence`
- `synthetic-provider-timeout-simulation`
- `synthetic-schema-validation-failure`

The Phase 4.27 metadata registry remains the matching metadata source. No runtime schema/types were added.

## 5. Altered/AI Uncertainty Safety

The altered-or-AI-generated-image uncertainty fixtures use artificial geometric differences only. They frame low, medium, and high review concern as uncertainty review signals.

They do not state proof, final decision, fraud score, customer accusation, automatic support outcome, confirmed alteration, confirmed AI generation, or claim disposition. Low review concern does not confirm authenticity. High review concern does not confirm alteration, AI generation, deception, or a claim outcome.

## 6. Package Safety

The fixtures are package-safe synthetic demo artifacts:

- Synthetic-only.
- Non-identifying.
- Locally authored.
- Safe for demo mode.
- Safe for self-hosted install.
- Matched to distributable synthetic metadata.
- Free of secrets, provider payloads, raw OCR, public URLs, object URLs, storage handles, customer evidence, external copyrighted/customer imagery, and live-provider assumptions.

No package archive, installer, release bundle, self-hosted template, or downloadable artifact was created.

## 7. Specialist Review Findings

Product Strategy Agent: The fixture set supports future photo intelligence demos while keeping all outputs framed as uncertainty, limitation, and manual-review support.

Architecture and Maintainability Agent: Fixtures live under `fixtures/vision-sandbox/` and remain separate from runtime source, routes, components, analyzers, reports, and upload paths.

Receipt Intelligence Agent: Receipt-like SVGs are sandbox visual fixtures only and do not alter OCR fixture harnesses, receipt parser/scoring/report behavior, or the receipt workflow.

Integration Readiness Agent: No provider SDKs, env vars, provider calls, provider payloads, uploads, storage, persistence, or route behavior changes were introduced.

Scoring and Safety Reviewer Agent: Altered/AI uncertainty assets avoid proof, accusation, final decision, and automatic disposition wording.

Privacy and Evidence Safety Agent: Assets and simulations contain no real/anonymized customer evidence, private identifiers, public/object/data/file URLs, storage handles, EXIF/location data, provider payloads, or raw OCR.

QA Harness Agent: `check:vision-sandbox-boundaries` validates fixture directories for required safety fields, unsafe wording, identifiers, URLs/storage handles, provider payload/raw OCR, package artifacts, and protected runtime drift.

Deployment and Release Agent: No deployment or package artifact was created.

## 8. Stop Point

Stop at Phase 4.29. Do not start Phase 4.30, OpenAI Vision sandbox skeleton planning, OpenAI Vision provider implementation, OpenAI SDK integration, env var work, provider calls, upload flow wiring, runtime schema/types, route changes, UI wiring, package artifact creation, or real evidence processing.
