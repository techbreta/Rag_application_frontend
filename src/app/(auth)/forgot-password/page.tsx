"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { GlowingOrb } from "@/components/layout/AnimatedPage";

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
      toast.success("Reset email sent!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 overflow-hidden">
      <GlowingOrb className="w-96 h-96 bg-violet-600 top-20 right-20" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-sm text-slate-400">
              {sent
                ? "Check your email for a reset link"
                : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex rounded-full bg-emerald-500/10 p-4 mb-4">
                <Mail className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-sm text-slate-300">
                We&apos;ve sent a password reset link to your email address.
              </p>
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
