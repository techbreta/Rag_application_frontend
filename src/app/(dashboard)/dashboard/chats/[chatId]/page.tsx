"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useChatDetails, useSendMessage } from "@/hooks/useChat";
import AnimatedPage from "@/components/layout/AnimatedPage";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { PageLoader, TypingIndicator } from "@/components/ui/Loading";
import { Send, FileText, Sparkles, ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface LocalMessage {
  role: "user" | "assistant";
  content: string;
  sources?: any[];
  timestamp?: string;
}

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params?.chatId as string | undefined;
  const { data: chat, isLoading } = useChatDetails(chatId ?? "");
  const sendMessage = useSendMessage();

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const [showSources, setShowSources] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chat?.messages) {
      setMessages(chat.messages);
    }
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sendMessage.isPending) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      // Build payload with required fields based on chat type
      const payload: any = {
        message: userMessage,
        chatId,
        chatType: chat?.chatType, // Backend requires chatType even for existing chats
      };

      // Add required fields based on chat type for backend validation
      if (chat?.chatType === "single-document" && chat?.documentId) {
        payload.documentId = chat.documentId;
      } else if (chat?.chatType === "multi-document" && chat?.documentIds) {
        payload.documentIds = chat.documentIds;
      }
      // For all-documents, no additional fields needed

      const response = await sendMessage.mutateAsync(payload);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer,
          sources: response.sources,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <AnimatedPage className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <Link href="/dashboard/history">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-base sm:text-lg font-bold text-white truncate">
            {chat?.title || "Chat Session"}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="info">{chat?.chatType || "chat"}</Badge>
            <span className="text-xs text-slate-500">
              {messages.length} messages
            </span>
            {chat?.documentIds && chat.documentIds.length > 0 && (
              <span className="text-xs text-slate-400">
                • {chat.documentIds.length} document
                {chat.documentIds.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          {chat?.documentIds && chat.documentIds.length > 0 && (
            <div className="mt-1">
              <p className="text-xs text-slate-600">
                Documents:{" "}
                {/* Show document IDs since we don't have names in this response */}
                {chat.documentIds
                  .slice(0, 2)
                  .map((docId: string, i: number) => (
                    <span key={docId}>
                      {i > 0 && ", "}
                      {docId.slice(-8)}
                    </span>
                  ))}
                {chat.documentIds.length > 2 &&
                  ` +${chat.documentIds.length - 2} more`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm mb-4 p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "" : ""
            }`}
          >
            {msg.role === "user" ? (
              <>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">U</span>
                </div>
                <div className="rounded-2xl rounded-tl-none bg-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 max-w-[85vw] sm:max-w-xl md:max-w-2xl">
                  <p className="text-sm text-slate-200 whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                  <Image
                    src="/icon.png"
                    alt="Sparkle"
                    width={400}
                    height={400}
                    className="text-violet-400 h-10 w-auto"
                  />
                </div>
                <div className="max-w-[85vw] sm:max-w-xl md:max-w-2xl space-y-2">
                  <div className="rounded-2xl rounded-tl-none bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 px-4 py-3">
                    <div className="text-sm text-slate-200 prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div>
                      <button
                        onClick={() =>
                          setShowSources(showSources === i ? null : i)
                        }
                        className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
                      >
                        <FileText className="h-3 w-3" />
                        {msg.sources.length} source
                        {msg.sources.length > 1 ? "s" : ""}
                        <ChevronDown
                          className={`h-3 w-3 transition-transform ${
                            showSources === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {showSources === i && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 space-y-2"
                          >
                            {msg.sources.map((source: any, si: number) => (
                              <div
                                key={si}
                                className="rounded-lg bg-slate-800/50 border border-slate-700 p-3"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <FileText className="h-3 w-3 text-violet-400" />
                                  <span className="text-xs font-medium text-violet-300">
                                    {source.documentName}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {Math.round(
                                      (source.score || source.similarity || 0) *
                                        100,
                                    )}
                                    % match
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-3">
                                  {source.content || source.relevantChunk}
                                </p>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        ))}

        {sendMessage.isPending && (
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 px-4 py-2">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 sm:gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-2 sm:p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Continue the conversation..."
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none max-h-32"
          style={{ minHeight: "2.5rem" }}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || sendMessage.isPending}
          size="sm"
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </AnimatedPage>
  );
}
