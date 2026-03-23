"use client";

import { motion } from "framer-motion";
import { ConsumerSearchForm } from "@/components/friends/consumer-search-form";
import { ConsumerSearchResults } from "@/components/friends/consumer-search-results";
import { FriendRequestsList } from "@/components/friends/friend-requests-list";
import type { FriendRequest } from "@/types";

type DiscoverFriendsContentProps = {
  pageTitle: string;
  pageDescription: string;
  activeTab: string;
  initialQuery: string;
  query?: string;
  receivedRequests: FriendRequest[];
  sentRequests: FriendRequest[];
};

export function DiscoverFriendsContent({
  pageTitle,
  pageDescription,
  activeTab,
  initialQuery,
  query,
  receivedRequests,
  sentRequests,
}: DiscoverFriendsContentProps) {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-4xl text-slate-900 dark:text-white">{pageTitle}</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {pageDescription}
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="border-b border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <nav className="flex gap-8" aria-label="Tabs">
          <a
            href="/discover-friends"
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "search"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Search
          </a>
          <a
            href="/discover-friends?tab=requests"
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "requests"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Friend Requests
          </a>
        </nav>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        {activeTab === "requests" ? (
          <FriendRequestsList
            receivedRequests={receivedRequests}
            sentRequests={sentRequests}
          />
        ) : (
          <div className="space-y-6">
            <ConsumerSearchForm
              initialQuery={initialQuery}
            />
            <ConsumerSearchResults
              query={query}
            />
          </div>
        )}
      </motion.div>
    </section>
  );
}
