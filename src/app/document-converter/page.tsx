import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import {
  FadeIn,
  SlideIn,
  StaggerContainer,
  StaggerItem,
  GlowingOrb,
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

/* ── supported format categories (static, for the info section) ── */
const formatCategories = [
  {
    icon: FileText,
    title: "Documents",
    formats: ["PDF", "DOCX", "DOC", "ODT", "RTF", "TXT"],
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: FileSpreadsheet,
    title: "Spreadsheets",
    formats: ["XLSX", "XLS", "ODS", "CSV"],
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Presentation,
    title: "Presentations",
    formats: ["PPTX", "PPT", "ODP"],
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: ImageIcon,
    title: "Images",
    formats: ["PNG", "JPG"],
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: FileCode,
    title: "Web & Other",
    formats: ["HTML", "CSV", "TXT"],
    color: "from-cyan-500 to-blue-600",
  },
];

const highlights = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Powered by LibreOffice on the server — conversions finish in seconds.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Files are processed in-memory and never stored. Your data stays yours.",
  },
  {
    icon: Globe,
    title: "16+ Formats",
    description:
      "Convert between documents, spreadsheets, presentations, images, and more.",
  },
];

export default async function DocumentConverterPage() {
  const formats = await getFormats();

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-12 sm:pb-16 px-4">
        <GlowingOrb className="top-20 left-1/4 bg-violet-500" />
        <GlowingOrb className="top-40 right-1/4 bg-indigo-600" />

        <div className="relative max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
              <FileText className="h-4 w-4" />
              Document Converter
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Convert Documents{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Instantly
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
              Upload any document and convert it to PDF, DOCX, XLSX, PPTX, HTML,
              PNG, and 10+ more formats — free, fast, and private. Powered by
              RagAi.
            </p>
          </FadeIn>
        </div>

        {/* ── Client interactive zone ── */}
        <SlideIn delay={0.3} direction="up">
          <DocumentConverterClient formats={formats} />
        </SlideIn>
      </section>

      {/* ── Highlights ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {highlights.map((h, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-violet-500/30 transition-colors">
                  <div className="rounded-xl bg-violet-500/10 p-3 shrink-0">
                    <h.icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">
                      {h.title}
                    </h3>
                    <p className="text-sm text-slate-400">{h.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Supported formats grid ── */}
      <section className="py-20 px-4 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Supported Formats
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                RagAi Document Converter supports all major office, image, and
                web formats.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formatCategories.map((cat, i) => (
              <StaggerItem key={i}>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors">
                  <div
                    className={`inline-flex rounded-xl bg-gradient-to-br ${cat.color} p-3 mb-4 shadow-lg`}
                  >
                    <cat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {cat.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.formats.map((f) => (
                      <span
                        key={f}
                        className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300"
                      >
                        .{f.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center rounded-3xl border border-slate-800 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need more from RagAi?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Sign up free and unlock AI-powered document chat, image
              generation, smart search, and more.
            </p>
            <Link href="/register">
              <Button>
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          © {new Date().getFullYear()} RagAi. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
