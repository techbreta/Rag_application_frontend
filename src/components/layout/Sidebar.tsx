"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  History,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/dashboard/history", label: "Chat History", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-800 bg-slate-950/95 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 p-2 shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xl font-bold text-white overflow-hidden whitespace-nowrap"
              >
                RAG<span className="text-violet-400">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 relative z-10",
                  isActive && "text-violet-400",
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-slate-800 p-3 space-y-2">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5",
            collapsed && "justify-center",
          )}
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || ""}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
