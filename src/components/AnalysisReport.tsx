import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gauge,
  ImageIcon,
  Info,
  ListChecks,
  MessageSquareText,
  ShieldQuestion,
  TicketCheck,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AnalysisStatus, MockAnalysisReport, RiskSignalGroup } from "@/lib/claim-data";

type AnalysisReportProps = {
  report: MockAnalysisReport;
  status: AnalysisStatus;
};

export function AnalysisReport({ report, status }: AnalysisReportProps) {
  const isComplete = status === "complete";
  const checkStyles = {
    Clear: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Review: "bg-sky-50 text-sky-700 ring-sky-200",
    Inconclusive: "bg-amber-50 text-amber-700 ring-amber-200",
  };
  const signalStyles = {
    "Manual review recommended": "bg-amber-50 text-amber-700 ring-amber-200",
    Inconclusive: "bg-sky-50 text-sky-700 ring-sky-200",
    "Low confidence": "bg-slate-100 text-slate-600 ring-slate-200",
    "No material signal": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
  const categoryIcons: Record<RiskSignalGroup["category"], LucideIcon> = {
    "Receipt/document formatting": FileText,
    "Image/photo integrity": ImageIcon,
    "Customer/ticket pattern": UserRound,
    "Missing verification data": ClipboardCheck,
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mock report</p>
          <h2 className="mt-1 text-lg font-semibold text-[#0b1f3a]">Evidence summary</h2>
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {isComplete ? report.reviewLabel : status === "analyzing" ? "Analyzing" : "Awaiting evidence"}
        </span>
      </div>

      {!isComplete ? (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full bg-sky-500 ${status === "analyzing" ? "w-2/3 animate-pulse" : "w-1/4"}`}
            />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-900">
            {status === "analyzing" ? "Building mock authenticity report" : "No completed report yet"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {status === "analyzing"
              ? "Checking evidence clarity, purchase context, and manual review signals."
              : "Upload evidence and run a mock analysis to generate a support-safe report."}
          </p>
        </div>
      ) : null}

      {isComplete ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary finding</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{report.primaryFinding}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This is a mock report for support prioritization. It is not a final decision about the
              customer or claim.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <article className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Gauge className="size-4 text-sky-700" aria-hidden="true" />
                Authenticity score
              </div>
              <p className="mt-2 text-2xl font-bold text-[#0b1f3a]">{report.score}</p>
              <p className="text-xs font-medium text-slate-500">out of 100</p>
              <p className="mt-2 text-sm leading-5 text-slate-600">{report.scoreExplanation}</p>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ShieldQuestion className="size-4 text-[#0f766e]" aria-hidden="true" />
                Confidence level
              </div>
              <p className="mt-2 text-lg font-semibold text-[#0b1f3a]">{report.confidenceLevel}</p>
              <p className="mt-2 text-sm leading-5 text-slate-600">
                Confidence reflects how complete the submitted evidence is for manual support review.
              </p>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <AlertTriangle className="size-4 text-amber-600" aria-hidden="true" />
                Risk level
              </div>
              <p className="mt-2 text-lg font-semibold text-[#0b1f3a]">{report.riskLevel} risk</p>
              <p className="mt-2 text-sm leading-5 text-slate-600">
                Use the level to prioritize review effort, not to accuse or automatically resolve the claim.
              </p>
            </article>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 size-5 shrink-0 text-slate-500" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Risk signal, not proof</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{report.signalVsProof}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 p-4">
          <ShieldQuestion className="size-5 text-sky-700" aria-hidden="true" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900">Evidence summary</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isComplete
              ? report.summary
              : "The report will summarize visible evidence and verification needs after analysis."}
          </p>
        </article>

        <article className="rounded-lg border border-slate-200 p-4">
          <CheckCircle2 className="size-5 text-[#0f766e]" aria-hidden="true" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900">Suggested support action</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isComplete
              ? report.suggestedAction
              : "Suggested support action will appear once the mock report is complete."}
          </p>
        </article>

        <article className="rounded-lg border border-slate-200 p-4">
          <MessageSquareText className="size-5 text-sky-700" aria-hidden="true" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900">Customer-safe response suggestion</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isComplete
              ? report.customerSafeWording
              : "Customer-facing wording will avoid accusations and focus on verification steps."}
          </p>
        </article>
      </div>

      {isComplete ? (
        <div className="mt-4 space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-900">Risk signals by category</h3>
              <p className="mt-1 text-xs text-slate-500">
                Each category is a prompt for manual review, not a final claim determination.
              </p>
            </div>
            <div className="grid gap-3 p-4 xl:grid-cols-2">
              {report.riskSignalGroups.map((group) => {
                const CategoryIcon = categoryIcons[group.category];

                return (
                  <article className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={group.category}>
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-sky-700 ring-1 ring-slate-200">
                        <CategoryIcon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-950">{group.category}</h4>
                        <p className="mt-1 text-sm leading-5 text-slate-600">{group.summary}</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-3">
                      {group.signals.map((signal) => (
                        <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200" key={signal.label}>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <p className="text-sm font-semibold text-slate-900">{signal.label}</p>
                            <span
                              className={`w-fit shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${
                                signalStyles[signal.confidence]
                              }`}
                            >
                              {signal.confidence}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-5 text-slate-600">{signal.detail}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <ListChecks className="size-4 text-[#0f766e]" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">What to verify next</h3>
              </div>
            </div>
            <div className="grid gap-3 p-4 md:grid-cols-3">
              {report.whatToVerifyNext.map((item) => (
                <div className="flex gap-3 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200" key={item}>
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                  <p className="text-sm leading-5 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <TicketCheck className="size-4 text-sky-700" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">Verification checks</h3>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {report.verificationChecks.map((check) => (
                <div className="grid gap-3 px-4 py-3 sm:grid-cols-[180px_110px_1fr]" key={check.label}>
                  <p className="text-sm font-semibold text-slate-900">{check.label}</p>
                  <span
                    className={`w-fit rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${checkStyles[check.result]}`}
                  >
                    {check.result}
                  </span>
                  <p className="text-sm leading-5 text-slate-600">{check.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-900">Manual review support only:</span> This mock
            analysis is designed to help support reps prioritize verification steps. It does not confirm
            authenticity, determine customer intent, or replace policy-based human review.
          </div>
        </div>
      ) : null}
    </section>
  );
}
