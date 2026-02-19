import { prisma } from "@/database/prisma";
import type { LawyerSearchFilters } from "@/types";

function buildAccountFilters(query: string) {
  return {
    OR: [
      { firstName: { contains: query, mode: "insensitive" } },
      { lastName: { contains: query, mode: "insensitive" } },
      { jobTitle: { contains: query, mode: "insensitive" } },
    ],
  };
}

export async function listProfessionalProfiles(filters: LawyerSearchFilters) {
  const andFilters: Record<string, unknown>[] = [];

  if (filters.q) {
    andFilters.push({
      OR: [
        { profession: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
        { account: buildAccountFilters(filters.q) },
      ],
    });
  }

  if (filters.specialization) {
    andFilters.push({
      specializations: { has: filters.specialization },
    });
  }

  if (filters.location) {
    andFilters.push({
      OR: [
        { location: { contains: filters.location, mode: "insensitive" } },
        { account: { locationCity: { contains: filters.location, mode: "insensitive" } } },
        { account: { locationState: { contains: filters.location, mode: "insensitive" } } },
      ],
    });
  }

  if (typeof filters.minRate === "number") {
    andFilters.push({
      hourlyRate: { gte: filters.minRate },
    });
  }

  if (typeof filters.maxRate === "number") {
    andFilters.push({
      hourlyRate: { lte: filters.maxRate },
    });
  }

  if (typeof filters.minRating === "number") {
    andFilters.push({
      rating: { gte: filters.minRating },
    });
  }

  return prisma.professionalProfile.findMany({
    where: andFilters.length > 0 ? { AND: andFilters } : undefined,
    orderBy: [{ rating: "desc" }, { hourlyRate: "asc" }],
    include: {
      account: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhotoUrl: true,
          jobTitle: true,
          email: true,
          bio: true,
          phone: true,
          locationCity: true,
          locationState: true,
        },
      },
    },
  });
}

export async function getProfessionalProfileById(id: string) {
  return prisma.professionalProfile.findUnique({
    where: { id },
    include: {
      account: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhotoUrl: true,
          jobTitle: true,
          email: true,
          phone: true,
          bio: true,
          locationCity: true,
          locationState: true,
        },
      },
    },
  });
}

export async function listSpecializations() {
  const profiles = await prisma.professionalProfile.findMany({
    select: { specializations: true },
  });

  const specializations = new Set<string>();
  profiles.forEach((profile: { specializations: string[] }) => {
    profile.specializations.forEach((specialization: string) => specializations.add(specialization));
  });

  return Array.from(specializations).sort((a, b) => a.localeCompare(b));
}
