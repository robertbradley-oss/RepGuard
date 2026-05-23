import {
  Camera,
  ClipboardList,
  Clock3,
  FileCheck2,
  FileText,
  MessageCircle,
  NotebookPen,
  PackageCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { formatFileSize } from "@/lib/file-format";
import type { AnalysisStatus, CaseRecord, MockAnalysisReport } from "@/lib/claim-data";

type TicketPreviewProps = {
  selectedFile: File | null;
  status: AnalysisStatus;
  report: MockAnalysisReport;
  caseRecord?: CaseRecord;
};

export function TicketPreview({ selectedFile, status, report, caseRecord }: TicketPreviewProps) {
  const fileSize = selectedFile ? formatFileSize(selectedFile.size) : "No file selected";
  const fileType = selectedFile
    ? selectedFile.type === "application/pdf"
      ? "PDF document"
      : selectedFile.type.startsWith("image/")
        ? "Image upload"
        : selectedFile.type || "Unknown"
    : "Awaiting upload";
  const statusLabel = caseRecord
    ? "Investigation record"
    : status === "complete"
      ? "Report ready"
      : status === "analyzing"
        ? "Analyzing"
        : status === "uploaded"
          ? "Evidence selected"
          : "Open intake";
  const caseId = caseRecord?.id ?? "New local case";
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
  const orderNumber = caseRecord?.ticket.orderNumber ?? "Pending order match";
  const claimReason = caseRecord?.ticket.claimReason ?? "Warranty evidence review";
  const purchaseChannel = caseRecord?.ticket.purchaseChannel ?? channel;
  const supportRepNotes =
    caseRecord?.ticket.supportRepNotes ??
    "Review uploaded evidence, verify purchase details, and use support-safe wording before responding.";

  return (
    <section className="cg-command-panel rounded-[1.15rem] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cg-cyan)]">{caseId}</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Support ticket record</h2>
        </div>
        <span className="cg-security-badge rounded-lg px-3 py-1 text-xs font-semibold">{statusLabel}</span>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="cg-ticket-paper rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#142133] text-[var(--cg-cyan)]">
              <MessageCircle className="size-5" aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-[var(--cg-text-paper)]">Customer message</p>
                <span className="rounded-md border border-[rgba(20,33,51,0.14)] bg-white/64 px-2 py-0.5 text-xs font-bold text-[#526175]">
                  {channel}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#344155]">{customerNote}</p>
            </div>
          </div>
        </div>

        <aside className="rounded-xl border border-[var(--cg-border)] bg-[#06101f]/58 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <NotebookPen className="size-4 text-[var(--cg-green)]" aria-hidden="true" />
            Support rep notes
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--cg-text-muted)]">{supportRepNotes}</p>
        </aside>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Customer", value: customer, icon: UserRound },
          { label: "Order number", value: orderNumber, icon: ClipboardList },
          { label: "Product", value: product, icon: ShoppingBag },
          { label: "Claim reason", value: claimReason, icon: PackageCheck },
          { label: "Purchase channel", value: purchaseChannel, icon: FileCheck2 },
          {
            label: "Evidence",
            value: caseRecord || selectedFile ? report.evidenceLabel : "Awaiting upload",
            icon: FileText,
          },
          { label: "Uploaded attachments", value: uploadedFile, icon: Camera },
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
          <div className="rounded-xl border border-[var(--cg-border)] bg-[#06101f]/58 p-3" key={item.label}>
            <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
              <item.icon className="size-3.5 text-[var(--cg-cyan)]" aria-hidden="true" />
              {item.label}
            </dt>
            <dd className="mt-1 break-words text-sm font-semibold text-[var(--cg-text)]">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
