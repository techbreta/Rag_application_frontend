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
  title: {
    default: "",
    template: "%s - Rag AI | RagAI",
  },
  authors: [{ name: "TechBreta Team", url: "https://ragai.website" }],
  creator: "TechBreta | Talha Riaz",
  publisher: "TechBreta | Talha Riaz",
  category: "AI, RAG, Document Intelligence, Document Chat, Knowledge Graph, Vector Search, Semantic Search, Question Answering, AI Assistant, Document Understanding, Natural Language Processing, Machine Learning, Artificial Intelligence,Image Editor, Background Remover, Free Images, Document Converter",
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
