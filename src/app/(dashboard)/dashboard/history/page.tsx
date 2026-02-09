"use client";

import { useState } from "react";
import { useChatSessions, useDeleteChat } from "@/hooks/useChat";
import AnimatedPage, {
  StaggerContainer,
  StaggerItem,
} from "@/components/layout/AnimatedPage";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Loading";
import { formatDate, truncate } from "@/lib/utils";
import {
  MessageSquare,
  Trash2,
  ArrowRight,
  Clock,
  FileText,
  Layers,
  File,
} from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useChatSessions();
  const deleteMutation = useDeleteChat();

  const getChatTypeIcon = (type: string) => {
    switch (type) {
      case "single-document":
        return <File className="h-4 w-4 text-violet-400" />;
      case "multi-document":
        return <Layers className="h-4 w-4 text-indigo-400" />;
      case "all-documents":
        return <FileText className="h-4 w-4 text-emerald-400" />;
      default:
        return <MessageSquare className="h-4 w-4 text-slate-400" />;
    }
  };

  const getChatTypeBadge = (type: string) => {
    switch (type) {
      case "single-document":
        return <Badge variant="info">Single Doc</Badge>;
      case "multi-document":
        return <Badge variant="info">Multi Doc</Badge>;
      case "all-documents":
        return <Badge variant="success">All Docs</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <AnimatedPage>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="h-6 w-6 text-violet-400" />
          Chat History
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          View and resume your previous conversations
        </p>
      </div>

      {data?.chats?.length > 0 ? (
        <>
          <StaggerContainer className="space-y-3">
            {data.chats.map((chat: any) => (
              <StaggerItem key={chat._id}>
                <Card hover className="group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <Link
                      href={`/dashboard/chats/${chat._id}`}
                      className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0"
                    >
                      <div className="rounded-xl bg-slate-800 p-3 shrink-0">
                        {getChatTypeIcon(chat.chatType)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-sm font-medium text-white truncate">
                            {truncate(chat.title || "Chat session", 60)}
                          </p>
                          {getChatTypeBadge(chat.chatType)}
                        </div>
                        {chat.documentIds?.length > 0 && (
                          <p className="text-xs text-slate-500 truncate">
                            {chat.documentIds
                              .map((d: any) => d.fileName)
                              .join(", ")}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                          <span>{formatDate(chat.createdAt)}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-700 group-hover:text-violet-400 transition-colors shrink-0" />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(chat._id);
                      }}
                      className="ml-auto sm:ml-3 rounded-lg p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </>
      ) : (
        <EmptyState
          icon="search"
          title="No chat history"
          description="Start a conversation with your documents to see your chat history here."
          action={
            <Link href="/dashboard/chat">
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" /> Start Chatting
              </Button>
            </Link>
          }
        />
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Chat"
      >
        <p className="text-sm text-slate-400 mb-6">
          Are you sure you want to delete this chat session? This action cannot
          be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={deleteMutation.isPending}
            onClick={async () => {
              if (deleteId) {
                await deleteMutation.mutateAsync(deleteId);
                setDeleteId(null);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </AnimatedPage>
  );
}
