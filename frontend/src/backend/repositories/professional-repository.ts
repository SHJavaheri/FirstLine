import { prisma } from "@/database/prisma";

export type ProfessionalProfileView = {
  id: string;
  accountId: string;
  account: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    profilePhotoUrl: string | null;
    bannerPhotoUrl: string | null;
    bio: string | null;
    locationCity: string | null;
    locationState: string | null;
    createdAt: Date;
  };
  profession: string;
  specializations: string[];
  firmName: string | null;
  firmAddress: string | null;
  firmWebsite: string | null;
  yearsAtCurrentFirm: number | null;
  totalExperienceYears: number | null;
  licenseNumber: string | null;
  licensingBody: string | null;
  licenseJurisdiction: string | null;
  education: string | null;
  certifications: string | null;
  professionalBio: string | null;
  description: string | null;
  hourlyRate: number | null;
  minRate: number | null;
  maxRate: number | null;
  pricingModel: string | null;
  pricingDetails: string | null;
  acceptsNewClients: boolean;
  offersInPerson: boolean;
  offersRemote: boolean;
  verified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
};

export async function getProfessionalProfileByAccountId(
  accountId: string
): Promise<ProfessionalProfileView | null> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { accountId },
    include: {
      account: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          profilePhotoUrl: true,
          bannerPhotoUrl: true,
          bio: true,
          locationCity: true,
          locationState: true,
          createdAt: true,
        },
      },
      ratings: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!profile) return null;

  return {
    id: profile.id,
    accountId: profile.accountId,
    account: profile.account,
    profession: profile.profession,
    specializations: profile.specializations,
    firmName: profile.firmName,
    firmAddress: profile.firmAddress,
    firmWebsite: profile.firmWebsite,
    yearsAtCurrentFirm: profile.yearsAtCurrentFirm,
    totalExperienceYears: profile.totalExperienceYears,
    licenseNumber: profile.licenseNumber,
    licensingBody: profile.licensingBody,
    licenseJurisdiction: profile.licenseJurisdiction,
    education: profile.education,
    certifications: profile.certifications,
    professionalBio: profile.professionalBio,
    description: profile.description,
    hourlyRate: profile.hourlyRate,
    minRate: profile.minRate,
    maxRate: profile.maxRate,
    pricingModel: profile.pricingModel,
    pricingDetails: profile.pricingDetails,
    acceptsNewClients: profile.acceptsNewClients,
    offersInPerson: profile.offersInPerson,
    offersRemote: profile.offersRemote,
    verified: profile.verified,
    rating: profile.rating,
    reviewCount: profile.ratings.length,
    createdAt: profile.createdAt,
  };
}
