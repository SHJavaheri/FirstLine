import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import {
  sendFriendRequest,
  getFriendRequests,
} from "@/backend/repositories/friend-repository";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      console.error("Friend request error: No authenticated user");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (user.role !== "CONSUMER") {
      console.error("Friend request error: User is not a consumer", { userId: user.id, role: user.role });
      return NextResponse.json({ error: "Only consumers can send friend requests" }, { status: 403 });
    }

    const body = await request.json();
    const { receiverId } = body;

    console.log("Friend request attempt:", { senderId: user.id, receiverId });

    if (!receiverId) {
      console.error("Friend request error: No receiver ID provided");
      return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 });
    }

    const friendRequest = await sendFriendRequest(user.id, receiverId);
    console.log("Friend request created successfully:", { requestId: friendRequest.id });
    return NextResponse.json({ success: true, friendRequest });
  } catch (error) {
    console.error("Error sending friend request:", error);
    const message = error instanceof Error ? error.message : "Failed to send friend request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "sent" | "received" || "received";
    const status = searchParams.get("status") as "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED" | undefined;

    const requests = await getFriendRequests(user.id, type, status);
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return NextResponse.json({ error: "Failed to fetch friend requests" }, { status: 500 });
  }
}
