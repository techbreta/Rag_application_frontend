import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | RagAI - Flexible Plans for Every Need",
  description:
    "Simple and transparent pricing for RagAI. Start free, upgrade to Pro, or contact us for Enterprise solutions. No hidden fees.",
  keywords:
    "pricing, RagAI plans, free trial, Pro plan, Enterprise plan, document AI pricing, RagAI pricing, AI chat pricing, knowledge graph pricing, vector search pricing, semantic search pricing, question answering pricing, AI assistant pricing, document understanding pricing, natural language processing pricing, machine learning pricing, artificial intelligence pricing,RagAI,RagAI",
  openGraph: {
    title: "Pricing | RagAI",
    description:
      "Transparent pricing plans for RagAI - Free, Pro, and Enterprise options",
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
