"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConsumerCard } from "./consumer-card";
import type { ConsumerSearchResult } from "@/types";

type ConsumerSearchResultsProps = {
  query?: string;
};

export function ConsumerSearchResults({
  query,
}: ConsumerSearchResultsProps) {
  const router = useRouter();
  const [consumers, setConsumers] = useState<ConsumerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsumers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);

        const response = await fetch(`/api/consumers/search?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch consumers");
        }

        const data = await response.json();
        setConsumers(data.consumers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsumers();
  }, [query]);

  const handleSendRequest = async (consumerId: string) => {
    setConsumers(prev => prev.map(c => 
      c.id === consumerId ? { ...c, pendingRequest: "sent" as const } : c
    ));

    try {
      const response = await fetch("/api/friends/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: consumerId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to send friend request" }));
        throw new Error(errorData.error || "Failed to send friend request");
      }

      const data = await response.json();
      console.log("Friend request sent successfully:", data);
    } catch (err) {
      setConsumers(prev => prev.map(c => 
        c.id === consumerId ? { ...c, pendingRequest: null } : c
      ));
      console.error("Error sending friend request:", err);
      alert(err instanceof Error ? err.message : "Failed to send friend request");
    }
  };

  const handleCancelRequest = async (consumerId: string) => {
    setConsumers(prev => prev.map(c => 
      c.id === consumerId ? { ...c, pendingRequest: null } : c
    ));

    try {
      const requests = await fetch("/api/friends/requests?type=sent&status=PENDING").then(r => r.json());
      const request = requests.requests?.find((r: { receiverId: string }) => r.receiverId === consumerId);
      
      if (!request) {
        throw new Error("Request not found");
      }

      const response = await fetch(`/api/friends/requests/${request.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel friend request");
      }
    } catch (err) {
      setConsumers(prev => prev.map(c => 
        c.id === consumerId ? { ...c, pendingRequest: "sent" as const } : c
      ));
      console.error("Error canceling friend request:", err);
      alert(err instanceof Error ? err.message : "Failed to cancel friend request");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-slate-600">Searching for consumers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  if (consumers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-xl font-semibold text-slate-900">No consumers found</h2>
        <p className="mt-2 text-sm text-slate-600">
          Try adjusting your search filters or browse without filters to see all consumers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Found {consumers.length} consumer{consumers.length !== 1 ? "s" : ""}
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {consumers.map((consumer) => (
          <ConsumerCard
            key={consumer.id}
            consumer={consumer}
            onSendRequest={handleSendRequest}
            onCancelRequest={handleCancelRequest}
          />
        ))}
      </div>
    </div>
  );
}
