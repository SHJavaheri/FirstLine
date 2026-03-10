import "server-only";

import { prisma } from "@/database/prisma";

export type ConsumerPreferences = {
  serviceInterests: string[];
  consultationPreference?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  distancePreference?: number | null;
  notificationPreferences?: Record<string, unknown> | null;
};

export async function getConsumerPreferences(accountId: string): Promise<ConsumerPreferences> {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: {
      serviceInterests: true,
      consultationPreference: true,
      budgetMin: true,
      budgetMax: true,
      distancePreference: true,
      notificationPreferences: true,
    },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  return {
    serviceInterests: account.serviceInterests,
    consultationPreference: account.consultationPreference,
    budgetMin: account.budgetMin,
    budgetMax: account.budgetMax,
    distancePreference: account.distancePreference,
    notificationPreferences: account.notificationPreferences as Record<string, unknown> | null,
  };
}

export async function updateServiceInterests(accountId: string, serviceInterests: string[]) {
  return prisma.account.update({
    where: { id: accountId },
    data: { serviceInterests },
  });
}

export async function updateConsultationPreference(
  accountId: string,
  consultationPreference: string
) {
  return prisma.account.update({
    where: { id: accountId },
    data: { consultationPreference },
  });
}

export async function updateBudgetRange(accountId: string, budgetMin?: number, budgetMax?: number) {
  return prisma.account.update({
    where: { id: accountId },
    data: {
      budgetMin: budgetMin ?? null,
      budgetMax: budgetMax ?? null,
    },
  });
}

export async function updateDistancePreference(accountId: string, distancePreference?: number) {
  return prisma.account.update({
    where: { id: accountId },
    data: { distancePreference: distancePreference ?? null },
  });
}

export async function updateNotificationPreferences(
  accountId: string,
  notificationPreferences: Record<string, unknown>
) {
  return prisma.account.update({
    where: { id: accountId },
    data: { notificationPreferences },
  });
}

export async function updateAllPreferences(
  accountId: string,
  preferences: Partial<ConsumerPreferences>
) {
  const updateData: Record<string, unknown> = {};

  if (preferences.serviceInterests !== undefined) {
    updateData.serviceInterests = preferences.serviceInterests;
  }
  if (preferences.consultationPreference !== undefined) {
    updateData.consultationPreference = preferences.consultationPreference;
  }
  if (preferences.budgetMin !== undefined) {
    updateData.budgetMin = preferences.budgetMin;
  }
  if (preferences.budgetMax !== undefined) {
    updateData.budgetMax = preferences.budgetMax;
  }
  if (preferences.distancePreference !== undefined) {
    updateData.distancePreference = preferences.distancePreference;
  }
  if (preferences.notificationPreferences !== undefined) {
    updateData.notificationPreferences = preferences.notificationPreferences;
  }

  return prisma.account.update({
    where: { id: accountId },
    data: updateData,
  });
}
