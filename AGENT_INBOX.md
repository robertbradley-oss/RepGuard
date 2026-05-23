# ClaimGuard Agent Inbox

Use this file to communicate with the autonomous ClaimGuard project agent.

## How To Use

Add requests under **Open Requests**. Keep each request small enough for one focused project-agent pass.

Good requests:

- Polish the upload-to-analysis workflow.
- Review the dashboard for mobile layout issues.
- Improve mock risk report copy.
- Add a mock case detail view.
- Summarize current repo health.

Do not request real integrations here unless you are ready for explicit approval in the Codex thread.

## Open Requests

Add new requests below this line.
Add a “ChatGPT handoff” section to AGENTS.md.

For every Codex run, the agent must end with:

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

This handoff should be clear enough that Robert can paste it into ChatGPT and get guidance on what to do next.

```text
[priority: medium] Example: Improve the upload-to-analysis workflow using mock data only.
```

## Parking Lot

Use this section for ideas that are not ready for implementation.

- Add real OCR later.
- Add real AI vision later.
- Plan database schema after the mock workflow is stable.
