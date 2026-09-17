"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  Shield,
  Lock,
  CheckCircle2,
  Mail,
  Send,
  Sparkles,
  Building2,
  User,
  Phone,
  HelpCircle,
  Clock,
  Headphones,
  Check,
} from "lucide-react";

type InquiryCategory = "security" | "sales" | "support" | "partnership" | "general";

const INQUIRY_CATEGORIES: { id: InquiryCategory; label: string; icon: any; description: string }[] = [
  {
    id: "security",
    label: "Security & Custom VPC",
    icon: Shield,
    description: "Air-gapped clusters, on-premise vectorization, dedicated BAAs & SOC-2 reports",
  },
  {
    id: "sales",
    label: "Enterprise Licensing",
    icon: Building2,
    description: "Volume seat licensing, tailored vector quotas, customized enterprise invoicing",
  },
  {
    id: "support",
    label: "Architecture & Support",
    icon: Headphones,
    description: "Technical integration, latency profiling, hybrid search & reranker setup",
  },
  {
    id: "partnership",
    label: "Partnership & Research",
    icon: Sparkles,
    description: "AI model providers, OEM embedding integration, joint academic publications",
  },
  {
    id: "general",
    label: "General Inquiries",
    icon: Mail,
    description: "Media inquiries, product questions, executive dispatch, or miscellaneous requests",
  },
];

function ContactContent() {
  const searchParams = useSearchParams();

  const [inquiryType, setInquiryType] = useState<InquiryCategory>("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Sync inquiry type from URL query string if provided (e.g. /contact?type=security)
  useEffect(() => {
    const typeParam = searchParams?.get("type")?.toLowerCase();
    if (typeParam) {
      const match = INQUIRY_CATEGORIES.find((cat) => cat.id === typeParam);
      if (match) {
        setInquiryType(match.id);
        if (match.id === "security" && !subject) {
          setSubject("Request for Enterprise VPC & Security Architecture Review");
        } else if (match.id === "sales" && !subject) {
          setSubject("Inquiry: Enterprise Tier Quota & Volume Licensing");
        }
      }
    }
  }, [searchParams, subject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid work email.");
      return;
    }

    if (!subject.trim()) {
      toast.error("Please provide a subject line.");
      return;
    }

    if (!message.trim() || message.trim().length < 15) {
      toast.error("Please write a detailed message (at least 15 characters).");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to our enterprise communication policy.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company.trim(),
        role: role.trim(),
        phone: phone.trim(),
        inquiryType,
        subject: subject.trim(),
        message: message.trim(),
      };

      const res = await api.post("/v1/contact", payload);

      if (res.data?.status === "success" || res.status === 201) {
        setIsSuccess(true);
        setSubmissionId(res.data?.data?._id || `REQ-${Date.now().toString(36).toUpperCase()}`);
        toast.success("Inquiry submitted successfully!");
      } else {
        throw new Error(res.data?.message || "Failed to submit inquiry.");
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email ||
        "An unexpected error occurred. Please try again or reach out directly.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setName("");
    setEmail("");
    setCompany("");
    setRole("");
    setPhone("");
    setSubject("");
    setMessage("");
    setAgreeTerms(false);
    setSubmissionId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-violet-100 selection:text-violet-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Header Hero Section */}
        <div className="max-w-6xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-semibold shadow-xs">
            <Shield className="h-3.5 w-3.5 text-violet-600" />
            <span>Dedicated Enterprise AI Advisory</span>
            <span className="h-1 w-1 rounded-full bg-violet-400" />
            <span className="text-violet-600 font-medium">Guaranteed 4-Hour Response SLA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Connect with Our Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">AI Architects</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Whether you require isolated VPC vectorization, custom BAA compliance, volume document processing, or specialized neural pipelines — our engineering leads are ready to collaborate.
          </p>
        </div>

        {/* Main Grid: Form + Trust/Contact Sidebar */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left / Main Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-10 relative overflow-hidden">
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600" />

              {isSuccess ? (
                /* Success Confirmation State */
                <div className="py-10 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                  <div className="w-18 h-18 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <span className="inline-block px-3 py-1 text-xs font-mono font-bold uppercase rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      Ref: {submissionId}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Inquiry Received Successfully
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Thank you for contacting RagAI Enterprise. Your request has been assigned to our senior solutions team. You will receive a direct technical response at <strong className="text-slate-900">{email}</strong> within 4 business hours.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-left text-xs text-slate-600 space-y-1.5 max-w-md mx-auto">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-violet-600" />
                      Next Steps:
                    </div>
                    <p>• Our security architect will review your VPC / deployment parameters.</p>
                    <p>• We will send a secure link to schedule a 30-minute technical deep-dive.</p>
                    <p>• A customized compliance dossier (SOC-2 & BAA) will be generated.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto"
                    >
                      Submit Another Inquiry
                    </Button>
                    <Link href="/features" className="w-full sm:w-auto">
                      <Button className="bg-slate-900 hover:bg-slate-800 text-white w-full">
                        Explore Platform Specs
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Contact Submission Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Select Inquiry Category */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      1. Select Inquiry Topic
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {INQUIRY_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = inquiryType === cat.id;
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setInquiryType(cat.id)}
                            className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                              isSelected
                                ? "bg-violet-50/80 border-violet-500 shadow-xs ring-1 ring-violet-500"
                                : "bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/60 hover:border-slate-300"
                            } ${cat.id === "general" ? "sm:col-span-2" : ""}`}
                          >
                            <div
                              className={`p-2 rounded-xl shrink-0 ${
                                isSelected
                                  ? "bg-violet-600 text-white shadow-xs"
                                  : "bg-white text-slate-600 border border-slate-200"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-xs font-bold ${
                                    isSelected ? "text-violet-950" : "text-slate-800"
                                  }`}
                                >
                                  {cat.label}
                                </span>
                                {isSelected && (
                                  <Check className="h-3 w-3 text-violet-600 shrink-0 ml-auto" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {cat.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Contact Information */}
                  <div className="space-y-4 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      2. Your Information
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300/90 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 shadow-xs"
                          />
                        </div>
                      </div>

                      {/* Work Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                          Work Email <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300/90 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 shadow-xs"
                          />
                        </div>
                      </div>

                      {/* Company Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                          Company / Organization
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Acme Global Inc"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300/90 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 shadow-xs"
                          />
                        </div>
                      </div>

                      {/* Role */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                          Job Role / Title
                        </label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. VP of Engineering / CISO"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300/90 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Phone (Optional) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                        Direct Phone / WhatsApp <span className="text-slate-400 text-[11px]">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 019-2834"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300/90 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Message & Subject */}
                  <div className="space-y-4 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      3. Inquiry Details
                    </label>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                        Subject Line <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. On-Premise VPC Cluster Consultation for Legal Knowledge Base"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300/90 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 shadow-xs"
                      />
                    </div>

                    {/* Message Body */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                        <label className="flex items-center gap-1">
                          Message / Specifications <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-slate-400 text-[11px]">
                          {message.length} / 5000
                        </span>
                      </div>
                      <textarea
                        required
                        rows={5}
                        maxLength={5000}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your architecture requirements, document throughput, compliance prerequisites, or questions in detail..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300/90 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 shadow-xs resize-y"
                      />
                    </div>

                    {/* Compliance Checkbox */}
                    <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30"
                      />
                      <span className="text-xs text-slate-500 leading-relaxed">
                        I confirm this inquiry is for commercial or technical evaluation. I agree to RagAI&apos;s{" "}
                        <Link href="/privacy" className="text-violet-600 hover:underline">
                          Privacy Policy
                        </Link>{" "}
                        and direct email correspondence with an assigned solutions architect.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>Routing to Solutions Architect...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Transmit Enterprise Inquiry</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Trust Signals, Security Pillars & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Communication Cards */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Mail className="h-4 w-4 text-violet-600" /> Direct Communication Desks
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Enterprise Licensing & Sales</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Response &lt;2h
                    </span>
                  </div>
                  <a
                    href="mailto:sales@ragai.website"
                    className="text-xs text-violet-600 hover:underline font-mono mt-1 inline-block"
                  >
                    sales@ragai.website
                  </a>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Security & Vulnerability Desk</span>
                    <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                      PGP Encrypted
                    </span>
                  </div>
                  <a
                    href="mailto:security@ragai.website"
                    className="text-xs text-violet-600 hover:underline font-mono mt-1 inline-block"
                  >
                    security@ragai.website
                  </a>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Technical API Support</span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                      24/7/365
                    </span>
                  </div>
                  <a
                    href="mailto:support@techbreta.com"
                    className="text-xs text-violet-600 hover:underline font-mono mt-1 inline-block"
                  >
                    support@techbreta.com
                  </a>
                </div>
              </div>
            </div>

            {/* Enterprise Security Commitment Card */}
            <div className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white rounded-3xl p-7 shadow-xl space-y-5 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-violet-600/30 border border-violet-500/30 text-violet-300">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base tracking-tight text-white">
                    Zero-Retention Trust Framework
                  </h4>
                  <p className="text-xs text-slate-400">
                    Engineered for audited compliance & data isolation
                  </p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>SOC-2 Type II Certified:</strong> Continuous third-party auditing with comprehensive access controls.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>HIPAA BAA Ready:</strong> Full support for healthcare organizations with executed Business Associate Agreements.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Isolated VPC Deployments:</strong> Zero multi-tenant vector leakage. Run inside your AWS, Azure, or GCP perimeter.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero-Training Guarantee:</strong> Your enterprise document embeddings are never used to train foundation models.
                  </span>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Current SLA status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  99.99% Systems Operational
                </span>
              </div>
            </div>

            {/* Global Coverage & SLA Badge */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-violet-600" />
                Global Deployment Regions
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                RagAI vectors are processed across low-latency edge zones ensuring local data residency compliance:
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="font-bold text-slate-800">US-East</div>
                  <div className="text-[10px] text-slate-500">N. Virginia</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="font-bold text-slate-800">EU-Central</div>
                  <div className="text-[10px] text-slate-500">Frankfurt (GDPR)</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="font-bold text-slate-800">AP-East</div>
                  <div className="text-[10px] text-slate-500">Tokyo / SG</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fast FAQ Section */}
        <section className="max-w-4xl mx-auto mt-20 pt-12 border-t border-slate-200/80">
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <HelpCircle className="h-3.5 w-3.5 text-violet-600" /> Frequently Asked Inquiries
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Enterprise Consultation FAQ
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="text-sm font-bold text-slate-900">
                Can we trial on-premise VPC vectorization prior to rollout?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. We offer fully configured 14-day sandbox VPC deployments with synthetic benchmark datasets, enabling your security engineers to validate isolation, encryption keys, and latency.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="text-sm font-bold text-slate-900">
                Do you sign custom Enterprise BAAs and DPAs?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. Our legal team provides customized Business Associate Agreements (BAA) for HIPAA compliance, as well as GDPR-compliant Data Processing Addendums with standard contractual clauses.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="text-sm font-bold text-slate-900">
                What are the available billing arrangements?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enterprise tiers support annual invoicing with Net-30/Net-60 payment terms, wire transfer / ACH, and AWS / Azure Marketplace consolidated billing drawdown.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="text-sm font-bold text-slate-900">
                How fast is technical onboarding?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard cloud deployments take less than 5 minutes. On-premise Helm / Terraform infrastructure kits typically achieve complete deployment within 48 hours.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-violet-600" />
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}

