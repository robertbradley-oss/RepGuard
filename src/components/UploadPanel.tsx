"use client";

import { useMemo, useRef, useState, type DragEvent } from "react";
import {
  CheckCircle2,
  Circle,
  FileImage,
  FileText,
  Loader2,
  Play,
  UploadCloud,
  X,
} from "lucide-react";
import type { AnalysisStatus, AnalysisStep } from "@/lib/claim-data";

const acceptedTypes = "image/png,image/jpeg,image/webp,application/pdf";

type UploadPanelProps = {
  selectedFile: File | null;
  status: AnalysisStatus;
  evidenceLabel: string;
  analysisSteps: AnalysisStep[];
  activeAnalysisStep: number;
  onFileSelect: (file: File | null) => void;
  onRunAnalysis: () => void;
  onReset: () => void;
};

export function UploadPanel({
  selectedFile,
  status,
  evidenceLabel,
  analysisSteps,
  activeAnalysisStep,
  onFileSelect,
  onRunAnalysis,
  onReset,
}: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileMeta = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    const sizeInMb = selectedFile.size / 1024 / 1024;
    const extension = selectedFile.name.split(".").pop()?.toUpperCase() ?? "File";
    const readableType =
      selectedFile.type === "application/pdf"
        ? "PDF document"
        : selectedFile.type.startsWith("image/")
          ? `${extension} image`
          : selectedFile.type || "Unknown file type";

    return {
      name: selectedFile.name,
      size: `${sizeInMb.toFixed(sizeInMb > 9.9 ? 0 : 1)} MB`,
      type: readableType,
    };
  }, [selectedFile]);

  const isAnalyzing = status === "analyzing";
  const canAnalyze = Boolean(selectedFile) && !isAnalyzing;
  const steps = [
    { label: "Upload", active: selectedFile !== null, complete: selectedFile !== null },
    { label: "Analyze", active: status === "analyzing", complete: status === "complete" },
    { label: "Report", active: status === "complete", complete: status === "complete" },
  ];

  function handleSelectedFile(file: File | null) {
    onFileSelect(file);
  }

  function handleResetSelection() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsDragging(false);
    onReset();
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (isAnalyzing) {
      return;
    }

    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    if (droppedFile) {
      handleSelectedFile(droppedFile);
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0f766e]">New case</p>
          <h2 className="mt-1 text-lg font-semibold text-[#0b1f3a]">Upload claim evidence</h2>
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          Mock analysis
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {steps.map((step, index) => (
          <div
            className={`rounded-md border px-2.5 py-1.5 ${
              step.active || step.complete
                ? "border-sky-200 bg-white text-sky-800"
                : "border-slate-200 bg-white text-slate-500"
            }`}
            key={step.label}
          >
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[11px] ${
                  step.complete ? "bg-[#0f766e] text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {step.complete ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : index + 1}
              </span>
              {step.label}
            </div>
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        className="sr-only"
        type="file"
        accept={acceptedTypes}
        disabled={isAnalyzing}
        onChange={(event) => handleSelectedFile(event.currentTarget.files?.[0] ?? null)}
      />

      <button
        className={`mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-5 text-left transition ${
          isDragging
            ? "border-sky-400 bg-sky-50"
            : "border-slate-300 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/60"
        } ${isAnalyzing ? "cursor-not-allowed opacity-70" : ""}`}
        type="button"
        disabled={isAnalyzing}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!isAnalyzing) {
            setIsDragging(true);
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={handleDrop}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-white text-sky-600 ring-1 ring-slate-200">
          <UploadCloud className="size-6" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-slate-900">
            {isDragging ? "Release to attach evidence" : "Drop or choose a receipt, product photo, screenshot, or PDF"}
          </span>
          <span className="mt-1 block text-xs text-slate-500">
            Local mock review only. PNG, JPG, WEBP, or PDF up to 25 MB.
          </span>
        </span>
      </button>

      {selectedFile && fileMeta ? (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white text-[#0f766e] ring-1 ring-slate-200">
              {selectedFile.type === "application/pdf" ? (
                <FileText className="size-5" aria-hidden="true" />
              ) : (
                <FileImage className="size-5" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-semibold text-slate-900">{fileMeta.name}</p>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                    status === "uploaded"
                      ? "bg-[#e7f7ef] text-[#0f766e]"
                      : "bg-white text-slate-600 ring-1 ring-slate-200"
                  }`}
                >
                  {status === "uploaded" ? "Ready to analyze" : status === "complete" ? "Analyzed" : "Selected"}
                </span>
              </div>
              <dl className="mt-3 grid gap-2 sm:grid-cols-3">
                {[
                  { label: "Evidence type", value: evidenceLabel },
                  { label: "File type", value: fileMeta.type },
                  { label: "File size", value: fileMeta.size },
                ].map((item) => (
                  <div className="rounded-md bg-white px-3 py-2 ring-1 ring-slate-200" key={item.label}>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-xs font-semibold text-slate-900">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <button
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={handleResetSelection}
              aria-label="Remove selected file"
              disabled={isAnalyzing}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      {isAnalyzing ? (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Mock analysis in progress</p>
              <p className="mt-1 text-xs text-slate-500">Running local demo checks. No real AI or OCR is connected.</p>
            </div>
            <span className="rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
              Step {Math.min(activeAnalysisStep + 1, analysisSteps.length)} of {analysisSteps.length}
            </span>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {analysisSteps.map((step, index) => {
              const isCompleteStep = index < activeAnalysisStep;
              const isActiveStep = index === activeAnalysisStep;

              return (
                <div
                  className={`rounded-lg border p-3 ${
                    isActiveStep
                      ? "border-sky-200 bg-sky-50"
                      : isCompleteStep
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-slate-50"
                  }`}
                  key={step.label}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                        isCompleteStep
                          ? "bg-[#0f766e] text-white"
                          : isActiveStep
                            ? "bg-sky-600 text-white"
                            : "bg-white text-slate-400 ring-1 ring-slate-200"
                      }`}
                    >
                      {isCompleteStep ? (
                        <CheckCircle2 className="size-3.5" aria-hidden="true" />
                      ) : isActiveStep ? (
                        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Circle className="size-2.5" aria-hidden="true" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{step.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0b1f3a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102b50] disabled:cursor-not-allowed disabled:bg-slate-300"
          type="button"
          onClick={onRunAnalysis}
          disabled={!canAnalyze}
        >
          {isAnalyzing ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
          {isAnalyzing ? "Analyzing evidence" : "Run mock analysis"}
        </button>

        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 sm:flex-1">
          {status === "idle"
            ? "Select claim evidence to generate a support-safe mock report."
            : status === "uploaded"
              ? `${evidenceLabel} selected. Ready to analyze with local mock checks.`
              : status === "analyzing"
                ? analysisSteps[activeAnalysisStep]?.label ?? "Checking visible fields and review needs."
                : "Mock report complete. Use results as review guidance only."}
        </div>
      </div>
    </section>
  );
}
