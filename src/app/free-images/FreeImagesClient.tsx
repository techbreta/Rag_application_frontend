import Link from "next/link";
import Image from "next/image";
import { ensureCloudinaryHttps } from "@/lib/cloudinary";
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

export default function FreeImagesClient({
  initialImages = [],
  initialPagination = null,
  query = "",
}: {
  initialImages?: ImageResult[];
  initialPagination?: PaginationInfo | null;
  query?: string;
}) {
  const images = initialImages || [];
  const pagination = initialPagination as PaginationInfo | null;
  const isSearchActive = Boolean(query && query.length > 0);

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

          {/* Search Bar - server form (GET) so params are in URL */}
          <SlideIn delay={0.3}>
            <form
              method="get"
              action="/free-images"
              className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Input
                  name="q"
                  type="text"
                  placeholder="Search images... (e.g., 'sunset over mountains')"
                  defaultValue={query}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl font-semibold px-5 py-2.5 text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </button>
                {isSearchActive && (
                  <Link href="/free-images">
                    <a>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-xl font-semibold px-3 py-1.5 text-sm border-2 border-violet-500/50 text-violet-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </a>
                  </Link>
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
                        &quot;{query}&quot;
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

          {/* Images Grid */}
          {images.length > 0 && (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {images.map((image) => (
                <StaggerItem key={image._id}>
                  <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden backdrop-blur-sm hover:border-violet-500/30 transition-all duration-300">
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-800">
                      <a
                        href={ensureCloudinaryHttps(image.cloudinaryUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={ensureCloudinaryHttps(image.cloudinaryUrl)}
                          alt={image.prompt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      </a>
                    </div>

                    <div className="p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-2">
                        {image.vectorSearchScore != null && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Sparkles className="h-3 w-3 text-violet-400" />
                            {Math.round(image.vectorSearchScore * 100)}% match
                          </span>
                        )}
                        <a
                          href={
                            image.cloudinaryUrl.includes("/upload/")
                              ? ensureCloudinaryHttps(
                                  image.cloudinaryUrl,
                                ).replace("/upload/", "/upload/fl_attachment/")
                              : ensureCloudinaryHttps(image.cloudinaryUrl)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-2 text-violet-400"
                        >
                          <Download className="h-4 w-4" />
                          <span className="text-xs">Download</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Empty State */}
          {images.length === 0 && (
            <div className="text-center py-32">
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
                <Link href="/free-images">
                  <Button variant="outline">Clear Search</Button>
                </Link>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-12 flex-wrap">
              <Link
                href={`?q=${encodeURIComponent(query ?? "")}&page=${Math.max(1, (pagination.currentPage ?? 1) - 1)}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
              </Link>

              <div className="flex items-center gap-1.5">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if ((pagination.currentPage ?? 1) <= 3) {
                      pageNum = i + 1;
                    } else if (
                      (pagination.currentPage ?? 1) >=
                      (pagination.totalPages ?? 1) - 2
                    ) {
                      pageNum = (pagination.totalPages ?? 1) - 4 + i;
                    } else {
                      pageNum = (pagination.currentPage ?? 1) - 2 + i;
                    }
                    return (
                      <Link
                        key={pageNum}
                        href={`?q=${encodeURIComponent(query ?? "")}&page=${pageNum}`}
                      >
                        <Button
                          variant={
                            pageNum === (pagination.currentPage ?? 1)
                              ? "primary"
                              : "outline"
                          }
                          size="sm"
                          className="min-w-[2.5rem]"
                        >
                          {pageNum}
                        </Button>
                      </Link>
                    );
                  },
                )}
              </div>

              <Link
                href={`?q=${encodeURIComponent(query ?? "")}&page=${Math.min(pagination.totalPages ?? 1, (pagination.currentPage ?? 1) + 1)}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

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
          © {new Date().getFullYear()} RagAI. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
