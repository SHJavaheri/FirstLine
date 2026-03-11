import { getCurrentUser } from "@/backend/auth/current-user";
import { redirect } from "next/navigation";
import { ConsumerSearchForm } from "@/components/friends/consumer-search-form";
import { ConsumerSearchResults } from "@/components/friends/consumer-search-results";
import { getFriendRequests } from "@/backend/repositories/friend-repository";
import { FriendRequestsList } from "@/components/friends/friend-requests-list";

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
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-4xl text-slate-900 dark:text-white">{pageTitle}</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {pageDescription}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-8" aria-label="Tabs">
          <a
            href="/discover-friends"
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "search"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Search
          </a>
          <a
            href="/discover-friends?tab=requests"
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "requests"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Friend Requests
          </a>
        </nav>
      </div>

      {activeTab === "requests" ? (
        <FriendRequestsList
          receivedRequests={receivedRequests}
          sentRequests={sentRequests}
        />
      ) : (
        <>
          <ConsumerSearchForm
            initialQuery={params.q || ""}
          />

          <ConsumerSearchResults
            query={params.q}
          />
        </>
      )}
    </section>
  );
}
