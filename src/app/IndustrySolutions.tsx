"use client";

import { useState } from "react";
import {
  Scale,
  TrendingUp,
  Activity,
  Code2,
  Palette,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface IndustryData {
  id: string;
  name: string;
  badge: string;
  icon: any;
  headline: string;
  description: string;
  painPoint: string;
  ragSolution: string;
  metrics: { label: string; value: string }[];
  sampleDoc: string;
  sampleQuery: string;
  sampleAnswer: string;
}

const industries: IndustryData[] = [
  {
    id: "legal",
    name: "Legal & Compliance",
    badge: "Contract & Regulatory Auditing",
    icon: Scale,
    headline: "Automate 200+ Page Contract Audits with Cryptographic Grounding",
    description:
      "Law firms, corporate legal counsels, and compliance officers analyze master service agreements, indemnification caps, NDAs, and regulatory mandates with 100% auditable citation links.",
    painPoint:
      "Attorneys spend 4-6 hours per contract manually cross-checking clause exceptions, risk exposures, and jurisdiction conflicts.",
    ragSolution:
      "RagAI extracts clauses across 50+ contracts simultaneously, highlighting indemnification anomalies and non-standard liabilities in seconds.",
    metrics: [
      { label: "Review Time Saved", value: "85%" },
      { label: "Audit Accuracy", value: "99.8%" },
      { label: "Hallucination Rate", value: "0.0%" },
    ],
    sampleDoc: "Master_Services_Agreement_2026_Final.pdf (Page 41)",
    sampleQuery:
      "Does this vendor contract contain an uncapped indemnification clause for third-party IP infringement?",
    sampleAnswer:
      "Yes. Under Section 14.2(b), the indemnification obligation for third-party intellectual property infringement claims is explicitly exempted from the aggregate liability cap defined in Section 15.1.",
  },
  {
    id: "finance",
    name: "Finance & Private Equity",
    badge: "Due Diligence & SEC 10-K Analysis",
    icon: TrendingUp,
    headline: "Instant Cross-Analysis of SEC Filings, Balance Sheets & Earnings Calls",
    description:
      "Investment analysts, private equity associates, and CPAs synthesize complex financial statements, footnote covenants, and quarterly earnings transcripts with tabular precision.",
    painPoint:
      "Financial tables in PDFs lose row/column relationships in standard chatbots, leading to inaccurate numerical inferences and false EBITDA calculations.",
    ragSolution:
      "RagAI's layout normalizer reconstructs multi-page financial tables into Markdown coordinate grids, enabling mathematically grounded deductions.",
    metrics: [
      { label: "Model Ingestion Speed", value: "<15ms" },
      { label: "Tabular Fidelity", value: "100%" },
      { label: "Due Diligence Output", value: "4x Faster" },
    ],
    sampleDoc: "Q3_Consolidated_Financial_Filing.pdf (Table 4.3)",
    sampleQuery:
      "Compare the YoY growth rate of European cloud revenue and reconcile against operating margin expansion.",
    sampleAnswer:
      "European cloud revenue grew by 28.4% YoY ($412M vs. $321M in Q3 prior year), driving a 310 bps expansion in regional operating margin (Table 4.3).",
  },
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    badge: "Clinical Protocols & BioPharma",
    icon: Activity,
    headline: "Synthesize Scientific Whitepapers & Clinical Protocols with Zero Hallucination",
    description:
      "Medical affairs teams, clinical researchers, and biotech founders cross-reference pharmacological trials, FDA submissions, and assay results with cryptographic source verification.",
    painPoint:
      "Generic consumer AI models hallucinate drug dosages and trial parameters, creating unacceptable patient safety and regulatory liabilities.",
    ragSolution:
      "RagAI utilizes strict negative prompt constraints and Natural Language Inference (NLI) verification loops to ensure claims are verifiably rooted in trial data.",
    metrics: [
      { label: "HIPAA Compliant", value: "Ready" },
      { label: "Citation Linkage", value: "100%" },
      { label: "Literature Synthesis", value: "10x" },
    ],
    sampleDoc: "Phase_III_Cohort_Summary_Report.pdf (Page 88)",
    sampleQuery:
      "What were the primary inclusion criteria and adverse event frequencies observed in Cohort B?",
    sampleAnswer:
      "Cohort B inclusion required baseline biomarkers above 4.5 ng/mL (Page 88). Adverse events were restricted to Grade 1 fatigue (12%) and mild nausea (8%), with zero dose-limiting toxicities.",
  },
  {
    id: "engineering",
    name: "Engineering & IT Ops",
    badge: "Architecture Specs & DevOps Runbooks",
    icon: Code2,
    headline: "Turn Scattered Architecture Specs & API Documentation into Instant Answers",
    description:
      "Engineering leads, systems architects, and DevOps teams turn gigabytes of PRDs, OpenAPI specifications, RFCs, and incident post-mortems into an interactive knowledge brain.",
    painPoint:
      "Engineers lose up to 9 hours a week digging through Confluence, Notion, and scattered GitHub repos trying to locate architecture decisions.",
    ragSolution:
      "RagAI indexes entire repositories and architecture documents with hybrid dense-sparse vector search, answering technical questions with exact code chunk anchors.",
    metrics: [
      { label: "Developer Time Saved", value: "9 hrs/wk" },
      { label: "Vector Search Recall", value: "99.4%" },
      { label: "Token Efficiency", value: "+45%" },
    ],
    sampleDoc: "Kubernetes_Distributed_Storage_RFC_v3.pdf (Section 3)",
    sampleQuery:
      "What is our fallback strategy if the primary etcd cluster loses quorum during cross-region failover?",
    sampleAnswer:
      "Per RFC Section 3.4, the cluster triggers read-only degraded mode and begins streaming state snapshot restoration from the geo-replicated S3 bucket with 120s TTL.",
  },
  {
    id: "creative",
    name: "Marketing & Creative Studios",
    badge: "E-Commerce & Digital Agencies",
    icon: Palette,
    headline: "Unify Analytical Research and Visual Creation in One Studio Canvas",
    description:
      "E-commerce brands, marketing directors, and creative agencies generate brand campaign visuals, remove image backgrounds with neural precision, and edit assets without switching tools.",
    painPoint:
      "Creators bounce between fragmented tools: reading briefs in one window, removing backgrounds in Photoshop, and generating mockups in another paid tool.",
    ragSolution:
      "RagAI combines high-resolution image diffusion, one-click sub-pixel neural matting, and an in-browser 60fps editing canvas directly connected to your document library.",
    metrics: [
      { label: "Studio Iteration", value: "Instant" },
      { label: "Matting Resolution", value: "4K UHD" },
      { label: "Photoshop Time Saved", value: "70%" },
    ],
    sampleDoc: "Autumn_Campaign_Visual_Identity_Guide.pdf",
    sampleQuery:
      "Generate a high-converting banner mockup honoring the color palette from our Autumn style guide.",
    sampleAnswer:
      "Extracted Autumn Color Palette (#8B4513, #D2691E, #F4A460) from Brand Guide. Generated 4K studio product shot and cleanly isolated foreground with neural matting.",
  },
];

export default function IndustrySolutions() {
  const [activeTab, setActiveTab] = useState<string>("legal");
  const selected = industries.find((i) => i.id === activeTab) || industries[0];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200/60 text-violet-700 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            Built for High-Trust Industries
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tailored for Enterprises Where <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Accuracy is Non-Negotiable</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Generic chatbots invent answers when data is complex. RagAI is built from first principles for mission-critical operations where every fact must be grounded in primary documents.
          </p>
        </div>

        {/* Industry Tabs Pills */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {industries.map((ind) => {
            const isActive = ind.id === activeTab;
            const Icon = ind.icon;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setActiveTab(ind.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-transparent"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-violet-400" : "text-slate-500"}`} />
                <span>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Industry Showcase Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 p-6 sm:p-10 shadow-xl shadow-slate-200/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Problem & Value Prop */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-100/70 px-3 py-1 rounded-md">
                  {selected.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {selected.headline}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {selected.description}
                </p>
              </div>

              {/* Challenge vs Solution Box */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                    The Industry Challenge:
                  </div>
                  <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                    {selected.painPoint}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
                  <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    The RagAI Solution:
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    {selected.ragSolution}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                {selected.metrics.map((m, idx) => (
                  <div key={idx} className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {m.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{m.label}</div>
                  </div>
                ))}
              </div>

              <div>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-violet-600/20 transition-all"
                >
                  Deploy in {selected.name} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right: Realistic Grounded Query Simulation */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl border border-slate-300/80 bg-white p-6 shadow-2xl shadow-slate-300/30 space-y-4">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-800">
                      Grounded Multi-Doc Query Engine
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    RagAI v2.4
                  </span>
                </div>

                {/* User Prompt Bubble */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    User Inquiry:
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-100 text-slate-800 text-xs sm:text-sm font-medium">
                    &quot;{selected.sampleQuery}&quot;
                  </div>
                </div>

                {/* AI Grounded Response Bubble */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-violet-700 uppercase tracking-wider">
                    <span>RagAI Grounded Response:</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                      100% Citation Grounded
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-200/80 text-slate-800 text-xs sm:text-sm leading-relaxed space-y-3">
                    <p>{selected.sampleAnswer}</p>

                    {/* Interactive Source Citation Pill */}
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-violet-200 text-xs font-medium text-violet-800 shadow-xs">
                      <FileCheck className="h-4 w-4 text-violet-600 shrink-0" />
                      <span className="truncate">Source Anchor: {selected.sampleDoc}</span>
                    </div>
                  </div>
                </div>

                {/* Footnote reassurance */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                  <span>Cryptographic Vector Hash Verified</span>
                  <span className="font-mono">Latency: 14ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

