"use client";

import { motion } from "framer-motion";
import { FileText, AlertCircle, Search } from "lucide-react";

interface EmptyStateProps {
  icon?: "document" | "error" | "search";
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon = "document",
  title,
  description,
  action,
}: EmptyStateProps) {
  const icons = {
    document: FileText,
    error: AlertCircle,
    search: Search,
  };

  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="rounded-2xl bg-slate-800/50 p-4 mb-4">
        <Icon className="h-10 w-10 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
