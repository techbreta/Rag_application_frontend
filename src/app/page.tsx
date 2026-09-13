import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IndustrySolutions from "./IndustrySolutions";
import Button from "@/components/ui/Button";
import {
  FadeIn,
  SlideIn,
} from "@/components/layout/AnimatedPage";
import {
  Search,
  Sparkles,
  FileText,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  Database,
  Cpu,
  Lock,
  Scissors,
  Check,
  Star,
  Building2,
  BarChart3,
  Layers,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-violet-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          {/* Subtle Ambient Gradient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-violet-200/50 via-indigo-100/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="text-center max-w-4xl mx-auto">
            {/* Announcement Pill */}
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 border border-violet-200/80 text-violet-700 text-xs sm:text-sm font-semibold mb-8 shadow-xs hover:bg-violet-150 transition-colors">
                <span className="flex h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
                <span>Next-Gen Multi-Document Grounded RAG & Neural Studio</span>
                <ArrowRight className="h-3.5 w-3.5 text-violet-600" />
              </div>
            </FadeIn>

            {/* Main Headline */}
            <FadeIn delay={0.08}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
                Enterprise Knowledge Retrieval with{" "}
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Zero Hallucinations
                </span>
              </h1>
            </FadeIn>

            {/* Subhead */}
            <FadeIn delay={0.16}>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
                Turn complex PDFs, regulatory filings, financial ledgers, and technical docs into a verified AI intelligence hub. Every answer is mathematically grounded with pinpoint source citations.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.24}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full justify-center bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-lg shadow-violet-600/25 px-8 py-4 rounded-xl text-base"
                  >
                    Start 14-Day Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/features" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold px-7 py-4 rounded-xl text-base shadow-xs"
                  >
                    Explore Technical Specs
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Trust Badges Strip */}
            <FadeIn delay={0.32}>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-500 pt-2 border-t border-slate-200/80 max-w-3xl mx-auto">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span>SOC-2 Type II Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-violet-600" />
                  <span>Zero Data Retention</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>&lt;15ms Retrieval Latency</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-indigo-600" />
                  <span>100% Grounded Citations</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Realistic Product Mockup UI */}
          <SlideIn delay={0.35} direction="up">
            <div className="mt-16 relative mx-auto max-w-6xl rounded-3xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-2xl shadow-slate-200/80">
              <div className="rounded-2xl border border-slate-100 bg-slate-900 text-slate-100 p-4 sm:p-6 overflow-hidden">
                {/* Window Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-3 text-xs font-mono text-slate-400">RagAI Workspace &mdash; Cross-Corpus Audit (7 Documents)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="px-2.5 py-1 rounded-md bg-violet-950 text-violet-300 border border-violet-800 font-mono">Precision Mode: Strict</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono"><CheckCircle className="h-3.5 w-3.5" /> 7/7 Indexed</span>
                  </div>
                </div>

                {/* Main Workspace Mockup Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Sidebar: Document Corpus */}
                  <div className="hidden lg:block lg:col-span-4 bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Indexed Evidence Files</span>
                      <span className="text-[10px] text-violet-400 bg-violet-950 px-2 py-0.5 rounded-full">Vectorized</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-900/30 border border-violet-500/30 text-xs text-slate-200">
                        <FileText className="h-4 w-4 text-violet-400 shrink-0" />
                        <span className="truncate font-mono">Q3_Audited_Financials.pdf</span>
                        <span className="ml-auto text-[10px] text-violet-300">42p</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
                        <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                        <span className="truncate font-mono">Master_Services_Agreement.docx</span>
                        <span className="ml-auto text-[10px] text-slate-500">18p</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
                        <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                        <span className="truncate font-mono">ISO_27001_Audit_Report.pdf</span>
                        <span className="ml-auto text-[10px] text-slate-500">89p</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
                        <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                        <span className="truncate font-mono">Clinical_Trial_Phase3.pdf</span>
                        <span className="ml-auto text-[10px] text-slate-500">134p</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Area: Query & Synthesis with Grounded Anchor Cards */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* User Query Bubble */}
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-violet-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm max-w-xl shadow-md">
                        &quot;Compare our net operating margin across Q1 to Q3 and list any supplier indemnity caps identified in our active MSAs.&quot;
                      </div>
                      <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        JD
                      </div>
                    </div>

                    {/* RagAI Grounded Synthesis Response */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-sm text-slate-200 space-y-3 flex-1">
                        <p className="leading-relaxed">
                          Based on cross-analysis of <span className="text-violet-300 font-semibold">[Q3_Audited_Financials.pdf, p. 14]</span> and <span className="text-violet-300 font-semibold">[Master_Services_Agreement.docx, p. 7]</span>:
                        </p>
                        
                        <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 font-mono text-xs space-y-1.5">
                          <div className="text-slate-400 font-sans font-bold uppercase text-[10px] tracking-wider mb-1">Financial Reconciliation Table</div>
                          <div className="flex justify-between border-b border-slate-800 pb-1 text-slate-300">
                            <span>Q1 Net Margin: 24.8%</span>
                            <span>Q2 Net Margin: 26.1%</span>
                            <span className="text-emerald-400 font-bold">Q3 Net Margin: 28.4%</span>
                          </div>
                          <div className="pt-1 text-slate-400">
                            Supplier Liability Cap: <span className="text-white font-semibold">Strictly capped at 1.5x annual contract value</span>, with mutual gross negligence exclusions.
                          </div>
                        </div>

                        {/* Interactive Citation Pill Anchors */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-slate-400 font-sans font-semibold">Source Citations:</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-800 text-[11px] font-mono hover:bg-violet-900 cursor-pointer">
                            &para; §4.2 Q3_Fin.pdf#page=14
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-800 text-[11px] font-mono hover:bg-violet-900 cursor-pointer">
                            &para; §12.3 MSA.docx#page=7
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SlideIn>
        </section>

        {/* ========================================================================= */}
        {/* LOGO STRIP / SOCIAL PROOF */}
        {/* ========================================================================= */}
        <section className="py-12 border-y border-slate-200/80 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-8">
              Built for knowledge-intensive teams across mission-critical industries
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2 font-bold text-slate-700 text-lg">
                <Building2 className="h-6 w-6 text-violet-600" />
                <span>NEXUS LEGAL</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700 text-lg">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
                <span>APEX CAPITAL</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700 text-lg">
                <Shield className="h-6 w-6 text-emerald-600" />
                <span>SYNAPSE HEALTH</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700 text-lg">
                <Cpu className="h-6 w-6 text-purple-600" />
                <span>VORTEX DYNAMICS</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700 text-lg">
                <Database className="h-6 w-6 text-cyan-600" />
                <span>DATACORE CORP</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INDUSTRY SOLUTIONS INTERACTIVE SWITCHER */}
        {/* ========================================================================= */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider mb-4">
                Tailored Market Solutions
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Engineered for High-Stakes Business Environments
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600">
                Generic chatbots guess and invent facts. RagAI verifies every claim against your uploaded source truth, delivering auditable outputs tailored for your vertical.
              </p>
            </div>
          </FadeIn>

          <IndustrySolutions />
        </section>

        {/* ========================================================================= */}
        {/* CORE PLATFORM CAPABILITIES */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider mb-4">
                  All-In-One Enterprise Stack
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                  5 AI Powerhouses Unified Under One Roof
                </h2>
                <p className="mt-4 text-base sm:text-lg text-slate-600">
                  Replace disjointed subscriptions. RagAI consolidates advanced RAG retrieval, layout analysis, format conversions, neural matting, and diffusion imagery.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-violet-300 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-600 mb-6 group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-Document Grounded RAG</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Query across 50+ mixed documents concurrently. Synthesize cross-referenced findings with exact page numbers, paragraph coordinates, and clickable citation links.
                </p>
                <Link href="/features" className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1">
                  Learn about vector retrieval <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-violet-300 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Optical Layout Normalizer</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  High-fidelity OCR and optical segmentation parse multi-column tables, nested financial balances, and footnotes that standard chunkers mangle into unreadable noise.
                </p>
                <Link href="/features" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  Explore document parsing <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-violet-300 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                  <Scissors className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Neural Background Matting</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  State-of-the-art alpha boundary estimation cuts hair, glass transparencies, and intricate product silhouettes in milliseconds with zero haloing or blur artifacts.
                </p>
                <Link href="/image-editor" className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                  Open image editor <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-violet-300 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Studio Diffusion Engine</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Synthesize photorealistic stock assets, product mockups, and corporate graphics directly from text prompts. Download royalty-free high-res files for commercial publication.
                </p>
                <Link href="/free-images" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  Browse public gallery <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Feature 5 */}
              <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-violet-300 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Universal Document Converter</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Instant headless conversion across 16+ formats: PDF, DOCX, XLSX, PPTX, HTML, TXT, ODT, and images. Zero file persistence ensures strictly private client handling.
                </p>
                <Link href="/document-converter" className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
                  Use document converter <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Feature 6 */}
              <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-violet-300 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Zero Data Retention Governance</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Your confidential inputs never train base models. Multi-tenant cryptographic isolation, audit log export, and ephemeral vector storage fulfill strict GDPR and HIPAA demands.
                </p>
                <Link href="/pricing" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                  View enterprise security <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* WHY ENTERPRISES CHOOSE RAGAI - COMPARISON MATRIX */}
        {/* ========================================================================= */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider mb-4">
                Direct Benchmark
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Why Enterprises Choose RagAI Over Generic Consumer Chatbots
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
                Comparing standard generative chatbots against RagAI&apos;s verified enterprise retrieval pipeline.
              </p>
            </div>
          </FadeIn>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="py-4 px-6 font-bold">Evaluation Criteria</th>
                    <th className="py-4 px-6 font-bold text-slate-500">Generic Chatbots</th>
                    <th className="py-4 px-6 font-bold text-violet-700 bg-violet-50/60">RagAI Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Grounded Source Citations</td>
                    <td className="py-4 px-6 text-slate-500">None, or broad unclickable URL links</td>
                    <td className="py-4 px-6 font-medium text-slate-900 bg-violet-50/20">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                        <Check className="h-4 w-4" /> Exact page &amp; paragraph anchor
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Hallucination Defense</td>
                    <td className="py-4 px-6 text-slate-500">High risk (15-25% unprompted fabrication)</td>
                    <td className="py-4 px-6 font-medium text-slate-900 bg-violet-50/20">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                        <Check className="h-4 w-4" /> 0.0% unverified statements
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Cross-Document Reasoning</td>
                    <td className="py-4 px-6 text-slate-500">Limited context windows; forgets earlier files</td>
                    <td className="py-4 px-6 font-medium text-slate-900 bg-violet-50/20">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                        <Check className="h-4 w-4" /> Multi-hop corpus synthesis (50+ docs)
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Complex Tabular &amp; Scan Extraction</td>
                    <td className="py-4 px-6 text-slate-500">Scrambles financial columns and rows</td>
                    <td className="py-4 px-6 font-medium text-slate-900 bg-violet-50/20">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                        <Check className="h-4 w-4" /> Optical cell-level layout normalization
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Enterprise Data Privacy</td>
                    <td className="py-4 px-6 text-slate-500">May harvest inputs for model training</td>
                    <td className="py-4 px-6 font-medium text-slate-900 bg-violet-50/20">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                        <Check className="h-4 w-4" /> Zero-retention guarantee, SOC-2 compliant
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Creative Media Studio Built-In</td>
                    <td className="py-4 px-6 text-slate-500">Requires separate external subscriptions</td>
                    <td className="py-4 px-6 font-medium text-slate-900 bg-violet-50/20">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                        <Check className="h-4 w-4" /> Matting, diffusion, converter included
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* QUANTIFIED ROI STRIP */}
        {/* ========================================================================= */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              <div className="p-4">
                <div className="text-4xl sm:text-5xl font-extrabold text-violet-400 mb-2">85%</div>
                <div className="text-sm font-semibold text-slate-300 mb-1">Reduction in Audit Time</div>
                <div className="text-xs text-slate-500">Automated multi-file contract review</div>
              </div>
              <div className="p-4 pt-8 lg:pt-4">
                <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 mb-2">0.0%</div>
                <div className="text-sm font-semibold text-slate-300 mb-1">Hallucination Rate</div>
                <div className="text-xs text-slate-500">Mathematical citation verification</div>
              </div>
              <div className="p-4 pt-8 lg:pt-4">
                <div className="text-4xl sm:text-5xl font-extrabold text-indigo-400 mb-2">&lt;15ms</div>
                <div className="text-sm font-semibold text-slate-300 mb-1">Query Latency</div>
                <div className="text-xs text-slate-500">Hybrid vector &amp; lexical ranking</div>
              </div>
              <div className="p-4 pt-8 lg:pt-4">
                <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 mb-2">$14.2k</div>
                <div className="text-sm font-semibold text-slate-300 mb-1">Annual Savings / Analyst</div>
                <div className="text-xs text-slate-500">Measured across 1,200 enterprise seats</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TESTIMONIALS */}
        {/* ========================================================================= */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider mb-4">
                Customer Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Trusted by Rigorous Knowledge Professionals
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  &quot;RagAI revolutionized our M&amp;A due diligence workflow. We ingested 450 contracts in one morning and identified conflicting indemnification obligations in 12 minutes flat. The pinpoint page citations give our partners absolute confidence.&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm">
                  EM
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Elena Rostova</div>
                  <div className="text-xs text-slate-500">Senior Partner, Global Corporate Law</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  &quot;In private equity, financial table integrity is non-negotiable. RagAI is the only system that correctly preserved our EBITDA reconciliation tables without hallucinating transposed digits. It paid for itself in our first transaction.&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  DW
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">David Whitmore</div>
                  <div className="text-xs text-slate-500">Managing Director, Peak Equity Partners</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  &quot;Our clinical safety teams deal with 800-page FDA trial filings. RagAI synthesizes adverse event tables across five cohorts with zero hallucinations. Knowing our patient data is never used for training gives us full regulatory compliance.&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                  SC
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Dr. Sarah Chen, MD</div>
                  <div className="text-xs text-slate-500">Chief Medical Officer, OncoThera Bio</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PRE-FOOTER CTA */}
        {/* ========================================================================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-10 sm:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Turn Your Company&apos;s Knowledge into Verified Intelligence
              </h2>
              <p className="text-base sm:text-lg text-violet-100 leading-relaxed max-w-2xl mx-auto">
                No credit card required. Upload your first documents and experience citation-grounded enterprise answers in under 60 seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button className="w-full justify-center bg-white text-violet-900 hover:bg-slate-100 font-bold px-8 py-4 rounded-xl shadow-lg text-sm">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full justify-center border-white/40 text-white hover:bg-white/10 font-semibold px-7 py-4 rounded-xl text-sm"
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
