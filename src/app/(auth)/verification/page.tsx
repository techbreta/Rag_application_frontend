"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 text-violet-400 animate-spin mx-auto" />
            <p className="text-slate-300">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
            <p className="text-slate-400">
              Your email has been verified successfully.
            </p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="h-16 w-16 text-red-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">
              Verification Failed
            </h2>
            <p className="text-slate-400">
              The verification link is invalid or has expired.
            </p>
            <Link href="/login">
              <Button>Back to Login</Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <Loader2 className="h-12 w-12 text-violet-400 animate-spin" />
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}
