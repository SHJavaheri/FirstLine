import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { searchLawyers, searchLawyersWithTrust } from "@/backend/services/lawyer-service";
import { lawyerSearchSchema } from "@/backend/validators/lawyer-search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = lawyerSearchSchema.parse({
      q: searchParams.get("q") ?? undefined,
      specialization: searchParams.get("specialization") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      minRate: searchParams.get("minRate") ?? undefined,
      maxRate: searchParams.get("maxRate") ?? undefined,
      minRating: searchParams.get("minRating") ?? undefined,
    });

    const sortBy = searchParams.get("sortBy") as "rating" | "friendTrust" | "price" || "rating";
    const includeTrust = searchParams.get("includeTrust") === "true";

    const user = await getCurrentUser();
    const userId = user?.role === "CONSUMER" ? user.id : undefined;

    if (includeTrust && userId) {
      const lawyers = await searchLawyersWithTrust(parsed, userId, sortBy);
      return NextResponse.json({ lawyers });
    }

    const lawyers = await searchLawyers(parsed);
    return NextResponse.json({ lawyers });
  } catch {
    return NextResponse.json({ error: "Failed to fetch lawyers." }, { status: 500 });
  }
}
