"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  MessagesSquare,
  Search,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/date";

interface ChatItem {
  _id: string;
  title: string;
  chatType: string;
  messageCount: number;
  lastMessage?: any;
  createdAt: string;
  updatedAt: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  documentId?: {
    _id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
  };
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

function AdminChatsContent() {
  const searchParams = useSearchParams();
  const initialChatId = searchParams?.get("chatId") || null;

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [chatType, setChatType] = useState("all");
  const [page, setPage] = useState(1);

  // Transcript Modal
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (search.trim()) queryParams.append("search", search.trim());
      if (chatType !== "all") queryParams.append("chatType", chatType);

      const { data } = await api.get(`/v1/admin/chats?${queryParams.toString()}`);
      setChats(data.data.chats || []);
      setPagination(data.data.pagination);
    } catch (err: any) {
      console.error("Failed to load chats:", err);
      toast.error(err.response?.data?.message || "Failed to load chat sessions");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, chatType]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleOpenTranscript = useCallback(async (chatId: string) => {
    try {
      setTranscriptLoading(true);
      setIsModalOpen(true);
      const { data } = await api.get(`/v1/admin/chats/${chatId}`);
      setSelectedChat(data.data.chat);
    } catch {
      toast.error("Failed to load chat transcript");
      setIsModalOpen(false);
    } finally {
      setTranscriptLoading(false);
    }
  }, []);

  // Auto-open transcript if chatId query param is present on mount
  useEffect(() => {
    if (initialChatId) {
      handleOpenTranscript(initialChatId);
    }
  }, [initialChatId, handleOpenTranscript]);

  const handleCopyTranscriptText = () => {
    if (!selectedChat?.messages) return;
    const lines = selectedChat.messages.map(
      (m: any) => `[${m.role.toUpperCase()} - ${formatDate(m.timestamp || selectedChat.updatedAt, "time")}]:\n${m.content}\n`
    );
    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
    toast.success("Transcript copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search chats by conversation title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={chatType}
              onChange={(e) => {
                setChatType(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by chat type"
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            >
              <option value="all">All Chat Types</option>
              <option value="single-document">Single Document</option>
              <option value="multi-document">Multi Document</option>
              <option value="all-documents">All Documents</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chats Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-5 py-3.5">Conversation Title</th>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Document Referenced</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5 text-center">Messages</th>
                <th className="px-4 py-3.5">Last Active</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-violet-500" />
                      <span>Loading chat logs...</span>
                    </div>
                  </td>
                </tr>
              ) : chats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No chat conversations found matching the filters.
                  </td>
                </tr>
              ) : (
                chats.map((chat) => (
                  <tr
                    key={chat._id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-5 py-3.5 max-w-[260px]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 shrink-0">
                          <MessagesSquare className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate" title={chat.title}>
                            {chat.title}
                          </p>
                          {chat.lastMessage?.content && (
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {chat.lastMessage.role === "user" ? "User: " : "AI: "}
                              {chat.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-200 truncate">
                        {chat.userId?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {chat.userId?.email || ""}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 max-w-[200px]">
                      {chat.documentId?.fileName ? (
                        <p className="text-xs text-slate-300 truncate" title={chat.documentId.fileName}>
                          {chat.documentId.fileName}
                        </p>
                      ) : (
                        <span className="text-xs text-slate-500 italic">
                          {chat.chatType === "all-documents"
                            ? "All Documents"
                            : "Multi-Document"}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          chat.chatType === "all-documents"
                            ? "info"
                            : chat.chatType === "multi-document"
                            ? "warning"
                            : "default"
                        }
                      >
                        {chat.chatType.replace("-", " ")}
                      </Badge>
                    </td>

                    <td className="px-4 py-3.5 text-center font-medium text-slate-200">
                      {chat.messageCount || 0}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(chat.updatedAt || chat.createdAt)}
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenTranscript(chat._id)}
                        className="px-3 py-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-300 hover:bg-violet-500/20 transition-all inline-flex items-center gap-1.5"
                      >
                        <span>View Transcript</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {chats.length} of {pagination.totalCount} chats (Page {pagination.currentPage} of {pagination.totalPages})
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Full Transcript Viewer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedChat?.title ? `Transcript: ${selectedChat.title}` : "Chat Transcript"}
      >
        {transcriptLoading || !selectedChat ? (
          <div className="py-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500" />
          </div>
        ) : (
          <div className="space-y-4 max-h-[75vh] flex flex-col">
            {/* Conversation Meta Bar */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="text-xs text-slate-400">
                <span>User: </span>
                <span className="font-semibold text-white">
                  {selectedChat.userId?.name} ({selectedChat.userId?.email})
                </span>
                {selectedChat.documentId?.fileName && (
                  <>
                    <span className="mx-1.5">•</span>
                    <span>Doc: </span>
                    <span className="font-semibold text-slate-200">
                      {selectedChat.documentId.fileName}
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={handleCopyTranscriptText}
                className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {copiedTranscript ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Conversation Messages Thread */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-sm">
              {selectedChat.messages?.length === 0 ? (
                <p className="py-12 text-center text-xs text-slate-500">
                  No messages in this chat session.
                </p>
              ) : (
                selectedChat.messages?.map((msg: any, idx: number) => {
                  const isUser = msg.role === "user";

                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 ${
                        isUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                          isUser
                            ? "bg-violet-600 text-white"
                            : "bg-emerald-600/30 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {isUser ? (
                          <UserIcon className="h-3.5 w-3.5" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 ${
                          isUser
                            ? "bg-violet-600/25 border border-violet-500/30 text-slate-100 rounded-tr-sm"
                            : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-1 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-300">
                            {isUser ? selectedChat.userId?.name || "User" : "RagAI Assistant"}
                          </span>
                          <span>
                            {msg.timestamp
                              ? formatDate(msg.timestamp, "time")
                              : ""}
                          </span>
                        </div>

                        <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                          {msg.content}
                        </div>

                        {/* RAG Sources / Citations */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                              <BookOpen className="h-3 w-3 text-violet-400" />
                              <span>Referenced Sources ({msg.sources.length}):</span>
                            </p>
                            <div className="space-y-1">
                              {msg.sources.map((src: any, sIdx: number) => (
                                <div
                                  key={sIdx}
                                  className="text-[11px] bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-slate-400"
                                >
                                  <div className="flex justify-between items-center text-slate-300 font-medium mb-0.5">
                                    <span>{src.documentName || "Document"}</span>
                                    {src.pageNumber && (
                                      <span className="text-[10px] text-violet-400">
                                        Page {src.pageNumber}
                                      </span>
                                    )}
                                  </div>
                                  <p className="line-clamp-2 italic text-slate-400 text-[10px]">
                                    &ldquo;{src.content}&rdquo;
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function AdminChatsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500" />
        </div>
      }
    >
      <AdminChatsContent />
    </Suspense>
  );
}

