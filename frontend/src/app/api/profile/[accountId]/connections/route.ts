import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { getConsumerConnections } from "@/backend/repositories/consumer-repository";

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
    const typeParam = searchParams.get("type") === "followers" ? "followers" : "following";
    const search = searchParams.get("search") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const connections = await getConsumerConnections(user.id, accountId, typeParam, {
      search,
      limit,
      offset,
    });

    return NextResponse.json({ connections });
  } catch (error) {
    console.error("Error fetching consumer connections:", error);
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 });
  }
}
