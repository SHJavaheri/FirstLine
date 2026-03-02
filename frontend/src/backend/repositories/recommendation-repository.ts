import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@/database/prisma";

const professionalProfileSelect = {
  id: true,
  accountId: true,
  profession: true,
  specializations: true,
  rating: true,
  account: {
    select: {
      firstName: true,
      lastName: true,
      email: true,
      profilePhotoUrl: true,
    },
  },
} as const;

const recommendationInclude = {
  professionalProfile: {
    select: professionalProfileSelect,
  },
} satisfies Prisma.PersonalRecommendationInclude;

type RecommendationWithProfessional = Prisma.PersonalRecommendationGetPayload<{
  include: typeof recommendationInclude;
}> & {
  selectedTags: string[];
  wouldUseAgain: string | null;
};

export type CreateRecommendationInput = {
  consumerId: string;
  professionalAccountId: string;
  category: string;
  specialty?: string;
  note?: string;
  isFavorite?: boolean;
  visibility?: "PUBLIC" | "FRIENDS_ONLY" | "PRIVATE";
  selectedTags?: string[];
  wouldUseAgain?: string;
};

export type UpdateRecommendationInput = {
  category?: string;
  specialty?: string;
  note?: string;
  isFavorite?: boolean;
  visibility?: "PUBLIC" | "FRIENDS_ONLY" | "PRIVATE";
  selectedTags?: string[];
  wouldUseAgain?: string;
};

async function getProfessionalProfileId(professionalAccountId: string) {
  const profile = await prisma.professionalProfile.findUnique({
    where: { accountId: professionalAccountId },
    select: { id: true },
  });

  return profile?.id ?? null;
}

export async function createRecommendation(input: CreateRecommendationInput) {
  const professionalProfileId = await getProfessionalProfileId(input.professionalAccountId);

  if (!professionalProfileId) {
    throw new Error("Professional profile not found");
  }

  const existingRecommendation = await prisma.personalRecommendation.findUnique({
    where: {
      consumerId_professionalProfileId: {
        consumerId: input.consumerId,
        professionalProfileId,
      },
    },
  });

  if (existingRecommendation) {
    throw new Error("Recommendation already exists for this professional");
  }

  const data = {
    consumerId: input.consumerId,
    professionalProfileId,
    category: input.category,
    specialty: input.specialty,
    note: input.note,
    isFavorite: input.isFavorite ?? false,
    visibility: input.visibility ?? "PUBLIC",
    selectedTags: input.selectedTags ?? [],
    wouldUseAgain: input.wouldUseAgain ?? null,
  };

  return prisma.personalRecommendation.create({
    data: data as Prisma.PersonalRecommendationUncheckedCreateInput,
    include: recommendationInclude,
  });
}

export async function updateRecommendation(
  recommendationId: string,
  consumerId: string,
  input: UpdateRecommendationInput
) {
  const recommendation = await prisma.personalRecommendation.findUnique({
    where: { id: recommendationId },
  });

  if (!recommendation) {
    throw new Error("Recommendation not found");
  }

  if (recommendation.consumerId !== consumerId) {
    throw new Error("Unauthorized to update this recommendation");
  }

  return prisma.personalRecommendation.update({
    where: { id: recommendationId },
    data: input,
    include: recommendationInclude,
  });
}

export async function deleteRecommendation(recommendationId: string, consumerId: string) {
  const recommendation = await prisma.personalRecommendation.findUnique({
    where: { id: recommendationId },
  });

  if (!recommendation) {
    throw new Error("Recommendation not found");
  }

  if (recommendation.consumerId !== consumerId) {
    throw new Error("Unauthorized to delete this recommendation");
  }

  return prisma.personalRecommendation.delete({
    where: { id: recommendationId },
  });
}

export async function getRecommendations(
  viewerId: string,
  consumerId: string,
  filters?: { category?: string; specialty?: string; limit?: number; offset?: number }
) {
  const isSelf = viewerId === consumerId;

  const friendship = await prisma.friendship.findFirst({
    where: { userId: viewerId, friendId: consumerId },
  });

  const isFriend = !!friendship;

  const visibilityFilter = isSelf
    ? {}
    : isFriend
    ? { visibility: { in: ["PUBLIC", "FRIENDS_ONLY"] } }
    : { visibility: "PUBLIC" };

  const { category, specialty, limit = 50, offset = 0 } = filters || {};

  const where: Record<string, unknown> = {
    consumerId,
    ...visibilityFilter,
  };

  if (category) {
    where.category = { contains: category, mode: "insensitive" };
  }

  if (specialty) {
    where.specialty = { contains: specialty, mode: "insensitive" };
  }

  const recommendations = (await prisma.personalRecommendation.findMany({
    where,
    include: recommendationInclude,
    orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
    take: limit,
    skip: offset,
  })) as RecommendationWithProfessional[];

  return recommendations.map((rec) => ({
    id: rec.id,
    category: rec.category,
    specialty: rec.specialty,
    note: rec.note,
    isFavorite: rec.isFavorite,
    visibility: rec.visibility,
    selectedTags: rec.selectedTags,
    wouldUseAgain: rec.wouldUseAgain,
    createdAt: rec.createdAt,
    professional: {
      id: rec.professionalProfile.id,
      accountId: rec.professionalProfile.accountId,
      name:
        [
          rec.professionalProfile.account.firstName,
          rec.professionalProfile.account.lastName,
        ]
          .filter(Boolean)
          .join(" ") || rec.professionalProfile.account.email,
      profession: rec.professionalProfile.profession,
      specializations: rec.professionalProfile.specializations,
      rating: rec.professionalProfile.rating,
      profilePhotoUrl: rec.professionalProfile.account.profilePhotoUrl,
    },
  }));
}

export async function getRecommendationsByFriends(
  userId: string,
  professionalIds: string[]
): Promise<Map<string, { friendCount: number; friends: Array<{ id: string; name: string }> }>> {
  const friendIds = await prisma.friendship.findMany({
    where: { userId },
    select: { friendId: true },
  });

  const friendIdList = friendIds.map((f) => f.friendId);

  if (friendIdList.length === 0 || professionalIds.length === 0) {
    return new Map();
  }

  const professionals = await prisma.professionalProfile.findMany({
    where: { accountId: { in: professionalIds } },
    select: { id: true, accountId: true },
  });

  const professionalProfileIds = professionals.map((p) => p.id);
  const accountIdToProfileId = new Map(professionals.map((p) => [p.accountId, p.id]));

  const recommendations = await prisma.personalRecommendation.findMany({
    where: {
      consumerId: { in: friendIdList },
      professionalProfileId: { in: professionalProfileIds },
      visibility: { in: ["PUBLIC", "FRIENDS_ONLY"] },
    },
    include: {
      consumer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const resultMap = new Map<string, { friendCount: number; friends: Array<{ id: string; name: string }> }>();

  recommendations.forEach((rec) => {
    const professionalAccountId = professionals.find(
      (p) => p.id === rec.professionalProfileId
    )?.accountId;

    if (!professionalAccountId) return;

    const existing = resultMap.get(professionalAccountId) || {
      friendCount: 0,
      friends: [],
    };

    const friendName =
      [rec.consumer.firstName, rec.consumer.lastName].filter(Boolean).join(" ") || "Friend";

    existing.friendCount++;
    existing.friends.push({ id: rec.consumer.id, name: friendName });

    resultMap.set(professionalAccountId, existing);
  });

  return resultMap;
}

export async function getFavoritesByFriends(
  userId: string,
  professionalIds: string[]
): Promise<Map<string, { friendCount: number; friends: Array<{ id: string; name: string }> }>> {
  const friendIds = await prisma.friendship.findMany({
    where: { userId },
    select: { friendId: true },
  });

  const friendIdList = friendIds.map((f) => f.friendId);

  if (friendIdList.length === 0 || professionalIds.length === 0) {
    return new Map();
  }

  const professionals = await prisma.professionalProfile.findMany({
    where: { accountId: { in: professionalIds } },
    select: { id: true, accountId: true },
  });

  const professionalProfileIds = professionals.map((p) => p.id);

  const favorites = await prisma.favoriteProfessional.findMany({
    where: {
      consumerId: { in: friendIdList },
      professionalProfileId: { in: professionalProfileIds },
    },
    include: {
      consumer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const resultMap = new Map<string, { friendCount: number; friends: Array<{ id: string; name: string }> }>();

  favorites.forEach((fav) => {
    const professionalAccountId = professionals.find(
      (p) => p.id === fav.professionalProfileId
    )?.accountId;

    if (!professionalAccountId) return;

    const existing = resultMap.get(professionalAccountId) || {
      friendCount: 0,
      friends: [],
    };

    const friendName =
      [fav.consumer.firstName, fav.consumer.lastName].filter(Boolean).join(" ") || "Friend";

    existing.friendCount++;
    existing.friends.push({ id: fav.consumer.id, name: friendName });

    resultMap.set(professionalAccountId, existing);
  });

  return resultMap;
}
