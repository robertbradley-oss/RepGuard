import { notFound } from "next/navigation";

import type { UnsupportedEvidenceReviewDisplay } from "@/lib/analysis/unsupported-evidence-review-state";

import { unsupportedEvidenceReviewCases } from "./render-cases";

function isUnsupportedEvidenceReviewBridgeEnabled() {
  return process.env.NODE_ENV !== "production";
}

function badgeClassFor(tone: "amber" | "cyan" | "rose" | "slate") {
  if (tone === "cyan") {
    return "border-[rgba(24,183,255,0.30)] bg-[rgba(24,183,255,0.08)] text-[var(--cg-cyan)]";
  }

  if (tone === "rose") {
    return "border-[rgba(244,63,94,0.34)] bg-[rgba(244,63,94,0.10)] text-[#fb7185]";
  }

  if (tone === "slate") {
    return "border-white/15 bg-white/[0.05] text-[var(--cg-text-soft)]";
  }

  return "border-[rgba(251,191,36,0.32)] bg-[rgba(251,191,36,0.10)] text-[var(--cg-amber)]";
}

function actionLabel(action: UnsupportedEvidenceReviewDisplay["allowedNextActions"][number]) {
  if (action === "manual-review") {
    return "Manual review";
  }

  if (action === "request-eligible-receipt") {
    return "Request eligible receipt";
  }

  return "Use support policy";
}

function MarkerRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
      <span className="text-xs text-[var(--cg-text-muted)]">{label}</span>
      <span className="text-xs font-semibold text-[var(--cg-text-soft)]">{value ? "Yes" : "No"}</span>
    </div>
  );
}

function FactCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-[var(--cg-text-muted)]">{label}</dt>
      <dd className="mt-0.5 text-xs font-semibold text-[var(--cg-text-soft)]">{value}</dd>
    </div>
  );
}

export default function UnsupportedEvidenceReviewBridgePage() {
  if (!isUnsupportedEvidenceReviewBridgeEnabled()) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#020814] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="border-b border-white/10 pb-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--cg-cyan)]">
            Synthetic non-live developer unsupported-evidence review
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white">
            Unsupported-evidence review bridge
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--cg-text-soft)]">
            This unlinked developer route renders literal synthetic unsupported-evidence review states only. It
            does not analyze uploads, does not run OCR or metadata processing, does not call the mapper or workflow
            boundary helper, and is disabled in production by default. No automated decision should be made from
            this bridge.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg border border-[rgba(24,183,255,0.28)] bg-[rgba(24,183,255,0.08)] px-3 py-1 text-xs font-medium text-[var(--cg-cyan)]">
              Local/dev only
            </span>
            <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-medium text-[var(--cg-text-soft)]">
              Synthetic review states only
            </span>
            <span className="rounded-lg border border-[rgba(251,191,36,0.28)] bg-[rgba(251,191,36,0.08)] px-3 py-1 text-xs font-medium text-[var(--cg-amber)]">
              Manual review only
            </span>
            <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-medium text-[var(--cg-text-soft)]">
              Runtime live: No
            </span>
          </div>
        </header>

        <section aria-labelledby="unsupported-review-cases-title" className="space-y-5">
          <div>
            <h2 id="unsupported-review-cases-title" className="text-lg font-semibold text-white">
              Synthetic stopped states
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--cg-text-muted)]">
              Each state is unsupported for automated receipt analysis, requires manual review before action, and
              should be read only as a developer bridge for future review-state QA.
            </p>
          </div>

          {unsupportedEvidenceReviewCases.map((reviewCase) => {
            const { review } = reviewCase;
            const headingId = `unsupported-review-${reviewCase.key}`;

            return (
              <article
                key={reviewCase.key}
                aria-labelledby={headingId}
                className="border border-white/10 bg-white/[0.025] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 id={headingId} className="text-base font-semibold text-white">
                      {reviewCase.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[var(--cg-text-muted)]">{reviewCase.caption}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-lg border px-3 py-1 text-xs font-semibold ${badgeClassFor(
                      reviewCase.badgeTone,
                    )}`}
                  >
                    {reviewCase.badgeLabel}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <FactCell label="Evidence type" value={review.evidenceTypeLabel} />
                  <FactCell label="Unsupported status" value={review.reviewStatus} />
                  <FactCell label="External verification" value={review.externalVerification} />
                  <FactCell label="Verification status" value={review.verificationStatus} />
                </dl>

                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="space-y-4">
                    <section aria-label={`${reviewCase.title} review summary`}>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                        Review summary
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-[var(--cg-text-soft)]">{review.supportRepSummary}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--cg-text-soft)]">
                        <span className="text-[var(--cg-text-muted)]">Customer-safe wording: </span>
                        {review.customerSafeWording}
                      </p>
                    </section>

                    <section aria-label={`${reviewCase.title} manual review guidance`}>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                        Manual review guidance
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {review.manualReviewGuidance.map((guidance) => (
                          <li
                            key={guidance}
                            className="border border-white/10 bg-white/[0.03] px-3 py-2 text-sm leading-6 text-[var(--cg-text-soft)]"
                          >
                            {guidance}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section aria-label={`${reviewCase.title} blocked output reasons`}>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                        Blocked output reasons
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {review.blockedOutputReasons.map((reason) => (
                          <li
                            key={reason}
                            className="border border-white/10 bg-white/[0.03] px-3 py-2 text-sm leading-6 text-[var(--cg-text-soft)]"
                          >
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <aside className="space-y-4 border border-white/10 bg-[#06111f] p-4">
                    <section aria-label={`${reviewCase.title} confidence treatment`}>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                        Confidence and uncertainty
                      </h4>
                      <p className="mt-2 text-sm font-semibold text-white">{review.confidenceTreatment.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--cg-text-soft)]">
                        {review.confidenceTreatment.summary}
                      </p>
                      <p className="mt-2 rounded-md border border-[rgba(251,191,36,0.28)] bg-[rgba(251,191,36,0.08)] px-3 py-2 text-xs leading-5 text-[var(--cg-amber)]">
                        {review.confidenceTreatment.scoreBoundaryNotice}
                      </p>
                    </section>

                    <section aria-label={`${reviewCase.title} allowed next actions`}>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                        Allowed next actions
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {review.allowedNextActions.map((action) => (
                          <span
                            key={action}
                            className="rounded-lg border border-[rgba(24,183,255,0.24)] bg-[rgba(24,183,255,0.07)] px-3 py-1 text-xs font-medium text-[var(--cg-cyan)]"
                          >
                            {actionLabel(action)}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section aria-label={`${reviewCase.title} internal notes`}>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                        Internal review notes
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {review.internalNotes.map((note) => (
                          <li key={note} className="text-xs leading-5 text-[var(--cg-text-soft)]">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section aria-label={`${reviewCase.title} no-live markers`}>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                        No-live isolation markers
                      </h4>
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        <MarkerRow label="Runtime live" value={review.runtimeLive} />
                        <MarkerRow label="Product-photo runtime live" value={review.productPhotoRuntimeLive} />
                        <MarkerRow label="Manual review only" value={review.manualReviewOnly} />
                        <MarkerRow label="OCR invoked" value={review.ocrInvoked} />
                        <MarkerRow label="Metadata processing invoked" value={review.metadataInvoked} />
                        <MarkerRow label="Analyzer invoked" value={review.analyzerInvoked} />
                        <MarkerRow label="Live report adapter invoked" value={review.liveReportAdapterInvoked} />
                        <MarkerRow
                          label="UI / upload / report / scoring / parser / fixture invoked"
                          value={review.uiUploadReportScoringParserFixturePathsInvoked}
                        />
                        <MarkerRow
                          label="Providers / storage / integrations / case queues invoked"
                          value={review.providersStorageIntegrationsCaseQueuesInvoked}
                        />
                        <MarkerRow label="Product-photo panel routed" value={review.productPhotoReviewPanelRouted} />
                      </div>
                    </section>
                  </aside>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
