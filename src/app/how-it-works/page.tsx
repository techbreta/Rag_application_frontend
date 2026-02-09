"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { FadeIn, GlowingOrb } from "@/components/layout/AnimatedPage";
import {
  Upload,
  Brain,
  MessageSquare,
  ArrowRight,
  FileText,
  Search,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Upload Your Documents",
    description:
      "Drag and drop your PDFs, DOCX, or TXT files into RAG AI. We'll automatically extract the text, split it into meaningful chunks, and create vector embeddings for fast retrieval.",
    icon: Upload,
    color: "from-violet-500 to-purple-600",
    details: [
      "Supports PDF, DOCX, and TXT file formats",
      "Automatic text extraction and parsing",
      "Smart chunking for optimal retrieval",
      "Real-time processing status updates",
    ],
  },
  {
    step: "02",
    title: "Choose Your Chat Mode",
    description:
      "Select how you want to interact with your documents. Chat with a single document for focused answers, select multiple documents for cross-referencing, or use all documents for a comprehensive search.",
    icon: FileText,
    color: "from-indigo-500 to-blue-600",
    details: [
      "Single document mode for focused Q&A",
      "Multi-document mode for cross-referencing",
      "All documents mode for library-wide search",
      "Flexible document selection",
    ],
  },
  {
    step: "03",
    title: "Ask Your Questions",
    description:
      "Type your questions naturally, just like you'd ask a colleague. Our AI understands context and intent, finding the most relevant information across your selected documents.",
    icon: MessageSquare,
    color: "from-cyan-500 to-teal-600",
    details: [
      "Natural language question input",
      "Context-aware understanding",
      "Follow-up questions supported",
      "Conversation history maintained",
    ],
  },
  {
    step: "04",
    title: "Get Smart Answers",
    description:
      "Receive accurate, well-formatted answers with source citations. Every response includes references to the exact document chunks used, so you can verify the information yourself.",
    icon: Brain,
    color: "from-emerald-500 to-green-600",
    details: [
      "AI-generated accurate responses",
      "Source citations with match scores",
      "Markdown-formatted answers",
      "Expandable source previews",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4">
        <GlowingOrb className="top-20 left-1/3 bg-violet-500" />
        <GlowingOrb className="top-40 right-1/3 bg-indigo-600" />

        <div className="relative max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
              <Search className="h-4 w-4" />
              Simple Process
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                RAG AI
              </span>{" "}
              works
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From document upload to intelligent answers in just a few simple
              steps. No complex setup required — just upload and start asking.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div
                className={`flex flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-8 md:gap-16`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-5xl font-black bg-gradient-to-br from-violet-400/20 to-indigo-400/20 bg-clip-text text-transparent">
                      {step.step}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {step.title}
                  </h2>
                  <p className="text-slate-400 mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, di) => (
                      <li
                        key={di}
                        className="flex items-center gap-3 text-sm text-slate-300"
                      >
                        <CheckCircle className="h-4 w-4 text-violet-400 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 w-full"
                >
                  <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm">
                    <div className="absolute -top-3 -right-3">
                      <div
                        className={`rounded-xl bg-gradient-to-br ${step.color} p-3 shadow-lg`}
                      >
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Step Visual Content */}
                    <div className="space-y-3">
                      {i === 0 && (
                        <>
                          <div className="rounded-xl border-2 border-dashed border-slate-700 p-6 text-center">
                            <Upload className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">
                              Drop files here
                            </p>
                          </div>
                          <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
                            <FileText className="h-4 w-4 text-red-400" />
                            <span className="text-xs text-slate-300 flex-1">
                              document.pdf
                            </span>
                            <span className="text-xs text-emerald-400">
                              Ready
                            </span>
                          </div>
                        </>
                      )}
                      {i === 1 && (
                        <div className="space-y-2">
                          {[
                            "Single Document",
                            "Multi Document",
                            "All Documents",
                          ].map((mode, mi) => (
                            <div
                              key={mi}
                              className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                                mi === 1
                                  ? "bg-violet-500/20 border border-violet-500/30"
                                  : "bg-slate-800/30"
                              }`}
                            >
                              <div
                                className={`h-3 w-3 rounded-full ${
                                  mi === 1 ? "bg-violet-400" : "bg-slate-600"
                                }`}
                              />
                              <span
                                className={`text-sm ${
                                  mi === 1
                                    ? "text-violet-300"
                                    : "text-slate-500"
                                }`}
                              >
                                {mode}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {i === 2 && (
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <div className="h-6 w-6 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] text-violet-300">
                                U
                              </span>
                            </div>
                            <div className="rounded-xl bg-slate-800 px-3 py-2">
                              <p className="text-xs text-slate-300">
                                What are the key findings?
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                              <Sparkles className="h-3 w-3 text-emerald-400" />
                            </div>
                            <div className="flex gap-1">
                              <div className="h-2 w-2 rounded-full bg-slate-600 animate-bounce" />
                              <div
                                className="h-2 w-2 rounded-full bg-slate-600 animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              />
                              <div
                                className="h-2 w-2 rounded-full bg-slate-600 animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {i === 3 && (
                        <div className="space-y-3">
                          <div className="rounded-xl bg-violet-600/10 border border-violet-500/20 p-3">
                            <p className="text-xs text-slate-300 leading-relaxed">
                              Based on the document, the key findings include...
                            </p>
                          </div>
                          <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3 text-violet-400" />
                              <span className="text-[10px] text-violet-300">
                                document.pdf
                              </span>
                              <span className="text-[10px] text-slate-500">
                                76% match
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center rounded-3xl border border-slate-800 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to try it yourself?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Upload your first document and experience the power of AI-driven
              document chat.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register">
                <Button>
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline">View Features</Button>
              </Link>
            </div>
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
