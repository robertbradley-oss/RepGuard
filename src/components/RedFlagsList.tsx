import { AlertCircle } from "lucide-react";
import type { AnalysisStatus, RedFlag } from "@/lib/claim-data";

type RedFlagsListProps = {
  flags: RedFlag[];
  status?: AnalysisStatus;
};

export function RedFlagsList({ flags, status = "complete" }: RedFlagsListProps) {
  const isPending = status !== "complete";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0b1f3a]">Review signals</h2>
          <p className="mt-1 text-xs text-slate-500">Signals guide manual review, not conclusions.</p>
        </div>
        <span className="text-sm font-medium text-slate-500">
          {isPending ? "Pending" : `${flags.length} signals`}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {isPending ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Risk signals will appear here after the mock analysis completes.
          </div>
        ) : null}

        {!isPending &&
          flags.map((flag) => (
            <article className="rounded-lg border border-slate-200 bg-slate-50 p-4" key={flag.label}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                  <AlertCircle className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{flag.label}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{flag.detail}</p>
                  <p className="mt-2 text-xs font-semibold text-[#0f766e]">{flag.confidence}</p>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
