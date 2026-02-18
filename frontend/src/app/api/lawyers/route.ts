import { NextResponse } from "next/server";

import { searchLawyers } from "@/backend/services/lawyer-service";
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

    const lawyers = await searchLawyers(parsed);
    return NextResponse.json({ lawyers });
  } catch {
    return NextResponse.json({ error: "Failed to fetch lawyers." }, { status: 500 });
  }
}
