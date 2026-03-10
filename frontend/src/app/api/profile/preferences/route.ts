import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/auth/current-user";
import { getConsumerPreferences, updateAllPreferences } from "@/backend/repositories/preferences-repository";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await getConsumerPreferences(user.id);
    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      serviceInterests,
      consultationPreference,
      budgetMin,
      budgetMax,
      distancePreference,
      notificationPreferences,
    } = body;

    await updateAllPreferences(user.id, {
      serviceInterests,
      consultationPreference,
      budgetMin,
      budgetMax,
      distancePreference,
      notificationPreferences,
    });

    const updatedPreferences = await getConsumerPreferences(user.id);
    return NextResponse.json({ preferences: updatedPreferences });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
