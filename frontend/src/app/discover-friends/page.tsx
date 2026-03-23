import { getCurrentUser } from "@/backend/auth/current-user";
import { redirect } from "next/navigation";
import { getFriendRequests } from "@/backend/repositories/friend-repository";
import { DiscoverFriendsContent } from "@/components/friends/discover-friends-content";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  tab?: string;
};

export default async function DiscoverFriendsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const activeTab = params.tab || "search";

  const pageTitle = user.role === "PROFESSIONAL" ? "Client Lookup" : "Discover Friends";
  const pageDescription = user.role === "PROFESSIONAL" 
    ? "Connect with consumers and other professionals to expand your network."
    : "Connect with other users to see their trusted professionals and recommendations.";

  // Fetch friend requests if on requests tab
  let receivedRequests: Awaited<ReturnType<typeof getFriendRequests>> = [];
  let sentRequests: Awaited<ReturnType<typeof getFriendRequests>> = [];
  if (activeTab === "requests") {
    [receivedRequests, sentRequests] = await Promise.all([
      getFriendRequests(user.id, "received", "PENDING"),
      getFriendRequests(user.id, "sent", "PENDING"),
    ]);
  }

  return (
    <DiscoverFriendsContent
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      activeTab={activeTab}
      initialQuery={params.q || ""}
      query={params.q}
      receivedRequests={receivedRequests}
      sentRequests={sentRequests}
    />
  );
}
