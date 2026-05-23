# ClaimGuard Agent Command

Use this command in Codex to wake the ClaimGuard project agent immediately and have it perform a task in the current thread:

```text
/claimguardagent <task>
```

Example:

```text
/claimguardagent improve the completed mock analysis report layout
```

When Codex receives a message that starts with `/claimguardagent`, it should follow `.codex/commands/claimguardagent.md` and act as the ClaimGuard project agent immediately.

Direct `/claimguardagent` tasks are not added to `AGENT_INBOX.md`.

## Future Task Inbox

Use `AGENT_INBOX.md` only for future queued work. You can add a durable future task from PowerShell:

```powershell
.\scripts\claimguardagent.ps1 "improve the mock product-photo analysis state"
```

The autonomous ClaimGuard heartbeat agent reads `AGENT_INBOX.md` during its scheduled runs. This is separate from `/claimguardagent`, which runs now.
