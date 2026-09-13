"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  Download,
  Loader2,
  FileText,
  CheckCircle,
  X,
  RefreshCw,
} from "lucide-react";
import Button from "@/components/ui/Button";
import axios from "axios";

const bgApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BG_URL ?? "",
});

interface Props {
  formats: string[];
}

export default function DocumentConverterClient({ formats }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState(formats[0] ?? ".pdf");
  const [converting, setConverting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  /* ── upload to Cloudinary (raw) ── */
  const uploadToCloudinary = useCallback(async (f: File) => {
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/raw/upload`;

    const fd = new FormData();
    fd.append("file", f);
    fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setCloudinaryUrl(data.secure_url);
      setUploadProgress(100);
    } catch {
      setError("Failed to upload file. Please check file size and try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  /* ── file selection ── */
  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      setFile(f);
      setDone(false);
      setError(null);
      setCloudinaryUrl(null);
      uploadToCloudinary(f);
    },
    [uploadToCloudinary],
  );

  /* ── drag & drop ── */
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (!f) return;
      setFile(f);
      setDone(false);
      setError(null);
      setCloudinaryUrl(null);
      uploadToCloudinary(f);
    },
    [uploadToCloudinary],
  );

  /* ── convert ── */
  const handleConvert = useCallback(async () => {
    if (!cloudinaryUrl) return;
    setConverting(true);
    setError(null);

    try {
      const response = await bgApi.post(
        "/v1/document/convert",
        {
          fileUrl: cloudinaryUrl,
          format: selectedFormat.replace(/^\./, ""),
        },
        { responseType: "blob" },
      );

      const blob = new Blob([response.data]);
      const baseName = (file?.name ?? "document").replace(/\.[^.]+$/, "");
      const fileName = `${baseName}${selectedFormat}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDone(true);
    } catch {
      setError("Conversion failed. Please check the file format compatibility and try again.");
    } finally {
      setConverting(false);
    }
  }, [cloudinaryUrl, selectedFormat, file]);

  /* ── reset ── */
  const reset = () => {
    setFile(null);
    setCloudinaryUrl(null);
    setUploadProgress(0);
    setSelectedFormat(formats[0] ?? ".pdf");
    setError(null);
    setDone(false);
  };

  /* ── friendly label ── */
  const fmtLabel = (f: string) => f.replace(/^\./, "").toUpperCase();

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Upload zone ── */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="relative rounded-3xl border-2 border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center hover:border-violet-500 transition-colors shadow-sm"
      >
        {!file ? (
          <>
            <div className="mx-auto w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 mb-4">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-slate-800 font-semibold text-base mb-1">
              Drag and drop your document here
            </p>
            <p className="text-xs text-slate-500 mb-6">
              Supports PDF, DOCX, XLSX, PPTX, ODT, TXT, HTML, CSV, PNG, JPG and more
            </p>
            <label>
              <input
                type="file"
                className="hidden"
                onChange={onFileChange}
                accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.odt,.ods,.odp,.txt,.html,.rtf,.csv,.png,.jpg,.jpeg"
              />
              <span className="inline-flex items-center justify-center cursor-pointer bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors">
                Browse Document Files
              </span>
            </label>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-xl bg-violet-100 p-3">
              <FileText className="h-8 w-8 text-violet-700" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm text-slate-900 font-semibold truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              {uploading && (
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-violet-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              {cloudinaryUrl && !uploading && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Ready for conversion
                </span>
              )}
            </div>
            <button
              onClick={reset}
              className="shrink-0 rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Remove selected file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Format selector + convert ── */}
      {cloudinaryUrl && (
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-end gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex-1 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Target Output Format:
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 font-medium focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
            >
              {formats.map((f) => (
                <option key={f} value={f}>
                  {fmtLabel(f)} (.{f.replace(/^\./, "").toLowerCase()})
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleConvert}
            disabled={converting}
            className="sm:min-w-[180px] bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:shadow-md"
          >
            {converting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting…
              </>
            ) : done ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Convert Again
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Convert & Download
              </>
            )}
          </Button>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-center shadow-xs">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* ── Success ── */}
      {done && !error && (
        <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center shadow-xs">
          <p className="text-sm font-semibold text-emerald-800">
            ✓ Conversion successful! Your converted file has been downloaded.
          </p>
        </div>
      )}
    </div>
  );
}

