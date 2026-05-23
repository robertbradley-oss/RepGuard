import {
  Camera,
  Clock3,
  FileCheck2,
  FileText,
  MessageCircle,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import type { AnalysisStatus, CaseRecord, MockAnalysisReport } from "@/lib/claim-data";

type TicketPreviewProps = {
  selectedFile: File | null;
  status: AnalysisStatus;
  report: MockAnalysisReport;
  caseRecord?: CaseRecord;
};

export function TicketPreview({ selectedFile, status, report, caseRecord }: TicketPreviewProps) {
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
    caseRecord
      ? "Selected case"
      : status === "complete"
      ? "Report ready"
      : status === "analyzing"
        ? "Analyzing"
        : status === "uploaded"
          ? "Evidence selected"
          : "Open";
  const caseId = caseRecord?.id ?? "New case";
  const customer = caseRecord?.customer ?? "Maya R.";
  const product = caseRecord?.item ?? "iSpring RCC7AK filter system";
  const channel = caseRecord?.channel ?? "Local upload";
  const customerNote =
    caseRecord?.ticket.customerNote ??
    "The under-sink filter housing started leaking after installation. I attached evidence for warranty review.";
  const uploadedFile = caseRecord?.ticket.uploadedFile ?? selectedFile?.name ?? "No file selected";
  const uploadedFileDetails = caseRecord?.ticket.fileDetails ?? (selectedFile ? `${fileType} | ${fileSize}` : fileType);
  const sla = caseRecord?.ticket.sla ?? "Review by 4:00 PM";
  const requestedAction = caseRecord?.ticket.requestedAction ?? "Warranty replacement review";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{caseId}</p>
          <h2 className="mt-1 text-lg font-semibold text-[#0b1f3a]">Warranty claim preview</h2>
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-sky-700 ring-1 ring-slate-200">
            <MessageCircle className="size-5" aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">Customer note</p>
              <span className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                {channel}
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-600">{customerNote}</p>
          </div>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          { label: "Customer", value: customer, icon: UserRound },
          { label: "Product", value: product, icon: ShoppingBag },
          {
            label: "Evidence type",
            value: caseRecord || selectedFile ? report.evidenceLabel : "Awaiting upload",
            icon: FileText,
          },
          { label: "Uploaded file", value: uploadedFile, icon: Camera },
          { label: "File details", value: uploadedFileDetails, icon: FileText },
          {
            label: "Review result",
            value:
              caseRecord || status === "complete"
                ? `${report.score}/100 | ${report.riskLevel} risk`
                : status === "analyzing"
                  ? "Mock analysis running"
                  : status === "uploaded"
                    ? "Ready to analyze"
                    : "Pending evidence",
            icon: FileCheck2,
          },
          { label: "SLA", value: sla, icon: Clock3 },
          { label: "Requested action", value: requestedAction, icon: FileCheck2 },
        ].map((item) => (
          <div className="rounded-lg border border-slate-200 bg-white p-3" key={item.label}>
            <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
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
