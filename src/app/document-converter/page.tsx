import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  FadeIn,
  SlideIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/layout/AnimatedPage";
import {
  FileText,
  ArrowRight,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  FileCode,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import DocumentConverterClient from "./DocumentConverterClient";

export const metadata = {
  title: "Universal Enterprise Document Converter | RagAI",
  description:
    "Convert between PDF, DOCX, XLSX, PPTX, HTML, PNG, and 16+ formats instantly with zero server retention and enterprise-grade privacy.",
};

/* ── fetch supported formats server-side ── */
async function getFormats(): Promise<string[]> {
  const API = process.env.NEXT_PUBLIC_BG_URL ?? "";

  try {
    const res = await fetch(`${API}/v1/document/formats`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch formats");
    const data = await res.json();
    return data.formats ?? [];
  } catch {
    // Fallback list so the page still renders
    return [
      ".pdf",
      ".docx",
      ".doc",
      ".xlsx",
      ".xls",
      ".pptx",
      ".ppt",
      ".odt",
      ".ods",
      ".odp",
      ".txt",
      ".html",
      ".rtf",
      ".csv",
      ".png",
      ".jpg",
    ];
  }
}

/* ── supported format categories ── */
const formatCategories = [
  {
    icon: FileText,
    title: "Document Archives",
    formats: ["PDF", "DOCX", "DOC", "ODT", "RTF", "TXT"],
    color: "from-violet-600 to-purple-600",
    bg: "bg-violet-50 text-violet-700 border-violet-100",
  },
  {
    icon: FileSpreadsheet,
    title: "Financial Spreadsheets",
    formats: ["XLSX", "XLS", "ODS", "CSV"],
    color: "from-emerald-600 to-teal-600",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    icon: Presentation,
    title: "Executive Presentations",
    formats: ["PPTX", "PPT", "ODP"],
    color: "from-amber-600 to-orange-600",
    bg: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    icon: ImageIcon,
    title: "Visual Assets & Raster",
    formats: ["PNG", "JPG"],
    color: "from-pink-600 to-rose-600",
    bg: "bg-pink-50 text-pink-700 border-pink-100",
  },
  {
    icon: FileCode,
    title: "Web & Source Code",
    formats: ["HTML", "TXT"],
    color: "from-cyan-600 to-blue-600",
    bg: "bg-cyan-50 text-cyan-700 border-cyan-100",
  },
];

const highlights = [
  {
    icon: Zap,
    title: "High-Throughput Conversion",
    desc: "Optimized headless document processing engine executes batch conversions in sub-second round-trips.",
  },
  {
    icon: Shield,
    title: "Zero Retention Privacy",
    desc: "Uploaded files are processed in ephemeral isolated memory and purged immediately post-download.",
  },
  {
    icon: Globe,
    title: "Exact Vector Fidelity",
    desc: "Preserves nested typography, multi-column tables, vector illustrations, and formulas without degradation.",
  },
];

export default async function DocumentConverterPage() {
  const formats = await getFormats();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-violet-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* ── Hero Section ── */}
          <FadeIn className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 mb-4">
              <Shield className="h-3.5 w-3.5 text-violet-600" />
              Enterprise Document Utility • Zero Cloud Retention
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Universal Enterprise{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Document Converter
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Seamlessly transform contracts, spreadsheets, slide decks, and reports
              across 16+ enterprise formats with typographic fidelity and strict zero-logging compliance.
            </p>
          </FadeIn>

          {/* ── Interactive Converter ── */}
          <SlideIn direction="up" delay={0.15}>
            <DocumentConverterClient formats={formats} />
          </SlideIn>

          {/* ── Supported Formats Grid ── */}
          <div className="mt-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Supported Enterprise Formats
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Full bi-directional conversion support across major business ecosystems
              </p>
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {formatCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <StaggerItem key={cat.title}>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cat.bg}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          {cat.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.formats.map((fmt) => (
                          <span
                            key={fmt}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            .{fmt.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          {/* ── Enterprise Value Highlights ── */}
          <div className="mt-20 border-t border-slate-200 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Enterprise RAG Callout ── */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-700 p-8 sm:p-10 text-white shadow-xl shadow-violet-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Need to search and synthesize these documents?
              </h3>
              <p className="text-violet-100 text-sm leading-relaxed">
                Connect your converted PDFs and spreadsheets directly into our Multi-Document RAG workspace for grounded, cited neural answers.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-violet-700 font-bold text-sm shadow-md hover:bg-violet-50 hover:shadow-lg transition-all shrink-0"
            >
              <span>Explore Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

