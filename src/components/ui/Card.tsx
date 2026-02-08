"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function Card({
  children,
  className,
  hover = false,
  glow = false,
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm",
        hover && "cursor-pointer hover:border-violet-500/30 transition-colors",
        glow && "shadow-lg shadow-violet-500/5",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
