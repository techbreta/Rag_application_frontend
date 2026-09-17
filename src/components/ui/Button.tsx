"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "white"
    | "outline-white";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20",
      secondary:
        "bg-slate-900 text-white hover:bg-slate-800 border border-slate-900 shadow-xs",
      outline:
        "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs",
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      danger:
        "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20",
      white:
        "bg-white text-slate-900 font-bold hover:bg-slate-100 hover:text-slate-950 shadow-xl shadow-black/10 border border-transparent",
      "outline-white":
        "border border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 backdrop-blur-md font-semibold shadow-xs",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs font-semibold",
      md: "px-5 py-2.5 text-sm font-semibold",
      lg: "px-8 py-3.5 text-base font-semibold",
    };

    return (
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        ref={ref as any}
        className={cn(
          "inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
export default Button;

