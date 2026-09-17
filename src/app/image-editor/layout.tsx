import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neural AI Image Editor & Transparent Background Remover | RagAI",
  description:
    "Edit, annotate, crop, watermark, and perform instant neural background matting client-side with zero data persistence.",
  alternates: {
    canonical: "/image-editor",
  },
  openGraph: {
    title: "Neural AI Image Editor & Transparent Background Remover | RagAI",
    description:
      "Edit, annotate, crop, watermark, and perform instant neural background matting client-side with zero data persistence.",
    url: "https://www.ragai.website/image-editor",
    siteName: "RagAI",
    type: "website",
    images: [
      {
        url: "/rag.png",
        width: 1200,
        height: 630,
        alt: "RagAI Image Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neural AI Image Editor | RagAI",
    description: "High-precision AI image editor and neural background removal.",
    images: ["/rag.png"],
  },
};

export default function ImageEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

