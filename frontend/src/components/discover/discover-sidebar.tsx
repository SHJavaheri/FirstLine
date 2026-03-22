"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FilterSection } from "./filter-section";
import { RangeSlider } from "./range-slider";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

type DiscoverSidebarProps = {
  initialFilters: {
    profession: string[];
    specialization: string;
    location: string;
    minRate: string;
    maxRate: string;
    minRating: string;
    acceptsNewClients: boolean;
    offersRemote: boolean;
    offersInPerson: boolean;
    verified: boolean;
  };
  professions: string[];
  specializations: string[];
};

const PROFESSIONS = ["Lawyer", "Accountant", "Real Estate Agent", "Financial Advisor", "Consultant"];

export function DiscoverSidebar({
  initialFilters,
  professions,
  specializations,
}: DiscoverSidebarProps) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  function updateFilter(key: string, value: any) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function toggleProfession(profession: string) {
    const current = filters.profession;
    const updated = current.includes(profession)
      ? current.filter((p) => p !== profession)
      : [...current, profession];
    updateFilter("profession", updated);
  }

  function applyFilters() {
    const params = new URLSearchParams(window.location.search);

    if (filters.profession.length > 0) {
      params.set("profession", filters.profession.join(","));
    } else {
      params.delete("profession");
    }

    if (filters.specialization) {
      params.set("specialization", filters.specialization);
    } else {
      params.delete("specialization");
    }

    if (filters.location) {
      params.set("location", filters.location);
    } else {
      params.delete("location");
    }

    if (filters.minRate) {
      params.set("minRate", filters.minRate);
    } else {
      params.delete("minRate");
    }

    if (filters.maxRate) {
      params.set("maxRate", filters.maxRate);
    } else {
      params.delete("maxRate");
    }

    if (filters.minRating) {
      params.set("minRating", filters.minRating);
    } else {
      params.delete("minRating");
    }

    if (filters.acceptsNewClients) {
      params.set("acceptsNewClients", "true");
    } else {
      params.delete("acceptsNewClients");
    }

    if (filters.offersRemote) {
      params.set("offersRemote", "true");
    } else {
      params.delete("offersRemote");
    }

    if (filters.offersInPerson) {
      params.set("offersInPerson", "true");
    } else {
      params.delete("offersInPerson");
    }

    if (filters.verified) {
      params.set("verified", "true");
    } else {
      params.delete("verified");
    }

    router.push(`/lawyers?${params.toString()}`);
  }

  function clearFilters() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    router.push(q ? `/lawyers?q=${q}` : "/lawyers");
  }

  return (
    <motion.aside 
      className="w-72 border-r border-slate-200 bg-white p-4 overflow-y-auto"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </div>

      <div className="space-y-0">
        <FilterSection title="Profession">
          {PROFESSIONS.map((profession) => (
            <label key={profession} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.profession.includes(profession)}
                onChange={() => toggleProfession(profession)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">{profession}</span>
            </label>
          ))}
        </FilterSection>

        <FilterSection title="Specialization">
          <select
            value={filters.specialization}
            onChange={(e) => updateFilter("specialization", e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </FilterSection>

        <FilterSection title="Location">
          <input
            type="text"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            placeholder="City or state"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </FilterSection>

        <FilterSection title="Hourly Rate">
          <RangeSlider
            min={0}
            max={1000}
            step={25}
            minValue={Number(filters.minRate) || 0}
            maxValue={Number(filters.maxRate) || 1000}
            onChange={(min, max) => {
              updateFilter("minRate", min.toString());
              updateFilter("maxRate", max.toString());
            }}
            formatValue={(v) => `$${v}`}
          />
        </FilterSection>

        <FilterSection title="Rating">
          <div className="space-y-2">
            {[
              { value: "4.5", label: "4.5+" },
              { value: "4", label: "4.0+" },
              { value: "3.5", label: "3.5+" },
              { value: "3", label: "3.0+" },
            ].map((rating) => (
              <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating.value}
                  onChange={() => updateFilter("minRating", rating.value)}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm text-slate-700">{rating.label}</span>
                </div>
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === ""}
                onChange={() => updateFilter("minRating", "")}
                className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Any rating</span>
            </label>
          </div>
        </FilterSection>

        <FilterSection title="Availability">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.acceptsNewClients}
              onChange={(e) => updateFilter("acceptsNewClients", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Accepts New Clients</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.offersRemote}
              onChange={(e) => updateFilter("offersRemote", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Offers Remote Services</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.offersInPerson}
              onChange={(e) => updateFilter("offersInPerson", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Offers In-Person Services</span>
          </label>
        </FilterSection>

        <FilterSection title="Verification">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verified}
              onChange={(e) => updateFilter("verified", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Verified Only</span>
          </label>
        </FilterSection>
      </div>

      <div className="mt-6 space-y-2">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </div>
    </motion.aside>
  );
}
