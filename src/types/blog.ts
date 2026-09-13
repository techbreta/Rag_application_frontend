export interface BlogAuthor {
  name: string;
  avatar?: string;
  role?: string;
}

export interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: BlogAuthor;
  readTimeMinutes: number;
  status: "draft" | "published" | "archived";
  featured: boolean;
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BlogListResponse {
  blogs: BlogItem[];
  featuredBlog: BlogItem | null;
  categories: string[];
  pagination: BlogPagination;
}

