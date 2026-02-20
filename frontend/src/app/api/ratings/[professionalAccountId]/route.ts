import { NextResponse } from "next/server";

import { getProfessionalRatings } from "@/backend/repositories/rating-repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ professionalAccountId: string }> }
) {
  try {
    const { professionalAccountId } = await params;

    const ratings = await getProfessionalRatings(professionalAccountId);
    return NextResponse.json({ ratings });
  } catch (error) {
    console.error("Error fetching professional ratings:", error);
    return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 });
  }
}
