"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid work email.");
      return;
    }
    setIsSubscribed(true);
    toast.success("Thank you for subscribing to RagAI Technical Dispatch!");
    setEmail("");
  };

  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 transition-colors">
      {/* Upper Newsletter & Enterprise Trust Banner */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational • 99.99% Uptime
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Stay ahead of enterprise AI & retrieval research
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Bi-weekly engineering briefs on RAG architectures, neural computer vision, and zero-hallucination document synthesis.
            </p>
          </div>

          {/* Subscribe Form */}
          <form onSubmit={handleSubscribe} className="flex-1 max-w-md">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email..."
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300/80 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 shadow-xs"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-violet-600/20 transition-all shrink-0 flex items-center justify-center gap-1.5"
              >
                {isSubscribed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Subscribed
                  </>
                ) : (
                  <>
                    Subscribe <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Zero spam. Unsubscribe anytime. View our{" "}
              <Link href="/privacy" className="underline hover:text-slate-600">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      </div>

      {/* Main Multi-Column Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Col 1: Brand & Enterprise Pillars */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <Image
                src="/rag.png"
                alt="RagAI Logo"
                width={160}
                height={62}
                priority
                className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              The unified retrieval intelligence and neural media studio. Grounding generative LLMs in verified multi-document truth while empowering teams with creative AI tools.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>SOC 2 Type II & GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-violet-600 shrink-0" />
                <span>Zero Data Retention for LLM Training</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Cryptographic Inline Source Citations</span>
              </div>
            </div>
          </div>

          {/* Col 2: Platform Capabilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard/chat" className="hover:text-violet-600 transition-colors">
                  Document AI Chat
                </Link>
              </li>
              <li>
                <Link href="/dashboard/documents" className="hover:text-violet-600 transition-colors">
                  Multi-Doc Synthesis
                </Link>
              </li>
              <li>
                <Link href="/image-editor" className="hover:text-violet-600 transition-colors">
                  Neural Matting Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard/generate-image" className="hover:text-violet-600 transition-colors">
                  Latent Image Diffusion
                </Link>
              </li>
              <li>
                <Link href="/document-converter" className="hover:text-violet-600 transition-colors">
                  Document Normalizer
                </Link>
              </li>
              <li>
                <Link href="/free-images" className="hover:text-violet-600 transition-colors">
                  Free Vector Image Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Industry Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Industry Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/features#legal" className="hover:text-violet-600 transition-colors">
                  Legal & Compliance
                </Link>
              </li>
              <li>
                <Link href="/features#finance" className="hover:text-violet-600 transition-colors">
                  Finance & Private Equity
                </Link>
              </li>
              <li>
                <Link href="/features#healthcare" className="hover:text-violet-600 transition-colors">
                  Healthcare & Clinical Trials
                </Link>
              </li>
              <li>
                <Link href="/features#engineering" className="hover:text-violet-600 transition-colors">
                  Engineering & Specs
                </Link>
              </li>
              <li>
                <Link href="/features#creative" className="hover:text-violet-600 transition-colors">
                  E-commerce & Agencies
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-violet-600 transition-colors">
                  Enterprise Custom
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/blog" className="hover:text-violet-600 transition-colors font-medium text-violet-600">
                  Engineering Blog
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-violet-600 transition-colors">
                  Architecture & Workflow
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-violet-600 transition-colors">
                  Platform Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-violet-600 transition-colors">
                  Plans & Pricing
                </Link>
              </li>
              <li>
                <a
                  href="https://status.ragai.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-violet-600 transition-colors flex items-center gap-1"
                >
                  System Status
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/features" className="hover:text-violet-600 transition-colors">
                  About RagAI
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-violet-600 transition-colors">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-violet-600 transition-colors">
                  Start Free Trial
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-violet-600 transition-colors">
                  Contact Sales
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@techbreta.com"
                  className="hover:text-violet-600 transition-colors"
                >
                  support@techbreta.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Social Strip */}
      <div className="border-t border-slate-200/80 bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span>© {new Date().getFullYear()} RagAI Inc. / TechBreta. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/security" className="hover:text-slate-900 transition-colors">
              Security Standards
            </Link>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="p-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

