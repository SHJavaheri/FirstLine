import { NextResponse } from "next/server";

import { getLawyerProfile } from "@/backend/services/lawyer-service";

export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;
    const lawyer = await getLawyerProfile(id);

    if (!lawyer) {
      return NextResponse.json({ error: "Lawyer not found." }, { status: 404 });
    }

    return NextResponse.json({ lawyer });
  } catch {
    return NextResponse.json({ error: "Failed to fetch lawyer." }, { status: 500 });
  }
}
