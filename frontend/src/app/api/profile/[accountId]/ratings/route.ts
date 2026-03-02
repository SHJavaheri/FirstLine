import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { getConsumerRatings } from "@/backend/repositories/consumer-repository";

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
    const { searchParams } = new URL(request.url);
    const profession = searchParams.get("profession") || undefined;
    const specialty = searchParams.get("specialty") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const ratings = await getConsumerRatings(user.id, accountId, {
      profession,
      specialty,
      limit,
      offset,
    });

    return NextResponse.json({ ratings });
  } catch (error) {
    console.error("Error fetching consumer ratings:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch ratings";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
