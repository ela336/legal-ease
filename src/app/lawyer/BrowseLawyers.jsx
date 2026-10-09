"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import LawyerCard from "@/app/components/LawyerCard";
import LawyerCardSkeleton from "@/app/components/LawyerCardSkeleton";

const LIMIT = 8;

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-[#7d7236] focus:ring-2 focus:ring-[#7d7236]/10";

function getPageNumbers(current, total) {
  const end = Math.min(total, Math.max(1, current - 2) + 4);
  const start = Math.max(1, end - 4);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

export default function BrowseLawyers() {
  const router = useRouter();
  const params = useSearchParams();
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const minFee = params.get("minFee") || "";
  const maxFee = params.get("maxFee") || "";
  const available = params.get("available") === "true";
  const sort = params.get("sort") || "newest";
  const page = Math.max(parseInt(params.get("page")) || 1, 1);

  const [searchInput, setSearchInput] = useState(search);
  const [minInput, setMinInput] = useState(minFee);
  const [maxInput, setMaxInput] = useState(maxFee);

  const [data, setData] = useState({ lawyers: [], total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  // Update the URL (which drives the fetch). Any filter change resets to page 1.
  const setParams = (updates) => {
    const next = new URLSearchParams(paramsRef.current.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined || value === false) next.delete(key);
      else next.set(key, String(value));
    });
    if (!("page" in updates)) next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `/lawyer?${qs}` : "/lawyer", { scroll: false });
  };

  // Keep inputs in sync when the URL changes from elsewhere (navbar search, category links)
  useEffect(() => setSearchInput(search), [search]);
  useEffect(() => setMinInput(minFee), [minFee]);
  useEffect(() => setMaxInput(maxFee), [maxFee]);

  // Debounce typing so we don't fetch on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== search) setParams({ search: searchInput.trim() });
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (minInput !== minFee || maxInput !== maxFee) setParams({ minFee: minInput, maxFee: maxInput });
    }, 500);
    return () => clearTimeout(t);
  }, [minInput, maxInput]);

  // Fetch whenever the URL filters change
  const queryString = params.toString();
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const q = new URLSearchParams(queryString);
    q.set("limit", LIMIT);

    apiFetch(`/api/lawyers?${q.toString()}`)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [queryString, retry]);

  const hasFilters = search || category || minFee || maxFee || available || sort !== "newest";

  const clearAll = () => {
    setSearchInput("");
    setMinInput("");
    setMaxInput("");
    router.replace("/lawyer", { scroll: false });
  };

  const goToPage = (p) => {
    setParams({ page: p > 1 ? p : "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      {/* Header */}
      <div className="bg-[#0D0D0D] px-4 py-12 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">Find your lawyer</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Browse Lawyers</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
          Search by name or specialization, then compare fees and availability before you hire.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or specialization"
                className={`${inputClass} pl-10`}
              />
            </div>

            <select value={category} onChange={(e) => setParams({ category: e.target.value })} className={inputClass}>
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select value={sort} onChange={(e) => setParams({ sort: e.target.value === "newest" ? "" : e.target.value })} className={inputClass}>
              <option value="newest">Newest first</option>
              <option value="fee-asc">Fee: low to high</option>
              <option value="fee-desc">Fee: high to low</option>
              <option value="popular">Most hired</option>
            </select>

            <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-2">
              <input
                type="number"
                min="0"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                placeholder="Min fee ($)"
                className={inputClass}
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                min="0"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                placeholder="Max fee ($)"
                className={inputClass}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setParams({ available: e.target.checked })}
                className="h-4 w-4 accent-[#7d7236]"
              />
              Available only
            </label>

            <button
              onClick={clearAll}
              disabled={!hasFilters}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Result count */}
        {!loading && !error && data.total > 0 && (
          <p className="mb-5 text-sm text-gray-500">
            Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, data.total)} of {data.total} lawyers
          </p>
        )}

        {/* Results */}
        {error ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-red-600">Something went wrong</p>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => setRetry((r) => r + 1)}
              className="mt-5 rounded-xl bg-[#22333b] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#18272d]"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <LawyerCardSkeleton key={i} />
            ))}
          </div>
        ) : data.lawyers.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <SearchX size={44} className="mx-auto text-gray-300" />
            <p className="mt-4 text-lg font-semibold text-[#22333b]">No lawyers match your search</p>
            <p className="mt-1 text-sm text-gray-500">
              Try a different name, widen the fee range, or remove some filters.
            </p>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="mt-6 rounded-xl bg-[#22333b] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#18272d]"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {data.lawyers.map((lawyer, i) => (
              <LawyerCard key={lawyer._id} lawyer={lawyer} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && data.pages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            {getPageNumbers(page, data.pages).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`h-10 w-10 rounded-lg text-sm font-semibold transition ${
                  p === page
                    ? "bg-[#C9A227] text-[#0D0D0D]"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= data.pages}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}