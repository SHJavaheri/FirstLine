import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { addOrUpdateRating, deleteRating, getRating } from "@/backend/repositories/rating-repository";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Only consumers can rate professionals" }, { status: 403 });
    }

    const body = await request.json();
    const { professionalAccountId, rating, comment } = body;

    if (!professionalAccountId) {
      return NextResponse.json({ error: "Professional account ID is required" }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const result = await addOrUpdateRating(user.id, professionalAccountId, rating, comment);
    return NextResponse.json({ success: true, rating: result });
  } catch (error) {
    console.error("Error adding/updating rating:", error);
    return NextResponse.json({ error: "Failed to add/update rating" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Only consumers can delete ratings" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const professionalAccountId = searchParams.get("professionalAccountId");

    if (!professionalAccountId) {
      return NextResponse.json({ error: "Professional account ID is required" }, { status: 400 });
    }

    await deleteRating(user.id, professionalAccountId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json({ error: "Failed to delete rating" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const professionalAccountId = searchParams.get("professionalAccountId");

    if (!professionalAccountId) {
      return NextResponse.json({ error: "Professional account ID is required" }, { status: 400 });
    }

    const rating = await getRating(user.id, professionalAccountId);
    return NextResponse.json({ rating });
  } catch (error) {
    console.error("Error fetching rating:", error);
    return NextResponse.json({ error: "Failed to fetch rating" }, { status: 500 });
  }
}
