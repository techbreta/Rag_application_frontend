"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { PinturaEditor } from "@pqina/react-pintura";
import Navbar from "@/components/layout/Navbar";
import { Download, Scissors } from "lucide-react";
import toast from "react-hot-toast";
import {
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultImageOrienter,
  createDefaultShapePreprocessor,
  createDefaultImageScrambler,
  setPlugins,
  plugin_crop,
  plugin_crop_locale_en_gb,
  plugin_filter,
  plugin_filter_defaults,
  plugin_filter_locale_en_gb,
  plugin_finetune,
  plugin_finetune_defaults,
  plugin_finetune_locale_en_gb,
  plugin_annotate,
  plugin_annotate_locale_en_gb,
  markup_editor_defaults,
  markup_editor_locale_en_gb,
  plugin_sticker,
  plugin_sticker_locale_en_gb,
  plugin_frame,
  plugin_frame_locale_en_gb,
  plugin_redact,
  plugin_redact_locale_en_gb,
  plugin_decorate,
  plugin_decorate_locale_en_gb,
  plugin_resize,
  plugin_resize_locale_en_gb,
  locale_en_gb,
} from "@pqina/pintura";

import "@pqina/pintura/pintura.css";

// Register plugins
setPlugins(
  plugin_crop,
  plugin_filter,
  plugin_finetune,
  plugin_annotate,
  plugin_sticker,
  plugin_frame,
  plugin_redact,
  plugin_decorate,
  plugin_resize,
);

const editorDefaults = {
  imageReader: createDefaultImageReader(),
  imageWriter: createDefaultImageWriter(),
  imageOrienter: createDefaultImageOrienter(),
  shapePreprocessor: createDefaultShapePreprocessor(),
  imageScrambler: createDefaultImageScrambler(),
  ...plugin_finetune_defaults,
  ...plugin_filter_defaults,
  ...markup_editor_defaults,
  locale: {
    ...locale_en_gb,
    ...plugin_crop_locale_en_gb,
    ...plugin_filter_locale_en_gb,
    ...plugin_finetune_locale_en_gb,
    ...plugin_annotate_locale_en_gb,
    ...markup_editor_locale_en_gb,
    ...plugin_sticker_locale_en_gb,
    ...plugin_frame_locale_en_gb,
    ...plugin_redact_locale_en_gb,
    ...plugin_decorate_locale_en_gb,
    ...plugin_resize_locale_en_gb,
  },
};

export default function ImageEditorPage() {
  const [imageSrc, setImageSrc] = useState<string | File>(
    "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const editorRef = useRef<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageSrc(file);
    }
  };

  const handleProcess = (output: any) => {
    console.log("Image processed:", output);
    const url = URL.createObjectURL(output.dest);
    setProcessedImage(url);
    toast.success("Image processed successfully!");
  };

  const handleDownload = () => {
    if (!processedImage) {
      toast.error("Please process the image first");
      return;
    }
    const a = document.createElement("a");
    a.href = processedImage;
    a.download = "edited-image.png";
    a.click();
    toast.success("Image downloaded!");
  };

  const removeBackground = async () => {
    if (!imageSrc) {
      toast.error("Please upload an image first");
      return;
    }
    setIsRemovingBg(true);
    try {
      // Prepare an image URL to send to backend. If the user uploaded a File,
      // convert it to a data URL so the backend can fetch/process it.
      let imageUrlToSend: string;

      if (typeof imageSrc === "string") {
        imageUrlToSend = imageSrc;
      } else {
        // If Cloudinary is configured, upload the file there first so the backend
        // can use existing Cloudinary-based processing. Otherwise fall back to
        // data URL inlining.
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

        if (cloudName && uploadPreset) {
          const fd = new FormData();
          fd.append("file", imageSrc as File);
          fd.append("upload_preset", uploadPreset);

          const cloudResp = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
            {
              method: "POST",
              body: fd,
            },
          );

          if (!cloudResp.ok) {
            const text = await cloudResp.text().catch(() => "");
            throw new Error(
              `Cloudinary upload failed: ${cloudResp.status} ${text}`,
            );
          }

          const cloudJson = await cloudResp.json();
          imageUrlToSend = cloudJson.secure_url || cloudJson.url;
        } else {
          imageUrlToSend = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") resolve(reader.result);
              else reject(new Error("Failed reading file"));
            };
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(imageSrc as File);
          });
        }
      }

      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      // Tell backend to delete the temporary Cloudinary image after 10 minutes
      const resp = await fetch(`${apiBase}/v1/image/remove-background`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imageUrlToSend,
          deleteAfterMinutes: 10,
        }),
      });
      

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`Background removal failed: ${resp.status} ${text}`);
      }

      const outBlob = await resp.blob();
      const url = URL.createObjectURL(outBlob);
      setImageSrc(url);
      setProcessedImage(url);
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
              annotations, stickers, frames, and more.
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
          {/* Upload Section */}

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
          {imageSrc && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-800/50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  Edit Your Image
                </h3>
                <button
                  onClick={handleDownload}
                  disabled={!processedImage}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
              <div className="h-[600px] md:h-[700px] lg:h-[800px] p-4">
                <PinturaEditor
                  ref={editorRef}
                  {...editorDefaults}
                  src={imageSrc}
                  onProcess={handleProcess}
                  imageCropAspectRatio={undefined}
                  className="pintura-editor"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .pintura-editor {
          --color-background: 20 20 31;
          --color-foreground: 255 255 255;
          border-radius: 1rem;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
