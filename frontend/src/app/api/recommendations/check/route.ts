import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { prisma } from "@/database/prisma";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const professionalAccountId = searchParams.get("professionalAccountId");

    if (!professionalAccountId) {
      return NextResponse.json({ error: "Professional ID is required" }, { status: 400 });
    }

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { accountId: professionalAccountId },
      select: { id: true },
    });

    if (!professionalProfile) {
      return NextResponse.json({ isRecommended: false });
    }

    const recommendation = await prisma.personalRecommendation.findUnique({
      where: {
        consumerId_professionalProfileId: {
          consumerId: user.id,
          professionalProfileId: professionalProfile.id,
        },
      },
    });

    return NextResponse.json({ isRecommended: !!recommendation });
  } catch (error) {
    console.error("Error checking recommendation status:", error);
    return NextResponse.json({ error: "Failed to check recommendation status" }, { status: 500 });
  }
}
