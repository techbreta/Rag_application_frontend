"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setSent(true);
      toast.success("Reset link sent!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 selection:bg-violet-600 selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex mb-4">
              <Image
                src="/rag.png"
                alt="RagAI Logo"
                width={160}
                height={62}
                priority
                className="h-14 w-auto object-contain mx-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
              Reset Your Password
            </h1>
            <p className="text-sm text-slate-500">
              Enter your email and we&apos;ll send you a recovery link
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 mb-2">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Check your inbox</h2>
              <p className="text-sm text-slate-600">
                We have emailed password reset instructions to your address if an account exists.
              </p>
              <Link href="/login" className="inline-block mt-4 w-full">
                <Button variant="outline" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <Button
                type="submit"
                className="w-full justify-center bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md"
                size="lg"
                isLoading={isLoading}
              >
                Send Recovery Instructions
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

