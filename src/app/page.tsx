import Image from "next/image";
import { Activity, FileSearch, RadioTower, ShieldCheck } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ClaimReviewWorkflow } from "@/components/ClaimReviewWorkflow";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--cg-bg)] text-[var(--cg-text)]">
      <div className="grid min-h-screen lg:grid-cols-[244px_minmax(0,1fr)]">
        <AppSidebar />

        <div className="min-w-0 px-4 py-4 sm:px-6 lg:px-7">
          <header className="cg-forensic-panel rounded-[1.35rem] px-5 py-5 sm:px-6 lg:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative h-16 w-56 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#020713] shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
                  <Image
                    className="object-cover object-center"
                    src="/claimguard-logo.png"
                    alt="ClaimGuard"
                    fill
                    priority
                    unoptimized
                    sizes="224px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cg-cyan)]">
                    Evidence review command center
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                    Fraud-risk screening for support teams
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--cg-text-muted)]">
                    Upload receipts, screenshots, PDFs, or product damage photos and generate
                    support-safe authenticity guidance for manual review.
                  </p>
                </div>
              </div>

              <div className="grid gap-2 text-xs sm:grid-cols-3 lg:w-[420px]">
                {[
                  { label: "Live queue", value: "28 open", icon: RadioTower },
                  { label: "Review mode", value: "Mock only", icon: FileSearch },
                  { label: "Language guard", value: "Safe wording", icon: ShieldCheck },
                ].map((item) => (
                  <div className="rounded-xl border border-[var(--cg-border)] bg-[#06101f]/70 p-3" key={item.label}>
                    <div className="flex items-center gap-2 text-[var(--cg-text-muted)]">
                      <item.icon className="size-3.5 text-[var(--cg-cyan)]" aria-hidden="true" />
                      <span className="font-semibold uppercase tracking-wide">{item.label}</span>
                    </div>
                    <p className="mt-2 font-mono text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-xs text-[var(--cg-text-muted)]">
              <Activity className="size-4 text-[var(--cg-green)]" aria-hidden="true" />
              <span>Manual review recommended for mixed evidence signals.</span>
              <span className="hidden h-1 w-1 rounded-full bg-[var(--cg-border-strong)] sm:block" />
              <span>ClaimGuard never confirms fraud or accuses a customer.</span>
            </div>
          </header>

          <ClaimReviewWorkflow />
        </div>
      </div>
    </main>
  );
}
