import Image from "next/image";
import { navItems } from "@/lib/claim-data";

export function AppSidebar() {
  return (
    <aside className="flex min-h-full w-full flex-col bg-[#020B18] px-4 py-5 text-white lg:w-64 lg:px-5">
      <div className="px-1">
        <div className="relative h-16 w-full overflow-hidden rounded-lg bg-[#020B18]">
          <Image
            className="object-cover object-center"
            src="/claimguard-logo.png"
            alt="ClaimGuard"
            fill
            priority
            unoptimized
            sizes="210px"
          />
        </div>
        <p className="mt-2 text-xs font-medium text-[#D9ECF8]/64">Claim authenticity review</p>
      </div>

      <nav className="mt-8 space-y-1.5">
        {navItems.map((item) => (
          <a
            href="#"
            key={item.label}
            className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
              item.active
                ? "bg-white/[0.075] text-white shadow-[inset_1px_0_0_rgba(25,211,243,0.95)] before:absolute before:left-0 before:top-2 before:h-6 before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-[#19D3F3] before:to-[#41D66F]"
                : "text-[#D9ECF8]/70 hover:bg-white/[0.055] hover:text-white"
            }`}
          >
            <item.icon className={`size-4 ${item.active ? "text-[#19D3F3]" : ""}`} aria-hidden="true" />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <p className="text-sm font-semibold text-[#D6FFF0]">Support-safe mode</p>
        <p className="mt-2 text-xs leading-5 text-[#D9ECF8]/68">
          Mock results flag review needs without claiming fraud or assigning intent.
        </p>
      </div>
    </aside>
  );
}
