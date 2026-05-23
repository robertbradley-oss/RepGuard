import { AppSidebar } from "@/components/AppSidebar";
import { ClaimReviewWorkflow } from "@/components/ClaimReviewWorkflow";
import { statusCards } from "@/lib/claim-data";

export default function Home() {
  return (
    <main className="min-h-screen p-3 text-[#0b1f3a] sm:p-4 lg:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1520px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white lg:flex-row">
        <div className="lg:shrink-0">
          <AppSidebar />
        </div>

        <div className="flex-1 overflow-hidden bg-[#f5f8fb]">
          <header className="border-b border-slate-200 bg-white px-5 py-4 lg:px-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0f766e]">
                  Claim review workspace
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-[#0b1f3a]">
                  Warranty evidence review
                </h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                  Review iSpring warranty evidence with mock authenticity signals, verification steps,
                  and customer-safe response guidance.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 xl:w-[430px]">
                {statusCards.map((card) => (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5" key={card.label}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-500">{card.label}</p>
                      <card.icon className="size-3.5 text-slate-500" aria-hidden="true" />
                    </div>
                    <p className="mt-1 text-xl font-semibold text-[#0b1f3a]">{card.value}</p>
                    <p className="text-xs font-medium text-[#0f766e]">{card.trend}</p>
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
