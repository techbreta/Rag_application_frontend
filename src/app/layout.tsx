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
  title: "RagAI - Enterprise Multi-Document RAG & AI Studio Platform",
  description:
    "Enterprise-grade Retrieval-Augmented Generation (RAG) with exact citation verification, cross-document synthesis, OCR table extraction, and neural creative media suite.",
  icons: {
    icon: "/rag.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 selection:bg-violet-600 selection:text-white min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

