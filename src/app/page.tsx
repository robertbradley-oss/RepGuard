import { AppSidebar } from "@/components/AppSidebar";
import { ClaimReviewWorkflow } from "@/components/ClaimReviewWorkflow";

export default function Home() {
  return (
    <main className="min-h-screen p-3 text-[#061426] sm:p-4 lg:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1520px] flex-col overflow-hidden rounded-xl border border-white/70 bg-white/90 shadow-[0_24px_70px_rgba(6,20,38,0.12)] lg:flex-row">
        <div className="lg:shrink-0">
          <AppSidebar />
        </div>

        <div className="flex-1 overflow-hidden bg-[#F6FAFD]">
          <header className="border-b border-[#E4F0F7] bg-white/92 px-5 py-5 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#008F91]">
              ClaimGuard authenticity review
            </p>
            <h1 className="mt-1 text-[1.85rem] font-semibold leading-tight text-[#061426]">
              Check claim evidence authenticity
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Upload a receipt, PDF, screenshot, or product photo to generate a support-safe mock review.
            </p>
          </header>

          <ClaimReviewWorkflow />
        </div>
      </div>
    </main>
  );
}
