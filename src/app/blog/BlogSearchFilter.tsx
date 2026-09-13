"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";

interface BlogSearchFilterProps {
  categories: string[];
  currentCategory?: string;
  currentSearch?: string;
}

export default function BlogSearchFilter({
  categories,
  currentCategory = "All",
  currentSearch = "",
}: BlogSearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("search");
    params.set("page", "1");
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  const getCategoryName = (c: any): string => {
    if (typeof c === "string") return c;
    return c?.name || c?._id || "";
  };

  const getCategoryCount = (c: any): number | null => {
    if (typeof c === "object" && c !== null && typeof c.count === "number") {
      return c.count;
    }
    return null;
  };

  const allCategories = ["All", ...categories];

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles on RAG, LLMs, vision AI..."
            className="w-full pl-11 pr-20 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm shadow-inner"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-14 text-slate-400 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="absolute right-2 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-all shadow-md hover:shadow-violet-600/30 disabled:opacity-50"
          >
            {isPending ? "..." : "Search"}
          </button>
        </div>
      </form>

      {/* Category Pills Bar */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
        {allCategories.map((rawCat, idx) => {
          const catName = getCategoryName(rawCat);
          const catCount = getCategoryCount(rawCat);
          const isSelected =
            catName === "All"
              ? !currentCategory || currentCategory === "All"
              : currentCategory === catName;

          return (
            <button
              key={`${catName}-${idx}`}
              type="button"
              onClick={() => handleCategoryChange(catName)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25 border border-violet-500"
                  : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800"
              }`}
            >
              <span>{catName}</span>
              {catCount !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {catCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

