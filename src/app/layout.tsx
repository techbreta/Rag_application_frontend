import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import JsonLd from "@/components/seo/JsonLd";

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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.ragai.website";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "RagAI — Enterprise Multi-Document RAG & AI Creative Studio",
    template: "%s | RagAI",
  },
  description:
    "Enterprise-grade Retrieval-Augmented Generation (RAG) with exact citation verification, cross-document synthesis, optical layout OCR, and neural creative AI media suite.",
  keywords: [
    "Enterprise RAG",
    "Retrieval-Augmented Generation",
    "Multi-Document AI Chat",
    "Document Knowledge Base",
    "Zero Hallucination AI",
    "Source Citation Verification",
    "Optical Document Layout OCR",
    "Table Extraction AI",
    "Neural Image Editor",
    "AI Background Remover",
    "Document Format Normalizer",
    "SOC-2 Type II AI",
    "HIPAA Compliant RAG",
    "Private VPC Vectorization",
  ],
  authors: [{ name: "RagAI Engineering Team", url: BASE_URL }],
  creator: "RagAI Inc.",
  publisher: "RagAI Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "RagAI",
    title: "RagAI — Enterprise Multi-Document RAG & AI Creative Studio",
    description:
      "Ground generative LLMs in verified multi-document truth with cryptographic citation anchors, OCR table extraction, and neural image studio.",
    images: [
      {
        url: "/rag.png",
        width: 1200,
        height: 630,
        alt: "RagAI Enterprise Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RagAI — Enterprise Multi-Document RAG & AI Creative Studio",
    description:
      "Zero-hallucination document synthesis, exact citation anchors, and creative AI tools for enterprise teams.",
    images: ["/rag.png"],
    creator: "@ragai_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/rag.png",
    shortcut: "/rag.png",
    apple: "/rag.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RagAI",
  url: BASE_URL,
  logo: `${BASE_URL}/rag.png`,
  description:
    "Enterprise multi-document RAG retrieval intelligence and neural media studio platform.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "sales@ragai.website",
    contactType: "customer service",
    availableLanguage: ["English"],
  },
  sameAs: [
    "https://twitter.com",
    "https://github.com",
    "https://linkedin.com",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "RagAI",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/free-images?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RagAI Platform",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  description:
    "Enterprise Retrieval-Augmented Generation (RAG) platform with multi-document cross-synthesis, exact citation verification, and AI image studio.",
  url: BASE_URL,
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <JsonLd data={[organizationSchema, websiteSchema, softwareApplicationSchema]} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 selection:bg-violet-600 selection:text-white min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

