"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Files,
  MessagesSquare,
  LayoutDashboard,
  ImageIcon,
  BookOpen,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "All Users", icon: Users },
  { href: "/dashboard/admin/documents", label: "All Documents", icon: Files },
  { href: "/dashboard/admin/chats", label: "All Chats", icon: MessagesSquare },
  { href: "/dashboard/admin/images", label: "All Images", icon: ImageIcon },
  { href: "/dashboard/admin/blogs", label: "All Blogs", icon: BookOpen },
  { href: "/dashboard/admin/contacts", label: "Inquiries", icon: Mail },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthorized = user?.role === "superadmin" || user?.role === "admin";

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthorized, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="p-3 rounded-full bg-red-500/10 text-red-400 mb-4 border border-red-500/20">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400 max-w-md mb-6">
          You do not have permission to view the Super Admin portal. Only administrators and superadmins have access.
        </p>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-medium text-sm hover:bg-violet-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Super Admin Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 shadow-inner">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Super Admin Portal
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {user?.role || "superadmin"}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Monitor all platform users, uploaded documents, AI chat transcripts, and enterprise inquiries
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 pt-2 border-t border-slate-800/80">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/dashboard/admin"
                ? pathname === "/dashboard/admin"
                : pathname?.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0",
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/50"
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div>{children}</div>
    </div>
  );
}

