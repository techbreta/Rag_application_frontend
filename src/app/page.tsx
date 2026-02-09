"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import {
  FadeIn,
  SlideIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  FloatingElement,
  GlowingOrb,
} from "@/components/layout/AnimatedPage";
import {
  FileText,
  Shield,
  Zap,
  Upload,
  Brain,
  Search,
  ArrowRight,
  Sparkles,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Documents",
    description:
      "Upload PDFs, DOCX, and TXT files. We process and index them for lightning-fast retrieval.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Brain,
    title: "AI-Powered Chat",
    description:
      "Ask questions about your documents and get accurate, context-aware answers instantly.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Our vector search finds the most relevant content across all your documents.",
    color: "from-cyan-500 to-teal-600",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your documents are encrypted and only accessible by you. We never share your data.",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Get responses in seconds, not minutes. Our optimized pipeline ensures speed.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Globe,
    title: "Multi-Document",
    description:
      "Chat with a single document, multiple documents, or your entire library at once.",
    color: "from-pink-500 to-rose-600",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload Your Documents",
    description:
      "Drag and drop your PDFs, DOCX, or TXT files. We'll process and index them automatically.",
  },
  {
    step: "02",
    title: "Ask Questions",
    description:
      "Type your questions naturally. Our AI understands context and finds relevant information.",
  },
  {
    step: "03",
    title: "Get Smart Answers",
    description:
      "Receive accurate answers with source citations so you can verify the information.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <GlowingOrb className="w-[600px] h-[600px] bg-violet-600 -top-40 left-1/2 -translate-x-1/2" />
        <GlowingOrb className="w-96 h-96 bg-indigo-600 top-40 -left-20" />
        <GlowingOrb className="w-72 h-72 bg-purple-600 bottom-0 right-10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <FadeIn>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 mb-8"
            >
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-violet-300">
                Powered by Advanced AI
              </span>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Chat with Your
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Documents
              </span>{" "}
              Instantly
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
              Upload your PDFs, DOCX, and TXT files. Ask questions and get
              accurate, AI-powered answers grounded in your actual documents —
              with source citations.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="text-base px-8">
                  How it Works
                </Button>
              </Link>
            </div>
          </FadeIn>

          {/* Hero Visual - Mock Chat */}
          <FadeIn delay={0.5}>
            <div className="relative mt-20 mx-auto max-w-4xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 to-indigo-500/20 blur-3xl" />
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-2 shadow-2xl">
                <div className="rounded-xl bg-slate-950 p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold">U</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-none bg-slate-800 px-4 py-3 max-w-md">
                        <p className="text-sm text-slate-200">
                          What are the key findings in my research paper?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 justify-end">
                      <div className="rounded-2xl rounded-tr-none bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/20 px-4 py-3 max-w-lg">
                        <p className="text-sm text-slate-200">
                          Based on your document, the key findings include: 1)
                          Significant improvement in processing speed by 40%, 2)
                          Novel approach to data indexing using vector
                          embeddings, and 3) Scalable architecture...
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-violet-400">
                          <FileText className="h-3 w-3" />
                          <span>Source: Research_Paper.pdf (Page 12)</span>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-sm font-medium text-violet-400 uppercase tracking-wider">
                Features
              </span>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold">
                Everything You Need
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                A complete platform for document-grounded AI conversations
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-violet-500/30 transition-all duration-300"
                >
                  <div
                    className={`inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4 shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative py-24 px-4">
        <GlowingOrb className="w-96 h-96 bg-indigo-600 top-1/2 left-0 -translate-y-1/2" />
        <div className="relative mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-sm font-medium text-violet-400 uppercase tracking-wider">
                How It Works
              </span>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold">
                Three Simple Steps
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <SlideIn key={i} direction="up" delay={i * 0.15}>
                <div className="relative">
                  <div className="text-6xl font-black text-violet-500/10 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 -right-4 text-slate-700">
                      <ArrowRight className="h-8 w-8" />
                    </div>
                  )}
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "<2s", label: "Response Time" },
              { value: "10K+", label: "Documents Processed" },
              { value: "50K+", label: "Questions Answered" },
            ].map((stat, i) => (
              <StaggerItem key={i}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4">
        <div className="relative mx-auto max-w-4xl">
          <ScaleIn>
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-12 text-center backdrop-blur-sm">
              <FloatingElement duration={4}>
                <Sparkles className="h-12 w-12 text-violet-400 mx-auto mb-6" />
              </FloatingElement>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                Join thousands of users who are already chatting with their
                documents using AI.
              </p>
              <Link href="/register">
                <Button size="lg" className="text-base px-10">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 p-1.5">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">
              RAG<span className="text-violet-400">AI</span>
            </span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date()?.getFullYear()} RAGAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
