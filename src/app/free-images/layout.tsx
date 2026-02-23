import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Images - RagAI",
  description:
    "Search and download high-quality AI-generated images using natural language prompts.",
  keywords: "free images, image search, AI images, download images,RagAI,RagAI",
};

export default function FreeImagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
