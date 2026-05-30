import { notFound } from "next/navigation";

import type { ProductPhotoAdapterReadinessResult } from "@/lib/analysis/product-photo-routing-adapter";

import { productPhotoAdapterReadinessReviewCases } from "./render-cases";

function isAdapterReadinessHostEnabled() {
  return process.env.NODE_ENV !== "production";
}

type ReadinessPresentation = {
  label: string;
  badgeClass: string;
};

function readinessPresentation(result: ProductPhotoAdapterReadinessResult): ReadinessPresentation {
  if (result.readinessAccepted) {
    return {
      label: "Readiness accepted",
      badgeClass: "border-[rgba(52,211,153,0.32)] bg-[rgba(52,211,153,0.10)] text-[#34d399]",
    };
  }

  if (result.inputKind === "legacy-quarantine") {
    return {
      label: "Legacy quarantine",
      badgeClass: "border-[rgba(244,63,94,0.34)] bg-[rgba(244,63,94,0.10)] text-[#fb7185]",
    };
  }

  if (result.inputKind === "unsupported") {
    return {
      label: "Unsupported collapse",
      badgeClass: "border-[rgba(251,191,36,0.32)] bg-[rgba(251,191,36,0.10)] text-[var(--cg-amber)]",
    };
  }

  return {
    label: "Not accepted",
    badgeClass: "border-white/15 bg-white/[0.05] text-[var(--cg-text-soft)]",
  };
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

export default function ProductPhotoAdapterReadinessHostPage() {
  if (!isAdapterReadinessHostEnabled()) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#020814] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="border-b border-white/10 pb-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--cg-cyan)]">
            Synthetic non-live developer adapter readiness review
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white">
            Product-photo adapter readiness review host
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--cg-text-soft)]">
            This unlinked developer route renders literal synthetic product-photo adapter readiness results only. It
            does not analyze uploads, does not run OCR or metadata processing, does not display photos or files,
            does not call the readiness builder, and is disabled in production by default. Adapter readiness is
            decision-only and is not wired into the live receipt analyzer.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg border border-[rgba(24,183,255,0.28)] bg-[rgba(24,183,255,0.08)] px-3 py-1 text-xs font-medium text-[var(--cg-cyan)]">
              Local/dev only
            </span>
            <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-medium text-[var(--cg-text-soft)]">
              Synthetic readiness only
            </span>
            <span className="rounded-lg border border-[rgba(251,191,36,0.28)] bg-[rgba(251,191,36,0.08)] px-3 py-1 text-xs font-medium text-[var(--cg-amber)]">
              Manual review only
            </span>
            <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-medium text-[var(--cg-text-soft)]">
              Runtime live: No
            </span>
          </div>
        </header>

        <section aria-labelledby="adapter-host-cases-title" className="space-y-5">
          <div>
            <h2 id="adapter-host-cases-title" className="text-lg font-semibold text-white">
              Synthetic adapter readiness states
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--cg-text-muted)]">
              Accepted, legacy quarantine, and unsupported collapse states are shown as distinct outcomes without
              files, uploads, raw metadata, identifiers, external payloads, or retained handles.
            </p>
          </div>

          {productPhotoAdapterReadinessReviewCases.map((reviewCase) => {
            const { result } = reviewCase;
            const presentation = readinessPresentation(result);
            const headingId = `adapter-case-${reviewCase.key}`;

            return (
              <article
                key={reviewCase.key}
                aria-labelledby={headingId}
                className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 id={headingId} className="text-base font-semibold text-white">
                      {reviewCase.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[var(--cg-text-muted)]">{reviewCase.caption}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-lg border px-3 py-1 text-xs font-semibold ${presentation.badgeClass}`}
                  >
                    {presentation.label}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <FactCell label="Readiness accepted" value={result.readinessAccepted ? "Yes" : "No"} />
                  <FactCell label="Input kind" value={result.inputKind} />
                  <FactCell label="Evidence type" value={result.evidenceType} />
                  <FactCell label="Source kind" value={result.sourceKind} />
                  <FactCell label="Confidence" value={result.confidence} />
                  <FactCell label="Review priority" value={result.reviewPriority} />
                  <FactCell label="Local signal level" value={result.localSignalLevel} />
                  <FactCell
                    label="Score"
                    value={`${result.score.value} (${result.score.scope})`}
                  />
                  <FactCell label="Posture" value="Runtime live: No · Manual review only: Yes" />
                </dl>

                <div className="mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                    Review summary
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-[var(--cg-text-soft)]">{result.reviewSummary}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--cg-text-soft)]">
                    <span className="text-[var(--cg-text-muted)]">Recommended support action: </span>
                    {result.recommendedSupportAction}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--cg-text-soft)]">
                    <span className="text-[var(--cg-text-muted)]">Customer-safe wording: </span>
                    {result.customerSafeWording}
                  </p>
                </div>

                {result.legacyCompatibility ? (
                  <div className="mt-4 rounded-md border border-[rgba(244,63,94,0.28)] bg-[rgba(244,63,94,0.06)] px-3 py-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[#fb7185]">
                      Legacy compatibility
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-[var(--cg-text-soft)]">
                      Alias {result.legacyCompatibility.alias} · canonical{" "}
                      {result.legacyCompatibility.canonicalEvidenceType} · quarantined{" "}
                      {result.legacyCompatibility.quarantined ? "Yes" : "No"} · runtime candidate{" "}
                      {result.legacyCompatibility.runtimeCandidate ? "Yes" : "No"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--cg-text-muted)]">
                      {result.legacyCompatibility.note}
                    </p>
                  </div>
                ) : null}

                {result.signals.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                      Review signals
                    </h4>
                    <ul className="mt-2 space-y-2">
                      {result.signals.map((signal) => (
                        <li
                          key={signal.label}
                          className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2"
                        >
                          <p className="text-sm font-semibold text-[var(--cg-text-soft)]">{signal.label}</p>
                          <p className="mt-0.5 text-xs text-[var(--cg-text-muted)]">
                            {signal.category} · severity {signal.severity} · confidence {signal.confidencePercent}%
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[var(--cg-text-soft)]">{signal.reviewNote}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                    No-live isolation markers
                  </h4>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <MarkerRow label="Runtime live" value={result.runtimeLive} />
                    <MarkerRow label="Local analysis result required" value={result.isolation.localAnalysisResultRequired} />
                    <MarkerRow label="Live receipt analyzer invoked" value={result.isolation.analyzeEvidenceFileInvoked} />
                    <MarkerRow label="Analyzer routing invoked" value={result.isolation.analyzerRoutingInvoked} />
                    <MarkerRow
                      label="UI / upload / report / scoring / parser / fixture invoked"
                      value={result.isolation.uiUploadReportScoringParserFixturePathsInvoked}
                    />
                    <MarkerRow
                      label="Providers / storage / integrations / case queues invoked"
                      value={result.isolation.providersStorageIntegrationsCaseQueuesInvoked}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                    Privacy posture
                  </h4>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <MarkerRow label="Derived summary only" value={result.privacy.derivedSummaryOnly} />
                    <MarkerRow label="Private source values omitted" value={result.privacy.privateSourceValuesOmitted} />
                    <MarkerRow label="Exact metadata omitted" value={result.privacy.exactMetadataOmitted} />
                    <MarkerRow label="External handles omitted" value={result.privacy.externalHandlesOmitted} />
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                    Limitations
                  </h4>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {result.limitations.map((limitation) => (
                      <li key={limitation} className="text-sm leading-6 text-[var(--cg-text-soft)]">
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
