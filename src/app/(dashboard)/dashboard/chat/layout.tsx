import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | RAG AI - Document Intelligence Platform",
  description:
    "Ask questions about your documents with RAG AI. Get instant answers with source citations and intelligent document analysis.",
  keywords: "document chat, AI Q&A, document intelligence, RAG",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
