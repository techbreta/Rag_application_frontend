

import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { FadeIn, GlowingOrb } from "@/components/layout/AnimatedPage";
import { Check, ArrowRight, Sparkles, Zap, Crown, X } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description:
      "Perfect for getting started and exploring RagAI capabilities.",
    icon: Sparkles,
    color: "from-slate-500 to-slate-600",
    highlight: false,
    features: [
      { text: "5 document uploads", included: true },
      { text: "50 queries per month", included: true },
      { text: "All documents chat mode", included: true },
      { text: "Chat history", included: true },
      { text: "Basic source citations", included: true },
      { text: "Multi-document mode", included: false },
      { text: "Priority processing", included: false },
      { text: "API access", included: false },
    ],
    cta: "Get Started",
    ctaLink: "/register",
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For professionals who need more power and flexibility.",
    icon: Zap,
    color: "from-violet-500 to-indigo-600",
    highlight: true,
    features: [
      { text: "Unlimited document uploads", included: true },
      { text: "Unlimited queries", included: true },
      { text: "All chat modes", included: true },
      { text: "Full chat history", included: true },
      { text: "Detailed source citations", included: true },
      { text: "Multi-document mode", included: true },
      { text: "Priority processing", included: true },
      { text: "API access", included: false },
    ],
    cta: "Start Free Trial",
    ctaLink: "/register",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For teams and organizations with advanced needs.",
    icon: Crown,
    color: "from-amber-500 to-orange-600",
    highlight: false,
    features: [
      { text: "Unlimited everything", included: true },
      { text: "Unlimited queries", included: true },
      { text: "All chat modes", included: true },
      { text: "Full chat history", included: true },
      { text: "Detailed source citations", included: true },
      { text: "Multi-document mode", included: true },
      { text: "Priority processing", included: true },
      { text: "Full API access", included: true },
    ],
    cta: "Contact Sales",
    ctaLink: "/register",
  },
];

const faqs = [
  {
    q: "Can I change plans later?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    q: "What file formats are supported?",
    a: "We support PDF, DOCX, and TXT file formats. More formats coming soon.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Yes! Pro plan comes with a 14-day free trial. No credit card required.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data is retained for 30 days after cancellation, giving you time to export or re-subscribe.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4">
        <GlowingOrb className="top-20 left-1/4 bg-violet-500" />
        <GlowingOrb className="top-40 right-1/4 bg-indigo-600" />

        <div className="relative max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Simple Pricing
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Choose your{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                plan
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Start for free, upgrade when you need more. No hidden fees, no
              surprises.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div
                // whileHover={{ y: -4 }}
                className={`relative flex flex-col rounded-2xl border p-8 backdrop-blur-sm h-full ${
                  plan.highlight
                    ? "border-violet-500/50 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 shadow-lg shadow-violet-500/10"
                    : "border-slate-800 bg-slate-900/50"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} mb-4`}
                  >
                    <plan.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 ml-2 text-sm">
                    / {plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature, fi) => (
                    <li
                      key={fi}
                      className={`flex items-center gap-3 text-sm ${
                        feature.included ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {feature.included ? (
                        <Check className="h-4 w-4 text-violet-400 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-slate-700 shrink-0" />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={plan.ctaLink}>
                  <Button
                    variant={plan.highlight ? "primary" : "outline"}
                    className="w-full"
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

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently asked questions
            </h2>
          </FadeIn>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                  <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-400">{faq.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center rounded-3xl border border-slate-800 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start for free today
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              No credit card required. Upload your documents and start asking
              questions in minutes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register">
                <Button>
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline">View Features</Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          © {new Date().getFullYear()} RagAI. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
