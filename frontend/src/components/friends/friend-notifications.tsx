"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, User, Check, X } from "lucide-react";
import type { FriendRequest } from "@/types";

export function FriendNotifications() {
  const router = useRouter();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/friends/requests?type=received&status=PENDING");
        if (response.ok) {
          const data = await response.json();
          const newRequests = data.requests || [];
          
          // If we have new requests that weren't there before, reset hasViewed
          if (newRequests.length > requests.length) {
            setHasViewed(false);
          }
          
          setRequests(newRequests);
        }
      } catch (err) {
        console.error("Error fetching friend requests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
    
    // Poll every 30 seconds for new requests
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [requests.length]);

  const handleAccept = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept friend request");
      }

      setRequests(prev => prev.filter(r => r.id !== requestId));
      router.refresh();
    } catch (err) {
      console.error("Error accepting friend request:", err);
      alert(err instanceof Error ? err.message : "Failed to accept friend request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline" }),
      });

      if (!response.ok) {
        throw new Error("Failed to decline friend request");
      }

      setRequests(prev => prev.filter(r => r.id !== requestId));
      router.refresh();
    } catch (err) {
      console.error("Error declining friend request:", err);
      alert(err instanceof Error ? err.message : "Failed to decline friend request");
    } finally {
      setActionLoading(null);
    }
  };

  const getDisplayName = (user: { firstName: string | null; lastName: string | null; email: string }) => {
    return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  };

  const handleToggle = () => {
    if (!isOpen) {
      setHasViewed(true);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative rounded-lg p-2 text-slate-700 hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" />
        {requests.length > 0 && !hasViewed && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
            {requests.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-96 rounded-lg border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Friend Requests</h3>
                {requests.length > 0 && (
                  <Link
                    href="/friends/requests"
                    className="text-sm text-blue-600 hover:text-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    View All
                  </Link>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                </div>
              ) : requests.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-slate-600">No pending friend requests</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {requests.map((request) => (
                    <div key={request.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Link
                          href={`/profile/${request.sender.id}`}
                          onClick={() => setIsOpen(false)}
                        >
                          {request.sender.profilePhotoUrl ? (
                            <img
                              src={request.sender.profilePhotoUrl}
                              alt={getDisplayName(request.sender)}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                              <User className="h-5 w-5 text-slate-500" />
                            </div>
                          )}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/profile/${request.sender.id}`}
                            className="font-medium text-slate-900 hover:text-blue-600"
                            onClick={() => setIsOpen(false)}
                          >
                            {getDisplayName(request.sender)}
                          </Link>
                          <p className="text-xs text-slate-600 mt-1">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleAccept(request.id)}
                              disabled={actionLoading === request.id}
                              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              <Check className="h-3 w-3" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleDecline(request.id)}
                              disabled={actionLoading === request.id}
                              className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                              <X className="h-3 w-3" />
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
