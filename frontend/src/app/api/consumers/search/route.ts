import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { searchConsumers } from "@/backend/repositories/consumer-repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const consumers = await searchConsumers(user.id, {
      query,
      limit,
      offset,
    });

    return NextResponse.json({ consumers });
  } catch (error) {
    console.error("Error searching consumers:", error);
    return NextResponse.json({ error: "Failed to search consumers" }, { status: 500 });
  }
}
