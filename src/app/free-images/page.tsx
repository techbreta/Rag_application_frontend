import FreeImagesClient from "./FreeImagesClient";

async function fetchInitialImages(prompt: string | undefined, page: number) {
  const API = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "";

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
