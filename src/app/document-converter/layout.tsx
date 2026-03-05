import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Document Converter — RagAi",
  description:
    "Convert documents between PDF, DOCX, XLSX, PPTX, ODT, HTML, TXT, CSV, PNG, JPG and more — free, fast, and private. Powered by RagAi.",
  icons: { icon: "/icon.png" },
  keywords:
    "document converter, file converter, PDF converter, DOCX to PDF, convert documents online, free file converter, RagAi, convert spreadsheet, convert presentation, office converter",
  openGraph: {
    title: "Document Converter — RagAi",
    description:
      "Convert documents between 16+ formats instantly. Upload, pick a format, download. Free and private.",
  },
};

export default function DocumentConverterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
