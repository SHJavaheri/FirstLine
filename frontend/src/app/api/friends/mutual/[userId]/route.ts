import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { getMutualFriends } from "@/backend/repositories/friend-repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;
    const mutualFriends = await getMutualFriends(user.id, userId);
    return NextResponse.json({ mutualFriends });
  } catch (error) {
    console.error("Error fetching mutual friends:", error);
    return NextResponse.json({ error: "Failed to fetch mutual friends" }, { status: 500 });
  }
}
