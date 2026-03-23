"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type SearchBarProps = {
  initialQuery?: string;
  onSearch?: (query: string) => void;
};

export function SearchBar({ initialQuery = "", onSearch }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      const params = new URLSearchParams(window.location.search);
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      router.push(`/lawyers?${params.toString()}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <motion.div
        layoutId="search-bar"
        className="relative"
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, profession, or specialization..."
          className="w-full rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:placeholder:text-slate-500"
        />
      </motion.div>
    </form>
  );
}
