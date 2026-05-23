import { Camera, FileText, MessageCircle, ShoppingBag } from "lucide-react";

export function TicketPreview() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">Case CG-1048</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0b1f3a]">Warranty claim preview</h2>
        </div>
        <span className="rounded-full bg-[#e7f7ef] px-3 py-1 text-xs font-semibold text-[#0f766e]">
          Open
        </span>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-sky-700 shadow-sm">
            <MessageCircle className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Customer note</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              The blender stopped working after three weeks. I attached my receipt and a photo of
              the cracked housing.
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          { label: "Product", value: "Countertop blender", icon: ShoppingBag },
          { label: "Receipt", value: "Store receipt PDF", icon: FileText },
          { label: "Damage photo", value: "Housing crack image", icon: Camera },
          { label: "Requested action", value: "Replacement review", icon: ShieldMini },
        ].map((item) => (
          <div className="rounded-lg border border-slate-200 p-3" key={item.label}>
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <item.icon className="size-3.5" aria-hidden="true" />
              {item.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ShieldMini(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 3 5 6v5c0 5 3.2 8.5 7 10 3.8-1.5 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}
