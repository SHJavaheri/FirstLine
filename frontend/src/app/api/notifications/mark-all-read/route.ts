import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { markAllAsRead } from "@/backend/repositories/notification-repository";

export async function PATCH() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await markAllAsRead(user.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json({ error: "Failed to mark all notifications as read" }, { status: 500 });
  }
}
