"use client";

import { useEffect, useMemo, useState } from "react";
import { AnalysisReport } from "@/components/AnalysisReport";
import { RecentCasesTable } from "@/components/RecentCasesTable";
import { RedFlagsList } from "@/components/RedFlagsList";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { TicketPreview } from "@/components/TicketPreview";
import { UploadPanel } from "@/components/UploadPanel";
import {
  mockAnalysisSteps,
  mockAnalysisReports,
  recentCases,
  type AnalysisStatus,
  type CaseRecord,
  type EvidenceType,
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

export function ClaimReviewWorkflow() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [activeAnalysisStep, setActiveAnalysisStep] = useState(0);
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(recentCases[0]?.id);
  const evidenceType = useMemo(() => getEvidenceType(selectedFile), [selectedFile]);
  const report = mockAnalysisReports[evidenceType];

  const newlyAnalyzedCase = useMemo<CaseRecord | null>(() => {
    if (status !== "complete" || !selectedFile) {
      return null;
    }

    const sizeInMb = selectedFile.size / 1024 / 1024;
    const fileDetails =
      selectedFile.type === "application/pdf"
        ? `PDF document | ${sizeInMb.toFixed(sizeInMb > 9.9 ? 0 : 1)} MB`
        : selectedFile.type.startsWith("image/")
          ? `Image upload | ${sizeInMb.toFixed(sizeInMb > 9.9 ? 0 : 1)} MB`
          : `${selectedFile.type || "Local file"} | ${sizeInMb.toFixed(sizeInMb > 9.9 ? 0 : 1)} MB`;

    return {
      id: "CG-1049",
      customer: "Maya R.",
      submittedAt: "Just now",
      item: "iSpring RCC7AK filter system",
      channel: `${report.evidenceLabel} upload`,
      risk: report.riskLevel,
      score: report.score,
      status: report.reviewLabel,
      evidence: report.evidenceLabel,
      report,
      ticket: {
        customerNote:
          "The under-sink filter housing started leaking after installation. I attached the new evidence file for warranty review.",
        uploadedFile: selectedFile.name,
        fileDetails,
        sla: "Review by 4:00 PM",
        requestedAction: "Warranty replacement review",
      },
    };
  }, [report, selectedFile, status]);
  const displayedCases = useMemo(
    () => (newlyAnalyzedCase ? [newlyAnalyzedCase, ...recentCases] : recentCases),
    [newlyAnalyzedCase],
  );
  const selectedCase = useMemo(
    () => (selectedCaseId ? displayedCases.find((claim) => claim.id === selectedCaseId) : undefined),
    [displayedCases, selectedCaseId],
  );
  const activeReport = selectedCase?.report ?? report;
  const reportStatus: AnalysisStatus = selectedCase ? "complete" : status;

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
      setSelectedCaseId("CG-1049");
    }, mockAnalysisSteps.length * 850 + 500);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(completeTimer);
    };
  }, [status]);

  function handleFileSelect(file: File | null) {
    setSelectedFile(file);
    setStatus(file ? "uploaded" : "idle");
    setActiveAnalysisStep(0);
    setSelectedCaseId(file ? undefined : recentCases[0]?.id);
  }

  function handleReset() {
    setSelectedFile(null);
    setStatus("idle");
    setActiveAnalysisStep(0);
    setSelectedCaseId(recentCases[0]?.id);
  }

  function handleRunAnalysis() {
    if (!selectedFile || status === "analyzing") {
      return;
    }

    setActiveAnalysisStep(0);
    setStatus("analyzing");
    setSelectedCaseId(undefined);
  }

  function handleCaseSelect(caseId: string) {
    setSelectedCaseId(caseId);
  }

  return (
    <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.75fr)] lg:p-7">
      <div className="space-y-4">
        <UploadPanel
          selectedFile={selectedFile}
          status={status}
          evidenceLabel={selectedFile ? report.evidenceLabel : "Awaiting upload"}
          analysisSteps={mockAnalysisSteps}
          activeAnalysisStep={activeAnalysisStep}
          onFileSelect={handleFileSelect}
          onRunAnalysis={handleRunAnalysis}
          onReset={handleReset}
        />
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0f766e]">Current review case</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0b1f3a]">
                {selectedCase ? `${selectedCase.id} - ${selectedCase.item}` : "New evidence review"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {selectedCase
                  ? `${selectedCase.customer} - ${selectedCase.channel} - ${selectedCase.status}`
                  : "Upload evidence and run the mock analysis to create a review case."}
              </p>
            </div>
            {selectedCase ? (
              <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {selectedCase.risk} risk - {selectedCase.score}/100
              </span>
            ) : null}
          </div>
        </section>
        <TicketPreview selectedFile={selectedFile} status={reportStatus} report={activeReport} caseRecord={selectedCase} />
        <AnalysisReport report={activeReport} status={reportStatus} />
        <RecentCasesTable
          cases={displayedCases}
          activeCaseId={selectedCase?.id}
          newlyAnalyzedCaseId={newlyAnalyzedCase?.id}
          onCaseSelect={handleCaseSelect}
        />
      </div>

      <aside className="space-y-4">
        <RiskScoreCard
          score={reportStatus === "complete" ? activeReport.score : 0}
          riskLevel={activeReport.riskLevel}
          status={reportStatus}
          reviewLabel={activeReport.reviewLabel}
          summary={activeReport.summary}
        />
        <RedFlagsList flags={activeReport.redFlags} status={reportStatus} />

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-[#0b1f3a]">
              Review guardrails
            </summary>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <p>Use review signals only as prompts for manual verification.</p>
              <p>Prefer &quot;Manual review recommended&quot; when evidence is mixed.</p>
              <p>Use &quot;Inconclusive&quot; or &quot;Low confidence&quot; when a signal is not reliable.</p>
            </div>
          </details>
        </section>
      </aside>
    </div>
  );
}
