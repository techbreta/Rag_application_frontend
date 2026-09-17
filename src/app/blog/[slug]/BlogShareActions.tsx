"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import toast from "react-hot-toast";

interface BlogShareActionsProps {
  title: string;
  slug: string;
}

export default function BlogShareActions({ title, slug }: BlogShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://www.ragai.website/blog/${slug}`;
  };

  const handleCopy = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Read "${title}" on @RagAI:`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
        <Share2 className="h-3.5 w-3.5 text-slate-400" /> Share:
      </span>

      <button
        onClick={shareOnTwitter}
        type="button"
        aria-label="Share on X / Twitter"
        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs hover:bg-slate-50"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X (Twitter)
      </button>

      <button
        onClick={shareOnLinkedIn}
        type="button"
        aria-label="Share on LinkedIn"
        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs hover:bg-slate-50"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.66-.74 1.66-1.66a1.66 1.66 0 0 0-1.66-1.66 1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66m1.4 9.74v-8.37H5.06v8.37h2.8z" />
        </svg>
        LinkedIn
      </button>

      <button
        onClick={handleCopy}
        type="button"
        aria-label="Copy link"
        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs hover:bg-slate-50"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-slate-500" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}

