"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ImageIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/dashboard/history", label: "Chat History", icon: History },
  { href: "/dashboard/generate-image", label: "Generate Image", icon: Sparkles },
  { href: "/dashboard/images", label: "Image Gallery", icon: ImageIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center h-14 px-4 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="ml-3">
          <Image
            src="/rag.png"
            alt="RagAI Logo"
            width={100}
            height={40}
            priority
            className="h-20 w-auto"
          />
        </Link>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 md:z-40 flex h-screen flex-col border-r border-slate-800 bg-slate-950 backdrop-blur-xl transition-all duration-300 overflow-y-auto",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/rag.png"
              alt="RagAI Logo"
              width={collapsed ? 40 : 120}
              height={collapsed ? 40 : 48}
              priority
              className={cn(
                "transition-all duration-300 object-contain",
                collapsed ? "h-40" : "h-40 w-auto",
              )}
            />
          </Link>
          {/* Close button on mobile, collapse toggle on desktop */}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileOpen(false);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="md:hidden">
              <X className="h-4 w-4" />
            </span>
            <span className="hidden md:block">
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </span>
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
      </aside>
    </>
  );
}
