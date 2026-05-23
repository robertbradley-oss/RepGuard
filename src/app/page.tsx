import { AnalysisReport } from "@/components/AnalysisReport";
import { AppSidebar } from "@/components/AppSidebar";
import { RecentCasesTable } from "@/components/RecentCasesTable";
import { RedFlagsList } from "@/components/RedFlagsList";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { TicketPreview } from "@/components/TicketPreview";
import { UploadPanel } from "@/components/UploadPanel";
import { recentCases, redFlags, statusCards } from "@/lib/claim-data";

export default function Home() {
  return (
    <main className="min-h-screen p-3 text-[#0b1f3a] sm:p-4 lg:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1520px] flex-col overflow-hidden rounded-lg border border-white/20 bg-white/70 shadow-2xl shadow-slate-950/15 backdrop-blur lg:flex-row">
        <div className="lg:shrink-0">
          <AppSidebar />
        </div>

        <div className="flex-1 overflow-hidden bg-[#f5f8fb]">
          <header className="border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#0f766e]">
                  Claim review workspace
                </p>
                <h1 className="mt-1 text-2xl font-bold text-[#0b1f3a] sm:text-3xl">
                  Screen receipts and damage evidence safely
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Prioritize warranty and support claims with mock authenticity signals,
                  customer-safe wording, and clear manual review guidance.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:w-[520px]">
                {statusCards.map((card) => (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={card.label}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-500">{card.label}</p>
                      <card.icon className="size-4 text-sky-700" aria-hidden="true" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-[#0b1f3a]">{card.value}</p>
                    <p className="text-xs font-medium text-[#0f766e]">{card.trend}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:p-8">
            <div className="space-y-5">
              <UploadPanel />
              <TicketPreview />
              <AnalysisReport />
              <RecentCasesTable cases={recentCases} />
            </div>

            <aside className="space-y-5">
              <RiskScoreCard score={68} riskLevel="Medium" />
              <RedFlagsList flags={redFlags} />

              <section className="rounded-lg border border-[#b7e7d0] bg-[#e7f7ef] p-5">
                <h2 className="text-lg font-semibold text-[#064e3b]">Review guardrails</h2>
                <div className="mt-4 space-y-3 text-sm leading-6 text-[#065f46]">
                  <p>Use “Potential alteration detected” only as a review signal.</p>
                  <p>Prefer “Manual review recommended” when evidence is mixed.</p>
                  <p>Use “Inconclusive” or “Low confidence” when a signal is not reliable.</p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
