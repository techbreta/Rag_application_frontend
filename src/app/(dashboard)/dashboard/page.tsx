"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useDocuments } from "@/hooks/useDocuments";
import { useChatSessions } from "@/hooks/useChat";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AnimatedPage, {
  StaggerContainer,
  StaggerItem,
} from "@/components/layout/AnimatedPage";
import {
  FileText,
  MessageSquare,
  Upload,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: docsData } = useDocuments();
  const { data: chatsData } = useChatSessions();

  const stats = [
    {
      label: "Documents",
      value:
        docsData?.pagination?.totalResults || docsData?.documents?.length || 0,
      icon: FileText,
      color: "from-violet-500 to-purple-600",
      href: "/dashboard/documents",
    },
    {
      label: "Chat Sessions",
      value: chatsData?.chats?.length || 0,
      icon: MessageSquare,
      color: "from-indigo-500 to-blue-600",
      href: "/dashboard/history",
    },
    {
      label: "Documents Used",
      value:
        new Set(
          chatsData?.chats?.flatMap((c: any) =>
            (c.documentIds || []).map((d: any) => d._id),
          ) || [],
        ).size || 0,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
      href: "/dashboard/chat",
    },
  ];

  return (
    <AnimatedPage>
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-white"
        >
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            {user?.name?.split(" ")[0] || "User"}
          </span>
          ! 👋
        </motion.h1>
        <p className="mt-2 text-slate-400">
          Here&apos;s what&apos;s happening with your documents today.
        </p>
      </div>

      {/* Stats Cards */}
      <StaggerContainer className="grid gap-6 md:grid-cols-3 mb-8">
        {stats.map((stat, i) => (
          <StaggerItem key={i}>
            <Link href={stat.href}>
              <Card hover glow>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`rounded-2xl bg-gradient-to-br ${stat.color} p-3 shadow-lg`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 p-3 w-fit mb-4">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Upload Document
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Add a new PDF, DOCX, or TXT file to your knowledge base.
              </p>
              <Link href="/dashboard/documents">
                <Button size="sm">
                  Upload Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 w-fit mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Start AI Chat
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Ask questions about your documents and get instant answers.
              </p>
              <Link href="/dashboard/chat">
                <Button size="sm" variant="secondary">
                  Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Chats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-violet-400" />
              Recent Activity
            </h3>
            <Link href="/dashboard/history">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {chatsData?.chats?.length > 0 ? (
            <div className="space-y-3">
              {chatsData.chats.slice(0, 5).map((chat: any) => (
                <Link
                  key={chat._id}
                  href={`/dashboard/chats/${chat._id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-lg bg-violet-500/10 p-2 shrink-0">
                      <MessageSquare className="h-4 w-4 text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">
                        {chat.title || "Chat session"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {chat.documentIds?.length || 0} docs •{" "}
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-violet-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">
                No recent activity. Start by uploading a document!
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatedPage>
  );
}
