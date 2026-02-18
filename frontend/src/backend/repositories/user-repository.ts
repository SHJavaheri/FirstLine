import { prisma } from "@/database/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
}

export async function createUser(data: { name?: string; email: string; passwordHash: string }) {
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      name: data.name ?? null,
      passwordHash: data.passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
}
