"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, Briefcase, Users, Lock } from "lucide-react";
import type { ConsumerProfile } from "@/types";
import { ConnectionsStats } from "@/components/friends/connections-stats";

type ConsumerProfileHeaderProps = {
  profile: ConsumerProfile;
  currentUserId: string;
};

export function ConsumerProfileHeader({ profile, currentUserId }: ConsumerProfileHeaderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email || "User";
  const location = [profile.locationCity, profile.locationState].filter(Boolean).join(", ");

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/friends/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: profile.id }),
      });

      if (!response.ok) throw new Error("Failed to send friend request");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send friend request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setIsLoading(true);
    try {
      const requests = await fetch("/api/friends/requests?type=sent&status=PENDING").then(r => r.json());
      const request = requests.requests?.find((r: { receiverId: string }) => r.receiverId === profile.id);
      
      if (!request) throw new Error("Request not found");

      const response = await fetch(`/api/friends/requests/${request.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to cancel friend request");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel friend request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (!confirm("Are you sure you want to remove this friend?")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/friends/${profile.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to remove friend");
      
      // Force a hard refresh to ensure friendship status is updated
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove friend");
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile.canViewDetails) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            {profile.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                alt={displayName}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200">
                <User className="h-12 w-12 text-slate-500" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{displayName}</h1>
            {profile.isSelf && (
              <ConnectionsStats
                accountId={profile.id}
                followingCount={profile.followingCount}
                followersCount={profile.followersCount}
                ratingsCount={profile.ratingsCount}
              />
            )}
            <div className="mt-4 flex items-center gap-2 text-slate-600">
              <Lock className="h-5 w-5" />
              <p className="text-sm">This profile is private</p>
            </div>
            {!profile.isFriend && (
              <button
                onClick={handleSendRequest}
                disabled={isLoading}
                className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Friend Request"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          {profile.profilePhotoUrl ? (
            <img
              src={profile.profilePhotoUrl}
              alt={displayName}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200">
              <User className="h-12 w-12 text-slate-500" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-slate-900">{displayName}</h1>
              
              {profile.jobTitle && (
                <div className="mt-2 flex items-center gap-2 text-slate-600">
                  <Briefcase className="h-5 w-5" />
                  <span>{profile.jobTitle}</span>
                </div>
              )}

              {location && (
                <div className="mt-1 flex items-center gap-2 text-slate-600">
                  <MapPin className="h-5 w-5" />
                  <span>{location}</span>
                </div>
              )}

              <ConnectionsStats
                accountId={profile.id}
                followingCount={profile.followingCount}
                followersCount={profile.followersCount}
                ratingsCount={profile.ratingsCount}
              />
            </div>

            {!profile.isSelf && (
              <div className="flex gap-2">
                {profile.isFriend ? (
                  <button
                    onClick={handleUnfriend}
                    disabled={isLoading}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {isLoading ? "Removing..." : "Unfriend"}
                  </button>
                ) : profile.pendingRequest === "sent" ? (
                  <button
                    onClick={handleCancelRequest}
                    disabled={isLoading}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {isLoading ? "Canceling..." : "Cancel Request"}
                  </button>
                ) : profile.pendingRequest === "received" ? (
                  <button
                    onClick={() => router.push("/friends/requests")}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Respond to Request
                  </button>
                ) : (
                  <button
                    onClick={handleSendRequest}
                    disabled={isLoading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Send Friend Request"}
                  </button>
                )}
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="mt-4 text-slate-700">{profile.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
