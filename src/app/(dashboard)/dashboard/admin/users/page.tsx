"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/date";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  isOnline?: boolean;
  contact?: string;
  createdAt: string;
  documentsCount: number;
  chatsCount: number;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  // Selected User Modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeUserTab, setActiveUserTab] = useState<"info" | "docs" | "chats">("info");

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (search.trim()) queryParams.append("search", search.trim());
      if (role !== "all") queryParams.append("role", role);
      if (status !== "all") queryParams.append("status", status);

      const { data } = await api.get(`/v1/admin/users?${queryParams.toString()}`);
      setUsers(data.data.users || []);
      setPagination(data.data.pagination);
    } catch (err: any) {
      console.error("Failed to load users:", err);
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, role, status]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenUserModal = async (userId: string) => {
    try {
      setUserLoading(true);
      setIsModalOpen(true);
      setActiveUserTab("info");
      const { data } = await api.get(`/v1/admin/users/${userId}`);
      setSelectedUser(data.data);
    } catch {
      toast.error("Failed to load user profile");
      setIsModalOpen(false);
    } finally {
      setUserLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await api.patch(`/v1/admin/users/${userId}/status`, { status: newStatus });
      toast.success(`User status updated to ${newStatus}`);
      fetchUsers();
      if (selectedUser && selectedUser.user._id === userId) {
        setSelectedUser({
          ...selectedUser,
          user: { ...selectedUser.user, status: newStatus },
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update user status");
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/v1/admin/users/${userId}/status`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
      if (selectedUser && selectedUser.user._id === userId) {
        setSelectedUser({
          ...selectedUser,
          user: { ...selectedUser.user, role: newRole },
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update user role");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by name, email, or contact..."
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
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by role"
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Docs</th>
                <th className="px-4 py-3.5 text-center">Chats</th>
                <th className="px-4 py-3.5">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-violet-500" />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No users matching the filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">
                            {u.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          u.role === "superadmin"
                            ? "error"
                            : u.role === "admin"
                            ? "warning"
                            : "default"
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>

                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          u.status === "active"
                            ? "success"
                            : u.status === "pending"
                            ? "warning"
                            : "error"
                        }
                      >
                        {u.status}
                      </Badge>
                    </td>

                    <td className="px-4 py-3.5 text-center font-medium text-slate-200">
                      {u.documentsCount || 0}
                    </td>

                    <td className="px-4 py-3.5 text-center font-medium text-slate-200">
                      {u.chatsCount || 0}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(u.createdAt)}
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenUserModal(u._id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-200 hover:text-white hover:border-violet-500/50 transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u._id, u.status)}
                          title={u.status === "active" ? "Deactivate User" : "Activate User"}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            u.status === "active"
                              ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                              : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {u.status === "active" ? (
                            <UserX className="h-3.5 w-3.5" />
                          ) : (
                            <UserCheck className="h-3.5 w-3.5" />
                          )}
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
              Showing {users.length} of {pagination.totalCount} users (Page {pagination.currentPage} of {pagination.totalPages})
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

      {/* User Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser?.user?.name ? `${selectedUser.user.name}'s Profile` : "User Details"}
      >
        {userLoading || !selectedUser ? (
          <div className="py-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500" />
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* User Header Summary */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
                  {selectedUser.user.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{selectedUser.user.name}</h4>
                  <p className="text-xs text-slate-400">{selectedUser.user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    selectedUser.user.role === "superadmin"
                      ? "error"
                      : selectedUser.user.role === "admin"
                      ? "warning"
                      : "default"
                  }
                >
                  {selectedUser.user.role}
                </Badge>
              </div>
            </div>

            {/* Tabs within Modal */}
            <div className="flex border-b border-slate-800 text-xs">
              <button
                onClick={() => setActiveUserTab("info")}
                className={`py-2 px-4 border-b-2 font-medium transition-colors ${
                  activeUserTab === "info"
                    ? "border-violet-500 text-violet-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Account Info
              </button>
              <button
                onClick={() => setActiveUserTab("docs")}
                className={`py-2 px-4 border-b-2 font-medium transition-colors ${
                  activeUserTab === "docs"
                    ? "border-violet-500 text-violet-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Documents ({selectedUser.documents?.length || 0})
              </button>
              <button
                onClick={() => setActiveUserTab("chats")}
                className={`py-2 px-4 border-b-2 font-medium transition-colors ${
                  activeUserTab === "chats"
                    ? "border-violet-500 text-violet-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Chats ({selectedUser.chats?.length || 0})
              </button>
            </div>

            {/* Tab: Info */}
            {activeUserTab === "info" && (
              <div className="space-y-3 text-xs text-slate-300">
                <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500">Account Status:</span>
                    <p className="font-semibold text-white mt-0.5">{selectedUser.user.status}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Email Verified:</span>
                    <p className="font-semibold text-white mt-0.5">
                      {selectedUser.user.isEmailVerified ? "Verified" : "Not Verified"}
                    </p>
                  </div>
                  <div className="mt-2">
                    <span className="text-slate-500">Contact / Phone:</span>
                    <p className="font-semibold text-white mt-0.5">
                      {selectedUser.user.contact || "None"}
                    </p>
                  </div>
                  <div className="mt-2">
                    <span className="text-slate-500">Registration Date:</span>
                    <p className="font-semibold text-white mt-0.5">
                      {formatDate(selectedUser.user.createdAt, "full")}
                    </p>
                  </div>
                </div>

                {/* Role and Status Actions */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Change Role:</span>
                    <select
                      value={selectedUser.user.role}
                      onChange={(e) => handleChangeRole(selectedUser.user._id, e.target.value)}
                      aria-label="Change user role"
                      className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>

                  <Button
                    variant={selectedUser.user.status === "active" ? "outline" : "primary"}
                    size="sm"
                    onClick={() =>
                      handleToggleStatus(selectedUser.user._id, selectedUser.user.status)
                    }
                  >
                    {selectedUser.user.status === "active" ? "Deactivate Account" : "Activate Account"}
                  </Button>
                </div>
              </div>
            )}

            {/* Tab: Docs */}
            {activeUserTab === "docs" && (
              <div className="space-y-2">
                {selectedUser.documents?.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">
                    This user has not uploaded any documents yet.
                  </p>
                ) : (
                  selectedUser.documents.map((doc: any) => (
                    <div
                      key={doc._id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{doc.fileName}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {doc.fileType.toUpperCase()} • {doc.totalChunks || 0} chunks •{" "}
                          {formatDate(doc.createdAt)}
                        </p>
                      </div>
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
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Chats */}
            {activeUserTab === "chats" && (
              <div className="space-y-2">
                {selectedUser.chats?.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">
                    No chat conversations recorded for this user.
                  </p>
                ) : (
                  selectedUser.chats.map((chat: any) => (
                    <div
                      key={chat._id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{chat.title}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {chat.messages?.length || 0} messages •{" "}
                          {formatDate(chat.updatedAt)}
                        </p>
                      </div>
                      <a
                        href={`/dashboard/admin/chats?chatId=${chat._id}`}
                        className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300"
                      >
                        <span>Transcript</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

