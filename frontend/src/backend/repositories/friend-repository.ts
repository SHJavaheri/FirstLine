import "server-only";

import { prisma } from "@/database/prisma";

const RATE_LIMIT_WINDOW_HOURS = 24;
const MAX_REQUESTS_PER_WINDOW = 50;

// Friend Request Management

export async function sendFriendRequest(senderId: string, receiverId: string) {
  // Validation checks
  if (senderId === receiverId) {
    throw new Error("Cannot send friend request to yourself");
  }

  // Check both users are consumers
  const [sender, receiver] = await Promise.all([
    prisma.account.findUnique({ where: { id: senderId }, select: { role: true, isSuspended: true } }),
    prisma.account.findUnique({ where: { id: receiverId }, select: { role: true, isSuspended: true, allowFriendRequests: true } }),
  ]);

  if (!sender || !receiver) {
    throw new Error("User not found");
  }

  if (sender.role !== "CONSUMER" || receiver.role !== "CONSUMER") {
    throw new Error("Only consumers can send/receive friend requests");
  }

  if (sender.isSuspended || receiver.isSuspended) {
    throw new Error("Cannot send friend requests to or from suspended accounts");
  }

  if (!receiver.allowFriendRequests) {
    throw new Error("User is not accepting friend requests");
  }

  // Check if already friends
  const existingFriendship = await prisma.friendship.findFirst({
    where: { userId: senderId, friendId: receiverId },
  });

  if (existingFriendship) {
    throw new Error("Already friends with this user");
  }

  // Check for existing request in either direction (any status)
  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });

  if (existingRequest) {
    if (existingRequest.status === "PENDING") {
      // Determine direction of pending request
      if (existingRequest.senderId === senderId) {
        throw new Error("You already sent a friend request to this user");
      } else {
        throw new Error("This user has already sent you a friend request. Check your notifications.");
      }
    } else if (existingRequest.status === "DECLINED" || existingRequest.status === "CANCELLED") {
      // Clean up the previous request so a new one can be sent immediately
      await prisma.friendRequest.delete({ where: { id: existingRequest.id } });
    } else if (existingRequest.status === "ACCEPTED") {
      // Friendship was removed without clearing the accepted request; clean it up so a new request can be created
      await prisma.friendRequest.delete({ where: { id: existingRequest.id } });
    }
  }

  // Check rate limit
  await checkAndUpdateRateLimit(senderId);

  // Create friend request
  return prisma.friendRequest.create({
    data: {
      senderId,
      receiverId,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhotoUrl: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhotoUrl: true,
          email: true,
        },
      },
    },
  });
}

async function checkAndUpdateRateLimit(accountId: string) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000);

  const rateLimit = await prisma.friendRequestRateLimit.findUnique({
    where: { accountId },
  });

  if (!rateLimit) {
    // Create new rate limit record
    await prisma.friendRequestRateLimit.create({
      data: {
        accountId,
        requestCount: 1,
        windowStart: now,
      },
    });
    return;
  }

  // Check if window has expired
  if (rateLimit.windowStart < windowStart) {
    // Reset window
    await prisma.friendRequestRateLimit.update({
      where: { accountId },
      data: {
        requestCount: 1,
        windowStart: now,
      },
    });
    return;
  }

  // Check if limit exceeded
  if (rateLimit.requestCount >= MAX_REQUESTS_PER_WINDOW) {
    throw new Error(`Rate limit exceeded. Maximum ${MAX_REQUESTS_PER_WINDOW} friend requests per ${RATE_LIMIT_WINDOW_HOURS} hours`);
  }

  // Increment count
  await prisma.friendRequestRateLimit.update({
    where: { accountId },
    data: {
      requestCount: { increment: 1 },
    },
  });
}

export async function acceptFriendRequest(requestId: string, userId: string) {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Friend request not found");
  }

  if (request.receiverId !== userId) {
    throw new Error("Unauthorized to accept this request");
  }

  if (request.status !== "PENDING") {
    throw new Error("Friend request is not pending");
  }

  // Create bidirectional friendship and update request status in a transaction
  const result = await prisma.$transaction([
    prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    }),
    prisma.friendship.create({
      data: {
        userId: request.senderId,
        friendId: request.receiverId,
      },
    }),
    prisma.friendship.create({
      data: {
        userId: request.receiverId,
        friendId: request.senderId,
      },
    }),
  ]);

  return result[0];
}

export async function declineFriendRequest(requestId: string, userId: string) {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Friend request not found");
  }

  if (request.receiverId !== userId) {
    throw new Error("Unauthorized to decline this request");
  }

  if (request.status !== "PENDING") {
    throw new Error("Friend request is not pending");
  }

  return prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: "DECLINED" },
  });
}

export async function cancelFriendRequest(requestId: string, userId: string) {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Friend request not found");
  }

  if (request.senderId !== userId) {
    throw new Error("Unauthorized to cancel this request");
  }

  if (request.status !== "PENDING") {
    throw new Error("Friend request is not pending");
  }

  return prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: "CANCELLED" },
  });
}

export async function getFriendRequests(
  userId: string,
  type: "sent" | "received",
  status?: "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED"
) {
  const where = type === "sent"
    ? { senderId: userId, ...(status && { status }) }
    : { receiverId: userId, ...(status && { status }) };

  return prisma.friendRequest.findMany({
    where,
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhotoUrl: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhotoUrl: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// Friendship Management

export async function getFriends(userId: string, search?: string, limit = 50, offset = 0) {
  const where: Record<string, unknown> = { userId };

  if (search) {
    where.friend = {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const friendships = await prisma.friendship.findMany({
    where,
    include: {
      friend: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhotoUrl: true,
          email: true,
          bio: true,
          locationCity: true,
          locationState: true,
          jobTitle: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  return friendships.map((f) => f.friend);
}

export async function removeFriend(userId: string, friendId: string) {
  // Delete both directions of the friendship
  await prisma.$transaction([
    prisma.friendship.deleteMany({
      where: { userId, friendId },
    }),
    prisma.friendship.deleteMany({
      where: { userId: friendId, friendId: userId },
    }),
    prisma.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
    }),
  ]);

  return { success: true };
}

export async function isFriend(userId: string, friendId: string): Promise<boolean> {
  const friendship = await prisma.friendship.findFirst({
    where: { userId, friendId },
  });

  return !!friendship;
}

export async function getFriendById(userId: string, friendId: string) {
  const friendship = await prisma.friendship.findFirst({
    where: { userId, friendId },
    include: {
      friend: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhotoUrl: true,
          email: true,
          bio: true,
          locationCity: true,
          locationState: true,
          jobTitle: true,
          phone: true,
          createdAt: true,
        },
      },
    },
  });

  if (!friendship) {
    throw new Error("Not friends with this user");
  }

  return friendship.friend;
}

export async function getMutualFriends(userId: string, otherUserId: string) {
  // Get user's friends
  const userFriendships = await prisma.friendship.findMany({
    where: { userId },
    select: { friendId: true },
  });

  const userFriendIds = userFriendships.map((f) => f.friendId);

  // Get other user's friends that are also in user's friends
  const mutualFriendships = await prisma.friendship.findMany({
    where: {
      userId: otherUserId,
      friendId: { in: userFriendIds },
    },
    include: {
      friend: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePhotoUrl: true,
          email: true,
        },
      },
    },
  });

  return mutualFriendships.map((f) => f.friend);
}

export async function getFriendIds(userId: string): Promise<string[]> {
  const friendships = await prisma.friendship.findMany({
    where: { userId },
    select: { friendId: true },
  });

  return friendships.map((f) => f.friendId);
}
