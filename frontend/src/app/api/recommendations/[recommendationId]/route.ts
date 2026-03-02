import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import {
  updateRecommendation,
  deleteRecommendation,
} from "@/backend/repositories/recommendation-repository";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ recommendationId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Only consumers can update recommendations" }, { status: 403 });
    }

    const { recommendationId } = await params;
    const body = await request.json();
    const { category, specialty, note, isFavorite, visibility } = body;

    const recommendation = await updateRecommendation(recommendationId, user.id, {
      category,
      specialty,
      note,
      isFavorite,
      visibility,
    });

    return NextResponse.json({ success: true, recommendation });
  } catch (error) {
    console.error("Error updating recommendation:", error);
    const message = error instanceof Error ? error.message : "Failed to update recommendation";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ recommendationId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Only consumers can delete recommendations" }, { status: 403 });
    }

    const { recommendationId } = await params;
    await deleteRecommendation(recommendationId, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recommendation:", error);
    const message = error instanceof Error ? error.message : "Failed to delete recommendation";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
