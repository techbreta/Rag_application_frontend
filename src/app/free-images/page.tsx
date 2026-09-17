import { Metadata } from "next";
import FreeImagesClient from "./FreeImagesClient";

export const metadata: Metadata = {
  title: "Free AI Stock Image Gallery & Royalty-Free Commercial Assets | RagAI",
  description:
    "Explore thousands of free, high-resolution AI generated images and vector media. Download full resolution, edit with neural tools, and use royalty-free for commercial projects.",
  alternates: {
    canonical: "/free-images",
  },
  openGraph: {
    title: "Free AI Stock Image Gallery & Royalty-Free Commercial Assets | RagAI",
    description:
      "Search and download thousands of high-resolution, commercial-grade AI generated images.",
    url: "https://www.ragai.website/free-images",
    siteName: "RagAI",
    type: "website",
    images: [
      {
        url: "/rag.png",
        width: 1200,
        height: 630,
        alt: "RagAI Free Images Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Stock Image Gallery | RagAI",
    description: "Search and download thousands of high-resolution AI generated stock assets.",
    images: ["/rag.png"],
  },
};

async function fetchInitialImages(prompt: string | undefined, page: number) {
  const API = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://127.0.0.1:4000";

  try {
    const res = await fetch(`${API}/v1/rag/images/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt && prompt.length > 0 ? prompt : "all",
        page,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        images: [],
        pagination: { currentPage: page, totalPages: 0, totalCount: 0 },
      };
    }

    const data = await res.json();
    return {
      images: data?.data?.data ?? [],
      pagination: data?.data?.pagination ?? {
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
      },
    };
  } catch (err) {
    return {
      images: [],
      pagination: { currentPage: page, totalPages: 0, totalCount: 0 },
    };
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string | string[]; page?: string | string[] };
}) {
  const q = Array.isArray(searchParams?.q)
    ? searchParams?.q[0]
    : searchParams?.q;
  const pageNum =
    Number(
      Array.isArray(searchParams?.page)
        ? searchParams?.page[0]
        : searchParams?.page,
    ) || 1;

  const { images, pagination } = await fetchInitialImages(q, pageNum);

  return (
    <FreeImagesClient
      initialImages={images}
      initialPagination={pagination}
      query={q ?? ""}
    />
  );
}

