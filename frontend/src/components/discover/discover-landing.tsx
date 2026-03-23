"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const SUGGESTED_SEARCHES = [
  "Divorce lawyer in New York",
  "Tax accountant",
  "Real estate lawyer",
  "Corporate attorney",
  "Family law specialist",
  "CPA for small business",
];

export function DiscoverLanding() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(query: string) {
    if (query.trim()) {
      router.push(`/lawyers?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSearch(searchQuery);
  }

  function handleExploreAll() {
    router.push("/lawyers?explore=all");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-8">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-medium text-slate-900 dark:text-white md:text-5xl">
            Find the perfect professional for your needs
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Search by name, profession, or specialization to discover trusted professionals
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div 
            className="relative"
            layoutId="search-bar"
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, profession (Lawyer, Accountant), or specialization (Divorce, Tax, etc.)"
              className="w-full rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-4 pl-14 pr-6 text-base text-slate-900 dark:text-slate-100 shadow-lg transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:shadow-xl dark:placeholder:text-slate-500"
            />
          </motion.div>
        </motion.form>

        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p className="text-center text-sm font-medium text-slate-700 dark:text-slate-300">Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTED_SEARCHES.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                onClick={() => handleSearch(suggestion)}
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 transition-all hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05, ease: "easeOut" }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <button
            type="button"
            onClick={handleExploreAll}
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            Explore professionals
          </button>
        </motion.div>
      </div>
    </div>
  );
}
