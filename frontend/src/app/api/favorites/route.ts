import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { addFavorite, removeFavorite, getFavorites, isFavorite } from "@/backend/repositories/favorite-repository";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const professionalAccountId = searchParams.get("professionalAccountId");

    if (professionalAccountId) {
      const favorite = await isFavorite(user.id, professionalAccountId);
      return NextResponse.json({ favorite });
    }

    const favorites = await getFavorites(user.id);
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { professionalAccountId } = body;

    if (!professionalAccountId) {
      return NextResponse.json({ error: "Professional account ID is required" }, { status: 400 });
    }

    await addFavorite(user.id, professionalAccountId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
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
      return NextResponse.json({ error: "Professional account ID is required" }, { status: 400 });
    }

    await removeFavorite(user.id, professionalAccountId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
