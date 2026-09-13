"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import Badge from "@/components/ui/Badge";
import {
  Users,
  Files,
  MessagesSquare,
  MessageCircle,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/date";

interface AdminStats {
  totalUsers: number;
  totalDocuments: number;
  totalChats: number;
  totalMessages: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  recentUsers: any[];
  recentDocuments: any[];
  recentChats: any[];
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/v1/admin/stats");
        setStats(data.data);
      } catch (err: any) {
        console.error("Failed to load admin stats:", err);
        setError(err.response?.data?.message || "Failed to load platform stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          <div className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
        <p className="font-semibold">{error || "Failed to load admin dashboard"}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/30 text-white text-xs hover:bg-red-600/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Platform Users",
      value: stats.totalUsers,
      subValue: `+${stats.newUsersThisWeek} this week`,
      icon: Users,
      color: "from-violet-500/20 to-indigo-500/20",
      textColor: "text-violet-400",
      borderColor: "border-violet-500/30",
      href: "/dashboard/admin/users",
    },
    {
      title: "Uploaded Documents",
      value: stats.totalDocuments,
      subValue: "Knowledge base files",
      icon: Files,
      color: "from-blue-500/20 to-cyan-500/20",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      href: "/dashboard/admin/documents",
    },
    {
      title: "AI Chat Sessions",
      value: stats.totalChats,
      subValue: "Active conversations",
      icon: MessagesSquare,
      color: "from-emerald-500/20 to-teal-500/20",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      href: "/dashboard/admin/chats",
    },
    {
      title: "Total Messages Exchanged",
      value: stats.totalMessages,
      subValue: "Queries & AI responses",
      icon: MessageCircle,
      color: "from-pink-500/20 to-rose-500/20",
      textColor: "text-pink-400",
      borderColor: "border-pink-500/30",
      href: "/dashboard/admin/chats",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href} className="block group">
            <div
              className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:border-violet-500/50 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  {card.title}
                </span>
                <div
                  className={`p-2 rounded-xl bg-gradient-to-br ${card.color} ${card.textColor} border border-white/5`}
                >
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-white tracking-tight">
                  {card.value.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <span>{card.subValue}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Grid: Recent Users & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-bold text-white">Recent Users</h2>
            </div>
            <Link
              href="/dashboard/admin/users"
              className="text-xs font-medium text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              <span>View all ({stats.totalUsers})</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60">
            {stats.recentUsers.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No users found</p>
            ) : (
              stats.recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {u.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        u.role === "superadmin"
                          ? "error"
                          : u.role === "admin"
                          ? "warning"
                          : "default"
                      }
                    >
                      {u.role}
                    </Badge>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      {formatDistanceToNow(u.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Documents Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Files className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Recent Documents</h2>
            </div>
            <Link
              href="/dashboard/admin/documents"
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>View all ({stats.totalDocuments})</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60">
            {stats.recentDocuments.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No documents uploaded yet
              </p>
            ) : (
              stats.recentDocuments.map((doc) => (
                <div
                  key={doc._id}
                  className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate flex items-center gap-2">
                      <span className="truncate">{doc.fileName}</span>
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      by {doc.userId?.name || doc.userId?.email || "Unknown"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        doc.status === "ready"
                          ? "success"
                          : doc.status === "processing"
                          ? "warning"
                          : "error"
                      }
                    >
                      {doc.status}
                    </Badge>
                    <span className="text-[11px] text-slate-500">
                      {doc.totalChunks || 0} chunks
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Chats Card (Full Width) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessagesSquare className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Recent Chat Conversations</h2>
          </div>
          <Link
            href="/dashboard/admin/chats"
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>View all chats ({stats.totalChats})</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/60">
          {stats.recentChats.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No conversations recorded yet
            </p>
          ) : (
            stats.recentChats.map((chat) => (
              <div
                key={chat._id}
                className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {chat.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    User:{" "}
                    <span className="text-violet-400 font-medium">
                      {chat.userId?.name || chat.userId?.email || "Unknown"}
                    </span>
                    {chat.documentId?.fileName && (
                      <>
                        {" "}
                        • Document:{" "}
                        <span className="text-slate-300">
                          {chat.documentId.fileName}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="info">
                    {chat.messages?.length || 0} msgs
                  </Badge>
                  <Link
                    href={`/dashboard/admin/chats?chatId=${chat._id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs text-slate-300 hover:text-white hover:border-violet-500/50 transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

