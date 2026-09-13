"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/date";
import { BlogItem, BlogPagination } from "@/types/blog";

const CATEGORY_SUGGESTIONS = [
  "RAG & AI Architecture",
  "Document Processing",
  "AI Safety & Accuracy",
  "Creative AI & Imaging",
  "Data Science & Search",
  "Security & Governance",
  "Future of AI",
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [pagination, setPagination] = useState<BlogPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState<BlogItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Editor Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("RAG & AI Architecture");
  const [formTags, setFormTags] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formReadTime, setFormReadTime] = useState(5);
  const [formStatus, setFormStatus] = useState<"draft" | "published" | "archived">("published");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formAuthorName, setFormAuthorName] = useState("RagAI Engineering Team");
  const [formAuthorRole, setFormAuthorRole] = useState("Core AI Contributor");
  const [formAuthorAvatar, setFormAuthorAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
  );
  const [formSeoTitle, setFormSeoTitle] = useState("");
  const [formSeoDescription, setFormSeoDescription] = useState("");
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");

  // Slugify helper
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleTitleChange = (newTitle: string) => {
    setFormTitle(newTitle);
    if (!editingBlog) {
      setFormSlug(slugify(newTitle));
    }
  };

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (search.trim()) queryParams.append("search", search.trim());
      if (status !== "all") queryParams.append("status", status);
      if (category !== "all") queryParams.append("category", category);

      const res = await api.get(`/v1/admin/blogs?${queryParams.toString()}`);
      if (res.data?.data) {
        setBlogs(res.data.data.blogs || []);
        setPagination(res.data.data.pagination || null);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status, category]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormTitle("");
    setFormSlug("");
    setFormCategory("RAG & AI Architecture");
    setFormTags("RAG, AI, Vector Search");
    setFormExcerpt("");
    setFormContent(`## Introduction\n\nWrite your blog content here in Markdown format...\n\n### Core Insights\n\n- Point 1\n- Point 2\n\n\`\`\`typescript\n// Code snippet\nconst response = await rag.query("Hello World");\n\`\`\`\n\n## Conclusion\n\nWrap up your key takeaways.`);
    setFormCoverImage("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop");
    setFormReadTime(5);
    setFormStatus("published");
    setFormFeatured(false);
    setFormAuthorName("RagAI Engineering Team");
    setFormAuthorRole("Core AI Contributor");
    setFormAuthorAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop");
    setFormSeoTitle("");
    setFormSeoDescription("");
    setEditorTab("write");
    setIsEditorOpen(true);
  };

  const openEditModal = (blog: BlogItem) => {
    setEditingBlog(blog);
    setFormTitle(blog.title);
    setFormSlug(blog.slug);
    setFormCategory(blog.category);
    setFormTags(blog.tags ? blog.tags.join(", ") : "");
    setFormExcerpt(blog.excerpt);
    setFormContent(blog.content);
    setFormCoverImage(blog.coverImage || "");
    setFormReadTime(blog.readTimeMinutes || 5);
    setFormStatus(blog.status);
    setFormFeatured(Boolean(blog.featured));
    setFormAuthorName(blog.author?.name || "RagAI Engineering Team");
    setFormAuthorRole(blog.author?.role || "Core AI Contributor");
    setFormAuthorAvatar(
      blog.author?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    );
    setFormSeoTitle(blog.seoTitle || "");
    setFormSeoDescription(blog.seoDescription || "");
    setEditorTab("write");
    setIsEditorOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Blog title is required");
      return;
    }
    if (!formSlug.trim()) {
      toast.error("URL Slug is required");
      return;
    }
    if (!formContent.trim()) {
      toast.error("Blog markdown content is required");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        title: formTitle.trim(),
        slug: slugify(formSlug),
        category: formCategory,
        tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
        excerpt: formExcerpt.trim() || formTitle.trim(),
        content: formContent,
        coverImage: formCoverImage.trim() || undefined,
        readTimeMinutes: Number(formReadTime) || 5,
        status: formStatus,
        featured: formFeatured,
        author: {
          name: formAuthorName.trim() || "RagAI Engineering Team",
          role: formAuthorRole.trim() || "Core Contributor",
          avatar: formAuthorAvatar.trim() || undefined,
        },
        seoTitle: formSeoTitle.trim() || undefined,
        seoDescription: formSeoDescription.trim() || undefined,
      };

      if (editingBlog) {
        await api.patch(`/v1/admin/blogs/${editingBlog._id}`, payload);
        toast.success("Blog updated successfully!");
      } else {
        await api.post("/v1/admin/blogs", payload);
        toast.success("Blog post created successfully!");
      }

      setIsEditorOpen(false);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save blog post");
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (blog: BlogItem) => {
    setDeletingBlog(blog);
    setIsDeleteOpen(true);
  };

  const handleDeleteBlog = async () => {
    if (!deletingBlog) return;
    try {
      setIsDeleting(true);
      await api.delete(`/v1/admin/blogs/${deletingBlog._id}`);
      toast.success("Blog deleted successfully!");
      setIsDeleteOpen(false);
      setDeletingBlog(null);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete blog");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, tag..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Categories</option>
            {CATEGORY_SUGGESTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <ExternalLink className="h-4 w-4" />
            View Public Blog
          </Link>

          <Button onClick={openCreateModal} size="sm" className="flex items-center gap-1.5 shadow-lg shadow-violet-600/25">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Blogs Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-slate-400">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                      Loading articles...
                    </div>
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <BookOpen className="h-10 w-10 mx-auto mb-2 text-slate-600" />
                    No blogs found matching the selected filters.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="h-12 w-16 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                          <img
                            src={
                              blog.coverImage ||
                              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
                            }
                            alt={blog.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="max-w-md">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white line-clamp-1">
                              {blog.title}
                            </span>
                            {blog.featured && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-600/30 text-violet-300 border border-violet-500/40">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-mono">
                            /{blog.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-violet-300 border border-slate-700/60">
                        {blog.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          blog.status === "published"
                            ? "success"
                            : blog.status === "draft"
                            ? "warning"
                            : "default"
                        }
                      >
                        {blog.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>{blog.views || 0}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Live View */}
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          title="View Public Article"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(blog)}
                          title="Edit Post"
                          className="p-1.5 rounded-lg bg-slate-800 text-violet-400 hover:text-violet-300 hover:bg-violet-950/40 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => openDeleteModal(blog)}
                          title="Delete Post"
                          className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/60">
            <span className="text-xs text-slate-400">
              Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} posts total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT BLOG MODAL */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingBlog ? "Edit Blog Article" : "Create New Blog Article"}
        className="max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSaveBlog} className="space-y-6 pt-2">
          {/* Main Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Modern Retrieval-Augmented Generation Architecture"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                URL Slug * (auto-generated)
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-slate-800/80 border border-r-0 border-slate-700 rounded-l-xl text-xs text-slate-500">
                  /blog/
                </span>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(slugify(e.target.value))}
                  placeholder="article-url-slug"
                  className="w-full px-3.5 py-2.5 rounded-r-xl bg-slate-800 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Category, Tags, Read Time, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Category *
              </label>
              <input
                type="text"
                list="category-suggestions"
                required
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <datalist id="category-suggestions">
                {CATEGORY_SUGGESTIONS.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="RAG, Vector, LLM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Read Time (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={formReadTime}
                onChange={(e) => setFormReadTime(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Cover Image & Featured Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Cover Image URL
              </label>
              <input
                type="url"
                value={formCoverImage}
                onChange={(e) => setFormCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="formFeatured"
                checked={formFeatured}
                onChange={(e) => setFormFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="formFeatured" className="text-sm font-medium text-slate-200 cursor-pointer">
                Mark as Featured Article
              </label>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Short Excerpt / Summary (shown in cards and meta description)
            </label>
            <textarea
              rows={2}
              value={formExcerpt}
              onChange={(e) => setFormExcerpt(e.target.value)}
              placeholder="Brief 1-2 sentence hook for the article..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Markdown Content with Write / Preview Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300">
                Article Content (Markdown Supported) *
              </label>
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditorTab("write")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    editorTab === "write"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    editorTab === "preview"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {editorTab === "write" ? (
              <textarea
                required
                rows={14}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Write in GitHub Flavored Markdown..."
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 leading-relaxed"
              />
            ) : (
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 min-h-[350px] max-h-[500px] overflow-y-auto prose prose-invert max-w-none text-slate-300">
                <ReactMarkdown>{formContent}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Author Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={formAuthorName}
                onChange={(e) => setFormAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Author Role
              </label>
              <input
                type="text"
                value={formAuthorRole}
                onChange={(e) => setFormAuthorRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Author Avatar URL
              </label>
              <input
                type="url"
                value={formAuthorAvatar}
                onChange={(e) => setFormAuthorAvatar(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          {/* SEO Metadata Override */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Custom SEO Title (Optional)
              </label>
              <input
                type="text"
                value={formSeoTitle}
                onChange={(e) => setFormSeoTitle(e.target.value)}
                placeholder="Overrides default title tag"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Custom SEO Description (Optional)
              </label>
              <input
                type="text"
                value={formSeoDescription}
                onChange={(e) => setFormSeoDescription(e.target.value)}
                placeholder="Overrides default meta description"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditorOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-600/25 min-w-[120px]"
            >
              {isSaving ? "Saving..." : editingBlog ? "Update Article" : "Publish Article"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Delete Article"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              Are you sure you want to permanently delete:
              <p className="font-semibold text-white mt-1">
                &quot;{deletingBlog?.title}&quot;
              </p>
              This action cannot be undone.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isDeleting}
              onClick={handleDeleteBlog}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
