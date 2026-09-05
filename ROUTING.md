# ClaimGuard task map

Optional reference for finding the relevant code or documentation. `AGENTS.md` contains operating instructions; the current user request defines authorized work. Work directly unless useful independent delegation is explicitly permitted. No role announcement, mandatory delegation, or fixed handoff is required.

| Task | Start here | Review concern |
| --- | --- | --- |
| Product direction or phase decision | Relevant `ROADMAP.md` section and current queue | Human evidence review; approved scope |
| Receipt OCR, parsing, classification, scoring | `src/lib/analysis/` | Receipt preservation, uncertainty, privacy |
| Evidence workspace or case shell UI | Affected route and component | Evidence-first workflow, safe wording, responsive behavior |
| Product-photo readiness | Relevant analysis module and probes | Non-live boundaries, canonical evidence type |
| Provider sandbox | `src/lib/analysis/vision-sandbox/` and current approval plan | Disabled defaults, synthetic scope, explicit live-call/API-credit authorization |
| Fixtures and QA | `src/lib/test-evidence/`, `docs/qa/TEST_EVIDENCE.md` | Synthetic data and meaningful coverage |
| Export, log, or data handling | Affected serializer or boundary | No private evidence or identifiers leaking |
| Release | Release sections of `REPO_SOURCE_OF_TRUTH.md` | Explicit authorization, exact branch/commit, applicable checks |

Read only the relevant files. Consult `NEXT_STEPS.md` **Current Recommended Next Prompt** for the current queue; earlier phase narratives are history, not tasks to execute. Verify implementation state in source before changing boundaries. A mock, stub, or readiness plan does not authorize a live integration.

Execute direct `/claimguardagent` requests in the current thread. Use `docs/operations/AGENT_INBOX.md` only for future queued requests.
