import { AppSidebar } from "@/components/AppSidebar";
import { ClaimReviewWorkflow } from "@/components/ClaimReviewWorkflow";
import { statusCards } from "@/lib/claim-data";

export default function Home() {
  return (
    <main className="min-h-screen p-3 text-[#061426] sm:p-4 lg:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1520px] flex-col overflow-hidden rounded-xl border border-white/70 bg-white/90 shadow-[0_24px_70px_rgba(6,20,38,0.12)] lg:flex-row">
        <div className="lg:shrink-0">
          <AppSidebar />
        </div>

        <div className="flex-1 overflow-hidden bg-[#F6FAFD]">
          <header className="border-b border-[#E4F0F7] bg-white/92 px-5 py-4 lg:px-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#008F91]">
                  Claim review workspace
                </p>
                <h1 className="mt-1 text-[1.7rem] font-semibold leading-tight text-[#061426]">
                  Warranty evidence review
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                  Mock authenticity signals, policy checks, and customer-safe response guidance for
                  iSpring warranty claims.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 xl:w-[420px]">
                {statusCards.map((card) => (
                  <div className="rounded-lg border border-[#E4F0F7] bg-[#FBFDFF] px-3 py-2 shadow-[0_8px_22px_rgba(6,20,38,0.035)]" key={card.label}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-500">{card.label}</p>
                      <card.icon className="size-3.5 text-[#08AEEA]" aria-hidden="true" />
                    </div>
                    <p className="mt-1 text-lg font-semibold leading-none text-[#061426]">{card.value}</p>
                    <p className="mt-1 text-xs font-medium text-[#008F91]">{card.trend}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <ClaimReviewWorkflow />
        </div>
      </div>
    </main>
  );
}
