# ClaimGuard Next Steps

This file is the near-term operational queue. Keep it short, current, and actionable.

Use `ROADMAP.md` for durable product roadmap, future modules, and phase definitions.

## Current Checkpoint

- Phase 1 Receipt Intelligence is closed, pushed, deployed, and production-smoked.
- Post-Phase-1 evidence workspace polish is live from commit `19ef25e`.
- Phase 2.0 scaffold work is closed.
- Phase 2.1 has officially started as Product Photo Local Heuristic Design.
- Current Phase 2.1 state is documentation/planning-only, local-only, manual-review-safe, provider-ready, and intentionally unwired.
- Shared evidence model types and product-photo scaffold/defaults exist.
- No product-photo analyzer behavior is live yet.
- No runtime analyzer, upload, UI, report, scoring, parser, or fixture behavior changed during Phase 2.0 or Phase 2.1 planning.
- `product-photo` is canonical.
- `damage-photo` remains only a compatibility alias to `product-photo` / `damage-close-up`.

## Next Safe Tasks

1. Complete the Phase 2.1 first-pass product-photo heuristic signal design in `PHASE_2_PHOTO_EVIDENCE_PLAN.md`.
2. Review the proposed Phase 2.2 implementation order before any runtime or routing work begins.
3. Confirm the product-photo scaffold remains unwired from runtime analyzer, upload, UI, report, scoring, parser, and fixture behavior.
4. Keep the shipped receipt module stable unless Robert explicitly requests maintenance.
5. Preserve a clean operational queue after each completed agent task.

## Do Not Touch Right Now

- Do not wire product-photo scaffold into runtime analyzer behavior.
- Do not add live product damage photo analysis.
- Do not modify app UI.
- Do not modify upload/input/reset behavior.
- Do not modify analyzer, parser, scoring, report, privacy, or fixture logic.
- Do not connect real AI, OCR, ticket, email, drive, database, auth, Vercel, or payment systems.
- Do not change package dependencies.
- Do not deploy unless Robert explicitly asks.

## Current Recommended Next Prompt

```text
/claimguardagent review the Phase 2.1 product-photo local heuristic design for safety, privacy, and Phase 2.2 implementation order only; do not make runtime, UI, upload, analyzer, scoring, parser, report, or fixture changes
```
