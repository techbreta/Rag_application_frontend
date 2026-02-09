"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSendMessage } from "@/hooks/useChat";
import { useDocuments } from "@/hooks/useDocuments";
import AnimatedPage from "@/components/layout/AnimatedPage";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { TypingIndicator } from "@/components/ui/Loading";
import {
  Send,
  FileText,
  Sparkles,
  ChevronDown,
  CheckSquare,
  Square,
  Layers,
  File,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: any[];
}

type ChatMode = "single-document" | "multi-document" | "all-documents";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>("all-documents");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [showDocSelector, setShowDocSelector] = useState(false);
  const [showSources, setShowSources] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = useSendMessage();
  const { data: docsData } = useDocuments(1, 100);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sendMessage.isPending) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const payload: any = { message: userMessage };

      if (chatId) {
        payload.chatId = chatId;
      } else {
        payload.chatType = chatMode;
        if (chatMode === "single-document" && selectedDocs[0]) {
          payload.documentId = selectedDocs[0];
        }
        if (chatMode === "multi-document" && selectedDocs.length > 0) {
          payload.documentIds = selectedDocs;
        }
      }

      const response = await sendMessage.mutateAsync(payload);

      if (response.chatId) {
        setChatId(response.chatId);
      }

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

  const toggleDoc = (docId: string) => {
    if (chatMode === "single-document") {
      setSelectedDocs([docId]);
    } else {
      setSelectedDocs((prev) =>
        prev.includes(docId)
          ? prev.filter((id) => id !== docId)
          : [...prev, docId],
      );
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setChatId(null);
    setSelectedDocs([]);
  };

  const chatModes = [
    { value: "single-document" as ChatMode, label: "Single Doc", icon: File },
    { value: "multi-document" as ChatMode, label: "Multi Docs", icon: Layers },
    { value: "all-documents" as ChatMode, label: "All Docs", icon: FileText },
  ];

  return (
    <AnimatedPage className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Chat</h1>
          <p className="text-sm text-slate-400">
            Ask questions about your documents
          </p>
        </div>
        <div className="flex items-center gap-3">
          {chatId && (
            <Button variant="outline" size="sm" onClick={startNewChat}>
              New Chat
            </Button>
          )}
        </div>
      </div>

      {/* Chat Mode Selector */}
      {!chatId && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                {chatModes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => {
                      setChatMode(mode.value);
                      if (mode.value === "all-documents") setSelectedDocs([]);
                      if (
                        mode.value === "single-document" &&
                        selectedDocs.length > 1
                      ) {
                        setSelectedDocs([selectedDocs[0]]);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      chatMode === mode.value
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <mode.icon className="h-4 w-4" />
                    {mode.label}
                  </button>
                ))}
              </div>

              {chatMode !== "all-documents" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDocSelector(!showDocSelector)}
                >
                  {selectedDocs.length > 0
                    ? `${selectedDocs.length} selected`
                    : "Select documents"}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Document Selector */}
            <AnimatePresence>
              {showDocSelector && chatMode !== "all-documents" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-1 max-h-48 overflow-y-auto"
                >
                  {docsData?.documents?.map((doc: any) => (
                    <button
                      key={doc._id}
                      onClick={() => toggleDoc(doc._id)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-left"
                    >
                      {selectedDocs.includes(doc._id) ? (
                        <CheckSquare className="h-4 w-4 text-violet-400 shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-600 shrink-0" />
                      )}
                      <span className="text-sm text-slate-300 truncate">
                        {doc.fileName}
                      </span>
                    </button>
                  ))}
                  {(!docsData?.documents ||
                    docsData.documents.length === 0) && (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No documents uploaded yet
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 p-6 mb-6"
            >
              <Image
                src="/icon.png"
                alt="Sparkle"
                width={400}
                height={400}
                                className="text-violet-400 h-20 w-20 "

              />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Start a Conversation
            </h3>
            <p className="text-sm text-slate-400 max-w-md">
              Ask anything about your documents. I&apos;ll find the relevant
              information and provide accurate answers with source citations.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "" : "justify-start"
                }`}
              >
                {msg.role === "user" ? (
                  <>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white">U</span>
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-slate-800 px-4 py-3 max-w-2xl">
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
                        width={16}
                        height={16}
                                        className="text-violet-400 h-40 w-auto"

                      />
                    </div>
                    <div className="max-w-2xl space-y-2">
                      <div className="rounded-2xl rounded-tl-none bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 px-4 py-3">
                        <div className="text-sm text-slate-200 prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>

                      {/* Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div>
                          <button
                            onClick={() =>
                              setShowSources(showSources === i ? null : i)
                            }
                            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            <FileText className="h-3 w-3" />
                            {msg.sources.length} source
                            {msg.sources.length > 1 ? "s" : ""} found
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
                                        {source.documentName ||
                                          source.documentId?.fileName ||
                                          "Document"}
                                      </span>
                                      <span className="text-xs text-slate-500">
                                        {Math.round(
                                          (source.score ??
                                            source.similarity ??
                                            0) * 100,
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
        )}
      </div>

      {/* Input Area */}
      <div className="relative">
        <div className="flex items-end gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your documents..."
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
      </div>
    </AnimatedPage>
  );
}
