"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  Copy,
  Check,
  Share2,
  Sliders,
  Scissors,
} from "lucide-react";
import { ensureCloudinaryHttps } from "@/lib/cloudinary";

interface ImageDetailActionsProps {
  prompt: string;
  cloudinaryUrl: string;
  slug: string;
}

export default function ImageDetailActions({
  prompt,
  cloudinaryUrl,
  slug,
}: ImageDetailActionsProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const safeUrl = ensureCloudinaryHttps(cloudinaryUrl);
  const downloadUrl = safeUrl.includes("/upload/")
    ? safeUrl.replace("/upload/", "/upload/fl_attachment/")
    : safeUrl;

  /**
   * Fallback copy that works on HTTP (non-secure contexts) where
   * navigator.clipboard is unavailable.
   */
  const fallbackCopy = (text: string): boolean => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // fall through to fallback
      }
    }
    return fallbackCopy(text);
  };

  const handleCopyPrompt = async () => {
    const ok = await copyToClipboard(prompt);
    if (ok) {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleShare = async () => {
    const pageUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `https://ragai.techbreta.com/free-images/${slug}`;

    // Try Web Share API (mobile / supported browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Free AI Image: ${prompt.slice(0, 50)}...`,
          text: prompt,
          url: pageUrl,
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }

    // Fallback: copy link to clipboard
    const ok = await copyToClipboard(pageUrl);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions: Download + Actions */}
      <div className="space-y-2.5 sm:space-y-3">
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-violet-600/20 hover:shadow-lg hover:shadow-violet-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <Download className="h-4 w-4" />
          <span>Download High-Resolution Image</span>
        </a>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99] transition-all shadow-xs"
          >
            {copiedPrompt ? (
              <>
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-semibold truncate">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="truncate">Copy Prompt</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99] transition-all shadow-xs"
            title="Share this image page"
          >
            {copiedLink ? (
              <>
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-semibold truncate">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="truncate">Share Image</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Creative Tools Integration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
        <Link
          href={`/image-editor?imageUrl=${encodeURIComponent(safeUrl)}`}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 hover:border-violet-300 active:scale-[0.99] transition-all text-center shadow-xs"
        >
          <Sliders className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Open in Image Editor</span>
        </Link>

        <Link
          href={`/image-editor?imageUrl=${encodeURIComponent(safeUrl)}&action=remove-bg`}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 active:scale-[0.99] transition-all text-center shadow-xs"
        >
          <Scissors className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Remove Background</span>
        </Link>
      </div>
    </div>
  );
}

