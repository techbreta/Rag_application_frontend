import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | RAG AI - Flexible Plans for Every Need",
  description:
    "Simple and transparent pricing for RAG AI. Start free, upgrade to Pro, or contact us for Enterprise solutions. No hidden fees.",
  keywords:
    "pricing, RAG AI plans, free trial, Pro plan, Enterprise plan, document AI pricing",
  openGraph: {
    title: "Pricing | RAG AI",
    description:
      "Transparent pricing plans for RAG AI - Free, Pro, and Enterprise options",
    url: "https://rag-ai.example.com/pricing",
    type: "website",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
