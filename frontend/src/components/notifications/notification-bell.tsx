"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, User, Check, X, Star, Award } from "lucide-react";

type Notification = {
  id: string;
  type: "FRIEND_REQUEST" | "RATING_RECEIVED" | "RECOMMENDATION_RECEIVED";
  relatedId: string;
  actorId: string | null;
  message: string | null;
  isRead: boolean;
  createdAt: Date;
  destinationProfileId: string | null;
};

type FriendRequest = {
  id: string;
  sender: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profilePhotoUrl: string | null;
    email: string;
    role: string;
    professional?: { profession: string } | null;
  };
  createdAt: Date;
};

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notifResponse, requestsResponse] = await Promise.all([
          fetch("/api/notifications?unreadOnly=true"),
          fetch("/api/friends/requests?type=received&status=PENDING"),
        ]);

        if (notifResponse.ok) {
          const data = await notifResponse.json();
          const newNotifications = data.notifications || [];
          
          if (newNotifications.length > notifications.length) {
            setHasViewed(false);
          }
          
          setNotifications(newNotifications);
        }

        if (requestsResponse.ok) {
          const data = await requestsResponse.json();
          const newRequests = data.requests || [];
          
          if (newRequests.length > friendRequests.length) {
            setHasViewed(false);
          }
          
          setFriendRequests(newRequests);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [notifications.length, friendRequests.length]);

  const handleAcceptFriend = async (requestId: string) => {
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

      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
      router.refresh();
    } catch (err) {
      console.error("Error accepting friend request:", err);
      alert(err instanceof Error ? err.message : "Failed to accept friend request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineFriend = async (requestId: string) => {
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

      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
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

  const getDisplayNameWithProfession = (user: { firstName: string | null; lastName: string | null; email: string; role?: string; professional?: { profession: string } | null }) => {
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
    if (user.role === "PROFESSIONAL" && user.professional?.profession) {
      return `${name} (${user.professional.profession})`;
    }
    return name;
  };

  const handleToggle = () => {
    if (!isOpen) {
      setHasViewed(true);
    }
    setIsOpen(!isOpen);
  };

  const totalUnread = notifications.length + friendRequests.length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "RATING_RECEIVED":
        return <Star className="h-4 w-4 text-amber-500" />;
      case "RECOMMENDATION_RECEIVED":
        return <Award className="h-4 w-4 text-blue-500" />;
      case "FRIEND_REQUEST":
        return <User className="h-4 w-4 text-slate-500" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  const getFriendRequestProfileHref = (request: FriendRequest) => {
    if (request.sender.role === "PROFESSIONAL") {
      return `/professionals/${request.sender.id}`;
    }

    return `/profile/${request.sender.id}`;
  };

  const getNotificationHref = (notification: Notification) => {
    switch (notification.type) {
      case "RATING_RECEIVED":
        return notification.destinationProfileId
          ? `/professionals/${notification.destinationProfileId}`
          : "/profile";
      case "RECOMMENDATION_RECEIVED":
        return notification.destinationProfileId
          ? `/professionals/${notification.destinationProfileId}`
          : "/profile";
      default:
        return "/profile";
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markNotificationAsRead(notification.id);
    setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
    setIsOpen(false);
    router.push(getNotificationHref(notification));
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative rounded-lg p-2 text-slate-700 hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" />
        {totalUnread > 0 && !hasViewed && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
            {totalUnread > 9 ? "9+" : totalUnread}
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
              <h3 className="font-semibold text-slate-900">Notifications</h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                </div>
              ) : totalUnread === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-slate-600">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {friendRequests.map((request) => (
                    <div key={request.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Link
                          href={getFriendRequestProfileHref(request)}
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
                            href={getFriendRequestProfileHref(request)}
                            className="font-medium text-slate-900 hover:text-blue-600"
                            onClick={() => setIsOpen(false)}
                          >
                            {getDisplayNameWithProfession(request.sender)}
                          </Link>
                          <p className="text-xs text-slate-600 mt-1">
                            Sent you a friend request
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleAcceptFriend(request.id)}
                              disabled={actionLoading === request.id}
                              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              <Check className="h-3 w-3" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleDeclineFriend(request.id)}
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

                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => void handleNotificationClick(notification)}
                      className="block w-full p-4 text-left hover:bg-slate-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
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
