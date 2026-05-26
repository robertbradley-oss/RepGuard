import type { ProductPhotoReportViewModel } from "@/lib/analysis/product-photo-report-view-model";

type ProductPhotoReviewPanelProps = {
  viewModel: ProductPhotoReportViewModel;
};

const signalTone: Record<ProductPhotoReportViewModel["reviewSignals"][number]["severity"], string> = {
  Low: "border-[rgba(74,222,128,0.24)] text-[var(--cg-green)]",
  Medium: "border-[rgba(251,191,36,0.28)] text-[var(--cg-amber)]",
  High: "border-[rgba(251,113,133,0.32)] text-[var(--cg-red)]",
};

function StatBlock({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-[var(--cg-border)] bg-[#06101f]/62 p-3">
      <dt className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--cg-text-muted)]">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-white">{value}</dd>
      {detail ? <dd className="mt-1 text-xs leading-5 text-[var(--cg-text-muted)]">{detail}</dd> : null}
    </div>
  );
}

export function ProductPhotoReviewPanel({ viewModel }: ProductPhotoReviewPanelProps) {
  const requestedViews = viewModel.productContext.requestedAdditionalViews;
  const reviewSignals = viewModel.reviewSignals;

  return (
    <section
      aria-labelledby="product-photo-review-title"
      className="cg-forensic-panel overflow-hidden rounded-[1.35rem] border border-[var(--cg-border)] bg-[#06101f]/84"
    >
      <div className="border-b border-white/10 bg-[#0b1728]/82 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--cg-cyan)]">
              Product-photo evidence review
            </p>
            <h2 id="product-photo-review-title" className="mt-2 text-2xl font-semibold text-white">
              {viewModel.reviewTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--cg-text-soft)]">{viewModel.reviewSummary}</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="rounded-lg border border-[rgba(251,191,36,0.34)] bg-[rgba(251,191,36,0.08)] px-3 py-1 text-xs font-medium text-[var(--cg-amber)]">
              {viewModel.reviewStatus}
            </span>
            <span className="rounded-lg border border-[var(--cg-border-strong)] bg-[rgba(24,183,255,0.08)] px-3 py-1 text-xs font-medium text-[var(--cg-cyan)]">
              Local review only
            </span>
            <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-medium text-[var(--cg-text-soft)]">
              {viewModel.externalVerification.status}
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.025] p-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--cg-text-muted)]">
            External Verification: {viewModel.externalVerification.externalVerification}
          </p>
          <p className="mt-1 text-sm leading-5 text-[var(--cg-text-soft)]">
            {viewModel.externalVerification.summary}
          </p>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <section aria-labelledby="product-photo-review-snapshot">
          <h3 id="product-photo-review-snapshot" className="text-base font-semibold text-white">
            Review snapshot
          </h3>
          <dl className="mt-3 grid gap-3 md:grid-cols-3">
            <StatBlock
              detail="Review priority guides queue attention only."
              label="Review priority"
              value={viewModel.reviewPriority}
            />
            <StatBlock
              detail="Confidence describes completeness for local support review."
              label="Confidence"
              value={viewModel.confidence}
            />
            <StatBlock
              detail={viewModel.evidenceQuality.qualitySummary}
              label="Evidence quality"
              value={viewModel.evidenceQuality.qualityLevel}
            />
          </dl>

          <div className="mt-3 rounded-lg border border-[var(--cg-border)] bg-[#0b1728]/78 p-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(150px,0.32fr)_1fr] lg:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--cg-text-muted)]">
                  {viewModel.score.label}
                </p>
                <p className="mt-2 font-mono text-5xl font-medium leading-none tabular-nums text-white">
                  {viewModel.score.value}
                  <span className="ml-1 text-base text-[var(--cg-text-muted)]">/100</span>
                </p>
              </div>
              <div className="space-y-2 text-sm leading-6 text-[var(--cg-text-soft)]">
                <p>
                  <span className="font-medium text-white">Scope:</span> {viewModel.score.scope}
                </p>
                <p>{viewModel.score.meaning}</p>
                <p>{viewModel.score.safetyNote}</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="product-photo-context">
          <h3 id="product-photo-context" className="text-base font-semibold text-white">
            Product/photo context
          </h3>
          <dl className="mt-3 grid gap-3 lg:grid-cols-2">
            <StatBlock label="Subject type" value={viewModel.productContext.subjectType} />
            <StatBlock label="Product context" value={viewModel.productContext.productContextStatus} />
            <StatBlock
              label="Relevant-area visibility"
              value={viewModel.productContext.damageVisibilityReviewContext}
            />
            <StatBlock label="Label context" value={viewModel.productContext.labelContextSummary} />
            <StatBlock
              label="Receipt/order match"
              value={
                viewModel.productContext.purchaseOrOrderMatchNeeded
                  ? "Comparison may be needed"
                  : "No added match request"
              }
            />
            <div className="rounded-lg border border-[var(--cg-border)] bg-[#06101f]/62 p-3">
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--cg-text-muted)]">
                Requested additional views
              </dt>
              <dd className="mt-2">
                {requestedViews.length > 0 ? (
                  <ul className="space-y-2">
                    {requestedViews.map((view) => (
                      <li className="text-sm leading-5 text-white" key={view}>
                        {view}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-sm text-white">No additional view requested by this summary.</span>
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section
          aria-labelledby="product-photo-recommended-action"
          className="rounded-lg border border-[rgba(74,222,128,0.28)] bg-[rgba(74,222,128,0.08)] p-4"
        >
          <h3 id="product-photo-recommended-action" className="text-base font-semibold text-white">
            Recommended support action
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--cg-text-soft)]">
            {viewModel.recommendedSupportAction}
          </p>
        </section>

        <section aria-labelledby="product-photo-limitations">
          <h3 id="product-photo-limitations" className="text-base font-semibold text-white">
            Limitations
          </h3>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {viewModel.limitations.map((limitation) => (
              <li
                className="rounded-lg border border-white/10 bg-white/[0.025] p-3 text-sm leading-5 text-[var(--cg-text-soft)]"
                key={limitation}
              >
                {limitation}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="product-photo-review-signals">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 id="product-photo-review-signals" className="text-base font-semibold text-white">
                Review signals
              </h3>
              <p className="mt-1 text-sm leading-5 text-[var(--cg-text-muted)]">
                Signals support manual review priority and do not complete support handling by themselves.
              </p>
            </div>
            <span className="w-fit rounded-lg border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-medium text-[var(--cg-text-soft)]">
              {reviewSignals.length} signal{reviewSignals.length === 1 ? "" : "s"}
            </span>
          </div>

          {reviewSignals.length > 0 ? (
            <ol className="mt-3 space-y-3">
              {reviewSignals.map((signal) => (
                <li className="rounded-lg border border-[var(--cg-border)] bg-[#0b1728]/78 p-4" key={signal.label}>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{signal.label}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--cg-text-muted)]">
                        {signal.category}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${signalTone[signal.severity]}`}
                      >
                        Severity: {signal.severity}
                      </span>
                      <span className="rounded-lg border border-white/10 bg-white/[0.035] px-2.5 py-1 text-xs font-medium text-[var(--cg-text-soft)]">
                        Confidence: {signal.confidencePercent}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <p className="text-sm leading-6 text-[var(--cg-text-soft)]">
                      <span className="font-medium text-white">Review note:</span> {signal.reviewNote}
                    </p>
                    <p className="text-sm leading-6 text-[var(--cg-text-soft)]">
                      <span className="font-medium text-white">Recommended review step:</span>{" "}
                      {signal.recommendedReviewStep}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 rounded-lg border border-white/10 bg-white/[0.025] p-4 text-sm leading-6 text-[var(--cg-text-soft)]">
              No additional review signal is included in this derived summary.
            </p>
          )}
        </section>

        <section
          aria-labelledby="product-photo-privacy-posture"
          className="rounded-lg border border-[var(--cg-border)] bg-[#06101f]/62 p-4"
        >
          <h3 id="product-photo-privacy-posture" className="text-base font-semibold text-white">
            Privacy posture
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--cg-text-soft)]">
            Derived summaries only. Source material, private metadata detail, original naming, label values,
            external payloads, retained handles, and workflow identifiers stay outside this panel.
          </p>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--cg-text-muted)]">
            Derived summary only: {viewModel.privacy.derivedSummaryOnly ? "Yes" : "No"}
          </p>
        </section>
      </div>
    </section>
  );
}
