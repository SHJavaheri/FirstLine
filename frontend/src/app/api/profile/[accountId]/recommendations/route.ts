import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { getRecommendations } from "@/backend/repositories/recommendation-repository";

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
    const category = searchParams.get("category") || undefined;
    const specialty = searchParams.get("specialty") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const recommendations = await getRecommendations(user.id, accountId, {
      category,
      specialty,
      limit,
      offset,
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
