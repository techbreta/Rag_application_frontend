import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { ensureCloudinaryHttps } from "@/lib/cloudinary";
import { createPromptSlug, extractIdFromSlug } from "@/lib/slug";
import ImageDetailActions from "./ImageDetailActions";
import {
  ChevronLeft,
  Sparkles,
  Download,
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
  //    Extract prompt words from slug for a more targeted search
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
      if (images.length === 0) break; // no more pages

      const found = images.find((img) => img._id === imageId);

      if (found) {
        const related = images.filter((img) => img._id !== imageId).slice(0, 8);
        return {
          image: found,
          relatedImages: related,
        };
      }

      // If the backend tells us there's no next page, stop
      const hasNextPage = searchData?.data?.pagination?.hasNextPage;
      if (hasNextPage === false) break;
    } catch {
      break;
    }
  }

  return null;
});

type Props = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(props.params);
  const data = await getImageData(resolvedParams.slug);

  if (!data || !data.image) {
    return {
      title: "Image Not Found | RagAI",
      description: "The requested image could not be found.",
    };
  }

  const { image } = data;
  const titlePrompt =
    image.prompt.length > 55
      ? `${image.prompt.slice(0, 52)}...`
      : image.prompt;
  const pageTitle = `${titlePrompt} - Free AI Image | RagAI`;
  const pageDescription = `Download high-resolution free AI generated image: "${image.prompt}". Free to download and use on RagAI.`;
  const canonicalUrl = `https://ragai.website/free-images/${resolvedParams.slug}`;
  const safeImgUrl = ensureCloudinaryHttps(image.cloudinaryUrl);

  const keywords = [
    "free AI images",
    "AI generated photo",
    "free stock images",
    "download AI image",
    "RagAI",
    ...image.prompt.split(/[\s,]+/).filter((w) => w.length > 3).slice(0, 8),
  ];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords.join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: "RagAI",
      type: "article",
      images: [
        {
          url: safeImgUrl,
          width: 1024,
          height: 1024,
          alt: image.prompt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [safeImgUrl],
    },
  };
}

export default async function ImageDetailPage(props: Props) {
  const resolvedParams = await Promise.resolve(props.params);
  const data = await getImageData(resolvedParams.slug);

  if (!data || !data.image) {
    notFound();
  }

  const { image, relatedImages } = data;
  const safeImgUrl = ensureCloudinaryHttps(image.cloudinaryUrl);
  const canonicalUrl = `https://ragai.website/free-images/${resolvedParams.slug}`;

  // Structured Data (JSON-LD) for Google Image Search and SEO ranking
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name: image.prompt,
      caption: image.prompt,
      description: image.prompt,
      contentUrl: safeImgUrl,
      thumbnailUrl: safeImgUrl,
      datePublished: image.createdAt,
      uploadDate: image.createdAt,
      acquireLicensePage: "https://ragai.website/free-images",
      license: "https://creativecommons.org/publicdomain/zero/1.0/",
      author: {
        "@type": "Organization",
        name: "RagAI",
        url: "https://ragai.website",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://ragai.website",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Free Images",
          item: "https://ragai.website/free-images",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: image.prompt.slice(0, 40),
          item: canonicalUrl,
        },
      ],
    },
  ];

  const formattedDate = new Date(image.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-violet-500/30">
      {/* Inject Structured Data for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <div className="pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-400 mb-6 sm:mb-8"
        >
          <Link
            href="/free-images"
            className="inline-flex items-center gap-1 hover:text-violet-400 transition-colors font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Gallery</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 font-medium">Free Image</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-500 line-clamp-1 max-w-[180px] sm:max-w-xs md:max-w-md">
            {image.prompt}
          </span>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
          {/* Left Column: Image Preview Card */}
          <div className="lg:col-span-7 xl:col-span-8 w-full">
            <div className="relative rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-xl">
              {/* Ambient Blurred Backdrop for atmospheric aesthetics */}
              <div
                className="absolute inset-0 overflow-hidden opacity-25 filter blur-3xl pointer-events-none scale-110"
                aria-hidden="true"
              >
                <Image
                  src={safeImgUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* Viewport-adaptive image display area */}
              <div className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[72vh] min-h-[300px] sm:min-h-[420px] max-h-[780px] p-2 sm:p-4 flex items-center justify-center bg-slate-950/40">
                <Image
                  src={safeImgUrl}
                  alt={image.prompt}
                  fill
                  priority
                  className="object-contain p-2 sm:p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 55vw"
                />

                {/* Resolution & Format Pill */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-950/80 border border-slate-700/60 backdrop-blur-md text-[10px] sm:text-[11px] text-slate-300 font-mono shadow-md">
                  <ImageIcon className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-violet-400 shrink-0" />
                  <span>High Resolution AI Image</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Prompt, Actions, Details (Sticky on Desktop) */}
          <div className="lg:col-span-5 xl:col-span-4 w-full space-y-5 sm:space-y-6 lg:sticky lg:top-28 self-start">
            {/* Prompt Card */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
                  <Sparkles className="h-3 w-3 shrink-0" />
                  Image Prompt
                </span>

                <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                  <Calendar className="h-3.5 w-3.5" />
                  {formattedDate}
                </span>
              </div>

              <h1 className="text-base sm:text-lg lg:text-xl font-medium text-slate-100 leading-relaxed break-words">
                {image.prompt}
              </h1>

              {/* Interactive Client Actions */}
              <div className="pt-1">
                <ImageDetailActions
                  prompt={image.prompt}
                  cloudinaryUrl={image.cloudinaryUrl}
                  slug={resolvedParams.slug}
                />
              </div>
            </div>

            {/* Specifications & License Card */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Image Information
              </h2>

              <div className="divide-y divide-slate-800/80 text-sm">
                <div className="py-2.5 flex items-center justify-between gap-2">
                  <span className="text-slate-400 flex items-center gap-2 text-xs shrink-0">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    License
                  </span>
                  <span className="font-medium text-[11px] sm:text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 truncate">
                    Free for Commercial Use
                  </span>
                </div>

                {image.metadata?.model && (
                  <div className="py-2.5 flex items-center justify-between gap-2">
                    <span className="text-slate-400 flex items-center gap-2 text-xs shrink-0">
                      <Cpu className="h-4 w-4 text-violet-400 shrink-0" />
                      AI Model
                    </span>
                    <span className="font-mono text-xs text-slate-200 truncate">
                      {image.metadata.model}
                    </span>
                  </div>
                )}

                {image.metadata?.generationTime && (
                  <div className="py-2.5 flex items-center justify-between gap-2">
                    <span className="text-slate-400 flex items-center gap-2 text-xs shrink-0">
                      <Layers className="h-4 w-4 text-cyan-400 shrink-0" />
                      Generation Time
                    </span>
                    <span className="text-xs text-slate-300">
                      {(image.metadata.generationTime / 1000).toFixed(1)}s
                    </span>
                  </div>
                )}

                <div className="py-2.5 flex items-center justify-between gap-2">
                  <span className="text-slate-400 flex items-center gap-2 text-xs shrink-0">
                    <Tag className="h-4 w-4 text-slate-400 shrink-0" />
                    Attribution
                  </span>
                  <span className="text-xs text-slate-300">
                    Not required
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Images Section (For Internal Linking and Crawler Traversal) */}
        {relatedImages.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-10 sm:pt-12 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">More Free AI Images</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Discover more high quality royalty-free generated images
                </p>
              </div>

              <Link
                href="/free-images"
                className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-semibold w-fit"
              >
                <span>View all gallery</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedImages.map((related) => {
                const relSlug = createPromptSlug(related.prompt, related._id);
                const relUrl = `/free-images/${relSlug}`;

                return (
                  <div
                    key={related._id}
                    className="group relative rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-violet-500/40 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-800">
                      <Link
                        href={relUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <Image
                          src={ensureCloudinaryHttps(related.cloudinaryUrl)}
                          alt={related.prompt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </Link>
                    </div>

                    <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
                      <Link
                        href={relUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] sm:text-xs text-slate-300 hover:text-violet-400 line-clamp-2 transition-colors font-medium"
                        title={related.prompt}
                      >
                        {related.prompt}
                      </Link>

                      <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-slate-800/60 mt-auto">
                        <Link
                          href={relUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] sm:text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium"
                        >
                          <span>View</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>

                        <a
                          href={
                            related.cloudinaryUrl.includes("/upload/")
                              ? ensureCloudinaryHttps(
                                  related.cloudinaryUrl,
                                ).replace("/upload/", "/upload/fl_attachment/")
                              : ensureCloudinaryHttps(related.cloudinaryUrl)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

