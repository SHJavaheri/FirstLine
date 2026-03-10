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
    const { bannerUrl } = body;

    if (!bannerUrl || typeof bannerUrl !== "string") {
      return NextResponse.json({ error: "Banner URL is required" }, { status: 400 });
    }

    const updatedAccount = await prisma.account.update({
      where: { id: user.id },
      data: { bannerPhotoUrl: bannerUrl },
    });

    return NextResponse.json({ success: true, bannerPhotoUrl: updatedAccount.bannerPhotoUrl });
  } catch (error) {
    console.error("Error updating banner photo:", error);
    return NextResponse.json({ error: "Failed to update banner photo" }, { status: 500 });
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
      data: { bannerPhotoUrl: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing banner photo:", error);
    return NextResponse.json({ error: "Failed to remove banner photo" }, { status: 500 });
  }
}
