"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type ResultsHeaderProps = {
  count: number;
  sortBy: string;
};

export function ResultsHeader({ count, sortBy }: ResultsHeaderProps) {
  const router = useRouter();

  function handleSortChange(newSortBy: string) {
    const params = new URLSearchParams(window.location.search);
    params.set("sortBy", newSortBy);
    router.push(`/lawyers?${params.toString()}`);
  }

  return (
    <motion.div 
      className="flex items-center justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
    >
      <p className="text-sm text-slate-600">
        <span className="font-semibold text-slate-900">{count}</span> professional{count !== 1 ? 's' : ''} found
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-slate-600">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="friendTrust">Friend Trust</option>
          <option value="rating">Rating</option>
          <option value="price">Price</option>
        </select>
      </div>
    </motion.div>
  );
}
