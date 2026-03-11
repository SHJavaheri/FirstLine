import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import {
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
} from "@/backend/repositories/friend-repository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (!action || !["accept", "decline", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Invalid action. Must be 'accept', 'decline', or 'cancel'" }, { status: 400 });
    }

    const { requestId } = await params;

    let result;
    if (action === "accept") {
      result = await acceptFriendRequest(requestId, user.id);
    } else if (action === "decline") {
      result = await declineFriendRequest(requestId, user.id);
    } else if (action === "cancel") {
      result = await cancelFriendRequest(requestId, user.id);
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error managing friend request:", error);
    const message = error instanceof Error ? error.message : "Failed to manage friend request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await params;
    const result = await cancelFriendRequest(requestId, user.id);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    const message = error instanceof Error ? error.message : "Failed to cancel friend request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
