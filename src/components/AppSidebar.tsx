import { Check, Search, Shield } from "lucide-react";
import { navItems } from "@/lib/claim-data";

export function AppSidebar() {
  return (
    <aside className="flex min-h-full w-full flex-col bg-[#07182d] px-4 py-5 text-white lg:w-64 lg:px-5">
      <div className="flex items-center gap-3">
        <div className="relative flex size-10 items-center justify-center rounded-lg bg-[#0ea5e9] text-white">
          <Shield className="size-7" aria-hidden="true" />
          <Check className="absolute bottom-1.5 right-1.5 size-3.5 stroke-[3]" aria-hidden="true" />
          <Search className="absolute -right-1 -top-1 size-4 rounded-full bg-[#10b981] p-0.5 text-[#062019]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-lg font-semibold leading-tight">ClaimGuard</p>
          <p className="text-xs text-sky-100/70">Claim authenticity review</p>
        </div>
      </div>

      <nav className="mt-7 space-y-1">
        {navItems.map((item) => (
          <a
            href="#"
            key={item.label}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
              item.active
                ? "bg-white text-[#07182d]"
                : "text-sky-100/78 hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.05] p-4">
        <p className="text-sm font-semibold text-emerald-100">Support-safe mode</p>
        <p className="mt-2 text-xs leading-5 text-emerald-50/72">
          Mock results flag review needs without claiming fraud or assigning intent.
        </p>
      </div>
    </aside>
  );
}
