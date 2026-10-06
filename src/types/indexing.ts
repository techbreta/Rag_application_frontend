export type IndexVerdict =
  | "PASS"
  | "PARTIAL"
  | "FAIL"
  | "NEUTRAL"
  | "VERDICT_UNSPECIFIED";

export interface IndexingStats {
  sitemap: { totalUrls: number; submitted: number; pendingSubmission: number };
  submissions: {
    totalTracked: number;
    success: number;
    failed: number;
    notSubmitted: number;
    sentLast24h: number;
    dailyQuota: number;
  };
  indexStatus: {
    enabled: boolean;
    indexed: number;
    checked: number;
    unchecked: number;
    byVerdict: Partial<Record<IndexVerdict, number>>;
    byCoverageState: Record<string, number>;
    lastCheckedAt: string | null;
  };
}

export interface IndexInspection {
  verdict?: IndexVerdict | string;
  coverageState?: string;
  indexingState?: string;
  pageFetchState?: string;
  robotsTxtState?: string;
  lastCrawlTime?: string;
  googleCanonical?: string;
  userCanonical?: string;
  resultLink?: string;
  checkedAt?: string;
  error?: string;
}

export interface IndexingUrl {
  _id: string;
  url: string;
  type?: "URL_UPDATED" | "URL_DELETED";
  status?: "success" | "failed";
  lastSubmittedAt?: string;
  lastError?: string;
  inspection?: IndexInspection;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatusFilter = "all" | "success" | "failed" | "not_submitted";
export type VerdictFilter = "all" | IndexVerdict | "unchecked";
