"use client";

import { useEffect, useMemo, useState } from "react";
import { AnalysisReport } from "@/components/AnalysisReport";
import { RecentCasesTable } from "@/components/RecentCasesTable";
import { RedFlagsList } from "@/components/RedFlagsList";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { TicketPreview } from "@/components/TicketPreview";
import { UploadPanel } from "@/components/UploadPanel";
import {
  mockAnalysisReports,
  mockAnalysisSteps,
  recentCases,
  type AnalysisStatus,
  type EvidenceType,
  type RiskLevel,
} from "@/lib/claim-data";

function getEvidenceType(file: File | null): EvidenceType {
  if (!file) {
    return "receipt";
  }

  const name = file.name.toLowerCase();

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    return "pdf";
  }

  if (name.includes("screenshot") || name.includes("screen")) {
    return "screenshot";
  }

  if (
    file.type.startsWith("image/") &&
    (name.includes("damage") ||
      name.includes("photo") ||
      name.includes("crack") ||
      name.includes("product"))
  ) {
    return "damage-photo";
  }

  return "receipt";
}

const investigationStatus: Record<RiskLevel, string> = {
  Low: "Low Concern",
  Medium: "Review Suggested",
  High: "Manual Review Required",
};

export function ClaimReviewWorkflow() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [activeAnalysisStep, setActiveAnalysisStep] = useState(0);
  const [activeCaseId, setActiveCaseId] = useState<string | undefined>(recentCases[0]?.id);
  const evidenceType = useMemo(() => getEvidenceType(selectedFile), [selectedFile]);
  const activeCase = recentCases.find((claim) => claim.id === activeCaseId);
  const report = activeCase?.report ?? mockAnalysisReports[evidenceType];
  const reviewStatus: AnalysisStatus = activeCase ? "complete" : status;
  const visibleCaseId = activeCase?.id ?? (selectedFile ? "CG-LOCAL" : "CG-INTAKE");
  const visibleChannel = activeCase?.channel ?? "Local upload";
  const visibleQueue = activeCase?.reviewQueue ?? "Evidence intake";
  const visibleReviewer = activeCase?.assignedReviewer ?? "Unassigned";
  const visibleUpdated =
    activeCase?.lastUpdated ?? (status === "complete" ? "Just completed" : status === "analyzing" ? "Analyzing now" : "Awaiting evidence");
  const visibleStatus =
    reviewStatus === "complete"
      ? investigationStatus[report.riskLevel]
      : status === "uploaded"
        ? "Verification Incomplete"
        : status === "analyzing"
          ? "Document Consistency Review"
          : "Awaiting Evidence";

  useEffect(() => {
    if (status !== "analyzing") {
      return;
    }

    const stepTimer = window.setInterval(() => {
      setActiveAnalysisStep((currentStep) =>
        Math.min(currentStep + 1, mockAnalysisSteps.length - 1),
      );
    }, 850);

    const completeTimer = window.setTimeout(() => {
      window.clearInterval(stepTimer);
      setActiveAnalysisStep(mockAnalysisSteps.length - 1);
      setStatus("complete");
    }, mockAnalysisSteps.length * 850 + 500);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(completeTimer);
    };
  }, [status]);

  function handleFileSelect(file: File | null) {
    setSelectedFile(file);
    setActiveCaseId(undefined);
    setStatus(file ? "uploaded" : "idle");
    setActiveAnalysisStep(0);
  }

  function handleReset() {
    setSelectedFile(null);
    setActiveCaseId(recentCases[0]?.id);
    setStatus("idle");
    setActiveAnalysisStep(0);
  }

  function handleRunAnalysis() {
    if (!selectedFile || status === "analyzing") {
      return;
    }

    setActiveCaseId(undefined);
    setActiveAnalysisStep(0);
    setStatus("analyzing");
  }

  function handleCaseSelect(caseId: string) {
    setActiveCaseId(caseId);
    setSelectedFile(null);
    setStatus("idle");
    setActiveAnalysisStep(0);
  }

  return (
    <div className="mt-5 grid gap-5">
      <section className="cg-command-panel rounded-[1.25rem] p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cg-cyan)]">
              Investigation record
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="font-mono text-2xl font-semibold text-white">{visibleCaseId}</h2>
              <span className="rounded-lg border border-[var(--cg-border-strong)] bg-[rgba(24,183,255,0.1)] px-3 py-1 text-xs font-bold text-[var(--cg-cyan)]">
                {visibleStatus}
              </span>
            </div>
          </div>

          <dl className="grid gap-2 sm:grid-cols-2 xl:w-[720px] xl:grid-cols-5">
            {[
              { label: "Review queue", value: visibleQueue },
              { label: "Reviewer", value: visibleReviewer },
              { label: "Channel", value: visibleChannel },
              { label: "Last updated", value: visibleUpdated },
              { label: "Evidence type", value: report.evidenceLabel },
            ].map((item) => (
              <div className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2" key={item.label}>
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--cg-text-muted)]">
                  {item.label}
                </dt>
                <dd className="mt-1 text-xs font-semibold text-[var(--cg-text-soft)]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.58fr)]">
      <div className="grid min-w-0 gap-5">
        <UploadPanel
          selectedFile={selectedFile}
          status={status}
          hasCompletedReport={status === "complete"}
          evidenceLabel={selectedFile ? report.evidenceLabel : "Selected case evidence"}
          report={report}
          caseRecord={activeCase}
          analysisSteps={mockAnalysisSteps}
          activeAnalysisStep={activeAnalysisStep}
          onFileSelect={handleFileSelect}
          onRunAnalysis={handleRunAnalysis}
          onReset={handleReset}
        />

        <TicketPreview
          selectedFile={selectedFile}
          status={reviewStatus}
          report={report}
          caseRecord={activeCase}
        />

        <AnalysisReport report={report} status={reviewStatus} />
      </div>

      <div className="grid min-w-0 content-start gap-5">
        <RiskScoreCard
          score={report.score}
          riskLevel={report.riskLevel}
          status={reviewStatus}
          reviewLabel={report.reviewLabel}
          summary={report.summary}
          confidenceLevel={report.confidenceLevel}
          signalCount={report.redFlags.length}
          suggestedAction={report.suggestedAction}
        />

        <RedFlagsList
          flags={report.redFlags}
          status={reviewStatus}
          evidenceLabel={report.evidenceLabel}
          riskLevel={report.riskLevel}
        />

        <RecentCasesTable
          cases={recentCases}
          activeCaseId={activeCaseId}
          newlyAnalyzedCaseId={!activeCase && status === "complete" ? "new-upload" : undefined}
          onCaseSelect={handleCaseSelect}
        />
      </div>
      </div>
    </div>
  );
}
