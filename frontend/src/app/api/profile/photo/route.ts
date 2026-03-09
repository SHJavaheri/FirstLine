import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/current-user";
import { prisma } from "@/database/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { photoUrl } = body;

    if (!photoUrl || typeof photoUrl !== "string") {
      return NextResponse.json({ error: "Photo URL is required" }, { status: 400 });
    }

    const updatedAccount = await prisma.account.update({
      where: { id: user.id },
      data: { profilePhotoUrl: photoUrl },
    });

    return NextResponse.json({ success: true, profilePhotoUrl: updatedAccount.profilePhotoUrl });
  } catch (error) {
    console.error("Error updating profile photo:", error);
    return NextResponse.json({ error: "Failed to update profile photo" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.account.update({
      where: { id: user.id },
      data: { profilePhotoUrl: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing profile photo:", error);
    return NextResponse.json({ error: "Failed to remove profile photo" }, { status: 500 });
  }
}
