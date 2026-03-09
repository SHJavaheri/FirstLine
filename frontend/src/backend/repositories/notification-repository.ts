import "server-only";

import { prisma } from "@/database/prisma";
import type { NotificationType } from "@prisma/client";

type NotificationWithDestination = {
  id: string;
  type: NotificationType;
  relatedId: string;
  actorId: string | null;
  message: string | null;
  isRead: boolean;
  createdAt: Date;
  destinationProfileId: string | null;
};

export async function createNotification(
  recipientId: string,
  type: NotificationType,
  relatedId: string,
  actorId?: string,
  message?: string
) {
  return prisma.notification.create({
    data: {
      recipientId,
      type,
      relatedId,
      actorId,
      message,
    },
  });
}

export async function getNotifications(userId: string, unreadOnly = false) {
  const where = unreadOnly
    ? { recipientId: userId, isRead: false }
    : { recipientId: userId };

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const ratingIds = notifications
    .filter((notification) => notification.type === "RATING_RECEIVED")
    .map((notification) => notification.relatedId);

  const recommendationIds = notifications
    .filter((notification) => notification.type === "RECOMMENDATION_RECEIVED")
    .map((notification) => notification.relatedId);

  const [ratings, recommendations] = await Promise.all([
    ratingIds.length > 0
      ? prisma.rating.findMany({
          where: { id: { in: ratingIds } },
          select: { id: true, professionalProfileId: true },
        })
      : Promise.resolve([]),
    recommendationIds.length > 0
      ? prisma.personalRecommendation.findMany({
          where: { id: { in: recommendationIds } },
          select: { id: true, professionalProfileId: true },
        })
      : Promise.resolve([]),
  ]);

  const ratingDestinationMap = new Map(ratings.map((rating) => [rating.id, rating.professionalProfileId]));
  const recommendationDestinationMap = new Map(
    recommendations.map((recommendation) => [recommendation.id, recommendation.professionalProfileId])
  );

  return notifications.map<NotificationWithDestination>((notification) => ({
    ...notification,
    destinationProfileId:
      notification.type === "RATING_RECEIVED"
        ? ratingDestinationMap.get(notification.relatedId) ?? null
        : notification.type === "RECOMMENDATION_RECEIVED"
        ? recommendationDestinationMap.get(notification.relatedId) ?? null
        : null,
  }));
}

export async function markAsRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.recipientId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { recipientId: userId, isRead: false },
    data: { isRead: true },
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { recipientId: userId, isRead: false },
  });
}
