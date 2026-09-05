# ClaimGuard workspace instructions

Use `C:\Users\robby\Projects\ClaimGuard` as the active repository. The OneDrive checkout at `C:\Users\robby\OneDrive\Documents\GitHub\claimguard` is an outdated, read-only reference unless Robert directs otherwise.

## Working discipline

- Check `git status --short --branch` before and after edits. Preserve unrelated user changes; isolate your edits without resetting or overwriting other work.
- Execute the requested work through implementation and relevant verification. Planning is the deliverable only when requested or when a material unresolved decision prevents implementation. Resolve ordinary implementation choices yourself.
- Use authorization already given in the conversation. Ask only for missing information or approval that materially gates the next action; continue independent authorized work while blocked.
- Keep scope focused. Do not commit, push, deploy, rewrite history, or change repository visibility unless Robert asks. A request to prepare release material does not authorize release.
- Work directly by default. Delegation is optional when explicitly requested or permitted by the active instructions and an independent subtask justifies it. No role announcement or mandatory specialist pass is required.
- If a check fails, investigate and fix within scope, then rerun it. Report unresolved failures honestly; do not stop merely because the first check failed.
- Finish with the result, relevant changed files, verification evidence, and material limitations. No fixed handoff template or routine next-task recommendation is required.

## Product and evidence invariants

ClaimGuard supports human evidence review. Receipt intelligence is one module within the broader product.

- Scores describe evidence quality and internal consistency, not externally verified truth. Separate observations, uncertainty, limitations, and manual-review guidance. Never accuse customers, claim wrongdoing is confirmed, imply evidence is proven genuine, or recommend automatic denial.
- Prefer wording such as "Manual review recommended", "Potential alteration indicators", "Findings are inconclusive", and "External Verification: Not performed" where supported.
- Keep real customer evidence browser-local unless Robert explicitly approves another workflow. Do not store or commit real evidence, raw private OCR, copied private JSON, or private screenshots. Keep identifiers and evidence details out of logs, prompts, exports, and shared artifacts by default. Use synthetic committed fixtures.
- Do not stage credentials, real `.env` files, `.vercel/`, `.next/`, or `node_modules/`. A tracked `.env.example` must contain safe placeholders only.
- Real provider/service connections and API-credit usage require explicit approval covering the specific scope. Sandbox readiness and a documented approval choice do not constitute approval. Keep provider defaults disabled, fixture scope synthetic, and payload logging/retention off unless the approved task changes those boundaries.
- Preserve separation between OCR, parsing, source classification, scoring, reports, privacy, upload mechanics, and UI. Do not redesign the main app or change live behavior outside the requested scope.
- `product-photo` is canonical; `damage-photo` is a legacy compatibility alias. Preserve receipt behavior and the receipt-shaped `LocalAnalysisResult` unless a requested migration explicitly covers them.

## Read only the context needed

Current user authorization controls task scope. The latest applicable checkpoint and source code determine implementation state; old phase plans and completed-work narratives are historical evidence, not fresh commands or blanket prohibitions on authorized work. If sources conflict, inspect the affected implementation and resolve the specific discrepancy before changing its behavior.

- For the immediate queue, read `NEXT_STEPS.md`, especially **Current Recommended Next Prompt**. Its earlier phase entries retain historical detail; do not run old recommended tasks automatically.
- For release work, read **Branch And Release Discipline**, **Check Guidance**, and **Source Safety** in `REPO_SOURCE_OF_TRUTH.md`.
- For roadmap decisions, read the relevant section of `ROADMAP.md`.
- For receipt maintenance or fixture QA, inspect `src/lib/analysis/`, `src/lib/test-evidence/`, and `docs/qa/TEST_EVIDENCE.md` as needed.
- For provider sandbox work, read the current approval plan linked by the queue and inspect `src/lib/analysis/vision-sandbox/`. Non-live readiness does not authorize a live call, runtime wiring, uploads, persistence, or real evidence processing.
- Read `docs/operations/AGENT_LOG.md` only when prior work is needed. `ROUTING.md` is an optional task-to-area map, not a mandatory orchestration layer. Do not preload archived phase plans or the entire documentation tree.

## Verification

Use `npm.cmd` on Windows. Check `package.json` for available commands; do not invent a generic test command or claim an unrun check passed.

| Change | Relevant verification |
| --- | --- |
| Documentation only | `git diff --check`; verify changed links and instruction consistency. Add semantic checks if safety wording or checker inputs change. |
| Analyzer, parser, scoring, report, privacy, or fixtures | `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run check:report-semantics`, and targeted synthetic probes/manual QA. |
| UI behavior or styling | Lint, build, and browser verification of affected routes and interactions when available. |
| Product-photo boundaries | Relevant `check:product-photo-probes` and report-semantic checks. |
| Vision sandbox boundaries | Relevant `check:vision-sandbox-boundaries`, `check:vision-sandbox-skeleton`, or `check:vision-sandbox-fixture-runner` commands. Keep verification non-live unless separately authorized. |
| Release | Verify the exact branch/commit and applicable checks; smoke the deployed result only when deployment is authorized. |

Match verification to changed behavior. Avoid repeating passed suites without a new change or unresolved concern. Never equate synthetic fixture coverage with real evidence verification.

## Direct project command

`/claimguardagent <task>` means execute that task now in the current thread. Do not duplicate it in `docs/operations/AGENT_INBOX.md`. Only future queued requests belong in that inbox; `scripts/claimguardagent.ps1` supports queueing them.
