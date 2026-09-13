import { BlogItem, BlogListResponse } from "@/types/blog";

const CANDIDATE_API_URLS = [
  process.env["INTERNAL_API_URL"],
  process.env["API_URL"],
  "http://localhost:4000",
  process.env["NEXT_PUBLIC_API_URL"],
].filter(Boolean) as string[];

async function fetchFromApi(endpoint: string): Promise<any> {
  let lastError: any = null;

  for (const baseUrl of CANDIDATE_API_URLS) {
    try {
      const url = `${baseUrl}${endpoint}`;
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to fetch from ${endpoint}`);
}

export async function getPublishedBlogs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
}): Promise<BlogListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.category && params.category !== "All") query.append("category", params.category);
  if (params?.tag) query.append("tag", params.tag);

  try {
    const data = await fetchFromApi(`/v1/blogs?${query.toString()}`);
    return (
      data?.data ?? {
        blogs: [],
        featuredBlog: null,
        categories: [],
        pagination: {
          currentPage: 1,
          pageSize: 9,
          totalCount: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    return {
      blogs: [],
      featuredBlog: null,
      categories: [],
      pagination: {
        currentPage: 1,
        pageSize: 9,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

export async function getBlogBySlug(
  slug: string
): Promise<{ blog: BlogItem; relatedBlogs: BlogItem[] } | null> {
  try {
    const data = await fetchFromApi(`/v1/blogs/${encodeURIComponent(slug)}`);
    return data?.data ?? null;
  } catch (error) {
    console.error(`Error fetching blog slug ${slug}:`, error);
    return null;
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const data = await fetchFromApi("/v1/blogs/categories");
    const raw = data?.data?.categories ?? [];
    if (Array.isArray(raw)) {
      return raw
        .map((c: any) => (typeof c === "string" ? c : c?.name || c?._id || ""))
        .filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [];
  }
}

