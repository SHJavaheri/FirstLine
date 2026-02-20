import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { prisma } from "@/database/prisma";

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, jobTitle, bio, locationCity, locationState, phone } = body;

    const updatedUser = await prisma.account.update({
      where: { id: user.id },
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        jobTitle: jobTitle || null,
        bio: bio || null,
        locationCity: locationCity || null,
        locationState: locationState || null,
        phone: phone || null,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
