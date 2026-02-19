import { prisma } from "@/database/prisma";
import type { AccountRole } from "@/types";

const ACCOUNT_SELECT = {
  id: true,
  email: true,
  role: true,
  firstName: true,
  lastName: true,
  profilePhotoUrl: true,
  jobTitle: true,
  bio: true,
  locationCity: true,
  locationState: true,
  phone: true,
  isSuspended: true,
  createdAt: true,
  updatedAt: true,
};

const ACCOUNT_SELECT_WITH_SECRET = {
  ...ACCOUNT_SELECT,
  passwordHash: true as const,
};

const PROFESSIONAL_SELECT = {
  id: true,
  profession: true,
  specializations: true,
  hourlyRate: true,
  yearsExperience: true,
  verified: true,
  rating: true,
  description: true,
  minRate: true,
  maxRate: true,
  acceptsNewClients: true,
  offersInPerson: true,
  offersRemote: true,
  pricingModel: true,
  pricingDetails: true,
  firmName: true,
  firmAddress: true,
  firmWebsite: true,
  licenseNumber: true,
  licensingBody: true,
  licenseJurisdiction: true,
  yearsAtCurrentFirm: true,
  totalExperienceYears: true,
};

export async function findAccountByEmail(email: string) {
  return prisma.account.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      ...ACCOUNT_SELECT_WITH_SECRET,
      professional: {
        select: PROFESSIONAL_SELECT,
      },
    },
  });
}

export async function findAccountById(id: string) {
  return prisma.account.findUnique({
    where: { id },
    select: {
      ...ACCOUNT_SELECT,
      professional: {
        select: PROFESSIONAL_SELECT,
      },
    },
  });
}

export type CreateAccountInput = {
  email: string;
  passwordHash: string;
  role?: AccountRole;
  firstName?: string;
  lastName?: string;
  profilePhotoUrl?: string;
  jobTitle?: string;
  bio?: string;
  locationCity?: string;
  locationState?: string;
  phone?: string;
};

export async function createAccount(data: CreateAccountInput) {
  return prisma.account.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: data.role ?? "CONSUMER",
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      profilePhotoUrl: data.profilePhotoUrl ?? null,
      jobTitle: data.jobTitle ?? null,
      bio: data.bio ?? null,
      locationCity: data.locationCity ?? null,
      locationState: data.locationState ?? null,
      phone: data.phone ?? null,
    },
    select: {
      ...ACCOUNT_SELECT,
      professional: {
        select: PROFESSIONAL_SELECT,
      },
    },
  });
}

export type CreateProfessionalProfileInput = {
  accountId: string;
  profession: string;
  specializations: string[];
  location?: string;
  firmName?: string;
  firmAddress?: string;
  firmWebsite?: string;
  yearsAtCurrentFirm?: number;
  totalExperienceYears?: number;
  licenseNumber?: string;
  licensingBody?: string;
  licenseJurisdiction?: string;
  pricingModel?: string;
  pricingDetails?: string;
  hourlyRate?: number;
  yearsExperience?: number;
  rating?: number;
  description?: string;
  minRate?: number;
  maxRate?: number;
  acceptsNewClients?: boolean;
  offersInPerson?: boolean;
  offersRemote?: boolean;
};

export async function createProfessionalProfile(data: CreateProfessionalProfileInput) {
  return prisma.professionalProfile.create({
    data: {
      accountId: data.accountId,
      profession: data.profession,
      specializations: data.specializations,
      location: data.location ?? null,
      firmName: data.firmName ?? null,
      firmAddress: data.firmAddress ?? null,
      firmWebsite: data.firmWebsite ?? null,
      yearsAtCurrentFirm: data.yearsAtCurrentFirm ?? null,
      totalExperienceYears: data.totalExperienceYears ?? null,
      licenseNumber: data.licenseNumber ?? null,
      licensingBody: data.licensingBody ?? null,
      licenseJurisdiction: data.licenseJurisdiction ?? null,
      pricingModel: data.pricingModel ?? null,
      pricingDetails: data.pricingDetails ?? null,
      hourlyRate: data.hourlyRate ?? null,
      yearsExperience: data.yearsExperience ?? null,
      rating: data.rating ?? 0,
      description: data.description ?? null,
      minRate: data.minRate ?? null,
      maxRate: data.maxRate ?? null,
      acceptsNewClients: data.acceptsNewClients ?? true,
      offersInPerson: data.offersInPerson ?? true,
      offersRemote: data.offersRemote ?? true,
    },
  });
}
