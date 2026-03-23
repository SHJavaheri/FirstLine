import "server-only";

import { prisma } from "@/database/prisma";
import type { Prisma } from "@prisma/client";

export type ActivityType = 
  | "viewed_professional"
  | "saved_professional"
  | "unsaved_professional"
  | "wrote_review"
  | "sent_message"
  | "booked_consultation"
  | "updated_preferences";

export async function logActivity(
  accountId: string,
  activityType: ActivityType,
  relatedId?: string,
  metadata?: Record<string, unknown>
) {
  return prisma.activityLog.create({
    data: {
      accountId,
      activityType,
      relatedId,
      metadata: (metadata as Prisma.InputJsonValue) ?? undefined,
    },
  });
}

export async function getActivityHistory(
  accountId: string,
  options?: { limit?: number; offset?: number; activityType?: ActivityType }
) {
  const { limit = 50, offset = 0, activityType } = options || {};

  const where: Record<string, unknown> = { accountId };
  if (activityType) {
    where.activityType = activityType;
  }

  const activities = await prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  const enrichedActivities = await Promise.all(
    activities.map(async (activity) => {
      let professionalInfo = null;

      if (
        activity.relatedId &&
        ["viewed_professional", "saved_professional", "unsaved_professional", "wrote_review"].includes(
          activity.activityType
        )
      ) {
        const professional = await prisma.professionalProfile.findUnique({
          where: { id: activity.relatedId },
          select: {
            id: true,
            accountId: true,
            profession: true,
            account: {
              select: {
                firstName: true,
                lastName: true,
                profilePhotoUrl: true,
              },
            },
          },
        });

        if (professional) {
          professionalInfo = {
            id: professional.id,
            accountId: professional.accountId,
            name:
              [professional.account.firstName, professional.account.lastName]
                .filter(Boolean)
                .join(" ") || "Professional",
            profession: professional.profession,
            profilePhotoUrl: professional.account.profilePhotoUrl,
          };
        }
      }

      return {
        id: activity.id,
        activityType: activity.activityType,
        createdAt: activity.createdAt,
        metadata: activity.metadata,
        professional: professionalInfo,
      };
    })
  );

  return enrichedActivities;
}

export async function deleteActivityLog(accountId: string, activityId: string) {
  return prisma.activityLog.deleteMany({
    where: {
      id: activityId,
      accountId,
    },
  });
}

export async function clearActivityHistory(accountId: string) {
  return prisma.activityLog.deleteMany({
    where: { accountId },
  });
}
