"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type ConsumerSearchFormProps = {
  initialQuery: string;
};

export function ConsumerSearchForm({
  initialQuery,
}: ConsumerSearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    
    if (query) {
      params.set("q", query);
    }

    startTransition(() => {
      router.push(`/discover-friends?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setQuery("");
    startTransition(() => {
      router.push("/discover-friends");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="query" className="block text-sm font-medium text-slate-700">
            Search Consumers
          </label>
          <input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or username..."
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isPending ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={isPending}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
