import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { prisma } from "@/database/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ recommendationId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "PROFESSIONAL") {
      return NextResponse.json({ error: "Only professionals can reply to recommendations" }, { status: 403 });
    }

    const { recommendationId } = await params;
    const body = await request.json();
    const { reply } = body;

    if (!reply || typeof reply !== "string" || reply.trim().length === 0) {
      return NextResponse.json({ error: "Reply text is required" }, { status: 400 });
    }

    // Get the recommendation to verify it belongs to this professional
    const recommendation = await prisma.personalRecommendation.findUnique({
      where: { id: recommendationId },
      include: {
        professionalProfile: {
          select: {
            accountId: true,
          },
        },
      },
    });

    if (!recommendation) {
      return NextResponse.json({ error: "Recommendation not found" }, { status: 404 });
    }

    if (recommendation.professionalProfile.accountId !== user.id) {
      return NextResponse.json({ error: "You can only reply to recommendations about you" }, { status: 403 });
    }

    // Update the recommendation with the professional's reply
    const updatedRecommendation = await prisma.personalRecommendation.update({
      where: { id: recommendationId },
      data: {
        professionalReply: reply.trim(),
      },
    });

    return NextResponse.json({ success: true, recommendation: updatedRecommendation });
  } catch (error) {
    console.error("Error adding reply to recommendation:", error);
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 });
  }
}
