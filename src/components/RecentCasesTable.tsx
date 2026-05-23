import type { CaseRecord, RiskLevel } from "@/lib/claim-data";

type RecentCasesTableProps = {
  cases: CaseRecord[];
  activeCaseId?: string;
  newlyAnalyzedCaseId?: string;
  onCaseSelect: (caseId: string) => void;
};

const riskClass: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Medium: "bg-sky-50 text-sky-700 ring-sky-100",
  High: "bg-rose-50 text-rose-700 ring-rose-100",
};

export function RecentCasesTable({
  cases,
  activeCaseId,
  newlyAnalyzedCaseId,
  onCaseSelect,
}: RecentCasesTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Queue</p>
          <h2 className="mt-1 text-lg font-semibold text-[#0b1f3a]">Recent cases</h2>
        </div>
        <button
          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
              const isNewAnalysis = claim.id === newlyAnalyzedCaseId;

              return (
                <tr
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`Open case ${claim.id}`}
                  className={`cursor-pointer text-slate-700 outline-none transition hover:bg-slate-50 focus:bg-slate-50 ${
                    isActive ? "bg-sky-50/80 ring-1 ring-inset ring-sky-200" : ""
                  }`}
                  key={claim.id}
                  onClick={() => onCaseSelect(claim.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onCaseSelect(claim.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <td className="border-b border-slate-100 py-3.5 pl-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{claim.id}</p>
                      {isActive ? (
                        <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-200">
                          Selected
                        </span>
                      ) : null}
                      {!isActive && isNewAnalysis ? (
                        <span className="rounded-md bg-[#e7f7ef] px-2 py-0.5 text-[11px] font-semibold text-[#0f766e]">
                          New
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-500">{claim.submittedAt}</p>
                  </td>
                  <td className="border-b border-slate-100 py-3.5">{claim.customer}</td>
                  <td className="border-b border-slate-100 py-3.5">
                    <p>{claim.item}</p>
                    {claim.evidence ? <p className="text-xs text-slate-500">{claim.evidence}</p> : null}
                  </td>
                  <td className="border-b border-slate-100 py-3.5">
                    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${riskClass[claim.risk]}`}>
                      {claim.risk}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 py-3.5 font-mono text-slate-900">{claim.score}</td>
                  <td className="border-b border-slate-100 py-3.5 pr-2">
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
