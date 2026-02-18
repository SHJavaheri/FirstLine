import type { Prisma } from "@prisma/client";

import { prisma } from "@/database/prisma";
import type { LawyerSearchFilters } from "@/types";

export async function listLawyers(filters: LawyerSearchFilters) {
  const andFilters: Prisma.LawyerWhereInput[] = [];

  if (filters.q) {
    andFilters.push({
      OR: [
        { name: { contains: filters.q, mode: "insensitive" } },
        { specialization: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
      ],
    });
  }

  if (filters.specialization) {
    andFilters.push({
      specialization: { equals: filters.specialization, mode: "insensitive" },
    });
  }

  if (filters.location) {
    andFilters.push({
      location: { contains: filters.location, mode: "insensitive" },
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

  return prisma.lawyer.findMany({
    where: andFilters.length > 0 ? { AND: andFilters } : undefined,
    orderBy: [{ rating: "desc" }, { hourlyRate: "asc" }],
    select: {
      id: true,
      name: true,
      specialization: true,
      hourlyRate: true,
      location: true,
      rating: true,
      yearsExperience: true,
      description: true,
      email: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getLawyerById(id: string) {
  return prisma.lawyer.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      specialization: true,
      hourlyRate: true,
      location: true,
      rating: true,
      yearsExperience: true,
      description: true,
      email: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function listSpecializations() {
  const lawyers = await prisma.lawyer.findMany({
    select: { specialization: true },
    distinct: ["specialization"],
    orderBy: { specialization: "asc" },
  });

  return lawyers.map((lawyer) => lawyer.specialization);
}
