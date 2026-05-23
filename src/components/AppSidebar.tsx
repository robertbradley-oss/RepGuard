import Image from "next/image";
import {
  FileSearch,
  Inbox,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

const navItems = [
  { label: "Command", icon: LayoutDashboard, active: true },
  { label: "Evidence", icon: FileSearch },
  { label: "Case queue", icon: Inbox },
  { label: "Safe replies", icon: MessageSquareText },
  { label: "Policies", icon: ShieldCheck },
  { label: "Controls", icon: SlidersHorizontal },
];

export function AppSidebar() {
  return (
    <aside className="border-b border-white/10 bg-[#020713] px-4 py-5 text-white lg:min-h-screen lg:border-b-0 lg:border-r lg:border-white/10">
      <div className="flex items-center gap-3 lg:block">
        <div className="relative h-12 w-44 overflow-hidden rounded-lg border border-white/10 bg-[#020713] lg:h-14 lg:w-full">
          <Image
            className="object-cover object-center"
            src="/claimguard-logo.png"
            alt="ClaimGuard"
            fill
            priority
            unoptimized
            sizes="212px"
          />
        </div>
        <div className="min-w-0 lg:mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cg-cyan)]">
            Review console
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--cg-text-muted)]">
            Support-safe evidence screening
          </p>
        </div>
      </div>

      <nav className="mt-5 grid gap-2 sm:grid-cols-3 lg:mt-8 lg:block lg:space-y-2">
        {navItems.map((item) => (
          <a
            href="#"
            className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
              item.active
                ? "border-[var(--cg-border-strong)] bg-[#0b1728] text-white shadow-[var(--cg-shadow-blue)]"
                : "border-white/8 bg-white/[0.025] text-[var(--cg-text-muted)] hover:border-[var(--cg-border)] hover:bg-white/[0.045] hover:text-white"
            }`}
            key={item.label}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${
                item.active
                  ? "border-[var(--cg-border-strong)] bg-[rgba(24,183,255,0.14)] text-[var(--cg-cyan)]"
                  : "border-white/10 bg-white/[0.035] text-[var(--cg-text-muted)] group-hover:text-[var(--cg-cyan)]"
              }`}
            >
              <item.icon className="size-4" aria-hidden="true" />
            </span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-6 hidden rounded-2xl border border-[rgba(74,222,128,0.26)] bg-[rgba(74,222,128,0.08)] p-4 lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cg-green)]">Safety lock</p>
        <p className="mt-2 text-sm leading-6 text-[var(--cg-text-soft)]">
          Review signals guide support decisions. They never confirm customer intent.
        </p>
      </div>
    </aside>
  );
}
