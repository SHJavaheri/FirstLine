"use client";

import { useState } from "react";
import Link from "next/link";
import { User, MapPin, Briefcase, Users, Wallet } from "lucide-react";
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

  const formatCurrency = (value?: number | null) =>
    value != null ? `$${value.toLocaleString()}` : null;

  const getPricingDisplay = () => {
    if (consumer.role !== "PROFESSIONAL") return null;

    const min = formatCurrency(consumer.minRate);
    const max = formatCurrency(consumer.maxRate);

    if (consumer.pricingModel && consumer.pricingModel !== "HOURLY") {
      // For non-hourly pricing models (FIXED, RETAINER, etc.)
      if (min && max && min !== max) {
        return `${min} - ${max}`;
      }
      if (min) {
        return min;
      }
      if (consumer.hourlyRate) {
        return formatCurrency(consumer.hourlyRate);
      }
      if (consumer.pricingModel) {
        return consumer.pricingModel;
      }
      return "Rate not provided";
    }

    // For hourly pricing model
    if (min && max && min !== max) {
      return `${min} - ${max}/hr`;
    }

    if (formatCurrency(consumer.hourlyRate)) {
      return `${formatCurrency(consumer.hourlyRate)}/hr`;
    }

    return min ? `${min}/hr` : "Hourly rate not provided";
  };

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
          href={getProfileHref()}
          className="w-full rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-center text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
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
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
        >
          {isLoading ? "Canceling..." : "Cancel Request"}
        </button>
      );
    }

    if (consumer.pendingRequest === "received") {
      return (
        <Link
          href="/discover-friends?tab=requests"
          className="w-full rounded-lg bg-blue-600 dark:bg-blue-800 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-900"
        >
          Respond to Request
        </Link>
      );
    }

    return (
      <button
        onClick={handleAction}
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 dark:bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-900 disabled:opacity-50"
      >
        {isLoading ? "Sending..." : "Send Request"}
      </button>
    );
  };

  const getProfileHref = () => {
    if (consumer.role === "PROFESSIONAL") {
      return `/professionals/${consumer.id}`;
    }
    return `/profile/${consumer.id}`;
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-shadow hover:shadow-md">
      <Link href={getProfileHref()} className="block">
        <div className="flex items-start gap-4 cursor-pointer">
          <div className="flex-shrink-0">
            {consumer.profilePhotoUrl ? (
              <img
                src={consumer.profilePhotoUrl}
                alt={displayName}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                <User className="h-8 w-8 text-slate-500 dark:text-slate-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                {displayName}
              </h3>
              {consumer.role === "PROFESSIONAL" && consumer.profession && (
                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
                  {consumer.profession}
                </span>
              )}
            </div>

            {consumer.jobTitle && (
              <div className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                <Briefcase className="h-4 w-4" />
                <span className="truncate">{consumer.jobTitle}</span>
              </div>
            )}

            {location && (
              <div className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{location}</span>
              </div>
            )}

            {consumer.role === "PROFESSIONAL" && getPricingDisplay() && (
              <div className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                <Wallet className="h-4 w-4" />
                <span className="truncate">{getPricingDisplay()}</span>
              </div>
            )}

            <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
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
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{consumer.bio}</p>
            )}

            {consumer.role === "PROFESSIONAL" && consumer.pricingDetails && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500 line-clamp-1">{consumer.pricingDetails}</p>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
        {getActionButton()}
      </div>
    </div>
  );
}
