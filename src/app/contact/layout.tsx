import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Enterprise Sales & Security Consultation | RagAI",
  description:
    "Connect with RagAI's enterprise solutions architects for custom on-premise VPC vectorization, dedicated BAAs, SOC-2 audit reports, and volume licensing.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Enterprise Sales & Security Consultation | RagAI",
    description:
      "Connect with RagAI's enterprise solutions architects for custom on-premise VPC vectorization, dedicated BAAs, SOC-2 audit reports, and volume licensing.",
    url: "https://www.ragai.website/contact",
    siteName: "RagAI",
    type: "website",
    images: [
      {
        url: "/rag.png",
        width: 1200,
        height: 630,
        alt: "RagAI Enterprise Security & Sales Contact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Enterprise Sales & Security Consultation | RagAI",
    description:
      "Connect with RagAI's enterprise solutions architects for custom on-premise VPC vectorization and SLAs.",
    images: ["/rag.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

