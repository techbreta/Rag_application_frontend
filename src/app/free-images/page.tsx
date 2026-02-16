"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import {
  FadeIn,
  SlideIn,
  StaggerContainer,
  StaggerItem,
  GlowingOrb,
} from "@/components/layout/AnimatedPage";
import {
  Search,
  Download,
  ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import api from "@/lib/axios";

interface ImageResult {
  _id: string;
  prompt: string;
  cloudinaryUrl: string;
  vectorSearchScore: number;
  mistralConversationId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface SearchResponse {
  status: string;
  data: {
    data: ImageResult[];
    pagination: PaginationInfo;
  };
}

export default function FreeImagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxImage, setLightboxImage] = useState<ImageResult | null>(null);
  const LIMIT = 12;

  // Fetch images — always calls API. Empty prompt = show all images.
  const { data, isLoading, isFetching, error } = useQuery<SearchResponse>({
    queryKey: ["freeImages", activeQuery, currentPage],
    queryFn: async () => {
      const { data } = await api.post("/v1/rag/images/search", {
        prompt: activeQuery || "all",
        limit: LIMIT,
        page: currentPage,
      });
      console.log("Search Images Response:", data);
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });

  // Load images on mount with empty query
  useEffect(() => {
    setActiveQuery("");
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveQuery(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    setActiveQuery("");
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      // Add Cloudinary's download flag to force download instead of opening in browser
      const downloadUrl = imageUrl.includes('/upload/')
        ? imageUrl.replace('/upload/', '/upload/fl_attachment/')
        : imageUrl;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${prompt.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50)}-${Date.now()}.png`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  const images = data?.data?.data || [];
  const pagination = data?.data?.pagination;
  const isSearchActive = activeQuery.length > 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 sm:pb-16 px-4">
        <GlowingOrb className="top-20 left-1/4 bg-violet-500" />
        <GlowingOrb className="top-40 right-1/4 bg-indigo-600" />

        <div className="relative max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
              <ImageIcon className="h-4 w-4" />
              Free Image Gallery
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover & Download{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Free AI Images
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
              Search through AI-generated images using natural language prompts.
              Browse, preview, and download high-quality images for free.
            </p>
          </FadeIn>

          {/* Search Bar */}
          <SlideIn delay={0.3}>
            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search images... (e.g., 'sunset over mountains')"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isFetching}>
                  {isFetching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
                {isSearchActive && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </SlideIn>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Results Header */}
          {pagination && (
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8">
                <p className="text-sm text-slate-400">
                  {isSearchActive ? (
                    <>
                      Showing results for{" "}
                      <span className="text-violet-400 font-medium">
                        &quot;{activeQuery}&quot;
                      </span>{" "}
                      — {pagination.totalCount} image
                      {pagination.totalCount !== 1 ? "s" : ""} found
                    </>
                  ) : (
                    <>
                      Browse all images — {pagination.totalCount} image
                      {pagination.totalCount !== 1 ? "s" : ""} available
                    </>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
              </div>
            </FadeIn>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-violet-400 mb-4" />
              <p className="text-sm text-slate-400">Loading images...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-center mb-8"
            >
              <p className="text-red-400">
                {error instanceof Error
                  ? error.message
                  : "Failed to load images. Please try again."}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleClearSearch}
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Images Grid */}
          {!isLoading && images.length > 0 && (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {images.map((image, index) => (
                <StaggerItem key={image._id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden backdrop-blur-sm hover:border-violet-500/30 transition-all duration-300"
                  >
                    {/* Image */}
                    <div
                      className="relative aspect-square w-full overflow-hidden cursor-pointer bg-slate-800"
                      onClick={() => setLightboxImage(image)}
                    >
                      <Image
                        src={image.cloudinaryUrl}
                        alt={image.prompt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      {/* Hover overlay */}
                      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-xs text-white/90 line-clamp-2">
                          {image.prompt}
                        </p>
                      </div> */}
                    </div>

                    {/* Info & Actions */}
                    <div className="p-3 sm:p-4">
                      {/* <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                        {image.prompt}
                      </p> */}
                      <div className="flex items-center justify-between gap-2">
                        {image.vectorSearchScore != null && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Sparkles className="h-3 w-3 text-violet-400" />
                            {Math.round(image.vectorSearchScore * 100)}% match
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDownload(image.cloudinaryUrl, image.prompt)
                          }
                          className="ml-auto text-violet-400 hover:text-violet-300"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          <span className="text-xs">Download</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Empty State */}
          {!isLoading && !error && images.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-slate-800/50 mb-6">
                <ImageIcon className="h-10 w-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                {isSearchActive ? "No images found" : "No images available"}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                {isSearchActive
                  ? "Try searching with a different prompt to find what you're looking for."
                  : "There are no images available yet. Check back later!"}
              </p>
              {isSearchActive && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Clear Search
                </Button>
              )}
            </motion.div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 sm:gap-3 mt-12 flex-wrap"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPreviousPage || isFetching}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div className="flex items-center gap-1.5">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (
                      pagination.currentPage >=
                      pagination.totalPages - 2
                    ) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === pagination.currentPage
                            ? "primary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isFetching}
                        className="min-w-[2.5rem]"
                      >
                        {pageNum}
                      </Button>
                    );
                  },
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage || isFetching}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Image */}
              <div className="relative w-full flex-1 min-h-0 aspect-square sm:aspect-video">
                <Image
                  src={lightboxImage.cloudinaryUrl}
                  alt={lightboxImage.prompt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  priority
                />
              </div>

              {/* Details */}
              <div className="p-4 sm:p-6 border-t border-slate-800">
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                  {lightboxImage.prompt}
                </p>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {lightboxImage.vectorSearchScore != null && (
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-violet-400" />
                        {Math.round(lightboxImage.vectorSearchScore * 100)}%
                        match
                      </span>
                    )}
                    <span>
                      {new Date(lightboxImage.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleDownload(
                        lightboxImage.cloudinaryUrl,
                        lightboxImage.prompt,
                      )
                    }
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-20 px-4">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center rounded-3xl border border-slate-800 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Want to create your own images?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Sign up for free and start generating AI images with your own
              prompts and documents.
            </p>
            <Link href="/register">
              <Button>
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          © {new Date().getFullYear()} RAG AI. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
