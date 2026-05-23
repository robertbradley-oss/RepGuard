import {
  Camera,
  Clock3,
  FileCheck2,
  FileText,
  MessageCircle,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import type { AnalysisStatus, MockAnalysisReport } from "@/lib/claim-data";

type TicketPreviewProps = {
  selectedFile: File | null;
  status: AnalysisStatus;
  report: MockAnalysisReport;
};

export function TicketPreview({ selectedFile, status, report }: TicketPreviewProps) {
  const fileSize = selectedFile
    ? `${(selectedFile.size / 1024 / 1024).toFixed(selectedFile.size / 1024 / 1024 > 9.9 ? 0 : 1)} MB`
    : "No file selected";
  const fileType = selectedFile
    ? selectedFile.type === "application/pdf"
      ? "PDF document"
      : selectedFile.type.startsWith("image/")
        ? "Image upload"
        : selectedFile.type || "Unknown"
    : "Awaiting upload";
  const statusLabel =
    status === "complete"
      ? "Report ready"
      : status === "analyzing"
        ? "Analyzing"
        : status === "uploaded"
          ? "Evidence selected"
          : "Open";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">Case CG-1048</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0b1f3a]">Warranty claim preview</h2>
        </div>
        <span className="rounded-full bg-[#e7f7ef] px-3 py-1 text-xs font-semibold text-[#0f766e]">
          {statusLabel}
        </span>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-sky-700 shadow-sm">
            <MessageCircle className="size-5" aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">Customer note</p>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                Zendesk
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              The blender stopped working after three weeks. I attached my receipt and a photo of
              the cracked housing.
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          { label: "Customer", value: "Maya R.", icon: UserRound },
          { label: "Product", value: "Countertop blender", icon: ShoppingBag },
          { label: "Evidence type", value: selectedFile ? report.evidenceLabel : "Awaiting upload", icon: FileText },
          { label: "Uploaded file", value: selectedFile?.name ?? "No file selected", icon: Camera },
          { label: "File details", value: selectedFile ? `${fileType} | ${fileSize}` : fileType, icon: FileText },
          {
            label: "Review result",
            value:
              status === "complete"
                ? `${report.score}/100 | ${report.riskLevel} risk`
                : status === "analyzing"
                  ? "Mock analysis running"
                  : status === "uploaded"
                    ? "Ready to analyze"
                    : "Pending evidence",
            icon: FileCheck2,
          },
          { label: "SLA", value: "Review by 4:00 PM", icon: Clock3 },
          { label: "Requested action", value: "Replacement review", icon: FileCheck2 },
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
