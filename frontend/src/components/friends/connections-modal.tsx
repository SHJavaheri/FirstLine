"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Users, Search } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type ConnectionAccount = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  profilePhotoUrl: string | null;
  jobTitle: string | null;
  locationCity: string | null;
  locationState: string | null;
  createdAt: string;
};

type ConnectionsModalProps = {
  accountId: string;
  defaultTab: "following" | "followers";
  open: boolean;
  onClose: () => void;
};

export function ConnectionsModal({ accountId, defaultTab, open, onClose }: ConnectionsModalProps) {
  const [activeTab, setActiveTab] = useState<"following" | "followers">(defaultTab);
  const [connections, setConnections] = useState<ConnectionAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setActiveTab(defaultTab);
    setSearch("");
    setDebouncedSearch("");
  }, [defaultTab, open]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();

    async function fetchConnections() {
      try {
        setIsLoading(true);
        setError(null);
        const params = new URLSearchParams({ type: activeTab });
        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }
        const response = await fetch(`/api/profile/${accountId}/connections?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to load connections");
        }
        const data = await response.json();
        setConnections(data.connections ?? []);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load connections");
        setConnections([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchConnections();
    return () => controller.abort();
  }, [open, activeTab, debouncedSearch, accountId]);

  const subtitle = useMemo(() => (activeTab === "following" ? "People they follow" : "People who follow them"), [activeTab]);

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Connections</DialogTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
        </DialogHeader>

        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("following")}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "following"
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-200 dark:hover:border-blue-400"
            }`}
          >
            Following
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("followers")}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "followers"
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-200 dark:hover:border-blue-400"
            }`}
          >
            Followers
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search connections"
            className="pl-9"
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto pt-4">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">Loading...</div>
          ) : error ? (
            <div className="py-8 text-center text-sm text-red-600 dark:text-red-400">{error}</div>
          ) : connections.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">No connections to show</div>
          ) : (
            <ul className="space-y-3">
              {connections.map((connection) => {
                const name =
                  [connection.firstName, connection.lastName].filter(Boolean).join(" ") || connection.email;
                const location =
                  [connection.locationCity, connection.locationState].filter(Boolean).join(", ") || null;
                return (
                  <li key={connection.id}>
                    <Link
                      href={`/profile/${connection.id}`}
                      className="flex items-center gap-4 rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:border-blue-200 dark:hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/30"
                    >
                      {connection.profilePhotoUrl ? (
                        <img
                          src={connection.profilePhotoUrl}
                          alt={name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                          <Users className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-slate-900 dark:text-slate-100">{name}</p>
                        {connection.jobTitle && (
                          <p className="truncate text-sm text-slate-600 dark:text-slate-400">{connection.jobTitle}</p>
                        )}
                        {location && <p className="truncate text-xs text-slate-500 dark:text-slate-500">{location}</p>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
