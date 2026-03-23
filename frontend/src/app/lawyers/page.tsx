import { getAllSpecializations, getAllProfessions, searchLawyers } from "@/backend/services/lawyer-service";
import { getCurrentUser } from "@/backend/auth/current-user";
import type { LawyerListItem } from "@/types";
import { DiscoverLanding } from "@/components/discover/discover-landing";
import { DiscoverSidebar } from "@/components/discover/discover-sidebar";
import { SearchBar } from "@/components/discover/search-bar";
import { ResultsHeader } from "@/components/discover/results-header";
import { ActiveFilters } from "@/components/discover/active-filters";
import { AnimatedCardsGrid } from "@/components/discover/animated-cards-grid";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  profession?: string;
  specialization?: string;
  location?: string;
  minRate?: string;
  maxRate?: string;
  minRating?: string;
  acceptsNewClients?: string;
  offersRemote?: string;
  offersInPerson?: string;
  verified?: string;
  sortBy?: string;
  explore?: string;
};

function parseNumber(value?: string) {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBoolean(value?: string) {
  return value === "true";
}

function parseProfessionArray(value?: string): string[] {
  if (!value) return [];
  return value.split(",").map(p => p.trim()).filter(Boolean);
}

export default async function LawyersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  
  const hasFilters = !!(params.q || params.profession || params.specialization || params.location || 
    params.minRate || params.maxRate || params.minRating || params.acceptsNewClients || 
    params.offersRemote || params.offersInPerson || params.verified || params.explore);

  if (!hasFilters) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <DiscoverLanding />
      </section>
    );
  }
  
  const searchFilters = {
    q: params.q,
    profession: parseProfessionArray(params.profession),
    specialization: params.specialization,
    location: params.location,
    minRate: parseNumber(params.minRate),
    maxRate: parseNumber(params.maxRate),
    minRating: parseNumber(params.minRating),
    acceptsNewClients: parseBoolean(params.acceptsNewClients),
    offersRemote: parseBoolean(params.offersRemote),
    offersInPerson: parseBoolean(params.offersInPerson),
    verified: parseBoolean(params.verified),
  };

  const sortBy = params.sortBy || "friendTrust";

  const [lawyers, specializations, professions] = await Promise.all([
    user?.role === "CONSUMER" 
      ? (await import("@/backend/services/lawyer-service")).searchLawyersWithTrust(searchFilters, user.id, sortBy as "rating" | "friendTrust" | "price")
      : searchLawyers(searchFilters),
    getAllSpecializations(),
    getAllProfessions(),
  ]);

  const initialFilters = {
    profession: parseProfessionArray(params.profession),
    specialization: params.specialization ?? "",
    location: params.location ?? "",
    minRate: params.minRate ?? "",
    maxRate: params.maxRate ?? "",
    minRating: params.minRating ?? "",
    acceptsNewClients: parseBoolean(params.acceptsNewClients),
    offersRemote: parseBoolean(params.offersRemote),
    offersInPerson: parseBoolean(params.offersInPerson),
    verified: parseBoolean(params.verified),
  };

  const activeFilters = [
    ...(params.q ? [{ key: "q", label: `Search: ${params.q}`, value: params.q }] : []),
    ...(parseProfessionArray(params.profession).map(p => ({ key: "profession", label: p, value: p }))),
    ...(params.specialization ? [{ key: "specialization", label: params.specialization, value: params.specialization }] : []),
    ...(params.location ? [{ key: "location", label: `Location: ${params.location}`, value: params.location }] : []),
    ...(params.minRate ? [{ key: "minRate", label: `Min: $${params.minRate}`, value: params.minRate }] : []),
    ...(params.maxRate ? [{ key: "maxRate", label: `Max: $${params.maxRate}`, value: params.maxRate }] : []),
    ...(params.minRating ? [{ key: "minRating", label: `Rating: ${params.minRating}+`, value: params.minRating }] : []),
    ...(params.acceptsNewClients === "true" ? [{ key: "acceptsNewClients", label: "Accepts New Clients", value: "true" }] : []),
    ...(params.offersRemote === "true" ? [{ key: "offersRemote", label: "Offers Remote", value: "true" }] : []),
    ...(params.offersInPerson === "true" ? [{ key: "offersInPerson", label: "Offers In-Person", value: "true" }] : []),
    ...(params.verified === "true" ? [{ key: "verified", label: "Verified Only", value: "true" }] : []),
  ];

  return (
    <section className="flex h-full">
      <DiscoverSidebar 
        initialFilters={initialFilters} 
        professions={professions}
        specializations={specializations} 
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <SearchBar initialQuery={params.q} />
            
            {activeFilters.length > 0 && (
              <ActiveFilters 
                filters={activeFilters}
              />
            )}
            
            <ResultsHeader 
              count={lawyers.length}
              sortBy={sortBy}
            />
          </div>

          {lawyers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-xl font-semibold text-slate-900">No professionals match your filters</h2>
              <p className="mt-2 text-sm text-slate-600">
                Try broadening your search terms, location, or rate range.
              </p>
            </div>
          ) : (
            <AnimatedCardsGrid
              lawyers={lawyers}
              showFavoriteButton={user?.role === "CONSUMER"}
              showRecommendButton={user?.role === "CONSUMER"}
            />
          )}
        </div>
      </main>
    </section>
  );
}
