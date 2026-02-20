import "server-only";

import { prisma } from "@/database/prisma";

async function getProfessionalProfileId(professionalAccountId: string) {
  const profile = await prisma.professionalProfile.findUnique({
    where: { accountId: professionalAccountId },
    select: { id: true },
  });

  return profile?.id ?? null;
}

export async function addOrUpdateRating(
  consumerAccountId: string,
  professionalAccountId: string,
  rating: number,
  comment?: string
) {
  const professionalProfileId = await getProfessionalProfileId(professionalAccountId);
  if (!professionalProfileId) {
    throw new Error("Professional profile not found");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const result = await prisma.rating.upsert({
    where: {
      consumerId_professionalProfileId: {
        consumerId: consumerAccountId,
        professionalProfileId,
      },
    },
    update: {
      rating,
      comment: comment || null,
    },
    create: {
      consumerId: consumerAccountId,
      professionalProfileId,
      rating,
      comment: comment || null,
    },
  });

  await updateProfessionalAverageRating(professionalProfileId);

  return result;
}

export async function deleteRating(consumerAccountId: string, professionalAccountId: string) {
  const professionalProfileId = await getProfessionalProfileId(professionalAccountId);
  if (!professionalProfileId) {
    return { count: 0 };
  }

  const result = await prisma.rating.deleteMany({
    where: {
      consumerId: consumerAccountId,
      professionalProfileId,
    },
  });

  await updateProfessionalAverageRating(professionalProfileId);

  return result;
}

export async function getRating(consumerAccountId: string, professionalAccountId: string) {
  const professionalProfileId = await getProfessionalProfileId(professionalAccountId);
  if (!professionalProfileId) {
    return null;
  }

  return prisma.rating.findFirst({
    where: {
      consumerId: consumerAccountId,
      professionalProfileId,
    },
  });
}

export async function getProfessionalRatings(professionalAccountId: string) {
  const professionalProfileId = await getProfessionalProfileId(professionalAccountId);
  if (!professionalProfileId) {
    return [];
  }

  return prisma.rating.findMany({
    where: {
      professionalProfileId,
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
      createdAt: "desc",
    },
  });
}

async function updateProfessionalAverageRating(professionalProfileId: string) {
  const ratings = await prisma.rating.findMany({
    where: { professionalProfileId },
    select: { rating: true },
  });

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  await prisma.professionalProfile.update({
    where: { id: professionalProfileId },
    data: { rating: averageRating },
  });
}
