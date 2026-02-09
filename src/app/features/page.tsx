import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | RAG AI - Advanced Document Intelligence",
  description: "Explore RAG AI's powerful features including multi-document chat, intelligent source citations, and advanced document processing. Secure, fast, and intuitive document Q&A.",
  keywords: "RAG, document AI, document chat, Q&A, document intelligence, vector search",
  openGraph: {
    title: "Features | RAG AI",
    description: "Explore RAG AI's powerful features for document intelligence and Q&A",
    url: "https://rag-ai.example.com/features",
    type: "website",
  },
};

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowingOrb,
} from "@/components/layout/AnimatedPage";
import {
  Upload,
  Brain,
  Search,
  Shield,
  Zap,
  Globe,
  FileText,
  MessageSquare,
  Layers,
  Lock,
  BarChart3,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

const mainFeatures = [
  {
    icon: Upload,
    title: "Upload Documents",
    description:
      "Upload PDFs, DOCX, and TXT files. We process and index them for lightning-fast retrieval.",
    details: [
      "Drag & drop file upload",
      "Support for PDF, DOCX, and TXT formats",
      "Automatic text extraction & chunking",
      "Real-time processing status",
    ],
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Brain,
    title: "AI-Powered Chat",
    description:
      "Ask questions about your documents and get accurate, context-aware answers instantly.",
    details: [
      "Natural language understanding",
      "Context-aware responses",
      "Source citations with every answer",
      "Conversation history & continuity",
    ],
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: Search,
    title: "Smart Vector Search",
    description:
      "Our vector search finds the most relevant content across all your documents.",
    details: [
      "Semantic similarity matching",
      "Cross-document search",
      "Relevance scoring",
      "Chunk-level precision",
    ],
    color: "from-cyan-500 to-teal-600",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your documents are encrypted and only accessible by you. We never share your data.",
    details: [
      "JWT-based authentication",
      "Per-user data isolation",
      "Secure file storage on Cloudinary",
      "Token-based session management",
    ],
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Get responses in seconds, not minutes. Our optimized pipeline ensures speed.",
    details: [
      "Optimized vector embeddings",
      "Fast document processing",
      "Efficient chunk retrieval",
      "Minimal response latency",
    ],
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Globe,
    title: "Multi-Document Chat",
    description:
      "Chat with a single document, multiple documents, or your entire library at once.",
    details: [
      "Single document mode",
      "Multi-document selection",
      "All documents mode",
      "Flexible chat types",
    ],
    color: "from-pink-500 to-rose-600",
  },
];

const additionalFeatures = [
  {
    icon: FileText,
    title: "Document Management",
    description:
      "Organize, view, and manage all your uploaded documents in one place.",
  },
  {
    icon: MessageSquare,
    title: "Chat History",
    description:
      "Access all your previous conversations and continue where you left off.",
  },
  {
    icon: Layers,
    title: "Source Citations",
    description:
      "Every answer comes with source references so you can verify information.",
  },
  {
    icon: Lock,
    title: "User Authentication",
    description:
      "Secure login, registration, and email verification for your account.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analytics",
    description:
      "See your document count, chat sessions, and usage at a glance.",
  },
  {
    icon: RefreshCw,
    title: "Real-time Processing",
    description:
      "Documents are processed and indexed automatically after upload.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4">
        <GlowingOrb className="top-20 left-1/3 bg-violet-500" />
        <GlowingOrb className="top-40 right-1/3 bg-indigo-600" />

        <div className="relative max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Powerful Features
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                chat with your docs
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              RAG AI combines document processing, vector search, and AI chat to
              give you instant answers from your documents with full source
              citations.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mainFeatures.map((feature, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 h-full backdrop-blur-sm hover:border-violet-500/30 transition-colors"
                >
                  <div
                    className={`rounded-xl bg-gradient-to-br ${feature.color} p-3 w-fit mb-4 shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, di) => (
                      <li
                        key={di}
                        className="flex items-center gap-2 text-sm text-slate-300"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-4 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                And much more...
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Additional features that make RAG AI the complete document
                intelligence platform.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((feature, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/30 p-5 hover:border-slate-700 transition-colors">
                  <div className="rounded-lg bg-violet-500/10 p-2.5 shrink-0">
                    <feature.icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center rounded-3xl border border-slate-800 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Upload your first document and start chatting with your knowledge
              base in minutes.
            </p>
            <Link href="/register">
              <Button>
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          © {new Date().getFullYear()} RAG AI. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
