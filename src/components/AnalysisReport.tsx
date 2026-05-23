import { CheckCircle2, MessageSquareText, ShieldQuestion } from "lucide-react";

export function AnalysisReport() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Mock report</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0b1f3a]">Evidence summary</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Inconclusive
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-slate-200 p-4">
          <ShieldQuestion className="size-5 text-sky-700" aria-hidden="true" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900">Evidence summary</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Receipt data appears mostly complete, but some fields need proof of purchase
            verification before final resolution.
          </p>
        </article>

        <article className="rounded-lg border border-slate-200 p-4">
          <CheckCircle2 className="size-5 text-[#0f766e]" aria-hidden="true" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900">Suggested action</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Route to manual review and request a clearer receipt or order confirmation if policy
            requires purchase validation.
          </p>
        </article>

        <article className="rounded-lg border border-slate-200 p-4">
          <MessageSquareText className="size-5 text-sky-700" aria-hidden="true" />
          <h3 className="mt-3 text-sm font-semibold text-slate-900">Customer-safe wording</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Thanks for sending this in. We need one additional proof of purchase check before we
            can complete the warranty review.
          </p>
        </article>
      </div>
    </section>
  );
}
