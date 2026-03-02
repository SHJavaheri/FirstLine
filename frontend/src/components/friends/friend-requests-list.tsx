"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

  return (
    <div className="space-y-6">
      {/* Received Requests */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Received Requests ({receivedRequests.length})
        </h2>
        
        {receivedRequests.length === 0 ? (
          <p className="text-sm text-slate-600">No pending friend requests</p>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-center gap-4">
                  <Link href={`/profile/${request.sender.id}`}>
                    {request.sender.profilePhotoUrl ? (
                      <img
                        src={request.sender.profilePhotoUrl}
                        alt={getDisplayName(request.sender)}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                        <User className="h-6 w-6 text-slate-500" />
                      </div>
                    )}
                  </Link>
                  <div>
                    <Link
                      href={`/profile/${request.sender.id}`}
                      className="font-medium text-slate-900 hover:text-blue-600"
                    >
                      {getDisplayName(request.sender)}
                    </Link>
                    <p className="text-sm text-slate-600">
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
                    className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent Requests */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Sent Requests ({sentRequests.length})
        </h2>
        
        {sentRequests.length === 0 ? (
          <p className="text-sm text-slate-600">No pending sent requests</p>
        ) : (
          <div className="space-y-4">
            {sentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-center gap-4">
                  <Link href={`/profile/${request.receiver.id}`}>
                    {request.receiver.profilePhotoUrl ? (
                      <img
                        src={request.receiver.profilePhotoUrl}
                        alt={getDisplayName(request.receiver)}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                        <User className="h-6 w-6 text-slate-500" />
                      </div>
                    )}
                  </Link>
                  <div>
                    <Link
                      href={`/profile/${request.receiver.id}`}
                      className="font-medium text-slate-900 hover:text-blue-600"
                    >
                      {getDisplayName(request.receiver)}
                    </Link>
                    <p className="text-sm text-slate-600">
                      Sent {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(request.id)}
                  disabled={loadingId === request.id}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
