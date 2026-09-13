"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  Files,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  Trash2,
  ExternalLink,
  Info,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/date";

interface DocumentItem {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  totalChunks: number;
  status: string;
  errorMessage?: string;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
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

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [fileType, setFileType] = useState("all");
  const [page, setPage] = useState(1);

  // Detail Modal
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete Confirmation
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (search.trim()) queryParams.append("search", search.trim());
      if (status !== "all") queryParams.append("status", status);
      if (fileType !== "all") queryParams.append("fileType", fileType);

      const { data } = await api.get(`/v1/admin/documents?${queryParams.toString()}`);
      setDocuments(data.data.documents || []);
      setPagination(data.data.pagination);
    } catch (err: any) {
      console.error("Failed to load documents:", err);
      toast.error(err.response?.data?.message || "Failed to load platform documents");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status, fileType]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleOpenDocModal = async (documentId: string) => {
    try {
      setDocLoading(true);
      setIsModalOpen(true);
      const { data } = await api.get(`/v1/admin/documents/${documentId}`);
      setSelectedDoc(data.data);
    } catch {
      toast.error("Failed to load document details");
      setIsModalOpen(false);
    } finally {
      setDocLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!deleteDocId) return;
    try {
      setIsDeleting(true);
      await api.delete(`/v1/admin/documents/${deleteDocId}`);
      toast.success("Document and associated data deleted");
      setDeleteDocId(null);
      fetchDocuments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete document");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search documents by file name..."
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
              value={fileType}
              onChange={(e) => {
                setFileType(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by file type"
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            >
              <option value="all">All File Types</option>
              <option value="pdf">PDF</option>
              <option value="webpage">Webpage</option>
              <option value="docx">Word (DOCX)</option>
              <option value="txt">Text (TXT)</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by status"
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            >
              <option value="all">All Statuses</option>
              <option value="ready">Ready</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-5 py-3.5">Document Name</th>
                <th className="px-4 py-3.5">Owner</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5 text-center">Chunks</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Uploaded</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-violet-500" />
                      <span>Loading documents...</span>
                    </div>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No documents found matching the filters.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc._id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-5 py-3.5 max-w-[280px]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-violet-600/15 border border-violet-500/20 text-violet-400 shrink-0">
                          {doc.fileType === "webpage" ? (
                            <Globe className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate" title={doc.fileName}>
                            {doc.fileName}
                          </p>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-violet-400 hover:underline flex items-center gap-1 truncate"
                          >
                            <span>Open Source File</span>
                            <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                          </a>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-200 truncate">
                        {doc.userId?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {doc.userId?.email || ""}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="uppercase text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {doc.fileType}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center font-medium text-slate-200">
                      {doc.totalChunks || 0}
                    </td>

                    <td className="px-4 py-3.5">
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
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(doc.createdAt)}
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenDocModal(doc._id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-200 hover:text-white hover:border-violet-500/50 transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => setDeleteDocId(doc._id)}
                          title="Delete Document"
                          className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
              Showing {documents.length} of {pagination.totalCount} documents (Page {pagination.currentPage} of {pagination.totalPages})
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

      {/* Document Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDoc?.document?.fileName ? `Document: ${selectedDoc.document.fileName}` : "Document Details"}
      >
        {docLoading || !selectedDoc ? (
          <div className="py-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500" />
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs text-slate-300">
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">File Type:</span>
                <span className="font-semibold text-white uppercase">{selectedDoc.document.fileType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Chunks:</span>
                <span className="font-semibold text-white">{selectedDoc.chunkCount || selectedDoc.document.totalChunks || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Owner:</span>
                <span className="font-semibold text-white">
                  {selectedDoc.document.userId?.name} ({selectedDoc.document.userId?.email})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Uploaded At:</span>
                <span className="font-semibold text-white">
                  {formatDate(selectedDoc.document.createdAt, "full")}
                </span>
              </div>
              <div className="pt-2">
                <a
                  href={selectedDoc.document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 font-medium hover:bg-violet-600/30 transition-colors"
                >
                  <span>Open Full File Source</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">
                Conversations referencing this document ({selectedDoc.chats?.length || 0}):
              </h4>
              <div className="space-y-2">
                {selectedDoc.chats?.length === 0 ? (
                  <p className="p-4 rounded-xl border border-slate-800 text-center text-slate-500">
                    No chats have queried this document yet.
                  </p>
                ) : (
                  selectedDoc.chats.map((chat: any) => (
                    <div
                      key={chat._id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-white">{chat.title}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {chat.userId?.name || "User"} • {chat.messages?.length || 0} messages
                        </p>
                      </div>
                      <a
                        href={`/dashboard/admin/chats?chatId=${chat._id}`}
                        className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteDocId)}
        onClose={() => setDeleteDocId(null)}
        title="Confirm Document Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to permanently delete this document? This will also remove all its vector chunks and associated chat logs from the system.
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDocId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteDocument}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Permanently Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

