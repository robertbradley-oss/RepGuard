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
  const evidenceType = useMemo(() => getEvidenceType(selectedFile), [selectedFile]);
  const report = mockAnalysisReports[evidenceType];
  const displayedCases = useMemo(() => {
    if (status !== "complete" || !selectedFile) {
      return recentCases;
    }

    return [
      {
        id: "CG-1049",
        customer: "Maya R.",
        submittedAt: "Just now",
        item: "Countertop blender",
        channel: `${report.evidenceLabel} upload`,
        risk: report.riskLevel,
        score: report.score,
        status: report.reviewLabel,
        evidence: report.evidenceLabel,
      },
      ...recentCases,
    ];
  }, [report, selectedFile, status]);

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
    setStatus(file ? "uploaded" : "idle");
    setActiveAnalysisStep(0);
  }

  function handleReset() {
    setSelectedFile(null);
    setStatus("idle");
    setActiveAnalysisStep(0);
  }

  function handleRunAnalysis() {
    if (!selectedFile || status === "analyzing") {
      return;
    }

    setActiveAnalysisStep(0);
    setStatus("analyzing");
  }

  return (
    <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:p-8">
      <div className="space-y-5">
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
        <TicketPreview selectedFile={selectedFile} status={status} report={report} />
        <AnalysisReport report={report} status={status} />
        <RecentCasesTable cases={displayedCases} activeCaseId={status === "complete" ? "CG-1049" : undefined} />
      </div>

      <aside className="space-y-5">
        <RiskScoreCard
          score={status === "complete" ? report.score : 0}
          riskLevel={report.riskLevel}
          status={status}
          reviewLabel={report.reviewLabel}
          summary={report.summary}
        />
        <RedFlagsList flags={report.redFlags} status={status} />

        <section className="rounded-lg border border-[#b7e7d0] bg-[#e7f7ef] p-5">
          <h2 className="text-lg font-semibold text-[#064e3b]">Review guardrails</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[#065f46]">
            <p>Use &quot;Potential alteration detected&quot; only as a review signal.</p>
            <p>Prefer &quot;Manual review recommended&quot; when evidence is mixed.</p>
            <p>Use &quot;Inconclusive&quot; or &quot;Low confidence&quot; when a signal is not reliable.</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
