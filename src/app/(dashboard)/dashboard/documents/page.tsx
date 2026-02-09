"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  useDocuments,
  useUploadDocument,
  useDeleteDocument,
} from "@/hooks/useDocuments";
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
import { formatDate, formatFileSize } from "@/lib/utils";
import {
  Upload,
  FileText,
  Trash2,
  File,
  FileType,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
} from "lucide-react";

export default function DocumentsPage() {
  const [page, setPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useDocuments(page);
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const handleFile = useCallback(
    async (file: File) => {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      if (!validTypes.includes(file.type)) {
        return;
      }

      setUploadProgress(0);
      await uploadMutation.mutateAsync({
        file,
        onProgress: (p) => setUploadProgress(p),
      });
      setShowUpload(false);
      setUploadProgress(0);
    },
    [uploadMutation],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile],
  );

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes("pdf"))
      return <FileText className="h-5 w-5 text-red-400" />;
    if (fileType?.includes("word") || fileType?.includes("docx"))
      return <FileType className="h-5 w-5 text-blue-400" />;
    return <File className="h-5 w-5 text-slate-400" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge variant="success">Ready</Badge>;
      case "processing":
        return <Badge variant="warning">Processing</Badge>;
      case "failed":
        return <Badge variant="error">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <AnimatedPage>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Documents</h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload and manage your knowledge base documents
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      {/* Documents Grid */}
      {(data?.documents?.length ?? 0) > 0 ? (
        <>
          <StaggerContainer className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {data?.documents.map((doc: any) => (
              <StaggerItem key={doc._id}>
                <Card hover className="group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-lg bg-slate-800 p-2.5 shrink-0">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {doc.totalChunks} chunks
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteId(doc._id)}
                      className="rounded-lg p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(doc.status)}
                    <span className="text-xs text-slate-500">
                      {formatDate(doc.createdAt)}
                    </span>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Pagination */}
          {(data?.documents?.length ?? 0) >= 10 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <span className="text-sm text-slate-400">Page {page}</span>
              <Button
                variant="ghost"
                size="sm"
                disabled={(data?.documents?.length ?? 0) < 10}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon="document"
          title="No documents yet"
          description="Upload your first document to start chatting with AI about its content."
          action={
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="mr-2 h-4 w-4" /> Upload Your First Document
            </Button>
          }
        />
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload Document"
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all ${
            dragActive
              ? "border-violet-500 bg-violet-500/10"
              : "border-slate-700 hover:border-violet-500/50 hover:bg-slate-800/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
          />

          {uploadMutation.isPending ? (
            <div className="text-center space-y-3">
              <div className="mx-auto w-full max-w-xs bg-slate-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                />
              </div>
              <p className="text-sm text-violet-400">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <>
              <CloudUpload className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-sm font-medium text-white mb-1">
                Drop your file here or click to browse
              </p>
              <p className="text-xs text-slate-500">
                Supports PDF, DOCX, and TXT files
              </p>
            </>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Document"
      >
        <p className="text-sm text-slate-400 mb-6">
          Are you sure you want to delete this document? This action cannot be
          undone and all associated embeddings will be removed.
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
