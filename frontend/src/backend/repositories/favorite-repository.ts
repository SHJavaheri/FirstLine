import "server-only";

import { prisma } from "@/database/prisma";

async function getProfessionalProfileId(professionalAccountId: string) {
  const profile = await prisma.professionalProfile.findUnique({
    where: { accountId: professionalAccountId },
    select: { id: true },
  });

  return profile?.id ?? null;
}

export async function addFavorite(consumerAccountId: string, professionalAccountId: string) {
  const professionalProfileId = await getProfessionalProfileId(professionalAccountId);
  if (!professionalProfileId) {
    throw new Error("Professional profile not found");
  }

  return prisma.favoriteProfessional.upsert({
    where: {
      consumerId_professionalProfileId: {
        consumerId: consumerAccountId,
        professionalProfileId,
      },
    },
    update: {},
    create: {
      consumerId: consumerAccountId,
      professionalProfileId,
    },
  });
}

export async function removeFavorite(consumerAccountId: string, professionalAccountId: string) {
  const professionalProfileId = await getProfessionalProfileId(professionalAccountId);
  if (!professionalProfileId) {
    return { count: 0 };
  }

  return prisma.favoriteProfessional.deleteMany({
    where: {
      consumerId: consumerAccountId,
      professionalProfileId,
    },
  });
}

export async function getFavorites(consumerAccountId: string) {
  return prisma.favoriteProfessional.findMany({
    where: {
      consumerId: consumerAccountId,
    },
    include: {
      professionalProfile: {
        include: {
          account: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function isFavorite(consumerAccountId: string, professionalAccountId: string) {
  const professionalProfileId = await getProfessionalProfileId(professionalAccountId);
  if (!professionalProfileId) {
    return false;
  }

  const favorite = await prisma.favoriteProfessional.findFirst({
    where: {
      consumerId: consumerAccountId,
      professionalProfileId,
    },
  });
  return !!favorite;
}
