import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { createRecommendation } from "@/backend/repositories/recommendation-repository";
import { createNotification } from "@/backend/repositories/notification-repository";
import { prisma } from "@/database/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Only consumers can create recommendations" }, { status: 403 });
    }

    const body = await request.json();
    const { professionalAccountId, category, specialty, note, isFavorite, visibility, selectedTags, wouldUseAgain } = body;

    if (!professionalAccountId || !category) {
      return NextResponse.json({ error: "Professional ID and category are required" }, { status: 400 });
    }

    if (selectedTags && (!Array.isArray(selectedTags) || selectedTags.length < 1 || selectedTags.length > 3)) {
      return NextResponse.json({ error: "Please select 1-3 tags" }, { status: 400 });
    }

    const recommendation = await createRecommendation({
      consumerId: user.id,
      professionalAccountId,
      category,
      specialty,
      note,
      isFavorite,
      visibility,
      selectedTags,
      wouldUseAgain,
    });

    // Create notification for the professional
    try {
      await createNotification(
        professionalAccountId,
        "RECOMMENDATION_RECEIVED",
        recommendation.id,
        user.id,
        `${user.firstName || user.email} recommended you for ${category}`
      );
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
      // Don't fail the recommendation if notification fails
    }

    return NextResponse.json({ success: true, recommendation });
  } catch (error) {
    console.error("Error creating recommendation:", error);
    const message = error instanceof Error ? error.message : "Failed to create recommendation";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
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
      return NextResponse.json({ error: "Professional not found" }, { status: 404 });
    }

    await prisma.personalRecommendation.deleteMany({
      where: {
        consumerId: user.id,
        professionalProfileId: professionalProfile.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recommendation:", error);
    return NextResponse.json({ error: "Failed to delete recommendation" }, { status: 500 });
  }
}
