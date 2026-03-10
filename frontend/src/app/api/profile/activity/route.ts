import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/auth/current-user";
import { getActivityHistory, logActivity, type ActivityType } from "@/backend/repositories/activity-repository";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const activityType = searchParams.get("activityType") as ActivityType | undefined;

    const activities = await getActivityHistory(user.id, {
      limit,
      offset,
      activityType,
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching activity history:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity history" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { activityType, relatedId, metadata } = body;

    if (!activityType) {
      return NextResponse.json(
        { error: "Activity type is required" },
        { status: 400 }
      );
    }

    const activity = await logActivity(
      user.id,
      activityType as ActivityType,
      relatedId,
      metadata
    );

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    );
  }
}
