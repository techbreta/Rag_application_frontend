"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

function VerificationContent() {
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const token = searchParams?.get("token");
    if (token) {
      verifyEmail(token)
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [searchParams, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 selection:bg-violet-600 selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-xl text-center">
          {status === "loading" && (
            <div className="space-y-4 py-6">
              <Loader2 className="h-12 w-12 text-violet-600 animate-spin mx-auto" />
              <h2 className="text-lg font-bold text-slate-900">Verifying your email...</h2>
              <p className="text-sm text-slate-500">Please wait a moment while we validate your token.</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4 py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 mb-2"
              >
                <CheckCircle2 className="h-12 w-12" />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-900">Email Verified!</h2>
              <p className="text-sm text-slate-600">
                Your account is confirmed and ready to query documents.
              </p>
              <div className="pt-4">
                <Link href="/dashboard">
                  <Button className="w-full justify-center bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl shadow-sm">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4 py-4">
              <div className="inline-flex p-3 rounded-full bg-red-50 text-red-600 mb-2">
                <XCircle className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Verification Failed</h2>
              <p className="text-sm text-slate-600">
                This verification link is invalid or has expired. Please sign in or request a new link.
              </p>
              <div className="pt-4 flex flex-col gap-2">
                <Link href="/login">
                  <Button className="w-full justify-center bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl shadow-sm">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}