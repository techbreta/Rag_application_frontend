import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import {
  FadeIn,
  SlideIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/layout/AnimatedPage";
import {
  Search,
  Sparkles,
  FileText,
  Shield,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Scissors,
  Check,
  Building2,
  FileCode,
  Lock,
} from "lucide-react";

export const metadata = {
  title: "Enterprise Architecture & Features | RagAI",
  description:
    "Explore RagAI's technical architecture: multi-document vector recall, optical layout normalizer, neural matting studio, and zero-retention compliance governance.",
};

const capabilities = [
  {
    category: "Retrieval & Vector Architecture",
    icon: Search,
    color: "from-violet-600 to-indigo-600",
    features: [
      {
        title: "Multi-Hop Cross-Corpus Synthesis",
        description:
          "Synthesize disparate insights across 50+ mixed files (PDF, DOCX, XLSX, TXT) simultaneously with unified semantic and lexical ranking.",
      },
      {
        title: "Exact Paragraph & Table Citations",
        description:
          "Every statement is anchored with interactive source citations including exact page number, section heading, and coordinate highlights.",
      },
      {
        title: "Dynamic Chunk Boundary Normalization",
        description:
          "Context-aware semantic boundaries avoid fragmented clauses, guaranteeing coherent vector embeddings for complex domain terminology.",
      },
      {
        title: "Hybrid Dense + Sparse Search Indexing",
        description:
          "Combines dense vector cosine embeddings with BM25 lexical keyword matching for sub-15ms lookup speeds across large document vaults.",
      },
    ],
  },
  {
    category: "Document Intelligence & OCR Extraction",
    icon: FileText,
    color: "from-indigo-600 to-blue-600",
    features: [
      {
        title: "Optical Layout Analysis",
        description:
          "Deep layout models identify multi-column flows, headers, footnotes, and embedded graphics to preserve original document hierarchy.",
      },
      {
        title: "Cell-Level Financial Table Normalization",
        description:
          "Extracts complex nested tables and spreadsheet balances into clean Markdown and structured JSON without scrambled numbers.",
      },
      {
        title: "Universal Document Format Converter",
        description:
          "Converts between PDF, DOCX, XLSX, PPTX, HTML, PNG, and 16+ formats in ephemeral server memory with zero data persistence.",
      },
      {
        title: "Embedded Chart & Diagram Transcription",
        description:
          "Translates infographics, organizational structures, and workflow charts into indexed textual knowledge.",
      },
    ],
  },
  {
    category: "Creative Media & Neural Vision Studio",
    icon: Sparkles,
    color: "from-purple-600 to-pink-600",
    features: [
      {
        title: "Neural Background Matting",
        description:
          "State-of-the-art alpha boundary estimation cuts hair, glass transparencies, and product silhouettes in milliseconds with zero haloing.",
      },
      {
        title: "Studio Diffusion Generation",
        description:
          "High-resolution AI image generation from natural language prompts. Download royalty-free commercial assets directly to your workflow.",
      },
      {
        title: "Client-Side Visual Canvas Editor",
        description:
          "Crop, annotate, apply filters, and watermark high-res visuals client-side without sending unneeded data back to external servers.",
      },
      {
        title: "Free Commercial Stock Asset Library",
        description:
          "Search thousands of pre-generated high-fidelity commercial imagery using natural language prompts and instant downloads.",
      },
    ],
  },
  {
    category: "Enterprise Security & Governance",
    icon: Shield,
    color: "from-emerald-600 to-teal-600",
    features: [
      {
        title: "Strict Zero Data Retention SLA",
        description:
          "Your confidential uploads and prompt queries are never used to train or adjust foundation model weights.",
      },
      {
        title: "SOC-2 Type II & HIPAA Readiness",
        description:
          "End-to-end TLS 1.3 encryption in transit, AES-256 encryption at rest, and optional dedicated VPC deployment options.",
      },
      {
        title: "Granular Role-Based Access Control (RBAC)",
        description:
          "Control access by organization, team, or document collection with Admin, Editor, and Viewer permission tiers.",
      },
      {
        title: "Comprehensive Audit Logging",
        description:
          "Exportable immutable access logs for legal compliance, regulatory oversight, and security posture monitoring.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-violet-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* Header Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-16 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 border border-violet-200/80 text-violet-700 text-xs font-semibold mb-6">
              <Cpu className="h-3.5 w-3.5" />
              Technical Architecture &amp; System Capabilities
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
              Built for precision, security, and{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                absolute truth
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Explore the engineering pillars behind RagAI&apos;s hallucination-free retrieval engine, document layout parser, and neural media tools.
            </p>
          </FadeIn>
        </section>

        {/* Feature Pillars Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
          {capabilities.map((cat, idx) => (
            <div key={cat.category} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${cat.color} text-white shadow-sm`}>
                  <cat.icon className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{cat.category}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cat.features.map((feat, fi) => (
                  <div
                    key={fi}
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-violet-300 hover:shadow-md transition-all"
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                      {feat.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed pl-3.5">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Enterprise Security Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-violet-400 font-bold text-xs uppercase tracking-wider">
                <Shield className="h-4 w-4" /> Enterprise Security Protocol
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Require custom on-premise VPC vectorization or dedicated SLAs?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We work directly with enterprise procurement officers, legal general counsels, and IT security teams to provide tailored BAAs, pen-test certifications, and isolated VPC deployments.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full justify-center bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/30 font-semibold px-6 py-3 rounded-xl text-sm">
                  Talk to Security Team
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pre-Footer Call to Action */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-10 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Experience Verified Knowledge Retrieval Today
              </h2>
              <p className="text-base sm:text-lg text-violet-100 leading-relaxed max-w-xl mx-auto">
                No credit card required. Upload your first documents and experience hallucination-free AI answers in under 60 seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button className="w-full justify-center bg-white text-violet-900 hover:bg-slate-100 font-bold px-8 py-3.5 rounded-xl shadow-lg text-sm">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full justify-center border-white/40 text-white hover:bg-white/10 font-semibold px-6 py-3.5 rounded-xl text-sm"
                  >
                    View Pricing Plans
                  </Button>
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
