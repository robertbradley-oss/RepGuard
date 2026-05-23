import { ShieldAlert } from "lucide-react";
import type { AnalysisStatus, RiskLevel } from "@/lib/claim-data";

type RiskScoreCardProps = {
  score: number;
  riskLevel: RiskLevel;
  status?: AnalysisStatus;
  reviewLabel?: string;
  summary?: string;
};

const riskStyles: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-sky-50 text-sky-700 ring-sky-200",
  High: "bg-rose-50 text-rose-700 ring-rose-200",
};

const riskCopy: Record<RiskLevel, string> = {
  Low: "Evidence appears ready for normal policy verification.",
  Medium: "Evidence has review signals that should be checked before resolution.",
  High: "Evidence needs a careful manual review before the rep decides next steps.",
};

export function RiskScoreCard({
  score,
  riskLevel,
  status = "complete",
  reviewLabel = "Manual review recommended",
  summary = "The mock screening found mixed signals. Treat this as a prioritization cue, not a determination about the customer or the claim.",
}: RiskScoreCardProps) {
  const circumference = 2 * Math.PI * 44;
  const progress = (score / 100) * circumference;
  const isPending = status !== "complete";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">Authenticity score</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0b1f3a]">Evidence review</h2>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ring-1 ${riskStyles[riskLevel]}`}>
          {isPending ? "Awaiting report" : `${riskLevel} risk`}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative size-32 shrink-0">
          <svg className="size-32 -rotate-90" viewBox="0 0 104 104" role="img" aria-label={`Authenticity score ${score} of 100`}>
            <circle cx="52" cy="52" r="44" fill="none" stroke="#e2e8f0" strokeWidth="10" />
            <circle
              cx="52"
              cy="52"
              r="44"
              fill="none"
              stroke={isPending ? "#cbd5e1" : "#0ea5e9"}
              strokeLinecap="round"
              strokeWidth="10"
              strokeDasharray={`${progress} ${circumference - progress}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-[#0b1f3a]">{isPending ? "--" : score}</span>
            <span className="text-xs font-medium text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0f766e]">
            <ShieldAlert className="size-4" aria-hidden="true" />
            {isPending ? "Upload evidence to begin" : reviewLabel}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {isPending
              ? "The authenticity score will update after the local mock analysis completes."
              : summary}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">How to read it</p>
          <p className="mt-1 text-sm leading-5 text-slate-700">
            Higher scores mean fewer mock review signals, not a guarantee of authenticity.
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rep guidance</p>
          <p className="mt-1 text-sm leading-5 text-slate-700">
            {isPending ? "Run the mock analysis to see the recommended review path." : riskCopy[riskLevel]}
          </p>
        </div>
      </div>
    </section>
  );
}
