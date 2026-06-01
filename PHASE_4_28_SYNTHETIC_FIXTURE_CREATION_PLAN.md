# Phase 4.28 Synthetic Fixture Creation Plan

Date: 2026-06-01

Primary agent role: QA Harness Agent

Supporting reviews: Product Strategy, Architecture and Maintainability, Receipt Intelligence, Integration Readiness, Scoring and Safety, Privacy and Evidence Safety, Deployment and Release

## 1. Purpose And Scope

Phase 4.28 plans the synthetic fixture files/assets that Phase 4.29 may create. This milestone is planning-only. It creates no fixture files, no fixture images, no PDFs, no screenshots, no receipts, no product photos, no provider payloads, no raw OCR dumps, no package artifacts, no runtime schema/types, no route behavior, no UI wiring, no upload/storage/persistence path, no SDKs, no provider calls, no environment variables, no real evidence, and no anonymized/redacted customer evidence.

The Phase 4.29 creation step may begin only if this plan is committed, pushed, all checks pass, and created files remain synthetic-only, non-identifying, package-safe, and matched to Phase 4.27 metadata.

Future fixture outputs must keep observation, uncertainty signal, limitation, and manual-review guidance separate.

## 2. Phase 4.29 Fixture Set

Phase 4.29 should create a limited initial fixture set matching Phase 4.27 metadata:

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

Phase 4.29 should prefer simple synthetic SVG assets and small text/markdown simulation files because they are transparent, diffable, package-safe, and locally authored. Raster images are not required for the initial fixture set.

## 3. Allowed File Types

Allowed in Phase 4.29:

- `.svg` for simple artificial synthetic visual fixtures.
- `.md` for unsupported/failure simulation notes.
- `.json` only for metadata updates if needed.

Not allowed in Phase 4.29:

- Real photos.
- Real screenshots.
- Real receipt scans.
- PDFs.
- Provider request/response files.
- Raw OCR text dumps.
- Public URL references.
- Object URL references.
- Storage-handle references.
- EXIF/location-bearing files.
- External copyrighted/customer images.
- Binary files copied from outside the repo.

## 4. Allowed Directories

Allowed directories:

- `fixtures/vision-sandbox/assets/`
- `fixtures/vision-sandbox/simulations/`
- `fixtures/vision-sandbox/metadata/` only for matching metadata updates if needed.

No other fixture, public, source, route, component, package artifact, or deployment directory should receive fixture files in Phase 4.29.

## 5. Naming Convention

File names should match `fixtureKey` exactly:

- `fixtures/vision-sandbox/assets/<fixtureKey>.svg`
- `fixtures/vision-sandbox/simulations/<fixtureKey>.md`

Names must be lowercase, hyphenated, synthetic, non-identifying, and free of customer names, ticket numbers, order numbers, tracking numbers, dates tied to real events, URLs, provider IDs, storage IDs, or claim outcomes.

## 6. Image And Content Requirements

Synthetic SVG fixtures must:

- Be locally authored.
- Use only simple geometric shapes and generic labels.
- Avoid brand marks, marketplace names, account pages, real product designs, real addresses, barcodes, QR codes, serial numbers, order numbers, tracking numbers, customer names, phone numbers, emails, and exact timestamps.
- Include a visible synthetic/demo label.
- Include no embedded raster image.
- Include no external resource reference.
- Include no script.
- Include no metadata block with location, author, device, or real source details.

Simulation markdown fixtures must:

- Be explicitly labeled synthetic.
- Describe only operational or unsupported-state behavior.
- Avoid provider payloads, raw OCR, stack traces, request IDs, dashboard links, identifiers, URLs, and final claim outcomes.

## 7. Synthetic Receipt Content Rules

Synthetic receipt visuals may show generic fields only:

- Generic merchant label such as `SYNTHETIC STORE`.
- Generic line items such as `ITEM A`.
- Rounded placeholder totals.
- Synthetic-only status label.

Synthetic receipts must not include real merchant names, loyalty IDs, payment details, order numbers, transaction IDs, barcodes, QR codes, addresses, phone numbers, emails, raw OCR dumps, real dates, or authenticity/proof labels.

## 8. Synthetic Order Screenshot Content Rules

Synthetic order screenshot visuals may show:

- Generic order summary layout.
- Generic status labels.
- Missing-context callouts.
- Synthetic-only status label.

Synthetic order screenshots must not mimic real marketplaces, customer account pages, account names, addresses, shipping/tracking numbers, order identifiers, payment details, public URLs, or real dates.

## 9. Synthetic Product Photo And Mock Image Rules

Synthetic product-photo visuals may show:

- Abstract product-like boxes or shapes.
- Generic surface/background.
- Synthetic condition markers.
- Missing-context callouts.

Synthetic product-photo visuals must not use real product photos, real brand designs, customer environments, private backgrounds, serial/model text, barcode/QR content, real packaging labels, public URLs, or object/storage references.

## 10. Altered/AI Uncertainty Fixture Rules

Altered-or-AI-generated-image uncertainty fixtures may use artificial geometric inconsistencies, texture bands, edge discontinuities, or lighting blocks to exercise review-signal behavior.

They must state:

- Altered-or-AI-generated-image uncertainty is a review signal only.
- It is not proof.
- It is not a final decision.
- It is not a fraud score.
- Low concern does not confirm authenticity.
- High concern does not confirm alteration, AI generation, deception, or a claim outcome.

They must not label the evidence as fake, forged, confirmed altered, confirmed AI-generated, fraudulent, approved, denied, rejected, or verified authentic.

## 11. Unsupported And Failure Simulation Rules

Unsupported/failure fixtures should use markdown only unless a simple SVG is needed for unsupported synthetic evidence shape.

Provider timeout and schema-validation-failure simulations must remain operational limitations only. They must not include provider payloads, provider request IDs, raw provider messages, stack traces, network logs, API keys, URLs, or evidence conclusions.

Unsupported evidence must remain an evidence limitation only and should recommend manual review or alternate evidence collection without accusing the customer or deciding the claim.

## 12. Package-Safe Distribution Requirements

Each created fixture must:

- Match a Phase 4.27 metadata entry.
- Be synthetic-only.
- Be package-safe where metadata marks it distributable.
- Be safe for demo mode.
- Be safe for self-hosted install.
- Be free of secrets, private identifiers, real customer data, provider payloads, raw OCR, public URLs, object URLs, storage handles, and external copyrighted/customer material.
- Preserve review-support wording and manual-review framing.

No package archive, installer, release bundle, self-hosted template, or downloadable artifact should be created in Phase 4.29.

## 13. License And Origin Rules

Phase 4.29 fixtures must be locally authored in the repo during the phase.

Allowed origin:

- Hand-authored SVG and markdown created from generic shapes/text.

Disallowed origin:

- Downloaded images.
- Screenshots from real accounts.
- Generated images based on real customer evidence.
- External stock/product/marketplace imagery.
- Redacted/anonymized customer evidence.
- Provider outputs.

## 14. QA Checks Before Creation

Before creating fixtures, Phase 4.29 should run:

- `git status --short --branch`
- `git log -1 --oneline`
- `npm.cmd run check:vision-sandbox-boundaries`
- `npm.cmd run check:report-semantics`

Phase 4.29 should confirm the repo is clean and synced, Phase 4.28 is committed/pushed, and metadata entries exist for every fixture planned.

## 15. QA Checks After Creation

After creating fixtures, Phase 4.29 must run:

- `git status --short --branch`
- `git diff --stat`
- `npm.cmd run lint`
- `npm.cmd run build`
- `npm.cmd run check:report-semantics`
- `npm.cmd run check:product-photo-probes`
- `npm.cmd run check:vision-sandbox-boundaries`
- `git diff --check`
- Protected code diff scan.
- Route/provider/env/package diff scan.
- Protected import scan.
- Upload/storage/object URL scan.
- Fixture/image addition scan.
- Runtime schema/type addition scan.
- Package artifact addition scan.
- Unsafe wording scan.
- Private identifier scan.
- Altered/AI-generated wording scan.
- Package-safety scan.

If SVG files are created, Phase 4.29 should confirm they contain no embedded raster images, scripts, external resources, URLs, or metadata blocks. If any raster file is unexpectedly considered, stop unless it can be proven synthetic, locally authored, package-safe, and free of EXIF/location metadata.

## 16. Stop Conditions

Stop Phase 4.29 if:

- Fixture creation requires real customer evidence.
- Fixture creation requires external copyrighted images.
- Fixture creation requires provider calls.
- Fixture creation requires upload parsing, storage, persistence, runtime wiring, route behavior changes, UI changes, package artifacts, SDKs, env vars, or runtime schema/types.
- Any fixture contains real/anonymized customer evidence, public URLs, object URLs, storage handles, provider payloads, raw OCR dumps, private identifiers, EXIF/location metadata, unsafe proof/fraud/fake/forged labels, or final claim outcome language.
- Metadata and fixture names do not match.
- Required checks fail.

## 17. Specialist Review Findings

Product Strategy Agent: The plan advances future photo intelligence demos while keeping them synthetic, review-support-only, and package-safe.

Architecture and Maintainability Agent: A narrow `fixtures/vision-sandbox/` structure keeps assets separate from runtime code and allows static validation to remain simple.

Receipt Intelligence Agent: Synthetic receipt fixtures are visual sandbox assets only and must not affect the existing OCR fixture harness, parser, scoring, report behavior, or receipt workflow.

Integration Readiness Agent: No provider integration, SDK, env var, provider call, upload path, storage path, or route behavior is allowed.

Scoring and Safety Reviewer Agent: Altered-or-AI-generated-image uncertainty remains not proof, not a final decision, and not a claim outcome.

Privacy and Evidence Safety Agent: Locally authored SVG/markdown with generic labels is the safest initial package-friendly fixture format.

QA Harness Agent: Phase 4.29 should verify metadata-to-file matching, boundary checks, no private identifiers, no URLs/storage handles, and no package artifacts.

Deployment and Release Agent: No deployment or downloadable package should be produced in Phase 4.29.

## 18. Phase 4.29 Recommendation

Proceed to Phase 4.29 synthetic fixture creation only if all checks pass. Create only the limited package-safe synthetic SVG/markdown fixtures described above, matching Phase 4.27 metadata, with no real evidence, no provider calls, no SDK/env additions, no route/runtime/UI changes, no upload/storage/persistence, no package artifacts, no receipt behavior changes, no `analyzeEvidenceFile` changes, and no `LocalAnalysisResult` changes.
