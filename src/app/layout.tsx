import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RAGAI - Chat with Your Documents",
  description:
    "Upload your documents and chat with them using AI. Get instant, accurate answers grounded in your actual documents.",
  icons: {
    icon: "/icon.png",
  },
  keywords:
    "RAG, Retrieval-Augmented Generation, AI chat, document chat, knowledge graph, vector search, semantic search, question answering, AI assistant, document understanding, natural language processing, machine learning, artificial intelligence,RagAI,Rag AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
