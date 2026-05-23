import type { CaseRecord, RiskLevel } from "@/lib/claim-data";

type RecentCasesTableProps = {
  cases: CaseRecord[];
  activeCaseId?: string;
};

const riskClass: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-sky-50 text-sky-700",
  High: "bg-rose-50 text-rose-700",
};

export function RecentCasesTable({ cases, activeCaseId }: RecentCasesTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">Queue</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0b1f3a]">Recent cases</h2>
        </div>
        <button
          className="rounded-md bg-[#0b1f3a] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#102b50]"
          type="button"
        >
          View all
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="border-b border-slate-200 pb-3 font-semibold">Case</th>
              <th className="border-b border-slate-200 pb-3 font-semibold">Customer</th>
              <th className="border-b border-slate-200 pb-3 font-semibold">Item</th>
              <th className="border-b border-slate-200 pb-3 font-semibold">Risk</th>
              <th className="border-b border-slate-200 pb-3 font-semibold">Score</th>
              <th className="border-b border-slate-200 pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((claim) => {
              const isActive = claim.id === activeCaseId;

              return (
                <tr className={`${isActive ? "bg-sky-50/70" : ""} text-slate-700`} key={claim.id}>
                  <td className="border-b border-slate-100 py-4">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{claim.id}</p>
                      {isActive ? (
                        <span className="rounded-full bg-[#e7f7ef] px-2 py-0.5 text-[11px] font-semibold text-[#0f766e]">
                          New analysis
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-500">{claim.submittedAt}</p>
                  </td>
                  <td className="border-b border-slate-100 py-4">{claim.customer}</td>
                  <td className="border-b border-slate-100 py-4">
                    <p>{claim.item}</p>
                    {claim.evidence ? <p className="text-xs text-slate-500">{claim.evidence}</p> : null}
                  </td>
                  <td className="border-b border-slate-100 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskClass[claim.risk]}`}>
                      {claim.risk}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 py-4 font-mono text-slate-900">{claim.score}</td>
                  <td className="border-b border-slate-100 py-4">
                    <p className="font-medium text-slate-900">{claim.status}</p>
                    <p className="text-xs text-slate-500">{claim.channel}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
