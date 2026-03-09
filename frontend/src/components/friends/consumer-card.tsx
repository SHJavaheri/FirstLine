"use client";

import { useState } from "react";
import Link from "next/link";
import { User, MapPin, Briefcase, Users } from "lucide-react";
import type { ConsumerSearchResult } from "@/types";

type ConsumerCardProps = {
  consumer: ConsumerSearchResult;
  onSendRequest?: (consumerId: string) => Promise<void>;
  onCancelRequest?: (consumerId: string) => Promise<void>;
};

export function ConsumerCard({ consumer, onSendRequest, onCancelRequest }: ConsumerCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const displayName = [consumer.firstName, consumer.lastName].filter(Boolean).join(" ") || consumer.email;
  const location = [consumer.locationCity, consumer.locationState].filter(Boolean).join(", ");

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (consumer.pendingRequest === "sent" && onCancelRequest) {
        await onCancelRequest(consumer.id);
      } else if (!consumer.isFriend && !consumer.pendingRequest && onSendRequest) {
        await onSendRequest(consumer.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getActionButton = () => {
    if (consumer.isFriend) {
      return (
        <Link
          href={`/profile/${consumer.id}`}
          className="w-full rounded-lg bg-slate-100 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          View Profile
        </Link>
      );
    }

    if (consumer.pendingRequest === "sent") {
      return (
        <button
          onClick={handleAction}
          disabled={isLoading}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {isLoading ? "Canceling..." : "Cancel Request"}
        </button>
      );
    }

    if (consumer.pendingRequest === "received") {
      return (
        <Link
          href="/friends/requests"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
        >
          Respond to Request
        </Link>
      );
    }

    return (
      <button
        onClick={handleAction}
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Sending..." : "Send Request"}
      </button>
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {consumer.profilePhotoUrl ? (
            <img
              src={consumer.profilePhotoUrl}
              alt={displayName}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
              <User className="h-8 w-8 text-slate-500" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900 truncate">{displayName}</h3>
            {consumer.role === "PROFESSIONAL" && consumer.profession && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {consumer.profession}
              </span>
            )}
          </div>
          
          {consumer.jobTitle && (
            <div className="mt-1 flex items-center gap-1 text-sm text-slate-600">
              <Briefcase className="h-4 w-4" />
              <span className="truncate">{consumer.jobTitle}</span>
            </div>
          )}

          {location && (
            <div className="mt-1 flex items-center gap-1 text-sm text-slate-600">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{location}</span>
            </div>
          )}

          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{consumer.followingCount} following</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{consumer.followersCount} followers</span>
            </div>
          </div>

          {consumer.bio && (
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{consumer.bio}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {getActionButton()}
      </div>
    </div>
  );
}
