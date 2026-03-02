"use client";

import { useState } from "react";
import { Users, Star } from "lucide-react";

import { ConnectionsModal } from "@/components/friends/connections-modal";
import { cn } from "@/lib/utils";

export type ConnectionsStatsProps = {
  accountId: string;
  followingCount?: number | null;
  followersCount?: number | null;
  ratingsCount?: number | null;
  showRatings?: boolean;
  className?: string;
};

export function ConnectionsStats({
  accountId,
  followingCount,
  followersCount,
  ratingsCount,
  showRatings = true,
  className,
}: ConnectionsStatsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"following" | "followers">("following");

  const handleOpen = (tab: "following" | "followers") => {
    setDefaultTab(tab);
    setModalOpen(true);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-6 text-sm text-slate-600", className)}>
      <button
        type="button"
        onClick={() => handleOpen("following")}
        className="flex items-center gap-2 text-left transition-colors hover:text-blue-600"
      >
        <Users className="h-4 w-4" />
        <span>
          <strong>{followingCount ?? 0}</strong> following
        </span>
      </button>
      <button
        type="button"
        onClick={() => handleOpen("followers")}
        className="flex items-center gap-2 text-left transition-colors hover:text-blue-600"
      >
        <Users className="h-4 w-4" />
        <span>
          <strong>{followersCount ?? 0}</strong> followers
        </span>
      </button>
      {showRatings && typeof ratingsCount === "number" && (
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          <span>
            <strong>{ratingsCount}</strong> reviews
          </span>
        </div>
      )}

      <ConnectionsModal
        accountId={accountId}
        defaultTab={defaultTab}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
