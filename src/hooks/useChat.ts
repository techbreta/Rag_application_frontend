"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface Source {
  documentId: string;
  documentName: string;
  relevantChunk: string;
  similarity: number;
}

interface ChatResponse {
  chatId: string;
  answer: string;
  sources: {
    content: string;
    score: number;
    documentName: string;
    documentId: {
      _id: string;
      fileName: string;
    };
  }[];
  documentsUsed: {
    id: string;
    name: string;
  }[];
}

interface SendMessagePayload {
  message: string;
  chatType?: "single-document" | "multi-document" | "all-documents";
  documentId?: string;
  documentIds?: string[];
  chatId?: string;
}

export function useChatSessions(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["chats", page, limit],
    queryFn: async () => {
      const { data } = await api.get(
        `/v1/rag/chats?page=${page}&limit=${limit}`,
      );
      console.log('[API] GET /v1/rag/chats - Response:', data);
      return data.data;
    },
  });
}

export function useChatDetails(chatId: string) {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const { data } = await api.get(`/v1/rag/chats/${chatId}`);
      console.log(`[API] GET /v1/rag/chats/${chatId} - Response:`, data);
      return data.data.chat;
    },
    enabled: !!chatId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<ChatResponse, Error, SendMessagePayload>({
    mutationFn: async (payload) => {
      console.log('[API] POST /v1/rag/chat - Payload:', payload);
      const { data } = await api.post("/v1/rag/chat", payload);
      console.log('[API] POST /v1/rag/chat - Response:', data);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send message");
    },
  });
}

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: string) => {
      const { data } = await api.delete(`/v1/rag/chats/${chatId}`);
      console.log(`[API] DELETE /v1/rag/chats/${chatId} - Response:`, data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toast.success("Chat deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete chat");
    },
  });
}
