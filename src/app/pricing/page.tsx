import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { FadeIn } from "@/components/layout/AnimatedPage";
import {
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Crown,
  X,
  ShieldCheck,
  Building2,
  Lock,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "Pricing Plans for Individuals, Teams & Enterprises | RagAI",
  description:
    "Transparent pricing designed for professional researchers, legal teams, financial analysts, and enterprise knowledge workers. Start free, scale securely.",
};

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever free",
    badge: "Free Exploration",
    description:
      "Essential grounded document search and basic generative tools for students and individual researchers.",
    icon: Sparkles,
    color: "from-slate-600 to-slate-700",
    highlight: false,
    features: [
      { text: "5 document uploads per month", included: true },
      { text: "50 grounded AI queries / month", included: true },
      { text: "Single-document chat synthesis", included: true },
      { text: "Direct source citation links", included: true },
      { text: "Standard document converter (16+ formats)", included: true },
      { text: "Standard background removal (5 / month)", included: true },
      { text: "Cross-document multi-hop reasoning", included: false },
      { text: "Priority neural processing queue", included: false },
      { text: "Enterprise SOC-2 / HIPAA compliance", included: false },
      { text: "Dedicated API access & webhook keys", included: false },
    ],
    cta: "Start Free",
    ctaLink: "/register",
    buttonVariant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$29",
    period: "per seat / month",
    badge: "Most Popular for Businesses",
    description:
      "Designed for attorneys, financial auditors, consultants, and knowledge workers who demand citation perfection.",
    icon: Zap,
    color: "from-violet-600 to-indigo-600",
    highlight: true,
    features: [
      { text: "Unlimited document uploads (up to 150MB/file)", included: true },
      { text: "Unlimited citation-grounded queries", included: true },
      { text: "Cross-document multi-hop synthesis", included: true },
      { text: "Optical layout parser for tables & scans", included: true },
      { text: "Unlimited neural background removal", included: true },
      { text: "High-resolution AI image diffusion studio", included: true },
      { text: "Export synthesis reports to PDF & DOCX", included: true },
      { text: "Priority GPU compute cluster", included: true },
      { text: "Zero data retention enterprise pledge", included: true },
      { text: "Dedicated API keys & SDK access", included: false },
    ],
    cta: "Start 14-Day Free Trial",
    ctaLink: "/register",
    buttonVariant: "primary" as const,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per seat / billed annually",
    badge: "Full Firm Governance",
    description:
      "Engineered for law firms, hedge funds, hospital networks, and tech corporations with rigorous compliance mandates.",
    icon: Crown,
    color: "from-amber-600 to-orange-600",
    highlight: false,
    features: [
      { text: "All Professional features included", included: true },
      { text: "Dedicated isolated vector namespace", included: true },
      { text: "Full REST & Python SDK API access", included: true },
      { text: "Custom chunking & embedding fine-tuning", included: true },
      { text: "Team workspace with granular RBAC permissions", included: true },
      { text: "SOC-2 Type II & HIPAA compliance bundle", included: true },
      { text: "Single Sign-On (SAML, Okta, Azure AD)", included: true },
      { text: "99.99% uptime SLA guarantee", included: true },
      { text: "Immutable audit logs & access tracking", included: true },
      { text: "Dedicated Customer Success Architect", included: true },
    ],
    cta: "Contact Enterprise Sales",
    ctaLink: "/register",
    buttonVariant: "outline" as const,
  },
];

const comparisonCategories = [
  {
    name: "Document Ingestion & RAG Capabilities",
    features: [
      { name: "Monthly Document Uploads", starter: "5 files", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Max File Size per Document", starter: "15 MB", pro: "150 MB", enterprise: "500 MB (Customizable)" },
      { name: "Supported Formats (PDF, DOCX, XLSX, TXT)", starter: "Standard", pro: "Advanced + Scans", enterprise: "All Formats + Custom Parser" },
      { name: "Optical Layout Analysis (Tables, Charts)", starter: "Basic", pro: "Yes (High Accuracy)", enterprise: "Yes (Specialized Financial/Legal)" },
      { name: "Cross-Document Multi-Hop Search", starter: "No", pro: "Up to 50 docs", enterprise: "Unlimited Whole-Firm Corpus" },
      { name: "Source Citation Anchors & Verifications", starter: "Basic Page", pro: "Exact Paragraph & Table", enterprise: "Exact Snippet + Cryptographic Hash" },
    ],
  },
  {
    name: "Generative Media & Creative Studio",
    features: [
      { name: "High-Resolution Image Diffusion", starter: "10 / month", pro: "Unlimited", enterprise: "Unlimited + Dedicated GPUs" },
      { name: "Neural Background Removal Matting", starter: "5 / month", pro: "Unlimited", enterprise: "Unlimited Batch Processing" },
      { name: "Universal Document Format Converter", starter: "Standard", pro: "Fast Batch Queue", enterprise: "Dedicated High-Throughput Cluster" },
      { name: "Free Commercial Stock Assets Gallery", starter: "Yes", pro: "Yes + High-Res Download", enterprise: "Yes + Whitelisted API Ingestion" },
    ],
  },
  {
    name: "Security, Governance & Support",
    features: [
      { name: "Data Retention Policy", starter: "Standard (30 days)", pro: "Zero Data Retention Option", enterprise: "Strict Zero Data Retention SLA" },
      { name: "Model Training on User Data", starter: "Never", pro: "Never", enterprise: "Contractual Zero-Training Guarantee" },
      { name: "SOC-2 Type II & HIPAA Compliance", starter: "No", pro: "Standard Encryption", enterprise: "BAA Available & Compliance Audits" },
      { name: "Single Sign-On (SAML / Okta / Azure AD)", starter: "No", pro: "No", enterprise: "Included" },
      { name: "Support Response Time", starter: "Community / Email", pro: "Priority Email (<4 hours)", enterprise: "Dedicated 24/7 Slack Channel & Phone" },
    ],
  },
];

const faqs = [
  {
    q: "How does the 14-day free trial for Professional work?",
    a: "You get full, unrestricted access to the complete Professional tier for 14 days without entering a credit card. You can upload entire document sets, test cross-document synthesis, and run neural image diffusion at full speed.",
  },
  {
    q: "Will our proprietary business documents ever be used to train AI models?",
    a: "No. Absolutely not. Under no circumstances are your uploaded documents, queries, or generated outputs used for model training or weight adjustments. We enforce strict multi-tenant isolation and ephemeral memory processing.",
  },
  {
    q: "What file formats does RagAI parse and vectorize?",
    a: "RagAI natively parses PDF (including OCR scanned documents), DOCX, TXT, XLSX spreadsheets, PPTX presentations, CSV files, and HTML. Our optical layout engine recognizes embedded financial tables, columns, and nested lists.",
  },
  {
    q: "Can I add team members and collaborate on the same knowledge base?",
    a: "Yes. The Enterprise tier includes team workspaces with Role-Based Access Control (Admin, Editor, Viewer), allowing entire departments to share grounded knowledge bases while maintaining departmental data separation.",
  },
  {
    q: "What happens if I decide to cancel my subscription?",
    a: "You can cancel anytime from your account settings with a single click. Your plan will remain active until the end of the billing period, and you can export all your synthesized reports and extracted documents anytime.",
  },
  {
    q: "Do you offer custom onboarding and enterprise procurement agreements?",
    a: "Yes. For our Enterprise customers, we offer customized master services agreements (MSAs), security questionnaires, HIPAA Business Associate Agreements (BAAs), and dedicated deployment engineering.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-violet-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-16 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 border border-violet-200/80 text-violet-700 text-xs font-semibold mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Transparent, Value-Driven Investment
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
              Predictable pricing for{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 bg-clip-text text-transparent">
                serious enterprise teams
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Eliminate research hours and citation errors. Choose the plan that fits your firm&apos;s data volume and governance requirements.
            </p>
          </FadeIn>

          {/* Quick Assurance Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>14-day free trial on Pro</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-violet-600" />
              <span>Zero model training guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              <span>Cancel or switch anytime</span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div
                  className={`relative flex flex-col h-full rounded-3xl p-8 sm:p-10 transition-all duration-300 ${
                    plan.highlight
                      ? "bg-white border-2 border-violet-600 shadow-2xl shadow-violet-500/15 ring-4 ring-violet-600/10 lg:-translate-y-2 z-10"
                      : "bg-white border border-slate-200/80 shadow-md hover:shadow-xl hover:border-slate-300"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md tracking-wide uppercase">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {!plan.highlight && (
                    <div className="mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                      <div
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} text-white shadow-md`}
                      >
                        <plan.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed min-h-[42px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-slate-100 flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900 tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      / {plan.period}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 flex-1 mb-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      What&apos;s Included:
                    </p>
                    {plan.features.map((feature, fi) => (
                      <div
                        key={fi}
                        className={`flex items-start gap-3 text-sm ${
                          feature.included ? "text-slate-700" : "text-slate-400"
                        }`}
                      >
                        {feature.included ? (
                          <div className="rounded-full bg-emerald-50 border border-emerald-200 p-0.5 mt-0.5 shrink-0">
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          </div>
                        ) : (
                          <div className="rounded-full bg-slate-100 p-0.5 mt-0.5 shrink-0">
                            <X className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                        )}
                        <span className="leading-snug">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link href={plan.ctaLink} className="w-full">
                    <Button
                      variant={plan.buttonVariant}
                      className={`w-full justify-center py-3.5 text-sm font-semibold rounded-xl transition-all shadow-sm ${
                        plan.highlight
                          ? "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20 hover:shadow-md"
                          : "border-slate-300 text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Full Feature Comparison Matrix */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/80">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Detailed Feature Comparison
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Review side-by-side specifications to choose the right infrastructure scale for your organization.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="py-4 px-6 font-bold w-2/5">Capability</th>
                    <th className="py-4 px-4 font-bold text-center w-1/5">Starter</th>
                    <th className="py-4 px-4 font-bold text-center w-1/5 text-violet-700 bg-violet-50/50">
                      Professional
                    </th>
                    <th className="py-4 px-4 font-bold text-center w-1/5">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonCategories.map((category) => (
                    <tr key={category.name} className="contents">
                      <tr className="bg-slate-100/60 font-semibold text-slate-800 text-xs uppercase tracking-wider">
                        <td colSpan={4} className="py-3 px-6 text-slate-700 font-bold">
                          {category.name}
                        </td>
                      </tr>
                      {category.features.map((feature, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-6 font-medium text-slate-800">
                            {feature.name}
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-600">
                            {feature.starter}
                          </td>
                          <td className="py-3.5 px-4 text-center font-medium text-slate-900 bg-violet-50/30">
                            {feature.pro}
                          </td>
                          <td className="py-3.5 px-4 text-center font-semibold text-slate-900">
                            {feature.enterprise}
                          </td>
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Enterprise Security & Guarantee Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-violet-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" /> Enterprise Security Protocol
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Need customized compliance, on-premise vectorization, or volume invoicing?
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

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold mb-3">
              <HelpCircle className="h-3.5 w-3.5 text-violet-600" /> Got Questions?
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Everything you need to know about billing, privacy, and team management.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-violet-300 transition-colors">
                  <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-3">
                    <span className="text-violet-600 font-extrabold">Q:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-sm text-slate-600 pl-6 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Pre-Footer Call to Action */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-10 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Unlock Truthful, Verified Knowledge Retrieval Today
              </h2>
              <p className="text-base sm:text-lg text-violet-100 leading-relaxed max-w-xl mx-auto">
                No credit card required. Upload your first documents and experience hallucination-free AI answers in under 60 seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button className="w-full justify-center bg-white text-violet-900 hover:bg-slate-100 font-bold px-8 py-3.5 rounded-xl shadow-lg text-sm">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full justify-center border-white/40 text-white hover:bg-white/10 font-semibold px-6 py-3.5 rounded-xl text-sm"
                  >
                    Explore Technical Specs
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
