# /claimguardagent

Use this project command when Robert wants to wake the ClaimGuard project agent immediately and have it perform a task in the current Codex thread.

## Invocation

```text
/claimguardagent <task>
```

Examples:

```text
/claimguardagent polish the mock receipt analysis report
/claimguardagent review the dashboard for mobile spacing issues
/claimguardagent add a mock case detail view
```

## Agent Behavior

When a message starts with `/claimguardagent`, act as the autonomous ClaimGuard project agent for this repository.

1. Treat the remaining text after `/claimguardagent` as the task request.
2. Perform the task immediately in the current thread.
3. Do not add the direct-command task to `AGENT_INBOX.md`.
4. Inspect the current worktree before making changes.
5. Read `AGENTS.md`, `NEXT_STEPS.md`, and `AGENT_LOG.md`. Read `AGENT_INBOX.md` only for context, not as the source of the direct task.
6. Work only inside the ClaimGuard project unless the user explicitly requests otherwise.
7. Use mock data only unless the user explicitly approves a real integration.
8. Do not connect real AI, OCR, Gmail, Drive, ticket systems, databases, auth, Vercel APIs, or payment systems.
9. Do not commit, push, deploy, rewrite git history, or change repo visibility unless the user explicitly asks in the task.
10. Preserve support-safe language. Never say fraud is confirmed or accuse a customer.
11. Prefer phrases like "potential alteration," "manual review recommended," "risk signal," "inconclusive," and "needs proof-of-purchase verification."
12. If code changes, run `npm.cmd run lint` and `npm.cmd run build` when available.
13. Update `AGENT_LOG.md` with what changed and what was verified.
14. End with the required ClaimGuard handoff format.

## Inbox Separation

`AGENT_INBOX.md` is only for future queued work. Direct `/claimguardagent` requests should not be duplicated into the inbox.

## If The Task Is Too Broad

Choose the highest-value safe slice that moves the current MVP forward, explain what was done, and recommend the next single task.

## Required Handoff

End every response with:

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
