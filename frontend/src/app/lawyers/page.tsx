import { getAllSpecializations, searchLawyers } from "@/backend/services/lawyer-service";
import { LawyerCard } from "@/components/lawyers/lawyer-card";
import type { LawyerListItem } from "@/types";
import { LawyerFilters } from "@/components/lawyers/lawyer-filters";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  specialization?: string;
  location?: string;
  minRate?: string;
  maxRate?: string;
  minRating?: string;
};

function parseNumber(value?: string) {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function LawyersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [lawyers, specializations]: [LawyerListItem[], string[]] = await Promise.all([
    searchLawyers({
      q: params.q,
      specialization: params.specialization,
      location: params.location,
      minRate: parseNumber(params.minRate),
      maxRate: parseNumber(params.maxRate),
      minRating: parseNumber(params.minRating),
    }),
    getAllSpecializations(),
  ]);

  const initialFilters = {
    q: params.q ?? "",
    specialization: params.specialization ?? "",
    location: params.location ?? "",
    minRate: params.minRate ?? "",
    maxRate: params.maxRate ?? "",
    minRating: params.minRating ?? "",
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-4xl text-slate-900">Lawyer Discovery</h1>
        <p className="text-slate-600">
          Search and filter legal professionals by specialization, location, rate, and rating.
        </p>
      </div>

      <LawyerFilters initialFilters={initialFilters} specializations={specializations} />

      {lawyers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900">No lawyers match your filters</h2>
          <p className="mt-2 text-sm text-slate-600">
            Try broadening your search terms, location, or rate range.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lawyers.map((lawyer) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} />
          ))}
        </div>
      )}
    </section>
  );
}
