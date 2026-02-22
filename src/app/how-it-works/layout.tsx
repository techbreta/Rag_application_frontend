import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | RAG AI - Document Processing Made Simple",
  description:
    "Learn how RAG AI works in 4 simple steps: upload documents, choose chat mode, ask questions, and get smart answers with source citations.",
  keywords:
    "RAG, how it works, document processing, AI Q&A, document chat, retrieval augmented generation, knowledge graph, vector search, semantic search, question answering, AI assistant, document understanding, natural language processing, machine learning, artificial intelligence,RagAI,Rag AI",
  openGraph: {
    title: "How It Works | RAG AI",
    description:
      "Discover RAG AI's simple 4-step process for intelligent document Q&A",
    url: "https://rag-ai.example.com/how-it-works",
    type: "website",
  },
  
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
