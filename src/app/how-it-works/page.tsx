import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import {
  FadeIn,
} from "@/components/layout/AnimatedPage";
import {
  Upload,
  Cpu,
  Search,
  ArrowRight,
  Database,
  Sparkles,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const metadata = {
  title: "How RagAI Works - Deep Architectural Walkthrough | RagAI",
  description:
    "Learn how RagAI's 4-stage technical pipeline ingests, vectorizes, retrieves, and synthesizes enterprise documents with cryptographic citation anchors.",
};

const stages = [
  {
    step: "01",
    title: "Optical Layout Analysis & Ingestion",
    icon: Upload,
    color: "from-violet-600 to-indigo-600",
    description:
      "Documents are parsed using deep optical layout models that recognize multi-column flows, nested financial tables, and embedded images.",
    bullets: [
      "Headless PDF, DOCX, XLSX, TXT, and scanned image ingestion",
      "High-precision OCR with spatial layout reconstruction",
      "Dynamic semantic chunk boundaries that preserve legal clause integrity",
    ],
  },
  {
    step: "02",
    title: "Hybrid Dense + Sparse Vectorization",
    icon: Database,
    color: "from-indigo-600 to-blue-600",
    description:
      "Text chunks are mapped into high-dimensional embedding spaces paired with lexical inverted indices for dual-channel semantic recall.",
    bullets: [
      "Dense vector cosine embeddings for deep contextual intent",
      "BM25 lexical index for exact nomenclature, SKUs, and case numbers",
      "Multi-tenant cryptographic vector isolation per customer workspace",
    ],
  },
  {
    step: "03",
    title: "Multi-Stage Retrieval & Neural Re-Ranking",
    icon: Search,
    color: "from-purple-600 to-pink-600",
    description:
      "When a query is received, an ensemble retrieval engine fetches candidate passages and scores them through a cross-encoder neural re-ranker.",
    bullets: [
      "Sub-15ms hybrid vector and keyword recall",
      "Cross-encoder relevance scoring filters out irrelevant noise",
      "Cross-corpus multi-hop synthesis across up to 50 active documents",
    ],
  },
  {
    step: "04",
    title: "Grounded Synthesis & Attribution Anchoring",
    icon: Sparkles,
    color: "from-emerald-600 to-teal-600",
    description:
      "The synthesis model generates answers strictly constrained to retrieved evidence passages, annotating every claim with interactive citations.",
    bullets: [
      "Mathematical zero-hallucination constraint enforcement",
      "Pinpoint citations with page, paragraph, and table links",
      "Zero model training guarantee with ephemeral memory flushing",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-violet-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-16 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 border border-violet-200/80 text-violet-700 text-xs font-semibold mb-6">
              <Cpu className="h-3.5 w-3.5" />
              Technical Architecture &amp; Data Flow
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
              How RagAI delivers{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                verifiable truth
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover the four-stage pipeline that turns raw enterprise documents into high-speed, citation-grounded intelligence.
            </p>
          </FadeIn>
        </section>

        {/* 4-Stage Pipeline Walkthrough */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
          {stages.map((stage) => (
            <div
              key={stage.step}
              className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row gap-8 items-start"
            >
              <div className="shrink-0 flex flex-col items-center lg:items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stage.color} text-white flex items-center justify-center font-bold text-xl shadow-md`}>
                  <stage.icon className="h-7 w-7" />
                </div>
                <span className="text-xs font-mono font-bold text-violet-700 bg-violet-100 px-3 py-1 rounded-full">
                  STAGE {stage.step}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                <h2 className="text-2xl font-bold text-slate-900">{stage.title}</h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  {stage.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {stage.bullets.map((bullet, bi) => (
                    <div key={bi} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Security & Data Isolation Strip */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-violet-400 font-bold text-xs uppercase tracking-wider">
                <Lock className="h-4 w-4" /> Confidentiality Guarantee
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Enterprise Ephemeral Memory Architecture
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Raw files are parsed in isolated in-memory sandboxes. Once indexed into your customer-isolated vector space, the original file data is purged from worker memory.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button className="w-full justify-center bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/30 font-semibold px-6 py-3 rounded-xl text-sm">
                  View Security Docs
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pre-Footer Call to Action */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-10 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Test the Pipeline on Your Own Documents
              </h2>
              <p className="text-base sm:text-lg text-violet-100 leading-relaxed max-w-xl mx-auto">
                Upload your first PDFs, legal contracts, or financial reports and experience citation-grounded RAG in under 60 seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-950 shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.99] transition-all"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 backdrop-blur-md shadow-xs hover:scale-[1.02] active:scale-[0.99] transition-all"
                >
                  <span>View Platform Specs</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

