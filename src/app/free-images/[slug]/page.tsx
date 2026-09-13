import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ensureCloudinaryHttps } from "@/lib/cloudinary";
import { createPromptSlug, extractIdFromSlug } from "@/lib/slug";
import ImageDetailActions from "./ImageDetailActions";
import {
  ChevronLeft,
  Sparkles,
  Calendar,
  Layers,
  Cpu,
  ShieldCheck,
  Tag,
  ArrowRight,
  ImageIcon,
} from "lucide-react";

interface ImageResult {
  _id: string;
  prompt: string;
  cloudinaryUrl: string;
  vectorSearchScore?: number;
  metadata?: {
    model?: string;
    temperature?: number;
    generationTime?: number;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt?: string;
}

interface ImageDetailData {
  image: ImageResult;
  relatedImages: ImageResult[];
}

const getImageData = cache(async (slug: string): Promise<ImageDetailData | null> => {
  const imageId = extractIdFromSlug(slug);
  if (!imageId) return null;

  const API =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://localhost:4000";

  // 1. Try public image endpoint
  try {
    const res = await fetch(`${API}/v1/rag/images/public/${imageId}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.data?.image) {
        return {
          image: data.data.image,
          relatedImages: data.data.relatedImages || [],
        };
      }
    }
  } catch {
    // continue to fallback
  }

  // 2. Fallback: Search across multiple pages to locate image by ID
  const slugPrompt = slug
    .replace(/-?[0-9a-fA-F]{24}$/, "")
    .replace(/-/g, " ")
    .trim();
  const searchQuery = slugPrompt.length > 2 ? slugPrompt : "all";

  for (let page = 1; page <= 10; page++) {
    try {
      const searchRes = await fetch(`${API}/v1/rag/images/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: searchQuery, page }),
        cache: "no-store",
      });

      if (!searchRes.ok) break;

      const searchData = await searchRes.json();
      const images: ImageResult[] = searchData?.data?.data || [];
      if (images.length === 0) break;

      const found = images.find((img) => img._id === imageId);

      if (found) {
        const related = images.filter((img) => img._id !== imageId).slice(0, 8);
        return {
          image: found,
          relatedImages: related,
        };
      }

      const hasNextPage = searchData?.data?.pagination?.hasNextPage;
      if (hasNextPage === false) break;
    } catch {
      break;
    }
  }

  return null;
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getImageData(params.slug);
  if (!data?.image) {
    return {
      title: "Image Not Found | RagAI Free AI Images",
      description: "The requested AI generated image could not be located.",
    };
  }

  const { image } = data;
  const promptSnippet =
    image.prompt.length > 70
      ? `${image.prompt.slice(0, 67)}...`
      : image.prompt;
  const title = `${promptSnippet} | Free AI Image`;
  const description = `Free high-resolution AI generated image: "${image.prompt}". Download full resolution, edit with neural tools, or use royalty-free commercially.`;
  const imageUrl = ensureCloudinaryHttps(image.cloudinaryUrl);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1024,
          height: 1024,
          alt: image.prompt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ImageDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getImageData(params.slug);

  if (!data?.image) {
    notFound();
  }

  const { image, relatedImages } = data;
  const imageUrl = ensureCloudinaryHttps(image.cloudinaryUrl);

  const formattedDate = image.createdAt
    ? new Date(image.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently generated";

  // Derive simple tags from prompt
  const tags = image.prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-violet-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <Link
              href="/free-images"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Free AI Images Directory</span>
            </Link>
          </nav>

          {/* Main Grid: Visual Media Container + Specification Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Image Canvas */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-lg p-2 sm:p-3">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100">
                  <Image
                    src={imageUrl}
                    alt={image.prompt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Resolution & Attribution Badge */}
              <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <ImageIcon className="h-3.5 w-3.5 text-violet-600" />
                  1024 × 1024 HD Lossless PNG
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  CC0 Commercial License
                </span>
              </div>
            </div>

            {/* Right: Metadata & Action Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  AI Studio Generation
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {image.prompt}
                </h1>
              </div>

              {/* Actions Box */}
              <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm">
                <ImageDetailActions
                  prompt={image.prompt}
                  cloudinaryUrl={imageUrl}
                  slug={params.slug}
                />
              </div>

              {/* Technical Specifications */}
              <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Asset Specifications
                </h2>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                      <Cpu className="h-3.5 w-3.5 text-violet-600" />
                      <span>Model Architecture</span>
                    </div>
                    <p className="font-bold text-slate-800 truncate">
                      {image.metadata?.model || "SDXL Neural Diffusion"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                      <Calendar className="h-3.5 w-3.5 text-violet-600" />
                      <span>Generated On</span>
                    </div>
                    <p className="font-bold text-slate-800">
                      {formattedDate}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                      <Layers className="h-3.5 w-3.5 text-violet-600" />
                      <span>Color Profile</span>
                    </div>
                    <p className="font-bold text-slate-800">sRGB 8-bit</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Commercial Rights</span>
                    </div>
                    <p className="font-bold text-emerald-700">Royalty Free</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    <Tag className="h-3.5 w-3.5 text-violet-600" />
                    <span>Neural Prompt Keywords</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <Link
                        key={t}
                        href={`/free-images?q=${encodeURIComponent(t)}`}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-colors"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Images Gallery */}
          {relatedImages && relatedImages.length > 0 && (
            <div className="mt-20 border-t border-slate-200 pt-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Related AI Generations
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Similar conceptual prompts from our high-throughput vector catalog
                  </p>
                </div>
                <Link
                  href="/free-images"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700"
                >
                  <span>Explore full gallery</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedImages.map((item) => {
                  const itemUrl = ensureCloudinaryHttps(item.cloudinaryUrl);
                  const itemSlug = createPromptSlug(item.prompt, item._id);

                  return (
                    <Link
                      key={item._id}
                      href={`/free-images/${itemSlug}`}
                      className="group block rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-300 transition-all duration-300"
                    >
                      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                        <Image
                          src={itemUrl}
                          alt={item.prompt}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-violet-600 transition-colors">
                          {item.prompt}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

