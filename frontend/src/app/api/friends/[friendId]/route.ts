import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { getFriendById, removeFriend } from "@/backend/repositories/friend-repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ friendId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { friendId } = await params;
    const friend = await getFriendById(user.id, friendId);
    return NextResponse.json({ friend });
  } catch (error) {
    console.error("Error fetching friend:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch friend";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ friendId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { friendId } = await params;
    await removeFriend(user.id, friendId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing friend:", error);
    return NextResponse.json({ error: "Failed to remove friend" }, { status: 500 });
  }
}
