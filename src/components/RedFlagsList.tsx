import { AlertCircle } from "lucide-react";
import type { AnalysisStatus, RedFlag } from "@/lib/claim-data";

type RedFlagsListProps = {
  flags: RedFlag[];
  status?: AnalysisStatus;
};

export function RedFlagsList({ flags, status = "complete" }: RedFlagsListProps) {
  const isPending = status !== "complete";

  return (
    <section className="cg-panel rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#061426]">Review signals</h2>
          <p className="mt-1 text-xs text-slate-500">Signals guide manual review, not conclusions.</p>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {isPending ? "Pending" : `${flags.length} signals`}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {isPending ? (
          <div className="rounded-lg border border-dashed border-[#D5E8F3] bg-[#F8FCFF] p-4 text-sm leading-6 text-slate-600">
            Risk signals will appear here after the mock analysis completes.
          </div>
        ) : null}

        {!isPending &&
          flags.map((flag) => (
            <article className="rounded-lg border border-[#E4F0F7] bg-white p-3" key={flag.label}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-[#FFF8EA] text-amber-700 ring-1 ring-amber-200">
                  <AlertCircle className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{flag.label}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{flag.detail}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">{flag.confidence}</p>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
