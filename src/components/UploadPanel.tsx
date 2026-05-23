"use client";

import { useMemo, useState } from "react";
import { FileImage, FileText, UploadCloud, X } from "lucide-react";

const acceptedTypes = "image/png,image/jpeg,image/webp,application/pdf";

export function UploadPanel() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileMeta = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    const sizeInMb = selectedFile.size / 1024 / 1024;
    return `${sizeInMb.toFixed(sizeInMb > 9.9 ? 0 : 1)} MB`;
  }, [selectedFile]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0f766e]">New case</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0b1f3a]">Upload claim evidence</h2>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
          Mock analysis
        </span>
      </div>

      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-9 text-center transition hover:border-sky-300 hover:bg-sky-50/60">
        <input
          className="sr-only"
          type="file"
          accept={acceptedTypes}
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
        />
        <span className="flex size-12 items-center justify-center rounded-lg bg-white text-sky-600 shadow-sm">
          <UploadCloud className="size-6" aria-hidden="true" />
        </span>
        <span className="mt-4 text-sm font-semibold text-slate-900">
          Drop a receipt, product photo, screenshot, or PDF
        </span>
        <span className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP, or PDF up to 25 MB</span>
      </label>

      {selectedFile ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e7f7ef] text-[#0f766e]">
              {selectedFile.type === "application/pdf" ? (
                <FileText className="size-5" aria-hidden="true" />
              ) : (
                <FileImage className="size-5" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">{fileMeta} uploaded locally for demo preview</p>
            </div>
          </div>
          <button
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            type="button"
            onClick={() => setSelectedFile(null)}
            aria-label="Remove selected file"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
