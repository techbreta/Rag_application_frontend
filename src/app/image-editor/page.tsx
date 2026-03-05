"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import { ensureCloudinaryHttps } from "@/lib/cloudinary";
import { Download, Scissors, Upload } from "lucide-react";
import toast from "react-hot-toast";

// Dynamically import Filerobot to avoid SSR issues (canvas/konva)
const FilerobotImageEditor = dynamic(
  () => import("react-filerobot-image-editor").then((mod) => mod.default),
  { ssr: false },
);

// We also need TABS — import them separately so they resolve at runtime
let TABS_PROMISE: Promise<any> | null = null;
function getTabsPromise() {
  if (!TABS_PROMISE) {
    TABS_PROMISE = import("react-filerobot-image-editor").then(
      (mod) => mod.TABS,
    );
  }
  return TABS_PROMISE;
}

export default function ImageEditorPage() {
  const [imageSrc, setImageSrc] = useState<string>(
    "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  const [tabs, setTabs] = useState<any>(null);

  // Resolve TABS on mount
  useEffect(() => {
    getTabsPromise().then(setTabs);
  }, []);

  /* ── file picker ── */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setProcessedImage(null);
      // Force remount of editor
      setShowEditor(false);
      setTimeout(() => setShowEditor(true), 50);
    }
  };

  /* ── on save from editor ── */
  const handleSave = (editedImageObject: any) => {
    const { imageBase64, fullName } = editedImageObject;
    if (imageBase64) {
      setProcessedImage(imageBase64);
      // Immediately trigger download
      const a = document.createElement("a");
      a.href = imageBase64;
      a.download = fullName || `edited-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Image downloaded!");
    }
  };

  /* ── download ── */
  const handleDownload = () => {
    if (!processedImage) {
      toast.error(
        "Please save the edited image first (click Save in the editor)",
      );
      return;
    }
    const a = document.createElement("a");
    a.href = processedImage;
    a.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Image downloaded!");
  };

  /* ── remove background ── */
  const removeBackground = async () => {
    if (!imageSrc) {
      toast.error("Please upload an image first");
      return;
    }
    setIsRemovingBg(true);
    try {
      let imageUrlToSend: string;

      if (imageSrc.startsWith("blob:")) {
        // Upload the local file to Cloudinary first
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

        if (!cloudName || !uploadPreset || !selectedFile) {
          throw new Error("Cloudinary not configured or no file selected");
        }

        const fd = new FormData();
        fd.append("file", selectedFile);
        fd.append("upload_preset", uploadPreset);

        const cloudResp = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          { method: "POST", body: fd },
        );

        if (!cloudResp.ok) {
          throw new Error(`Cloudinary upload failed: ${cloudResp.status}`);
        }

        const cloudJson = await cloudResp.json();
        imageUrlToSend = ensureCloudinaryHttps(
          cloudJson.secure_url || cloudJson.url,
        );
      } else {
        imageUrlToSend = imageSrc;
      }

      const apiBase = process.env.NEXT_PUBLIC_BG_URL || "http://localhost:4500";
      const resp = await fetch(`${apiBase}/v1/image/remove-background`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageUrlToSend,
          deleteAfterMinutes: 10,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`Background removal failed: ${resp.status} ${text}`);
      }

      const json = await resp.json();
      const url = ensureCloudinaryHttps(json.url);

      setImageSrc(url);
      setProcessedImage(url);
      // Remount editor with new source
      setShowEditor(false);
      setTimeout(() => setShowEditor(true), 50);
      toast.success("Background removed successfully!");
    } catch (error) {
      console.error("Error removing background:", error);
      toast.error((error as Error).message || "Failed to remove background.");
    } finally {
      setIsRemovingBg(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="mt-16 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-4">
              Professional Image Editor
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Edit your images with powerful tools including crop, filters,
              annotations, stickers, frames, and more — completely free, no
              watermarks.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Toolbar */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Upload Your Image
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-violet-500/20 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Choose Image
                </div>
              </label>

              <button
                onClick={removeBackground}
                disabled={isRemovingBg || !imageSrc}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Scissors className="h-4 w-4" />
                {isRemovingBg ? "Removing..." : "Remove Background"}
              </button>

              <button
                onClick={handleDownload}
                disabled={!processedImage}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                Download
              </button>

              {selectedFile && (
                <p className="text-slate-400 w-full sm:w-auto">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Editor */}
          {imageSrc && showEditor && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden"
            >
              <div className="h-[600px] md:h-[700px] lg:h-[800px]">
                <FilerobotImageEditor
                  source={imageSrc}
                  onSave={handleSave}
                  onClose={() => {}}
                  annotationsCommon={{
                    fill: "#ff0000",
                  }}
                  Text={{ text: "Add text here..." }}
                  Rotate={{ angle: 90, componentType: "slider" }}
                  tabsIds={
                    tabs
                      ? [
                          tabs.ADJUST,
                          tabs.ANNOTATE,
                          tabs.FINETUNE,
                          tabs.FILTERS,
                          tabs.RESIZE,
                          tabs.WATERMARK,
                        ]
                      : []
                  }
                  defaultTabId={tabs?.ADJUST}
                  defaultSavedImageName="edited-image"
                  defaultSavedImageType="png"
                  defaultSavedImageQuality={0.92}
                  savingPixelRatio={4}
                  previewPixelRatio={typeof window !== "undefined" ? window.devicePixelRatio : 1}
                  observePluginContainerSize={true}
                  avoidChangesNotSavedAlertOnLeave={true}
                  resetOnImageSourceChange={true}
                  theme={{
                    palette: {
                      "bg-secondary": "#0f172a",
                      "bg-primary": "#1e293b",
                      "bg-primary-active": "#334155",
                      "accent-primary": "#7c3aed",
                      "accent-primary-active": "#6d28d9",
                      "icons-primary": "#e2e8f0",
                      "icons-secondary": "#94a3b8",
                      "borders-secondary": "#334155",
                      "borders-primary": "#475569",
                      "borders-strong": "#64748b",
                      "light-shadow": "rgba(0, 0, 0, 0.3)",
                      warning: "#f59e0b",
                    },
                    typography: {
                      fontFamily: "Inter, system-ui, sans-serif",
                    },
                  }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
