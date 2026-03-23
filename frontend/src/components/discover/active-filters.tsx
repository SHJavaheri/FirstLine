"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type ActiveFilter = {
  key: string;
  label: string;
  value: string;
};

type ActiveFiltersProps = {
  filters: ActiveFilter[];
};

export function ActiveFilters({ filters }: ActiveFiltersProps) {
  const router = useRouter();

  if (filters.length === 0) {
    return null;
  }

  function handleRemove(key: string, value?: string) {
    const params = new URLSearchParams(window.location.search);
    
    if (key === "profession" && value) {
      const professions = (params.get("profession") || "").split(",").filter(Boolean);
      const updated = professions.filter(p => p !== value);
      if (updated.length > 0) {
        params.set("profession", updated.join(","));
      } else {
        params.delete("profession");
      }
    } else {
      params.delete(key);
    }
    
    const newUrl = params.toString() ? `/lawyers?${params.toString()}` : "/lawyers";
    router.push(newUrl);
  }

  function handleClearAll() {
    router.push("/lawyers");
  }

  return (
    <motion.div 
      className="flex flex-wrap items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active filters:</span>
      {filters.map((filter, index) => (
        <motion.button
          key={`${filter.key}-${filter.value}-${index}`}
          onClick={() => handleRemove(filter.key, filter.value)}
          className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 px-3 py-1 text-sm text-blue-700 dark:text-blue-300 transition-colors hover:bg-blue-200 dark:hover:bg-blue-900/60"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
        >
          <span>{filter.label}</span>
          <X className="h-3 w-3" />
        </motion.button>
      ))}
      {filters.length > 1 && (
        <motion.button
          onClick={handleClearAll}
          className="text-sm text-slate-600 dark:text-slate-400 underline hover:text-slate-900 dark:hover:text-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 + filters.length * 0.05 }}
        >
          Clear all
        </motion.button>
      )}
    </motion.div>
  );
}
