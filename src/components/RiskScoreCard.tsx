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
  Low: "bg-[#E9FFF0] text-[#0B5F2A] ring-[#41D66F]/40",
  Medium: "bg-[#F7FBFF] text-[#066B8F] ring-[#19D3F3]/45",
  High: "bg-[#FFF1F2] text-[#9F1239] ring-[#FECDD3]",
};

const riskCopy: Record<RiskLevel, string> = {
  Low: "No high-risk signals were generated in this mock review.",
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
    <section className="cg-panel rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Authenticity score</p>
          <h2 className="mt-1 text-lg font-semibold text-[#061426]">Evidence review</h2>
        </div>
        <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${riskStyles[riskLevel]}`}>
          {isPending ? "Awaiting report" : `${riskLevel} risk`}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative size-28 shrink-0">
          <svg className="size-28 -rotate-90" viewBox="0 0 104 104" role="img" aria-label={`Authenticity score ${score} of 100`}>
            <circle cx="52" cy="52" r="44" fill="none" stroke="#E4F0F7" strokeWidth="10" />
            <circle
              cx="52"
              cy="52"
              r="44"
              fill="none"
              stroke={isPending ? "#E4F0F7" : "#08AEEA"}
              strokeLinecap="round"
              strokeWidth="10"
              strokeDasharray={`${progress} ${circumference - progress}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#061426]">{isPending ? "--" : score}</span>
            <span className="text-xs font-medium text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#00A7A5]">
            <ShieldAlert className="size-4" aria-hidden="true" />
            {isPending ? "Upload evidence to begin" : reviewLabel}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isPending
              ? "The authenticity score will update after the local mock analysis completes."
              : summary}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3 border-t border-[#E4F0F7] pt-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">How to read it</p>
          <p className="mt-1 text-sm leading-5 text-slate-700">
            Higher scores mean fewer mock review signals, not a guarantee of authenticity.
          </p>
        </div>
        <div className="rounded-lg bg-[#F8FCFF] p-3 ring-1 ring-[#E4F0F7]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rep guidance</p>
          <p className="mt-1 text-sm leading-5 text-slate-700">
            {isPending ? "Run the mock analysis to see the recommended review path." : riskCopy[riskLevel]}
          </p>
        </div>
      </div>
    </section>
  );
}
