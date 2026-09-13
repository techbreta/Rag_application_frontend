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
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
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
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Welcome Back</h1>
            <p className="text-sm text-slate-500">
              Sign in to continue to your AI workspace
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Work Email"
              type="email"
              placeholder="you@company.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 font-medium">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-violet-600 hover:text-violet-700 font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full justify-center bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md"
              size="lg"
              isLoading={isLoading}
            >
              Sign In to Workspace
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-violet-600 hover:text-violet-700 font-bold transition-colors"
            >
              Create free account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}