"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Check, X } from "lucide-react";
import type { FriendRequest } from "@/types";

type FriendRequestsListProps = {
  receivedRequests: FriendRequest[];
  sentRequests: FriendRequest[];
};

export function FriendRequestsList({ receivedRequests, sentRequests }: FriendRequestsListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAccept = async (requestId: string) => {
    setLoadingId(requestId);
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept friend request");
      }

      router.refresh();
    } catch (err) {
      console.error("Error accepting friend request:", err);
      alert(err instanceof Error ? err.message : "Failed to accept friend request");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setLoadingId(requestId);
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline" }),
      });

      if (!response.ok) {
        throw new Error("Failed to decline friend request");
      }

      router.refresh();
    } catch (err) {
      console.error("Error declining friend request:", err);
      alert(err instanceof Error ? err.message : "Failed to decline friend request");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = async (requestId: string) => {
    setLoadingId(requestId);
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel friend request");
      }

      router.refresh();
    } catch (err) {
      console.error("Error canceling friend request:", err);
      alert(err instanceof Error ? err.message : "Failed to cancel friend request");
    } finally {
      setLoadingId(null);
    }
  };

  const getDisplayName = (user: { firstName: string | null; lastName: string | null; email: string }) => {
    return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  };

  const getDisplayNameWithProfession = (user: { firstName: string | null; lastName: string | null; email: string; role?: string; professional?: { profession: string } | null }) => {
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
    if (user.role === "PROFESSIONAL" && user.professional?.profession) {
      return `${name} (${user.professional.profession})`;
    }
    return name;
  };

  const getProfileHref = (user: { id: string; role?: string }) => {
    if (user.role === "PROFESSIONAL") {
      return `/professionals/${user.id}`;
    }

    return `/profile/${user.id}`;
  };

  return (
    <div className="space-y-6">
      {/* Received Requests */}
      <motion.div
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Received Requests ({receivedRequests.length})
        </h2>
        
        {receivedRequests.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">No pending friend requests</p>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((request, index) => (
              <motion.div
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05, ease: "easeOut" }}
              >
                <div className="flex items-center gap-4">
                  <Link href={getProfileHref(request.sender)}>
                    {request.sender.profilePhotoUrl ? (
                      <img
                        src={request.sender.profilePhotoUrl}
                        alt={getDisplayName(request.sender)}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                        <User className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                      </div>
                    )}
                  </Link>
                  <div>
                    <Link
                      href={getProfileHref(request.sender)}
                      className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {getDisplayNameWithProfession(request.sender)}
                    </Link>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(request.id)}
                    disabled={loadingId === request.id}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecline(request.id)}
                    disabled={loadingId === request.id}
                    className="flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Sent Requests */}
      <motion.div
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Sent Requests ({sentRequests.length})
        </h2>
        
        {sentRequests.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">No pending sent requests</p>
        ) : (
          <div className="space-y-4">
            {sentRequests.map((request, index) => (
              <motion.div
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05, ease: "easeOut" }}
              >
                <div className="flex items-center gap-4">
                  <Link href={getProfileHref(request.receiver)}>
                    {request.receiver.profilePhotoUrl ? (
                      <img
                        src={request.receiver.profilePhotoUrl}
                        alt={getDisplayName(request.receiver)}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                        <User className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                      </div>
                    )}
                  </Link>
                  <div>
                    <Link
                      href={getProfileHref(request.receiver)}
                      className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {getDisplayName(request.receiver)}
                    </Link>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Sent {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(request.id)}
                  disabled={loadingId === request.id}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
                >
                  Cancel Request
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
