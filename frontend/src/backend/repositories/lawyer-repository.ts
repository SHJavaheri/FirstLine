import { prisma } from "@/database/prisma";
import type { LawyerSearchFilters } from "@/types";
import { getProfessionalsWithFriendTrust, sortProfessionalsByTrust } from "./friend-trust-repository";
import { getRecommendationsByFriends, getFavoritesByFriends } from "./recommendation-repository";

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

export async function listProfessionalProfilesWithTrust(
  filters: LawyerSearchFilters,
  userId?: string,
  sortBy: "rating" | "friendTrust" | "price" = "rating"
) {
  const professionals = await listProfessionalProfiles(filters);

  if (!userId) {
    return professionals.map((p) => ({
      ...p,
      friendTrustData: {
        friendCount: 0,
        averageFriendRating: 0,
        trustScore: p.rating,
        trustedByNetwork: false,
      },
    }));
  }

  const professionalAccountIds = professionals.map((p) => p.account.id);
  
  const [trustDataMap, recommendationsMap, favoritesMap] = await Promise.all([
    getProfessionalsWithFriendTrust(userId, professionalAccountIds),
    getRecommendationsByFriends(userId, professionalAccountIds),
    getFavoritesByFriends(userId, professionalAccountIds),
  ]);

  const professionalsWithTrust = professionals.map((p) => {
    const trustData = trustDataMap.get(p.account.id);
    const recommendations = recommendationsMap.get(p.account.id);
    const favorites = favoritesMap.get(p.account.id);
    
    return {
      ...p,
      friendTrustData: {
        friendCount: trustData?.friendCount || 0,
        averageFriendRating: trustData?.averageFriendRating || 0,
        trustScore: trustData?.trustScore || p.rating,
        trustedByNetwork: (trustData?.friendCount || 0) >= 1 && (trustData?.averageFriendRating || 0) >= 3.5,
      },
      recommendedByFriends: recommendations ? {
        count: recommendations.friendCount,
        friends: recommendations.friends,
      } : undefined,
      favoritedByFriends: favorites ? {
        count: favorites.friendCount,
        friends: favorites.friends,
      } : undefined,
    };
  });

  const sorted = sortProfessionalsByTrustAndRecommendations(professionalsWithTrust, trustDataMap, recommendationsMap, favoritesMap, sortBy);

  return sorted;
}

function sortProfessionalsByTrustAndRecommendations<T extends { 
  id: string; 
  rating: number; 
  hourlyRate?: number | null;
  account: { id: string };
}>(
  professionals: T[],
  trustData: Map<string, { friendCount: number; averageFriendRating: number; trustScore: number }>,
  recommendations: Map<string, { friendCount: number; friends: Array<{ id: string; name: string }> }>,
  favorites: Map<string, { friendCount: number; friends: Array<{ id: string; name: string }> }>,
  sortBy: "rating" | "friendTrust" | "price" = "friendTrust"
): T[] {
  return professionals.sort((a, b) => {
    const aRecommendations = recommendations.get(a.account.id);
    const bRecommendations = recommendations.get(b.account.id);
    const aFavorites = favorites.get(a.account.id);
    const bFavorites = favorites.get(b.account.id);
    
    const aRecommendationCount = (aRecommendations?.friendCount || 0) + (aFavorites?.friendCount || 0);
    const bRecommendationCount = (bRecommendations?.friendCount || 0) + (bFavorites?.friendCount || 0);
    
    if (aRecommendationCount !== bRecommendationCount) {
      return bRecommendationCount - aRecommendationCount;
    }
    
    const aTrust = trustData.get(a.account.id);
    const bTrust = trustData.get(b.account.id);
    
    if (sortBy === "friendTrust" && aTrust && bTrust) {
      if (aTrust.trustScore !== bTrust.trustScore) {
        return bTrust.trustScore - aTrust.trustScore;
      }
      if (aTrust.friendCount !== bTrust.friendCount) {
        return bTrust.friendCount - aTrust.friendCount;
      }
    }
    
    if (a.rating !== b.rating) {
      return b.rating - a.rating;
    }
    
    if (sortBy === "price" && a.hourlyRate !== null && b.hourlyRate !== null) {
      return (a.hourlyRate || 0) - (b.hourlyRate || 0);
    }
    
    return 0;
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
