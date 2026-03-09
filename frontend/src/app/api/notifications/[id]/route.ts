import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { markAsRead } from "@/backend/repositories/notification-repository";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const notification = await markAsRead(id, user.id);
    
    return NextResponse.json({ notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    const message = error instanceof Error ? error.message : "Failed to mark notification as read";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
