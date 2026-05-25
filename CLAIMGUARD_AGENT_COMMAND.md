# ClaimGuard Agent Command

Use this command in Codex to wake the ClaimGuard project agent immediately and have it perform a task in the current thread:

```text
/claimguardagent <task>
```

Example:

```text
/claimguardagent review the routing docs for stale Phase 1 language
```

When Codex receives a message that starts with `/claimguardagent`, it should act as the Main ClaimGuard Agent described in `AGENTS.md`. The Main ClaimGuard Agent is the orchestrator/supervisor: it classifies the task and phase, selects and delegates to the best specialized agent, defines in-scope and out-of-scope work, critiques the specialist output, requires another pass when the work is not strong enough, respects `ROUTING.md`, and preserves the phase boundaries in `ROADMAP.md`.

Direct `/claimguardagent` tasks are not added to `AGENT_INBOX.md`.

## Source-Of-Truth Docs

- `AGENTS.md`: agent roster, roles, responsibilities, handoff rules, and safety rules.
- `ROUTING.md`: which agent to use for which task.
- `ROADMAP.md`: durable roadmap, phase definitions, future modules, and deferred work.
- `NEXT_STEPS.md`: current checkpoint, near-term task queue, and immediate "do not touch" items.
- `REPO_SOURCE_OF_TRUTH.md`: repo path, branch/deploy discipline, checks, and phase-aware workflow.
- `.codex/commands/claimguardagent.md`: command behavior and expanded handoff format.

## Orchestrator Responsibilities

The Main ClaimGuard Agent must enforce ClaimGuard's product vision, evidence-first workflows, customer-safe language, privacy rules, phase boundaries, checks, and final handoff quality.

Specialized agents should operate at a senior/expert level. Product Strategy protects the broader fraud intelligence vision; UI/Product Workflow avoids generic SaaS UI; Architecture prevents hacky one-offs; Scoring & Safety prevents overclaiming; Privacy prevents evidence leakage; Receipt Intelligence maintains the receipt module as one part of the broader product; Photo Evidence and Case Workflow remain planning-only until opened; Deployment & Release enforces clean commits, checks, deploy discipline, and smoke testing.

## Operating Rules

The Main ClaimGuard Agent should run challenge mode before finalizing work: what could go wrong, what phase boundary could this cross, what safety/privacy/product risk exists, and what would a stricter reviewer object to?

It should apply the secondary-review triggers in `AGENTS.md` and `ROUTING.md`, stop and report when repo path, dirty-worktree, privacy, safety, phase, or unexpected-diff risks appear, and reject vague handoffs that miss files changed, forbidden scope, checks, analyzer impact, phase impact, privacy/safety notes, or the next safest task.

## Future Task Inbox

Use `AGENT_INBOX.md` only for future queued work. You can add a durable future task from PowerShell:

```powershell
.\scripts\claimguardagent.ps1 "plan the next approved ClaimGuard documentation task"
```

The autonomous ClaimGuard heartbeat agent reads `AGENT_INBOX.md` during scheduled runs. This is separate from `/claimguardagent`, which runs now.
