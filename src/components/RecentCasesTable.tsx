import type { CaseRecord, RiskLevel } from "@/lib/claim-data";

type RecentCasesTableProps = {
  cases: CaseRecord[];
  activeCaseId?: string;
  newlyAnalyzedCaseId?: string;
  onCaseSelect: (caseId: string) => void;
};

const riskClass: Record<RiskLevel, string> = {
  Low: "cg-risk-low",
  Medium: "cg-risk-medium",
  High: "cg-risk-high",
};

export function RecentCasesTable({
  cases,
  activeCaseId,
  newlyAnalyzedCaseId,
  onCaseSelect,
}: RecentCasesTableProps) {
  return (
    <section className="cg-command-panel rounded-[1.15rem] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cg-cyan)]">Review queue</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Evidence queue</h2>
        </div>
        <button
          className="rounded-lg border border-[var(--cg-border)] px-3 py-2 text-sm font-semibold text-[var(--cg-text-soft)] hover:border-[var(--cg-border-strong)] hover:text-white"
          type="button"
        >
          View all
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-[0.16em] text-[var(--cg-text-muted)]">
              <th className="border-b border-white/10 pb-3 font-semibold">Case</th>
              <th className="border-b border-white/10 pb-3 font-semibold">Customer</th>
              <th className="border-b border-white/10 pb-3 font-semibold">Item</th>
              <th className="border-b border-white/10 pb-3 font-semibold">Review state</th>
              <th className="border-b border-white/10 pb-3 font-semibold">Score</th>
              <th className="border-b border-white/10 pb-3 font-semibold">Queue</th>
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
                  className={`cursor-pointer text-[var(--cg-text-soft)] outline-none transition hover:bg-white/[0.055] focus:bg-white/[0.055] ${
                    isActive ? "bg-[rgba(24,183,255,0.12)] shadow-[inset_4px_0_0_var(--cg-cyan)]" : ""
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
                  <td className="border-b border-white/8 py-3.5 pl-2">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-white">{claim.id}</p>
                      {isActive ? (
                        <span className="rounded-md border border-[var(--cg-border-strong)] bg-[rgba(24,183,255,0.12)] px-2 py-0.5 text-[11px] font-semibold text-[var(--cg-cyan)]">
                          Selected
                        </span>
                      ) : null}
                      {!isActive && isNewAnalysis ? (
                        <span className="rounded-md border border-[rgba(74,222,128,0.38)] bg-[rgba(74,222,128,0.12)] px-2 py-0.5 text-[11px] font-semibold text-[var(--cg-green)]">
                          New
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-[var(--cg-text-muted)]">{claim.submittedAt}</p>
                  </td>
                  <td className="border-b border-white/8 py-3.5">{claim.customer}</td>
                  <td className="border-b border-white/8 py-3.5">
                    <p className="text-white/92">{claim.item}</p>
                    {claim.evidence ? <p className="text-xs text-[var(--cg-text-muted)]">{claim.evidence}</p> : null}
                  </td>
                  <td className="border-b border-white/8 py-3.5">
                    <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${riskClass[claim.risk]}`}>
                      {claim.risk === "Low" ? "Low Concern" : claim.risk === "Medium" ? "Review Suggested" : "Manual Review"}
                    </span>
                  </td>
                  <td className="border-b border-white/8 py-3.5 font-mono text-white">{claim.score}</td>
                  <td className="border-b border-white/8 py-3.5 pr-2">
                    <p className="font-medium text-white">{claim.reviewQueue}</p>
                    <p className="text-xs text-[var(--cg-text-muted)]">{claim.assignedReviewer} | {claim.channel}</p>
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
