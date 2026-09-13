import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import BlogSearchFilter from "./BlogSearchFilter";
import { getPublishedBlogs, getBlogCategories } from "@/lib/blogApi";
import { formatDate } from "@/lib/date";
import {
  Sparkles,
  Clock,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { page?: string; category?: string; search?: string };
}): Promise<Metadata> {
  const category = searchParams?.category ? ` - ${searchParams.category}` : "";
  const search = searchParams?.search ? ` | Search: "${searchParams.search}"` : "";

  const title = `RagAI Engineering & AI Research Blog${category}${search}`;
  const description =
    "Explore in-depth technical guides, tutorials, and research on Retrieval-Augmented Generation (RAG), vector databases, multi-document synthesis, neural computer vision, and building secure AI infrastructure.";

  const siteUrl = process.env["NEXT_PUBLIC_APP_URL"] || "https://ragai.techbreta.com";
  const canonicalUrl = `${siteUrl}/blog`;

  return {
    title,
    description,
    keywords: [
      "Retrieval-Augmented Generation",
      "RAG",
      "Vector Search",
      "AI Engineering",
      "Multi-Document Search",
      "Neural Matting",
      "Image Diffusion",
      "AI Safety",
      "LLM Hallucinations",
      "Document Chat",
    ],
    authors: [{ name: "RagAI Engineering Team" }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "RagAI",
      images: [
        {
          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
          width: 1200,
          height: 630,
          alt: "RagAI Engineering Blog",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      ],
      creator: "@ragai",
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    category?: string;
    search?: string;
    tag?: string;
  };
}) {
  const page = Number(searchParams?.page) || 1;
  const category = searchParams?.category || "";
  const search = searchParams?.search || "";
  const tag = searchParams?.tag || "";

  const [blogData, categories] = await Promise.all([
    getPublishedBlogs({ page, limit: 9, category, search, tag }),
    getBlogCategories(),
  ]);

  const { blogs, featuredBlog, pagination } = blogData;

  // Schema.org Blog / CollectionPage JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "RagAI Engineering & AI Research Blog",
    description:
      "Articles and deep dives on Retrieval-Augmented Generation, vector embeddings, multi-document synthesis, and AI computer vision.",
    url: `${process.env["NEXT_PUBLIC_APP_URL"] || "https://ragai.techbreta.com"}/blog`,
    publisher: {
      "@type": "Organization",
      name: "RagAI",
      logo: {
        "@type": "ImageObject",
        url: `${process.env["NEXT_PUBLIC_APP_URL"] || "https://ragai.techbreta.com"}/rag.png`,
      },
    },
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.excerpt,
      url: `${process.env["NEXT_PUBLIC_APP_URL"] || "https://ragai.techbreta.com"}/blog/${blog.slug}`,
      datePublished: blog.publishedAt || blog.createdAt,
      image: blog.coverImage,
      author: {
        "@type": "Person",
        name: blog.author?.name || "RagAI Team",
      },
    })),
  };

  const showFeaturedHero = page === 1 && !search && (!category || category === "All") && featuredBlog;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Background glow effects */}
        <div className="relative overflow-hidden">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Hero Header */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              RagAI Technical Publications
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
              Insights on <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Retrieval AI</span> & Neural Media
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore deep architectural write-ups, vector search algorithms, layout normalization benchmarks, and production AI engineering.
            </p>

            {/* Filter and Search Bar Wrapped in Suspense */}
            <div className="mt-8">
              <Suspense fallback={<div className="h-20 flex items-center justify-center text-slate-500 text-sm">Loading filters...</div>}>
                <BlogSearchFilter
                  categories={categories}
                  currentCategory={category}
                  currentSearch={search}
                />
              </Suspense>
            </div>
          </section>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Featured Article Hero */}
          {showFeaturedHero && (
            <section className="relative group">
              <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-1 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-violet-500/50">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-6 sm:p-8">
                  {/* Featured Cover Image */}
                  <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img
                      src={featuredBlog.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-violet-600/90 text-white shadow-lg backdrop-blur-md border border-violet-400/30">
                        Featured Article
                      </span>
                    </div>
                  </div>

                  {/* Featured Content */}
                  <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="text-violet-400 font-semibold uppercase tracking-wider">
                        {featuredBlog.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {featuredBlog.readTimeMinutes} min read
                      </span>
                    </div>

                    <Link href={`/blog/${featuredBlog.slug}`}>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white hover:text-violet-300 transition-colors leading-snug">
                        {featuredBlog.title}
                      </h2>
                    </Link>

                    <p className="text-slate-400 text-sm sm:text-base line-clamp-3 leading-relaxed">
                      {featuredBlog.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                      <div className="flex items-center gap-3">
                        <img
                          src={featuredBlog.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                          alt={featuredBlog.author?.name || "Author"}
                          className="h-10 w-10 rounded-full border border-violet-500/30 object-cover"
                        />
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {featuredBlog.author?.name || "RagAI Engineering"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatDate(featuredBlog.publishedAt || featuredBlog.createdAt)}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredBlog.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
                      >
                        Read Article
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Articles Grid Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {category && category !== "All"
                    ? `${category} Articles`
                    : search
                    ? `Results for "${search}"`
                    : "Latest Articles"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Showing {blogs.length} of {pagination.totalCount} articles
                </p>
              </div>
            </div>

            {blogs.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center max-w-lg mx-auto">
                <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">No articles found</h3>
                <p className="text-slate-400 text-sm mt-2 mb-6">
                  We couldn&apos;t find any articles matching your search criteria. Try a different query or explore all categories.
                </p>
                <Link
                  href="/blog"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-all"
                >
                  View All Articles
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {blogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 transition-all duration-300 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-600/10 overflow-hidden"
                  >
                    {/* Cover Image Container */}
                    <Link href={`/blog/${blog.slug}`} className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <img
                        src={blog.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-950/80 text-violet-300 border border-violet-500/30 backdrop-blur-md">
                          {blog.category}
                        </span>
                      </div>
                    </Link>

                    {/* Card Content Body */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          <span>{blog.readTimeMinutes} min read</span>
                          <span>•</span>
                          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                        </div>

                        <Link href={`/blog/${blog.slug}`}>
                          <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                            {blog.title}
                          </h3>
                        </Link>

                        <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </div>

                      {/* Author & Footer */}
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={blog.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                            alt={blog.author?.name || "Author"}
                            className="h-8 w-8 rounded-full border border-slate-700 object-cover"
                          />
                          <div>
                            <div className="text-xs font-semibold text-slate-200">
                              {blog.author?.name || "RagAI Team"}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {blog.author?.role || "Core Contributor"}
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/blog/${blog.slug}`}
                          className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                        >
                          Read
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-10">
                {pagination.hasPreviousPage && (
                  <Link
                    href={`/blog?${new URLSearchParams({
                      ...(category && { category }),
                      ...(search && { search }),
                      page: String(pagination.currentPage - 1),
                    }).toString()}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Link>
                )}

                <span className="text-xs sm:text-sm text-slate-400 px-3">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                {pagination.hasNextPage && (
                  <Link
                    href={`/blog?${new URLSearchParams({
                      ...(category && { category }),
                      ...(search && { search }),
                      page: String(pagination.currentPage + 1),
                    }).toString()}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* CTA Banner */}
          <section className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/60 via-slate-900 to-indigo-950/60 p-8 sm:p-12 text-center backdrop-blur-xl">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Supercharge Your Knowledge Retrieval & Creative Workflows
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Connect your documents, run multi-hop citation-grounded RAG queries, remove backgrounds with neural matting, and synthesize studio images in one unified workspace.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/25"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/features"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm border border-slate-700 transition-all"
                >
                  Explore Platform Features
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <Image src="/rag.png" alt="RagAI" width={80} height={32} className="h-8 w-auto" />
            <span>© {new Date().getFullYear()} RagAI Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/free-images" className="hover:text-white transition-colors">Free Images</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
