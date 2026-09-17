import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogShareActions from "./BlogShareActions";
import { getBlogBySlug } from "@/lib/blogApi";
import { formatDate } from "@/lib/date";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Tag,
  Sparkles,
} from "lucide-react";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

const getCachedBlog = cache(async (slug: string) => {
  return await getBlogBySlug(slug);
});

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const data = await getCachedBlog(params.slug);
  if (!data || !data.blog) {
    return {
      title: "Article Not Found | RagAI Blog",
      description: "The requested blog article could not be found.",
    };
  }

  const { blog } = data;
  const siteUrl = process.env["NEXT_PUBLIC_APP_URL"] || "https://www.ragai.website";
  const postUrl = `${siteUrl}/blog/${blog.slug}`;
  const title = blog.seoTitle || `${blog.title} | RagAI Blog`;
  const description = blog.seoDescription || blog.excerpt;
  const coverImage =
    blog.coverImage ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop";

  return {
    title,
    description,
    keywords: blog.tags,
    authors: [{ name: blog.author?.name || "RagAI Engineering Team" }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName: "RagAI",
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author?.name || "RagAI Engineering Team"],
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImage],
      creator: "@ragai",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const data = await getCachedBlog(params.slug);
  if (!data || !data.blog) {
    notFound();
  }

  const { blog, relatedBlogs } = data;
  const siteUrl = process.env["NEXT_PUBLIC_APP_URL"] || "https://www.ragai.website";
  const postUrl = `${siteUrl}/blog/${blog.slug}`;
  const coverImage =
    blog.coverImage ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop";

  // Schema.org BlogPosting JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: [coverImage],
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      "@type": "Person",
      name: blog.author?.name || "RagAI Engineering Team",
      jobTitle: blog.author?.role || "Core AI Contributor",
    },
    publisher: {
      "@type": "Organization",
      name: "RagAI",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/rag.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    keywords: blog.tags?.join(", "),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-violet-600 selection:text-white">
      {/* Schema.org BlogPosting JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link href="/blog" className="hover:text-slate-900 transition-colors">
              Blog
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link
              href={`/blog?category=${encodeURIComponent(blog.category)}`}
              className="hover:text-violet-600 text-slate-500 transition-colors"
            >
              {blog.category}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-800 font-medium line-clamp-1 max-w-[200px] sm:max-w-xs">
              {blog.title}
            </span>
          </nav>

          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to All Articles
            </Link>
          </div>

          {/* Header / Meta */}
          <header className="space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-violet-100 border border-violet-200/80 text-violet-700 text-xs font-bold uppercase tracking-wider">
              {blog.category}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {blog.title}
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Author & Share Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    blog.author?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                  }
                  alt={blog.author?.name || "Author"}
                  className="h-11 w-11 rounded-full border border-violet-200 object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {blog.author?.name || "RagAI Engineering"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{blog.author?.role || "Core Contributor"}</span>
                    <span>•</span>
                    <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="h-3 w-3" />
                      {blog.readTimeMinutes} min read
                    </span>
                  </div>
                </div>
              </div>

              <BlogShareActions title={blog.title} slug={blog.slug} />
            </div>
          </header>

          {/* Cover Image */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 mb-12 shadow-xl bg-slate-100">
            <img
              src={coverImage}
              alt={blog.title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>

          {/* Markdown Body */}
          <div className="prose max-w-none space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight border-b border-slate-200 pb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3 tracking-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg sm:text-xl font-semibold text-violet-700 mt-6 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700 ml-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-700 ml-2">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-violet-600 pl-4 py-2 my-4 italic bg-violet-50/70 rounded-r-xl text-slate-800">
                    {children}
                  </blockquote>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code
                        className="bg-slate-100 text-violet-700 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
                      <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                table: ({ children }) => (
                  <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-sm text-slate-700 divide-y divide-slate-200">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 bg-slate-50 font-semibold text-slate-900">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 border-t border-slate-100">
                    {children}
                  </td>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 underline underline-offset-2 hover:text-violet-800 transition-colors font-medium"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Tags Section */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 mr-2">
                  <Tag className="h-3.5 w-3.5" /> Tags:
                </span>
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-violet-300 hover:bg-violet-50/50 transition-colors shadow-xs"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio Box */}
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <img
                src={
                  blog.author?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                }
                alt={blog.author?.name || "Author"}
                className="h-16 w-16 rounded-full border-2 border-violet-200 object-cover shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {blog.author?.name || "RagAI Engineering Team"}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 font-medium">
                    Author
                  </span>
                </div>
                <p className="text-xs text-violet-600 font-medium">
                  {blog.author?.role || "Core AI Contributor"}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  Dedicated to pushing the frontier of grounded retrieval systems, document normalization pipelines, and intuitive creative generative media.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Share Bar */}
          <div className="mt-8 flex items-center justify-between py-4 border-y border-slate-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to All Articles
            </Link>
            <BlogShareActions title={blog.title} slug={blog.slug} />
          </div>

          {/* Related Articles Section */}
          {relatedBlogs && relatedBlogs.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Related Articles
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Continue exploring in {blog.category}
                  </p>
                </div>
                <Link
                  href={`/blog?category=${encodeURIComponent(blog.category)}`}
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
                >
                  View more
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.slice(0, 3).map((rel) => (
                  <Link
                    key={rel._id}
                    href={`/blog/${rel.slug}`}
                    className="group flex flex-col rounded-xl border border-slate-200/80 bg-white hover:border-violet-300 hover:shadow-lg transition-all p-4 overflow-hidden"
                  >
                    <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-100 mb-3">
                      <img
                        src={
                          rel.coverImage ||
                          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
                        }
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">
                      {rel.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2 mt-1 leading-snug">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="mt-16 rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 p-8 text-center text-white shadow-xl">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Ready to Experience RagAI in Action?
            </h2>
            <p className="text-sm text-violet-100 max-w-xl mx-auto mt-2 mb-6">
              Upload your PDFs and documents, query with zero hallucinations, and create studio visuals without leaving the browser.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-violet-900 hover:bg-slate-100 font-bold text-sm transition-all shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              Start Free Trial
            </Link>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}

