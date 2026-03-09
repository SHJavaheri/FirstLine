import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/database/prisma";

export type ConsumerSearchFilters = {
  query?: string;
  limit?: number;
  offset?: number;
};

const connectionAccountSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  profilePhotoUrl: true,
  bio: true,
  locationCity: true,
  locationState: true,
  jobTitle: true,
  createdAt: true,
} as const;

type ConnectionAccount = Prisma.AccountGetPayload<{ select: typeof connectionAccountSelect }>;

export async function searchConsumers(
  currentUserId: string,
  filters: ConsumerSearchFilters
) {
  const { query, limit = 50, offset = 0 } = filters;

  const where: Record<string, unknown> = {
    role: { in: ["CONSUMER", "PROFESSIONAL"] },
    isSuspended: false,
    id: { not: currentUserId },
  };

  if (query) {
    where.OR = [
      { firstName: { contains: query, mode: "insensitive" } },
      { lastName: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { jobTitle: { contains: query, mode: "insensitive" } },
    ];
  }

  const consumers = await prisma.account.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      profilePhotoUrl: true,
      bio: true,
      locationCity: true,
      locationState: true,
      jobTitle: true,
      profileVisibility: true,
      createdAt: true,
      professional: {
        select: {
          profession: true,
        },
      },
      _count: {
        select: {
          friendships: true,
          friendOf: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  const friendships = await prisma.friendship.findMany({
    where: {
      userId: currentUserId,
      friendId: { in: consumers.map((c) => c.id) },
    },
    select: { friendId: true },
  });

  const friendIds = new Set(friendships.map((f) => f.friendId));

  const pendingRequests = await prisma.friendRequest.findMany({
    where: {
      OR: [
        { senderId: currentUserId, receiverId: { in: consumers.map((c) => c.id) }, status: "PENDING" },
        { receiverId: currentUserId, senderId: { in: consumers.map((c) => c.id) }, status: "PENDING" },
      ],
    },
    select: { senderId: true, receiverId: true },
  });

  const requestMap = new Map<string, "sent" | "received">();
  pendingRequests.forEach((req) => {
    if (req.senderId === currentUserId) {
      requestMap.set(req.receiverId, "sent");
    } else {
      requestMap.set(req.senderId, "received");
    }
  });

  return consumers.map((consumer) => ({
    id: consumer.id,
    firstName: consumer.firstName,
    lastName: consumer.lastName,
    email: consumer.email,
    role: consumer.role,
    profilePhotoUrl: consumer.profilePhotoUrl,
    bio: consumer.bio,
    locationCity: consumer.locationCity,
    locationState: consumer.locationState,
    jobTitle: consumer.jobTitle,
    profileVisibility: consumer.profileVisibility,
    createdAt: consumer.createdAt,
    followingCount: consumer._count.friendships,
    followersCount: consumer._count.friendOf,
    isFriend: friendIds.has(consumer.id),
    pendingRequest: requestMap.get(consumer.id) || null,
    profession: consumer.professional?.profession || null,
  }));
}

export async function getConsumerConnections(
  viewerId: string,
  profileId: string,
  type: "following" | "followers",
  options?: { search?: string; limit?: number; offset?: number }
): Promise<ConnectionAccount[]> {
  const profile = await getConsumerProfile(viewerId, profileId);

  if (!profile.canViewDetails) {
    throw new Error("Not authorized to view this profile's connections");
  }

  const { search, limit = 50, offset = 0 } = options || {};

  const searchFilter: Prisma.AccountWhereInput | undefined = search
    ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : undefined;

  if (type === "following") {
    const friendships = await prisma.friendship.findMany({
      where: {
        userId: profileId,
        ...(searchFilter && { friend: searchFilter }),
      },
      include: {
        friend: {
          select: connectionAccountSelect,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return friendships.map((friendship) => friendship.friend);
  }

  const friendships = await prisma.friendship.findMany({
    where: {
      friendId: profileId,
      ...(searchFilter && { user: searchFilter }),
    },
    include: {
      user: {
        select: connectionAccountSelect,
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  return friendships.map((friendship) => friendship.user);
}

export async function getConsumerProfile(viewerId: string, profileId: string) {
  const consumer = await prisma.account.findUnique({
    where: { id: profileId, role: "CONSUMER" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profilePhotoUrl: true,
      bio: true,
      locationCity: true,
      locationState: true,
      jobTitle: true,
      profileVisibility: true,
      createdAt: true,
      _count: {
        select: {
          friendships: true,
          friendOf: true,
          ratings: true,
        },
      },
    },
  });

  if (!consumer) {
    throw new Error("Consumer not found");
  }

  const friendship = await prisma.friendship.findFirst({
    where: { userId: viewerId, friendId: profileId },
  });

  const isFriend = !!friendship;
  const isSelf = viewerId === profileId;

  const canViewDetails =
    isSelf ||
    consumer.profileVisibility === "PUBLIC" ||
    (consumer.profileVisibility === "FRIENDS_ONLY" && isFriend);

  if (!canViewDetails) {
    return {
      id: consumer.id,
      firstName: consumer.firstName,
      lastName: consumer.lastName,
      profilePhotoUrl: consumer.profilePhotoUrl,
      profileVisibility: consumer.profileVisibility,
      isFriend,
      isSelf,
      canViewDetails: false,
    };
  }

  const pendingRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: viewerId, receiverId: profileId, status: "PENDING" },
        { senderId: profileId, receiverId: viewerId, status: "PENDING" },
      ],
    },
    select: { senderId: true },
  });

  const pendingRequestDirection: "sent" | "received" | null = pendingRequest
    ? pendingRequest.senderId === viewerId
      ? "sent"
      : "received"
    : null;

  return {
    id: consumer.id,
    firstName: consumer.firstName,
    lastName: consumer.lastName,
    email: consumer.email,
    profilePhotoUrl: consumer.profilePhotoUrl,
    bio: consumer.bio,
    locationCity: consumer.locationCity,
    locationState: consumer.locationState,
    jobTitle: consumer.jobTitle,
    profileVisibility: consumer.profileVisibility,
    createdAt: consumer.createdAt,
    followingCount: consumer._count.friendships,
    followersCount: consumer._count.friendOf,
    ratingsCount: consumer._count.ratings,
    isFriend,
    isSelf,
    canViewDetails: true,
    pendingRequest: pendingRequestDirection,
  };
}

export async function getConsumerRatings(
  viewerId: string,
  consumerId: string,
  filters?: { profession?: string; specialty?: string; limit?: number; offset?: number }
) {
  const profile = await getConsumerProfile(viewerId, consumerId);

  if (!profile.canViewDetails) {
    throw new Error("Not authorized to view this profile");
  }

  const { profession, specialty, limit = 50, offset = 0 } = filters || {};

  const where: Record<string, unknown> = { consumerId };

  if (profession || specialty) {
    where.professionalProfile = {};
    if (profession) {
      (where.professionalProfile as Record<string, unknown>).profession = {
        contains: profession,
        mode: "insensitive",
      };
    }
    if (specialty) {
      (where.professionalProfile as Record<string, unknown>).specializations = {
        has: specialty,
      };
    }
  }

  const ratings = await prisma.rating.findMany({
    where,
    include: {
      professionalProfile: {
        select: {
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
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  return ratings.map((rating) => ({
    id: rating.id,
    rating: rating.rating,
    comment: rating.comment,
    createdAt: rating.createdAt,
    professional: {
      id: rating.professionalProfile.id,
      accountId: rating.professionalProfile.accountId,
      name:
        [
          rating.professionalProfile.account.firstName,
          rating.professionalProfile.account.lastName,
        ]
          .filter(Boolean)
          .join(" ") || rating.professionalProfile.account.email,
      profession: rating.professionalProfile.profession,
      specializations: rating.professionalProfile.specializations,
      rating: rating.professionalProfile.rating,
      profilePhotoUrl: rating.professionalProfile.account.profilePhotoUrl,
    },
  }));
}

export async function getFriendStats(userId: string) {
  const [followingCount, followersCount, mutualCount] = await Promise.all([
    prisma.friendship.count({ where: { userId } }),
    prisma.friendship.count({ where: { friendId: userId } }),
    prisma.friendship.count({
      where: {
        userId,
        friend: {
          friendships: {
            some: { friendId: userId },
          },
        },
      },
    }),
  ]);

  return {
    followingCount,
    followersCount,
    mutualCount,
  };
}
