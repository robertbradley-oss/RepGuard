import { ShieldAlert } from "lucide-react";
import type { RiskLevel } from "@/lib/claim-data";

type RiskScoreCardProps = {
  score: number;
  riskLevel: RiskLevel;
};

const riskStyles: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-sky-50 text-sky-700 ring-sky-200",
  High: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function RiskScoreCard({ score, riskLevel }: RiskScoreCardProps) {
  const circumference = 2 * Math.PI * 44;
  const progress = (score / 100) * circumference;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">Authenticity score</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0b1f3a]">Evidence review</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${riskStyles[riskLevel]}`}>
          {riskLevel} risk
        </span>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <div className="relative size-32 shrink-0">
          <svg className="size-32 -rotate-90" viewBox="0 0 104 104" role="img" aria-label={`Authenticity score ${score} of 100`}>
            <circle cx="52" cy="52" r="44" fill="none" stroke="#e2e8f0" strokeWidth="10" />
            <circle
              cx="52"
              cy="52"
              r="44"
              fill="none"
              stroke="#0ea5e9"
              strokeLinecap="round"
              strokeWidth="10"
              strokeDasharray={`${progress} ${circumference - progress}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-[#0b1f3a]">{score}</span>
            <span className="text-xs font-medium text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0f766e]">
            <ShieldAlert className="size-4" aria-hidden="true" />
            Manual review recommended
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The mock screening found mixed signals. Treat this as a prioritization cue, not a
            determination about the customer or the claim.
          </p>
        </div>
      </div>
    </section>
  );
}
