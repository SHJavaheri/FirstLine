import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { getConsumerProfile } from "@/backend/repositories/consumer-repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { accountId } = await params;
    const profile = await getConsumerProfile(user.id, accountId);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching consumer profile:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch profile";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
