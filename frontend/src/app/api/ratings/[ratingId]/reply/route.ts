import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { prisma } from "@/database/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ ratingId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "PROFESSIONAL") {
      return NextResponse.json({ error: "Only professionals can reply to ratings" }, { status: 403 });
    }

    const { ratingId } = await params;
    const body = await request.json();
    const { reply } = body;

    if (!reply || typeof reply !== "string" || reply.trim().length === 0) {
      return NextResponse.json({ error: "Reply text is required" }, { status: 400 });
    }

    // Get the rating to verify it belongs to this professional
    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
      include: {
        professionalProfile: {
          select: {
            accountId: true,
          },
        },
      },
    });

    if (!rating) {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }

    if (rating.professionalProfile.accountId !== user.id) {
      return NextResponse.json({ error: "You can only reply to ratings about you" }, { status: 403 });
    }

    // Update the rating with the professional's reply
    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: {
        professionalReply: reply.trim(),
      },
    });

    return NextResponse.json({ success: true, rating: updatedRating });
  } catch (error) {
    console.error("Error adding reply to rating:", error);
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 });
  }
}
