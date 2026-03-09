import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { getFriendTrustDataForProfessional } from "@/backend/repositories/friend-trust-repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ professionalAccountId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { professionalAccountId } = await params;
    const trustData = await getFriendTrustDataForProfessional(
      user.id,
      professionalAccountId
    );
    return NextResponse.json({ trustData });
  } catch (error) {
    console.error("Error fetching friend trust data:", error);
    return NextResponse.json({ error: "Failed to fetch friend trust data" }, { status: 500 });
  }
}
