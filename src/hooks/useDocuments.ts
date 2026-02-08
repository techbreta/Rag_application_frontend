"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { uploadToCloudinary } from "@/lib/cloudinary";
import toast from "react-hot-toast";

interface Document {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  totalChunks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentsResponse {
  documents: Document[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function useDocuments(page = 1, limit = 10) {
  return useQuery<DocumentsResponse>({
    queryKey: ["documents", page, limit],
    queryFn: async () => {
      const { data } = await api.get(
        `/v1/rag/documents?page=${page}&limit=${limit}`,
      );
      console.log("[API] GET /v1/rag/documents - Response:", data);
      return data.data;
    },
  });
}

export function useDocumentDetails(documentId: string) {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const { data } = await api.get(`/v1/rag/documents/${documentId}`);
      console.log(
        `[API] GET /v1/rag/documents/${documentId} - Response:`,
        data,
      );
      return data.data;
    },
    enabled: !!documentId,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (progress: number) => void;
    }) => {
      // Upload to Cloudinary first
      const fileUrl = await uploadToCloudinary(file, onProgress);
      console.log("[API] Cloudinary upload complete - fileUrl:", fileUrl);

      // Then send URL to backend
      const { data } = await api.post("/v1/rag/upload", {
        fileUrl,
        fileName: file.name,
      });
      console.log("[API] POST /v1/rag/upload - Response:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document uploaded successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload document");
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const { data } = await api.delete(`/v1/rag/documents/${documentId}`);
      console.log(
        `[API] DELETE /v1/rag/documents/${documentId} - Response:`,
        data,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete document");
    },
  });
}
