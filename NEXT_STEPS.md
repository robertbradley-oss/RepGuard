# ClaimGuard Next Steps

This file is the near-term operational queue. Keep it short, current, and actionable.

Use `ROADMAP.md` for durable product roadmap, future modules, and phase definitions.

## Current Checkpoint

- Phase 1 Receipt Intelligence is closed, pushed, deployed, and production-smoked.
- Post-Phase-1 evidence workspace polish is live from commit `19ef25e`.
- Phase 2 has not started.
- The immediate priority is agent-system and documentation discipline, not app behavior changes.

## Next Safe Tasks

1. Review Agent System Upgrade 1.0 documentation changes.
2. Confirm `ROADMAP.md` and `NEXT_STEPS.md` are serving distinct purposes.
3. Decide whether any additional release checklist docs are needed for future deploys.
4. Plan, but do not implement, the first Phase 2 readiness artifact if Robert asks.
5. Identify any stale Phase 1 language remaining in project guidance docs.
6. Keep the shipped receipt module stable unless Robert explicitly requests maintenance.
7. Preserve a clean operational queue after each completed agent task.

## Do Not Touch Right Now

- Do not start Phase 2.
- Do not add product damage photo analysis.
- Do not modify app UI.
- Do not modify upload/input/reset behavior.
- Do not modify analyzer, parser, scoring, report, privacy, or fixture logic.
- Do not connect real AI, OCR, ticket, email, drive, database, auth, Vercel, or payment systems.
- Do not change package dependencies.
- Do not deploy unless Robert explicitly asks.

## Current Recommended Next Prompt

```text
/claimguardagent review Agent System Upgrade 1.0 docs for routing clarity and stale Phase 1 language only; do not modify app code
```
