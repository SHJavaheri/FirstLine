import { NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/auth/current-user";
import { prisma } from "@/database/prisma";

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "PROFESSIONAL") {
      return NextResponse.json({ error: "Only professionals can update professional profiles" }, { status: 403 });
    }

    const body = await request.json();
    const {
      bio,
      professionalBio,
      hourlyRate,
      minRate,
      maxRate,
      pricingModel,
      pricingDetails,
      acceptsNewClients,
      offersInPerson,
      offersRemote,
    } = body;

    // Update bio in Account table if provided
    if (bio !== undefined) {
      await prisma.account.update({
        where: { id: user.id },
        data: { bio },
      });
    }

    // Update professional profile fields
    const updatedProfile = await prisma.professionalProfile.update({
      where: { accountId: user.id },
      data: {
        professionalBio: professionalBio !== undefined ? professionalBio : undefined,
        hourlyRate: hourlyRate !== undefined ? hourlyRate : undefined,
        minRate: minRate !== undefined ? minRate : undefined,
        maxRate: maxRate !== undefined ? maxRate : undefined,
        pricingModel: pricingModel !== undefined ? pricingModel : undefined,
        pricingDetails: pricingDetails !== undefined ? pricingDetails : undefined,
        acceptsNewClients: acceptsNewClients !== undefined ? acceptsNewClients : undefined,
        offersInPerson: offersInPerson !== undefined ? offersInPerson : undefined,
        offersRemote: offersRemote !== undefined ? offersRemote : undefined,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Error updating professional profile:", error);
    return NextResponse.json({ error: "Failed to update professional profile" }, { status: 500 });
  }
}
