"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import api from "@/lib/axios";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  SearchCheck,
  Send,
  AlertCircle,
  AlertTriangle,
  Gauge,
  Clock,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate, formatDistanceToNow } from "@/lib/date";
import { cn } from "@/lib/utils";
import type {
  IndexingStats,
  IndexingUrl,
  IndexVerdict,
  SubmissionStatusFilter,
  VerdictFilter,
} from "@/types/indexing";

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

const VERDICT_META: Record<
  IndexVerdict,
  { label: string; variant: "success" | "warning" | "error" | "default" }
> = {
  PASS: { label: "Indexed", variant: "success" },
  PARTIAL: { label: "Indexed (warnings)", variant: "warning" },
  NEUTRAL: { label: "Not indexed", variant: "default" },
  FAIL: { label: "Error", variant: "error" },
  VERDICT_UNSPECIFIED: { label: "Unknown", variant: "default" },
};

const VERDICT_OPTIONS: { value: VerdictFilter; label: string }[] = [
  { value: "all", label: "All Google Statuses" },
  { value: "PASS", label: "Indexed" },
  { value: "PARTIAL", label: "Indexed (warnings)" },
  { value: "NEUTRAL", label: "Not indexed" },
  { value: "FAIL", label: "Error" },
  { value: "VERDICT_UNSPECIFIED", label: "Unknown" },
  { value: "unchecked", label: "Not checked yet" },
];

const SUBMISSION_OPTIONS: { value: SubmissionStatusFilter; label: string }[] = [
  { value: "all", label: "All Submissions" },
  { value: "success", label: "Submitted" },
  { value: "failed", label: "Failed" },
  { value: "not_submitted", label: "Not submitted" },
];

// Only allow http(s) links from API data to be rendered as hrefs.
function safeHref(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : undefined;
  } catch {
    return undefined;
  }
}

function urlPath(url: string): string {
  try {
    const { pathname, search } = new URL(url);
    return `${pathname}${search}`;
  } catch {
    return url;
  }
}

function VerdictBadge({ inspection }: { inspection?: IndexingUrl["inspection"] }) {
  if (!inspection?.verdict) {
    return (
      <span className="inline-flex items-center rounded-full border border-dashed border-slate-600 px-2.5 py-0.5 text-xs font-medium text-slate-400">
        Not checked yet
      </span>
    );
  }
  const meta = VERDICT_META[inspection.verdict as IndexVerdict] ?? {
    label: inspection.verdict,
    variant: "default" as const,
  };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

export default function AdminIndexingPage() {
  // Stats
  const [stats, setStats] = useState<IndexingStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // URL table
  const [urls, setUrls] = useState<IndexingUrl[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [urlsLoading, setUrlsLoading] = useState(true);

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [verdict, setVerdict] = useState<VerdictFilter>("all");
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatusFilter>("all");
  const [page, setPage] = useState(1);

  // Ignore responses from superseded requests (fast filter/search changes).
  const urlsRequestId = useRef(0);

  useEffect(() => {
    const next = searchInput.trim();
    if (next === search) return;
    const timer = setTimeout(() => {
      setSearch(next);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      const { data } = await api.get("/v1/admin/indexing/stats");
      setStats(data.data);
    } catch (err: any) {
      console.error("Failed to load indexing stats:", err);
      setStatsError(err.response?.data?.message || "Failed to load indexing stats");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchUrls = useCallback(async () => {
    const requestId = ++urlsRequestId.current;
    try {
      setUrlsLoading(true);
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (search) queryParams.append("search", search);
      if (verdict !== "all") queryParams.append("verdict", verdict);
      if (submissionStatus !== "all") queryParams.append("submissionStatus", submissionStatus);

      const { data } = await api.get(`/v1/admin/indexing/urls?${queryParams.toString()}`);
      if (requestId !== urlsRequestId.current) return;
      setUrls(data.data.urls || []);
      setPagination(data.data.pagination);
    } catch (err: any) {
      if (requestId !== urlsRequestId.current) return;
      console.error("Failed to load indexing URLs:", err);
      toast.error(err.response?.data?.message || "Failed to load indexed URLs");
      setUrls([]);
      setPagination(null);
    } finally {
      if (requestId === urlsRequestId.current) setUrlsLoading(false);
    }
  }, [page, search, verdict, submissionStatus]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleReload = () => {
    fetchStats();
    fetchUrls();
  };

  const applyVerdictFilter = (value: VerdictFilter) => {
    setVerdict(value);
    setPage(1);
  };

  const applySubmissionFilter = (value: SubmissionStatusFilter) => {
    setSubmissionStatus(value);
    setPage(1);
  };

  const isRefreshing = statsLoading || urlsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <SearchCheck className="h-5 w-5 text-violet-400" />
            Google Indexing
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pages submitted to Google and their current index status. Submissions and checks run automatically in the background.
          </p>
        </div>
        <button
          onClick={handleReload}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-200 hover:text-white hover:border-violet-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
          <span>Reload</span>
        </button>
      </div>

      {/* Summary */}
      {statsLoading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : statsError && !stats ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
          <p className="font-semibold">{statsError}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/30 text-white text-xs hover:bg-red-600/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : stats ? (
        <>
        {statsError && (
          <p className="flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            {statsError}. Showing previously loaded stats.
          </p>
        )}
        <StatsSummary
          stats={stats}
          activeVerdict={verdict}
          onVerdictClick={applyVerdictFilter}
          onFailedClick={() => applySubmissionFilter("failed")}
        />
        </>
      ) : null}

      {/* Search & Filters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search URLs, e.g. blog/ or free-images..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={verdict}
              onChange={(e) => applyVerdictFilter(e.target.value as VerdictFilter)}
              aria-label="Filter by Google status"
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            >
              {VERDICT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={submissionStatus}
              onChange={(e) => applySubmissionFilter(e.target.value as SubmissionStatusFilter)}
              aria-label="Filter by submission status"
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            >
              {SUBMISSION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* URLs Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-5 py-3.5">URL</th>
                <th className="px-4 py-3.5">Google Status</th>
                <th className="px-4 py-3.5">Last Crawled</th>
                <th className="px-4 py-3.5">Submission</th>
                <th className="px-4 py-3.5">Submitted At</th>
                <th className="px-4 py-3.5">Checked At</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {urlsLoading && urls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-violet-500" />
                      <span>Loading URLs...</span>
                    </div>
                  </td>
                </tr>
              ) : urls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No URLs found matching the filters.
                  </td>
                </tr>
              ) : (
                urls.map((row) => (
                  <UrlRow key={row._id} row={row} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {urls.length} of {pagination.totalCount} URLs (Page {pagination.currentPage} of {pagination.totalPages})
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPreviousPage || urlsLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage || urlsLoading}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsSummary({
  stats,
  activeVerdict,
  onVerdictClick,
  onFailedClick,
}: {
  stats: IndexingStats;
  activeVerdict: VerdictFilter;
  onVerdictClick: (verdict: VerdictFilter) => void;
  onFailedClick: () => void;
}) {
  const { sitemap, submissions, indexStatus } = stats;
  const quotaPercent =
    submissions.dailyQuota > 0
      ? Math.min(100, Math.round((submissions.sentLast24h / submissions.dailyQuota) * 100))
      : 0;

  const coverageEntries = Object.entries(indexStatus.byCoverageState || {}).sort(
    (a, b) => b[1] - a[1],
  );
  const coverageMax = coverageEntries.length ? coverageEntries[0][1] : 0;
  const verdictEntries = (Object.keys(VERDICT_META) as IndexVerdict[])
    .map((key) => [key, indexStatus.byVerdict?.[key] ?? 0] as const)
    .filter(([, count]) => count > 0);

  return (
    <div className="space-y-4">
      {!indexStatus.enabled && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Google index checking is not configured on the server. Submission data is still shown below.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Indexed on Google */}
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Indexed on Google</span>
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-white/5">
              <SearchCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-white tracking-tight">
              {indexStatus.enabled ? indexStatus.indexed.toLocaleString() : "—"}
            </span>
            <span className="text-sm text-slate-500">/ {sitemap.totalUrls.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {indexStatus.enabled
              ? `${indexStatus.unchecked.toLocaleString()} not checked yet`
              : "Index checking disabled"}
          </p>
        </div>

        {/* Submitted */}
        <div className="rounded-2xl border border-violet-500/30 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Submitted</span>
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-400 border border-white/5">
              <Send className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-white tracking-tight">
              {sitemap.submitted.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500">/ {sitemap.totalUrls.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {sitemap.pendingSubmission.toLocaleString()} pending
          </p>
        </div>

        {/* Failed submissions */}
        <button
          type="button"
          onClick={onFailedClick}
          className="text-left rounded-2xl border border-red-500/30 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-red-500/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Failed Submissions</span>
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 text-red-400 border border-white/5">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">
              {submissions.failed.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Click to filter the table</p>
        </button>

        {/* Daily quota */}
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Daily Quota (approx.)</span>
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-white/5">
              <Gauge className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-white tracking-tight">
              {submissions.sentLast24h.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500">/ {submissions.dailyQuota.toLocaleString()}</span>
          </div>
          <div
            className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden"
            role="progressbar"
            aria-valuenow={submissions.sentLast24h}
            aria-valuemin={0}
            aria-valuemax={submissions.dailyQuota}
          >
            <div
              className={cn(
                "h-full rounded-full",
                quotaPercent >= 90 ? "bg-red-500" : quotaPercent >= 70 ? "bg-amber-500" : "bg-emerald-500",
              )}
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
        </div>
      </div>

      {indexStatus.enabled && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-sm font-bold text-white">Index Coverage Breakdown</h3>
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {indexStatus.lastCheckedAt
                ? `Last checked ${formatDistanceToNow(indexStatus.lastCheckedAt)}`
                : "Not checked yet"}
            </span>
          </div>

          {verdictEntries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {verdictEntries.map(([key, count]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onVerdictClick(activeVerdict === key ? "all" : key)}
                  aria-pressed={activeVerdict === key}
                  title={`Filter table by "${VERDICT_META[key].label}"`}
                  className={cn(
                    "rounded-full transition-all",
                    activeVerdict === key ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-slate-900" : "hover:opacity-80",
                  )}
                >
                  <Badge variant={VERDICT_META[key].variant}>
                    {VERDICT_META[key].label}: {count.toLocaleString()}
                  </Badge>
                </button>
              ))}
            </div>
          )}

          {coverageEntries.length === 0 ? (
            <p className="text-sm text-slate-500">No index status results yet.</p>
          ) : (
            <div className="space-y-2.5">
              {coverageEntries.map(([state, count]) => (
                <div key={state} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate pr-3">{state}</span>
                    <span className="text-slate-400 font-medium shrink-0">{count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${coverageMax > 0 ? (count / coverageMax) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UrlRow({ row }: { row: IndexingUrl }) {
  const inspection = row.inspection;
  const isDeleted = row.type === "URL_DELETED";
  const pageHref = safeHref(row.url);
  const resultHref = safeHref(inspection?.resultLink);
  const canonicalMismatch =
    inspection?.googleCanonical &&
    inspection?.userCanonical &&
    inspection.googleCanonical !== inspection.userCanonical;

  return (
    <tr className={cn("hover:bg-slate-800/30 transition-colors", isDeleted && "opacity-50")}>
      <td className="px-5 py-3.5 max-w-[320px]">
        {pageHref ? (
          <a
            href={pageHref}
            target="_blank"
            rel="noopener noreferrer"
            title={row.url}
            className="font-medium text-white hover:text-violet-300 hover:underline truncate block"
          >
            {urlPath(row.url)}
          </a>
        ) : (
          <span className="font-medium text-white truncate block" title={row.url}>
            {urlPath(row.url)}
          </span>
        )}
        {isDeleted && <p className="text-[11px] text-slate-500 mt-0.5">Removed from site</p>}
        {canonicalMismatch && (
          <p
            className="text-[11px] text-amber-400 mt-0.5 truncate"
            title={`Google canonical: ${inspection?.googleCanonical}`}
          >
            Google chose a different canonical
          </p>
        )}
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5" title={inspection?.coverageState}>
          <VerdictBadge inspection={inspection} />
          {inspection?.error && (
            <span title={`Latest check failed: ${inspection.error}`} className="text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
        {inspection?.coverageState && (
          <p className="text-[11px] text-slate-500 mt-1 max-w-[220px] truncate" title={inspection.coverageState}>
            {inspection.coverageState}
          </p>
        )}
      </td>

      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
        {inspection?.lastCrawlTime ? formatDate(inspection.lastCrawlTime, "full") : "Never"}
      </td>

      <td className="px-4 py-3.5">
        {row.status ? (
          <div title={row.status === "failed" ? row.lastError : undefined}>
            <Badge variant={row.status === "success" ? "success" : "error"}>
              {row.status === "success" ? "Submitted" : "Failed"}
            </Badge>
            {row.type && (
              <p className="text-[11px] text-slate-500 mt-1">
                {row.type === "URL_DELETED" ? "Deletion" : "Update"}
              </p>
            )}
            {row.status === "failed" && row.lastError && (
              <p className="text-[11px] text-red-400/80 mt-0.5 max-w-[200px] truncate">{row.lastError}</p>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-500">Not submitted</span>
        )}
      </td>

      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
        {row.lastSubmittedAt ? formatDate(row.lastSubmittedAt, "full") : "—"}
      </td>

      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
        {inspection?.checkedAt ? formatDate(inspection.checkedAt, "full") : "—"}
      </td>

      <td className="px-5 py-3.5 text-right whitespace-nowrap">
        {resultHref ? (
          <a
            href={resultHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-200 hover:text-white hover:border-violet-500/50 transition-colors"
          >
            <span>Search Console</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-600">—</span>
        )}
      </td>
    </tr>
  );
}
