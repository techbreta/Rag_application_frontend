import { Metadata } from "next";
import { ReactNode } from "react";
export const metadata: Metadata = {
  title: "RAGAI — Image Editor & Background Remover",
  description:
    "Free, powerful image editor with crop, filters, annotations, stickers, frames and an AI-powered background remover. Upload or paste images, edit with Pintura-powered tools, and download the result.",
  icons: {
    icon: "/icon.png",
  },
  keywords:
    "RAG, image editor, background remover, remove background, Pintura, Cloudinary, image editing, crop, filters, annotations, stickers, free images, AI image tools, RagAI",
};
export default function ImageEditorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
