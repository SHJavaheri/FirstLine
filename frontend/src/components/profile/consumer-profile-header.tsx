"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, CheckCircle, Calendar, Lock, Edit, Pen, Image, Camera } from "lucide-react";
import type { ConsumerProfile } from "@/types";
import { ConnectionsStats } from "@/components/friends/connections-stats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { ProfileBannerUpload } from "@/components/profile/profile-banner-upload";
import { ProfilePhotoUpload } from "@/components/profile/profile-photo-upload";

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
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-40">
          {profile.bannerPhotoUrl ? (
            <img
              src={profile.bannerPhotoUrl}
              alt={`${displayName}'s banner`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700" />
          )}
        </div>
        
        <div className="relative px-6 pb-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="-mt-20 flex-shrink-0">
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg">
                {profile.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500">
                    <span className="text-5xl font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 pt-4 sm:pt-0">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{displayName}</h1>
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <p className="mt-2 text-sm text-slate-600">This profile is private</p>
              </div>

              {!profile.isFriend && (
                <Button
                  onClick={handleSendRequest}
                  disabled={isLoading}
                  className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                >
                  {isLoading ? "Sending..." : "Send Friend Request"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const memberSince = profile.createdAt ? new Date(profile.createdAt).getFullYear() : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {profile.isSelf ? (
        <ProfileBannerUpload 
          currentBannerUrl={profile.bannerPhotoUrl} 
          userName={displayName}
        />
      ) : (
        <div className="relative h-40 sm:h-48">
          {profile.bannerPhotoUrl ? (
            <img
              src={profile.bannerPhotoUrl}
              alt={`${displayName}'s banner`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700" />
          )}
        </div>
      )}
      
      <div className="relative px-6 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:gap-9">
          <div className="-mt-20 flex-shrink-0 sm:-mt-24">
            {profile.isSelf ? (
              <ProfilePhotoUpload currentPhotoUrl={profile.profilePhotoUrl} userName={displayName}>
                <div className="group relative h-40 w-40 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg sm:h-48 sm:w-48">
                  {profile.profilePhotoUrl ? (
                    <img
                      src={profile.profilePhotoUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500">
                      <span className="text-5xl font-bold text-white sm:text-6xl">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {profile.emailVerified && (
                    <div className="absolute bottom-2 right-2 rounded-full bg-white p-1.5 shadow-md">
                      <CheckCircle className="h-7 w-7 fill-blue-600 text-white" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-5 w-5 text-white" />
                    <span className="text-xs font-semibold text-white">Update Photo</span>
                  </div>
                </div>
              </ProfilePhotoUpload>
            ) : (
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg sm:h-48 sm:w-48">
                {profile.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500">
                    <span className="text-5xl font-bold text-white sm:text-6xl">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {profile.emailVerified && (
                  <div className="absolute bottom-2 right-2 rounded-full bg-white p-1.5 shadow-md">
                    <CheckCircle className="h-7 w-7 fill-blue-600 text-white" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4 pt-4 sm:pt-0">
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="flex-1 min-w-0 space-y-2">
                  <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{displayName}</h1>

                  {profile.jobTitle && (
                    <p className="mt-1 text-lg font-medium text-slate-700">{profile.jobTitle}</p>
                  )}

                  {location && (
                    <div className="mt-2 flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{location}</span>
                    </div>
                  )}
                </div>

                {profile.isSelf ? (
                  <EditProfileDialog user={{
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    jobTitle: profile.jobTitle,
                    bio: profile.bio,
                    locationCity: profile.locationCity,
                    locationState: profile.locationState,
                    phone: null,
                  }} />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.isFriend ? (
                      <Button
                        onClick={handleUnfriend}
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                      >
                        {isLoading ? "Removing..." : "Unfriend"}
                      </Button>
                    ) : profile.pendingRequest === "sent" ? (
                      <Button
                        onClick={handleCancelRequest}
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                      >
                        {isLoading ? "Canceling..." : "Cancel Request"}
                      </Button>
                    ) : profile.pendingRequest === "received" ? (
                      <Button
                        onClick={() => router.push("/friends/requests")}
                        size="sm"
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      >
                        Respond to Request
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSendRequest}
                        disabled={isLoading}
                        size="sm"
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      >
                        {isLoading ? "Sending..." : "Send Friend Request"}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {profile.bio && (
                <p className="mt-4 text-sm leading-relaxed text-slate-700 line-clamp-2">
                  {profile.bio}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-slate-100 pt-4 text-sm">
              <ConnectionsStats
                accountId={profile.id}
                followingCount={profile.followingCount || 0}
                followersCount={profile.followersCount || 0}
                ratingsCount={profile.ratingsCount || 0}
              />
              
              {memberSince && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {memberSince}</span>
                </div>
              )}

              {profile.emailVerified && (
                <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
