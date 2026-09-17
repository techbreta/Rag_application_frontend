import { MetadataRoute } from "next";
import { createPromptSlug } from "@/lib/slug";

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://www.ragai.website").replace(/\/+$/, "");
const API_URL = (
  (process.env.VERCEL ? process.env.NEXT_PUBLIC_API_URL : process.env.INTERNAL_API_URL) ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://rag-application-backend-xi.vercel.app"
).replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Core Static Product & Company Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/how-it-works`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/free-images`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/image-editor`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/document-converter`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/security`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // 2. Fetch all published blog articles
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/v1/blogs?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const blogs = data?.data?.blogs || [];
      blogRoutes = blogs.map((b: any) => ({
        url: `${BASE_URL}/blog/${b.slug}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : b.publishedAt ? new Date(b.publishedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch blog posts for dynamic sitemap:", err);
  }

  // 3. Fetch public AI images (limit <= 50 per page as supported by backend validator)
  let imageRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/v1/rag/images/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "all", page: 1, limit: 50 }),
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const images = data?.data?.data || [];
      imageRoutes = images.map((img: any) => {
        const slug = createPromptSlug(img.prompt, img._id);
        return {
          url: `${BASE_URL}/free-images/${slug}`,
          lastModified: img.updatedAt ? new Date(img.updatedAt) : img.createdAt ? new Date(img.createdAt) : now,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      });
    }
  } catch (err) {
    console.error("Failed to fetch images for dynamic sitemap:", err);
  }

  return [...staticRoutes, ...blogRoutes, ...imageRoutes];
}

