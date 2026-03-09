import { getCurrentUser } from "@/backend/auth/current-user";
import { redirect } from "next/navigation";
import { ConsumerSearchForm } from "@/components/friends/consumer-search-form";
import { ConsumerSearchResults } from "@/components/friends/consumer-search-results";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
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

  const pageTitle = user.role === "PROFESSIONAL" ? "Client Lookup" : "Discover Friends";
  const pageDescription = user.role === "PROFESSIONAL" 
    ? "Connect with consumers and other professionals to expand your network."
    : "Connect with other users to see their trusted professionals and recommendations.";

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-4xl text-slate-900">{pageTitle}</h1>
        <p className="text-slate-600">
          {pageDescription}
        </p>
      </div>

      <ConsumerSearchForm
        initialQuery={params.q || ""}
      />

      <ConsumerSearchResults
        query={params.q}
      />
    </section>
  );
}
