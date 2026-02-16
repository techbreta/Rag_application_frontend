"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import AnimatedPage from "@/components/layout/AnimatedPage";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Loading";
import {
  ImageIcon,
  Download,
  Sparkles,
  X,
  Calendar,
  Search,
} from "lucide-react";
import api from "@/lib/axios";
import Input from "@/components/ui/Input";

interface GeneratedImage {
  _id: string;
  prompt: string;
  cloudinaryUrl: string;
  mistralConversationId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface GetImagesResponse {
  status: string;
  data: {
    images: GeneratedImage[];
  };
}

export default function ImageGalleryPage() {
  const [lightboxImage, setLightboxImage] = useState<GeneratedImage | null>(
    null,
  );
  const [searchFilter, setSearchFilter] = useState("");

  // Fetch user's generated images
  const { data, isLoading, error, refetch } = useQuery<GetImagesResponse>({
    queryKey: ["userImages"],
    queryFn: async () => {
      const { data } = await api.get("/v1/rag/images");
      console.log("User Images Response:", data);
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });

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

  const images = data?.data?.images || [];
  const filteredImages = images.filter((img) =>
    img.prompt.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  if (isLoading) return <PageLoader />;

  return (
    <AnimatedPage>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            My Image Gallery
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            View and download your AI-generated images
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">
            {images.length} image{images.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Search */}
      {images.length > 0 && (
        <div className="mb-6 max-w-md">
          <Input
            type="text"
            placeholder="Search by prompt..."
            value={searchFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchFilter(e.target.value)
            }
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
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
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Images Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredImages.map((image) => (
            <motion.div
              key={image._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
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
              </div>

              {/* Info & Actions */}
              <div className="p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                  {image.prompt}
                </p>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(image.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleDownload(image.cloudinaryUrl, image.prompt)
                    }
                    className="text-violet-400 hover:text-violet-300"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : images.length > 0 ? (
        <div className="text-center py-20">
          <Search className="h-16 w-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            No matching images
          </h3>
          <p className="text-slate-500">
            No images match your search. Try a different keyword.
          </p>
        </div>
      ) : (
        <EmptyState
          title="No images yet"
          description="You haven't generated any images yet. Create your first AI-generated image!"
          action={
            <Button
              onClick={() =>
                (window.location.href = "/dashboard/generate-image")
              }
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Image
            </Button>
          }
        />
      )}

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
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
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
    </AnimatedPage>
  );
}
