"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  ImageIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ExternalLink,
  Edit,
  Download,
  Calendar,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/date";

interface ImageItem {
  _id: string;
  prompt: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  metadata?: {
    model: string;
    temperature?: number;
    generationTime?: number;
  };
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

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Preview & Delete Modal
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "12",
      });
      if (search.trim()) queryParams.append("search", search.trim());

      const { data } = await api.get(`/v1/admin/images?${queryParams.toString()}`);
      setImages(data.data.images || []);
      setPagination(data.data.pagination);
    } catch (err: any) {
      console.error("Failed to load images:", err);
      toast.error(err.response?.data?.message || "Failed to load generated images");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDelete = async () => {
    if (!deleteImageId) return;
    try {
      setIsDeleting(true);
      await api.delete(`/v1/admin/images/${deleteImageId}`);
      toast.success("Image deleted successfully");
      setDeleteImageId(null);
      if (previewImage?._id === deleteImageId) {
        setPreviewImage(null);
      }
      fetchImages();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl">
        <div className="relative max-w-xl">
          <Input
            type="text"
            placeholder="Search generated images by prompt..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Images Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-500">
          <ImageIcon className="h-10 w-10 mx-auto text-slate-600 mb-3" />
          <p className="text-base font-semibold text-slate-400">No images found</p>
          <p className="text-xs text-slate-500 mt-1">
            No generated images match your search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {images.map((img) => (
            <div
              key={img._id}
              className="group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl"
            >
              {/* Thumbnail Container */}
              <div
                onClick={() => setPreviewImage(img)}
                className="relative aspect-square w-full overflow-hidden bg-slate-950 cursor-pointer"
              >
                <Image
                  src={img.cloudinaryUrl}
                  alt={img.prompt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs text-white font-medium flex items-center gap-1">
                    <span>Click to inspect</span>
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <p
                    className="text-xs font-semibold text-slate-200 line-clamp-2"
                    title={img.prompt}
                  >
                    {img.prompt}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 truncate">
                    <User className="h-3 w-3 text-violet-400 shrink-0" />
                    <span className="truncate">
                      {img.userId?.name || img.userId?.email || "Unknown User"}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>{formatDate(img.createdAt)}</span>
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                  <Link
                    href={`/image-editor?imageUrl=${encodeURIComponent(img.cloudinaryUrl)}`}
                    className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs text-slate-300 hover:text-white hover:border-violet-500/50 transition-colors"
                    title="Open in Image Editor"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Link>

                  <a
                    href={img.cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs text-slate-300 hover:text-white hover:border-violet-500/50 transition-colors"
                    title="Open full resolution"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>

                  <button
                    onClick={() => setDeleteImageId(img._id)}
                    className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors ml-auto"
                    title="Delete Image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-5 py-3 rounded-2xl border border-slate-800 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {images.length} of {pagination.totalCount} images (Page {pagination.currentPage} of {pagination.totalPages})
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

      {/* Inspect Image Preview Modal */}
      <Modal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title="Image Details"
      >
        {previewImage && (
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <Image
                src={previewImage.cloudinaryUrl}
                alt={previewImage.prompt}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2 text-xs text-slate-300">
              <div>
                <span className="text-slate-500">Prompt:</span>
                <p className="font-semibold text-white mt-0.5">{previewImage.prompt}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                <div>
                  <span className="text-slate-500">Owner:</span>
                  <p className="font-semibold text-white mt-0.5">
                    {previewImage.userId?.name || "Unknown"}
                  </p>
                  <p className="text-slate-400 text-[11px]">{previewImage.userId?.email}</p>
                </div>
                <div>
                  <span className="text-slate-500">Created:</span>
                  <p className="font-semibold text-white mt-0.5">
                    {formatDate(previewImage.createdAt, "full")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <Link
                href={`/image-editor?imageUrl=${encodeURIComponent(previewImage.cloudinaryUrl)}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Open in Image Editor</span>
              </Link>

              <button
                onClick={() => {
                  setDeleteImageId(previewImage._id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Image</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteImageId)}
        onClose={() => setDeleteImageId(null)}
        title="Confirm Image Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to permanently delete this image? It will be removed from Cloudinary storage and deleted from the database.
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteImageId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
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

