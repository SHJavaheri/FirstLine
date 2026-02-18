"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LawyerFiltersProps = {
  initialFilters: {
    q: string;
    specialization: string;
    location: string;
    minRate: string;
    maxRate: string;
    minRating: string;
  };
  specializations: string[];
};

export function LawyerFilters({ initialFilters, specializations }: LawyerFiltersProps) {
  const router = useRouter();

  const [filters, setFilters] = useState(initialFilters);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) {
        params.set(key, value.trim());
      }
    });

    router.push(`/lawyers${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function clearFilters() {
    setFilters({
      q: "",
      specialization: "",
      location: "",
      minRate: "",
      maxRate: "",
      minRating: "",
    });
    router.push("/lawyers");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div className="space-y-2 xl:col-span-2">
          <Label htmlFor="q">Search</Label>
          <Input
            id="q"
            placeholder="Name, specialization, keyword..."
            value={filters.q}
            onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <select
            id="specialization"
            value={filters.specialization}
            onChange={(event) => setFilters((prev) => ({ ...prev, specialization: event.target.value }))}
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <option value="">All</option>
            {specializations.map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City or state"
            value={filters.location}
            onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minRate">Min Rate</Label>
          <Input
            id="minRate"
            placeholder="100"
            value={filters.minRate}
            onChange={(event) => setFilters((prev) => ({ ...prev, minRate: event.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxRate">Max Rate</Label>
          <Input
            id="maxRate"
            placeholder="400"
            value={filters.maxRate}
            onChange={(event) => setFilters((prev) => ({ ...prev, maxRate: event.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minRating">Min Rating</Label>
          <select
            id="minRating"
            value={filters.minRating}
            onChange={(event) => setFilters((prev) => ({ ...prev, minRating: event.target.value }))}
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <option value="">Any</option>
            <option value="3">3.0+</option>
            <option value="3.5">3.5+</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={clearFilters}>
          Reset
        </Button>
        <Button type="submit">Apply Filters</Button>
      </div>
    </form>
  );
}
