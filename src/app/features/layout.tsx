import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | RagAI - Advanced Document Intelligence",
  description:
    "Explore RagAI's powerful features including multi-document chat, intelligent source citations, and advanced document processing. Secure, fast, and intuitive document Q&A.",
  keywords:
    "RAG, document AI, document chat, Q&A, document intelligence, vector search",
  openGraph: {
    title: "Features | RagAI",
    description:
      "Explore RagAI's powerful features for document intelligence and Q&A",
    url: "https://rag-ai.example.com/features",
    type: "website",
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
