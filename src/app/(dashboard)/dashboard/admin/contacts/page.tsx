"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  Mail,
  Search,
  Trash2,
  ExternalLink,
  Eye,
  AlertCircle,
  Building2,
  Clock,
  Phone,
  Shield,
  CheckCircle2,
  FileText,
  Filter,
  RefreshCw,
  Send,
  User,
  Inbox,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/date";

interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  phone?: string;
  inquiryType: "security" | "sales" | "support" | "partnership" | "general";
  subject: string;
  message: string;
  status: "pending" | "in-review" | "resolved" | "archived";
  adminNotes?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface InquiryStats {
  total: number;
  pending: number;
  inReview: number;
  resolved: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export default function AdminContactsPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [stats, setStats] = useState<InquiryStats>({
    total: 0,
    pending: 0,
    inReview: 0,
    resolved: 0,
  });
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  // View / Edit Modal
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [statusInput, setStatusInput] = useState<"pending" | "in-review" | "resolved" | "archived">("pending");
  const [notesInput, setNotesInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal
  const [deletingInquiry, setDeletingInquiry] = useState<ContactInquiry | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch inquiries from backend
  const fetchInquiries = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "12",
      });

      if (search.trim()) {
        queryParams.append("search", search.trim());
      }
      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }
      if (typeFilter !== "all") {
        queryParams.append("inquiryType", typeFilter);
      }

      const [resList, resStats] = await Promise.all([
        api.get(`/v1/contact?${queryParams.toString()}`),
        api.get("/v1/contact/stats"),
      ]);

      if (resList.data?.data) {
        setInquiries(resList.data.data.results || []);
        setPagination({
          page: resList.data.data.page,
          limit: resList.data.data.limit,
          totalPages: resList.data.data.totalPages,
          totalResults: resList.data.data.totalResults,
        });
      }

      if (resStats.data?.data) {
        setStats(resStats.data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch inquiries:", err);
      toast.error("Failed to load inquiries from server.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter, typeFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Open inspection modal
  const handleOpenView = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setStatusInput(inquiry.status);
    setNotesInput(inquiry.adminNotes || "");
    setIsViewModalOpen(true);
  };

  // Update status or notes
  const handleSaveInquiry = async () => {
    if (!selectedInquiry) return;
    try {
      setIsSaving(true);
      const res = await api.patch(`/v1/contact/${selectedInquiry._id}`, {
        status: statusInput,
        adminNotes: notesInput,
      });

      if (res.data?.status === "success") {
        toast.success("Inquiry updated successfully!");
        setIsViewModalOpen(false);
        fetchInquiries();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update inquiry.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete inquiry
  const handleDeleteConfirm = async () => {
    if (!deletingInquiry) return;
    try {
      setIsDeleting(true);
      await api.delete(`/v1/contact/${deletingInquiry._id}`);
      toast.success("Inquiry deleted successfully.");
      setIsDeleteModalOpen(false);
      setDeletingInquiry(null);
      fetchInquiries();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete inquiry.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helpers for category styling
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "security":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">Security & VPC</span>;
      case "sales":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">Enterprise Sales</span>;
      case "support":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">Tech Support</span>;
      case "partnership":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Partnership</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/30">General</span>;
    }
  };

  // Helpers for status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending
          </span>
        );
      case "in-review":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            In Review
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            Resolved
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-500/15 text-slate-400 border border-slate-500/30">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Mail className="h-5 w-5 text-violet-400" />
            Inquiries & Enterprise Leads
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming enterprise requests, security compliance evaluations, and lead contacts.
          </p>
        </div>

        <Button
          onClick={() => fetchInquiries()}
          variant="outline"
          size="sm"
          className="border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 self-start sm:self-auto gap-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* KPI Counters Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
          <div className="text-xs font-medium text-slate-400">Total Inquiries</div>
          <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">All-time communications</div>
        </div>

        {/* Pending */}
        <div
          onClick={() => {
            setStatusFilter("pending");
            setPage(1);
          }}
          className="p-4 rounded-2xl bg-slate-900/70 border border-amber-500/30 hover:border-amber-500/60 cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400">Pending Action</span>
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-white mt-1 group-hover:text-amber-400 transition-colors">
            {stats.pending}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Awaiting initial reply</div>
        </div>

        {/* In Review */}
        <div
          onClick={() => {
            setStatusFilter("in-review");
            setPage(1);
          }}
          className="p-4 rounded-2xl bg-slate-900/70 border border-blue-500/30 hover:border-blue-500/60 cursor-pointer transition-all shadow-md group"
        >
          <div className="text-xs font-medium text-blue-400">In Review</div>
          <div className="text-2xl font-black text-white mt-1 group-hover:text-blue-400 transition-colors">
            {stats.inReview}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Under evaluation</div>
        </div>

        {/* Resolved */}
        <div
          onClick={() => {
            setStatusFilter("resolved");
            setPage(1);
          }}
          className="p-4 rounded-2xl bg-slate-900/70 border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition-all shadow-md group"
        >
          <div className="text-xs font-medium text-emerald-400">Resolved</div>
          <div className="text-2xl font-black text-white mt-1 group-hover:text-emerald-400 transition-colors">
            {stats.resolved}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Completed communications</div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, company, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["all", "pending", "in-review", "resolved"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === st
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {st === "all" ? "All Status" : st.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Type Filter Dropdown */}
        <div className="w-full md:w-auto shrink-0">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-auto px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="all">All Inquiry Topics</option>
            <option value="security">Security & VPC</option>
            <option value="sales">Enterprise Sales</option>
            <option value="support">Technical Support</option>
            <option value="partnership">Partnership</option>
            <option value="general">General Inquiries</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Received</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Company & Role</th>
                <th className="py-3.5 px-4">Topic</th>
                <th className="py-3.5 px-4">Subject & Excerpt</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-violet-500" />
                      <span>Loading contact inquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="h-10 w-10 text-slate-600 mb-1" />
                      <div className="text-sm font-semibold text-slate-300">
                        No contact inquiries found
                      </div>
                      <p className="text-xs text-slate-500 max-w-sm">
                        There are no submissions matching your current search or status filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr
                    key={inquiry._id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => handleOpenView(inquiry)}
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {formatDate(inquiry.createdAt)}
                    </td>

                    {/* Contact (Name & Email) */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {inquiry.name}
                      </div>
                      <a
                        href={`mailto:${inquiry.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-slate-400 hover:text-violet-400 flex items-center gap-1 mt-0.5"
                      >
                        <Mail className="h-3 w-3" />
                        {inquiry.email}
                      </a>
                    </td>

                    {/* Company & Role */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">
                        {inquiry.company || <span className="text-slate-600">—</span>}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {inquiry.role || <span className="text-slate-600">—</span>}
                      </div>
                    </td>

                    {/* Topic Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getTypeBadge(inquiry.inquiryType)}
                    </td>

                    {/* Subject & Message */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-200 truncate">
                        {inquiry.subject}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {inquiry.message}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(inquiry.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleOpenView(inquiry)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-violet-600 transition-colors"
                          title="Inspect Inquiry"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <a
                          href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
                            `Re: ${inquiry.subject}`
                          )}&body=${encodeURIComponent(
                            `Hi ${inquiry.name},\n\nThank you for reaching out to RagAI Enterprise.\n\n`
                          )}`}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
                          title="Reply via Email"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setDeletingInquiry(inquiry);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete Inquiry"
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

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="py-3 px-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing page <strong className="text-white">{pagination.page}</strong> of{" "}
              <strong className="text-white">{pagination.totalPages}</strong> (
              {pagination.totalResults} total inquiries)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 text-xs px-3 py-1"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 text-xs px-3 py-1"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Inspection & Edit Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Enterprise Inquiry Dossier"
          className="max-w-2xl"
        >
          <div className="space-y-5 text-xs text-slate-300">
            {/* Header / Origin strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Category:</span>
                {getTypeBadge(selectedInquiry.inquiryType)}
              </div>
              <div className="text-slate-400 font-mono">
                Received: {formatDate(selectedInquiry.createdAt)}
              </div>
            </div>

            {/* Sender Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div>
                <div className="text-[11px] text-slate-400">Full Name</div>
                <div className="text-sm font-bold text-white mt-0.5">{selectedInquiry.name}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Work Email</div>
                <div className="text-sm font-mono text-violet-400 mt-0.5">
                  <a href={`mailto:${selectedInquiry.email}`} className="hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Company / Organization</div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">
                  {selectedInquiry.company || "Not specified"}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Role / Position</div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">
                  {selectedInquiry.role || "Not specified"}
                </div>
              </div>
              {selectedInquiry.phone && (
                <div className="sm:col-span-2">
                  <div className="text-[11px] text-slate-400">Direct Phone</div>
                  <div className="text-xs font-mono text-slate-300 mt-0.5">
                    {selectedInquiry.phone}
                  </div>
                </div>
              )}
            </div>

            {/* Subject & Message Dossier */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-200">
                Subject: <span className="font-semibold text-white">{selectedInquiry.subject}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Super Admin Status Switcher & Internal Notes */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-300 shrink-0">
                  Update Status:
                </label>
                <select
                  value={statusInput}
                  onChange={(e: any) => setStatusInput(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-review">In Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Internal Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-violet-400" />
                  Super Admin Internal Notes:
                </label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Add internal meeting notes, SLA tracking info, or resolution comments..."
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-y"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <a
                href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                  `Re: ${selectedInquiry.subject}`
                )}&body=${encodeURIComponent(
                  `Hi ${selectedInquiry.name},\n\nThank you for reaching out to RagAI Enterprise.\n\n`
                )}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <Send className="h-3.5 w-3.5 text-blue-400" />
                <span>Launch Email Client</span>
              </a>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsViewModalOpen(false)}
                  className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={isSaving}
                  onClick={handleSaveInquiry}
                  className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingInquiry && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Inquiry Confirmation"
          className="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>
                Are you sure you want to permanently delete the inquiry from{" "}
                <strong>{deletingInquiry.name}</strong> ({deletingInquiry.email})? This action cannot be undone.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteModalOpen(false)}
                className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

