import "server-only";

import { prisma } from "@/database/prisma";
import { getFriendIds } from "./friend-repository";

export type FriendTrustData = {
  friendsWhoUsed: Array<{
    friendId: string;
    friendName: string;
    friendPhoto: string | null;
    rating: number;
    comment: string | null;
    ratedAt: Date;
  }>;
  averageFriendRating: number;
  friendCount: number;
  trustScore: number;
};

async function getProfessionalProfileId(professionalAccountId: string) {
  const profile = await prisma.professionalProfile.findUnique({
    where: { accountId: professionalAccountId },
    select: { id: true },
  });

  return profile?.id ?? null;
}

export async function getFriendTrustDataForProfessional(
  userId: string,
  professionalAccountId: string
): Promise<FriendTrustData> {
  const professionalProfileId = await getProfessionalProfileId(professionalAccountId);
  
  if (!professionalProfileId) {
    return {
      friendsWhoUsed: [],
      averageFriendRating: 0,
      friendCount: 0,
      trustScore: 0,
    };
  }

  const friendIds = await getFriendIds(userId);

  if (friendIds.length === 0) {
    return {
      friendsWhoUsed: [],
      averageFriendRating: 0,
      friendCount: 0,
      trustScore: 0,
    };
  }

  const friendRatings = await prisma.rating.findMany({
    where: {
      professionalProfileId,
      consumerId: { in: friendIds },
    },
    include: {
      consumer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhotoUrl: true,
        },
      },
    },
    orderBy: {
      rating: "desc",
    },
  });

  const friendsWhoUsed = friendRatings.map((rating) => ({
    friendId: rating.consumer.id,
    friendName: `${rating.consumer.firstName || ""} ${rating.consumer.lastName || ""}`.trim() || "Friend",
    friendPhoto: rating.consumer.profilePhotoUrl,
    rating: rating.rating,
    comment: rating.comment,
    ratedAt: rating.createdAt,
  }));

  const averageFriendRating = friendRatings.length > 0
    ? friendRatings.reduce((sum, r) => sum + r.rating, 0) / friendRatings.length
    : 0;

  const professional = await prisma.professionalProfile.findUnique({
    where: { id: professionalProfileId },
    select: { rating: true },
  });

  const baseRating = professional?.rating ?? 0;
  const trustScore = calculateTrustScore(baseRating, averageFriendRating, friendRatings.length);

  return {
    friendsWhoUsed,
    averageFriendRating,
    friendCount: friendRatings.length,
    trustScore,
  };
}

export function calculateTrustScore(
  baseRating: number,
  friendAvgRating: number,
  friendRatingCount: number
): number {
  if (friendRatingCount === 0) {
    return baseRating;
  }

  const friendWeight = Math.min(friendRatingCount * 0.2, 0.8);
  const baseWeight = 1 - friendWeight;

  const trustScore = (baseRating * baseWeight) + (friendAvgRating * friendWeight);

  return Math.round(trustScore * 100) / 100;
}

export async function getProfessionalsWithFriendTrust(
  userId: string,
  professionalIds: string[]
): Promise<Map<string, { friendCount: number; averageFriendRating: number; trustScore: number }>> {
  const friendIds = await getFriendIds(userId);
  const resultMap = new Map<string, { friendCount: number; averageFriendRating: number; trustScore: number }>();

  if (friendIds.length === 0 || professionalIds.length === 0) {
    return resultMap;
  }

  const professionals = await prisma.professionalProfile.findMany({
    where: {
      accountId: { in: professionalIds },
    },
    select: {
      id: true,
      accountId: true,
      rating: true,
    },
  });

  const professionalProfileIds = professionals.map((p) => p.id);

  const friendRatings = await prisma.rating.findMany({
    where: {
      professionalProfileId: { in: professionalProfileIds },
      consumerId: { in: friendIds },
    },
    select: {
      professionalProfileId: true,
      rating: true,
    },
  });

  const ratingsByProfessional = new Map<string, number[]>();
  friendRatings.forEach((rating) => {
    const existing = ratingsByProfessional.get(rating.professionalProfileId) || [];
    existing.push(rating.rating);
    ratingsByProfessional.set(rating.professionalProfileId, existing);
  });

  professionals.forEach((professional) => {
    const ratings = ratingsByProfessional.get(professional.id) || [];
    const friendCount = ratings.length;
    const averageFriendRating = friendCount > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / friendCount
      : 0;
    const trustScore = calculateTrustScore(professional.rating, averageFriendRating, friendCount);

    resultMap.set(professional.accountId, {
      friendCount,
      averageFriendRating,
      trustScore,
    });
  });

  return resultMap;
}

export type TrustTier = 1 | 2 | 3 | 4;

export function getTrustTier(friendCount: number, averageFriendRating: number): TrustTier {
  if (friendCount >= 3 && averageFriendRating >= 4.0) {
    return 1;
  }
  if (friendCount >= 1 && averageFriendRating >= 3.5) {
    return 2;
  }
  return 3;
}

export function sortProfessionalsByTrust<T extends { 
  id: string; 
  rating: number; 
  hourlyRate?: number | null;
}>(
  professionals: T[],
  trustData: Map<string, { friendCount: number; averageFriendRating: number; trustScore: number }>,
  sortBy: "rating" | "friendTrust" | "price" = "friendTrust"
): T[] {
  return professionals.sort((a, b) => {
    const aTrust = trustData.get(a.id);
    const bTrust = trustData.get(b.id);

    const aTier = aTrust ? getTrustTier(aTrust.friendCount, aTrust.averageFriendRating) : 4;
    const bTier = bTrust ? getTrustTier(bTrust.friendCount, bTrust.averageFriendRating) : 4;

    if (aTier !== bTier) {
      return aTier - bTier;
    }

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
