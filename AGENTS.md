# ClaimGuard Agent Guide

This file tells future Codex agents how to work on ClaimGuard.

## Project Purpose

ClaimGuard is a SaaS-style fraud-risk screening app for customer support and warranty teams. It helps reps review customer-submitted claim evidence and decide whether a claim is ready to approve, needs proof-of-purchase verification, or should be routed to manual review.

ClaimGuard must flag risk carefully. It must never accuse a customer or state that fraud is confirmed.

## Main Workflow

The core workflow is:

1. A support rep opens a claim case.
2. The rep uploads a receipt, screenshot, PDF, or product damage photo.
3. ClaimGuard returns a careful authenticity and risk report.
4. The report includes an authenticity score, risk level, red flags, evidence summary, suggested support action, and customer-safe wording.
5. The rep uses the result as a review aid, not as a final fraud determination.

The current app uses mock data only. Do not connect real AI, OCR, Gmail, Vercel APIs, databases, or payment systems unless the user explicitly asks.

## Tech Stack

Based on the current repo:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- lucide-react icons
- npm
- Vercel-ready project configuration

## Folder Structure

- `src/app/page.tsx`: main dashboard screen.
- `src/app/layout.tsx`: app metadata, font setup, and root layout.
- `src/app/globals.css`: global CSS, theme tokens, and page background styling.
- `DESIGN.md`: ClaimGuard visual system and design tokens.
- `src/components/`: reusable UI components.
- `src/components/AppSidebar.tsx`: sidebar navigation and ClaimGuard brand mark.
- `src/components/UploadPanel.tsx`: local upload UI for receipts, photos, screenshots, and PDFs.
- `src/components/TicketPreview.tsx`: ticket-style warranty claim preview.
- `src/components/RiskScoreCard.tsx`: authenticity score and risk level summary.
- `src/components/RedFlagsList.tsx`: careful risk-signal list.
- `src/components/AnalysisReport.tsx`: evidence summary, suggested action, and customer-safe wording.
- `src/components/RecentCasesTable.tsx`: recent case queue table.
- `src/lib/claim-data.ts`: mock dashboard data, cases, navigation, and red flags.
- `package.json`: scripts and dependencies.
- `.gitignore`: ignored local, build, dependency, Vercel, and environment files.

## Run Locally

Install dependencies:

```powershell
npm.cmd install
```

Start the dev server:

```powershell
npm.cmd run dev
```

The app normally runs at:

```text
http://localhost:3000
```

If port `3000` is busy, Next.js may choose another port or you can pass a port explicitly.

## Lint, Test, And Build

Lint:

```powershell
npm.cmd run lint
```

Build:

```powershell
npm.cmd run build
```

Security audit when needed:

```powershell
$env:NODE_OPTIONS='--use-system-ca'; npm.cmd audit --audit-level=moderate
```

Tests:

There is no test script configured yet. Do not claim tests pass unless a real test command has been added and run. For now, use lint, build, and browser/UI verification as the minimum checks.

## Coding Standards

- Use TypeScript and keep types explicit where they clarify component contracts.
- Prefer small reusable components over large page-only blocks.
- Keep mock data in `src/lib/claim-data.ts` until there is a real data layer.
- Follow existing Tailwind patterns and color choices before introducing new styling systems.
- Use `lucide-react` for icons when a suitable icon exists.
- Keep code comments rare and useful.
- Do not add heavy dependencies without a clear product need.
- Do not introduce real external service calls in the MVP without user approval.
- Preserve unrelated user changes in the working tree.

## UI Standards

- Keep the product as a working dashboard, not a marketing landing page.
- Follow `DESIGN.md` for the ClaimGuard command-center visual system.
- Use a dark forensic dashboard feel: deep navy and charcoal base, electric blue and verification green accents, and subtle document-forensics texture.
- Prioritize dense, scannable, operational layouts for support reps.
- Use strong evidence-review panels, support-ticket previews, security-style risk badges, and receipt/document surfaces.
- Make the evidence viewer the dominant product surface. Uploaded documents and photos should feel like inspected evidence with scan frames, metadata, timestamps, evidence IDs, and verification details.
- Case surfaces should feel like investigation records with customer-safe status, review queue, reviewer, channel, and last-updated metadata.
- Risk intelligence should include confidence, detected signal count, severity distribution, and recommended support action, not just a decorative score.
- Avoid generic white cards on gray backgrounds, centered SaaS hero layouts, default shadcn demo styling, random gradient blobs, and template-looking card grids.
- Vary panel shape, width, emphasis, and density where useful; do not make every card the same size and shape.
- Make the upload-to-analysis workflow obvious and demo-friendly.
- Ensure text fits on mobile and desktop without awkward overlap.
- Use customer-support language in visible UI.
- Avoid decorative clutter that distracts from claim review.

## Fraud-Language Safety Rules

Critical rule: ClaimGuard must never say "fraud confirmed" or accuse a customer.

Use careful phrases like:

- potential alteration detected
- manual review recommended
- risk signal
- inconclusive
- low confidence
- needs proof-of-purchase verification
- evidence requires additional review
- authenticity score

Avoid accusatory or definitive phrases like:

- fraud confirmed
- fraudulent customer
- fake receipt
- customer lied
- scam
- forged proof
- confirmed manipulation
- dishonest claim

When in doubt, frame results as review signals, confidence levels, or verification needs.

## Autonomous Communication Loop

The project agent has two repo-level communication files:

- `AGENT_INBOX.md`: the user can add requests, priorities, and questions for the agent.
- `AGENT_LOG.md`: the agent records what it inspected, changed, verified, and still needs.
- `.codex/commands/claimguardagent.md`: the project command definition for `/claimguardagent`.
- `CLAIMGUARD_AGENT_COMMAND.md`: user-facing instructions for directly tasking the agent.

## Direct Command

When Robert sends a message that starts with:

```text
/claimguardagent
```

Treat the rest of the message as a direct ClaimGuard project-agent task and perform it immediately in the current thread. Do not add the same task to `AGENT_INBOX.md`. Follow `.codex/commands/claimguardagent.md`, inspect the current worktree, use mock data only unless explicitly approved, preserve fraud-language safety, and end with the ClaimGuard handoff format.

Robert can add future queued tasks to the durable inbox with:

```powershell
.\scripts\claimguardagent.ps1 "task description"
```

When operating autonomously:

1. Inspect `git status --short --branch`.
2. Read `AGENTS.md`, `NEXT_STEPS.md`, and `AGENT_INBOX.md`.
3. Choose the highest-priority open request that is safe and scoped.
4. Make only changes that satisfy that request.
5. Run `npm.cmd run lint` and `npm.cmd run build` when code changed.
6. Append a concise entry to `AGENT_LOG.md`.
7. Report back in the Codex thread with what changed and what remains.

If an inbox request needs approval, write that clearly in the Codex thread instead of making the change.

## ChatGPT Handoff Requirement

Every ClaimGuard Codex run must end with this exact handoff format so Robert can paste the result into ChatGPT for review:

```text
CLAIMGUARD HANDOFF

Task completed:
Files changed:
What changed:
Checks run:
- lint:
- build:
- browser check:

Anything risky:
Anything not finished:
Recommended next task:
Questions for Robert:
```

Keep the handoff concrete and concise. It should name changed files, verification performed, any remaining risk, and the single best next task.

## Do Not Change Without Approval

Ask before changing:

- Real AI, OCR, computer vision, or model integrations.
- Gmail, helpdesk, CRM, or support inbox integrations.
- Vercel project settings, deployment automation, or production domains.
- Database setup, schema migrations, or persistent storage.
- Payment, billing, authentication, or user management systems.
- Git history rewrites, branch deletion, force pushes, or repo visibility.
- `.env*`, `.vercel/`, `.next/`, `node_modules/`, or generated build artifacts.
- The core fraud-language safety posture.

## Definition Of Done

For each task:

- The requested behavior or UI change is implemented.
- The change preserves support-safe fraud-risk language.
- The app still uses mock data unless real integration work was explicitly requested.
- `npm.cmd run lint` passes.
- `npm.cmd run build` passes.
- Any new user-facing flow is checked in a browser when practical.
- Any missing test coverage or known limitation is reported.
- No secrets, build output, `node_modules`, `.next`, `.vercel`, or `.env*` files are committed.

## Recommended Next Tasks

1. Polish the MVP dashboard layout and responsive behavior.
2. Improve the upload-to-analysis workflow with richer mock states.
3. Add a mock receipt analysis engine.
4. Add a mock product-photo analysis engine.
5. Add a case history detail view.
6. Plan the database schema for cases, evidence, reports, and review actions.
7. Plan real OCR and AI vision integration later, after the workflow is solid.
