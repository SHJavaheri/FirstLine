import {
  getProfessionalProfileById,
  listProfessionalProfiles,
  listSpecializations,
} from "@/backend/repositories/lawyer-repository";
import type { LawyerSearchFilters, LawyerListItem } from "@/types";

export async function searchLawyers(filters: LawyerSearchFilters) {
  const profiles = await listProfessionalProfiles(filters);
  return profiles.map(mapProfessionalProfile);
}

export async function getLawyerProfile(id: string) {
  const profile = await getProfessionalProfileById(id);
  return profile ? mapProfessionalProfile(profile) : null;
}

export async function getAllSpecializations() {
  return listSpecializations();
}

function mapProfessionalProfile(
  profile: NonNullable<Awaited<ReturnType<typeof getProfessionalProfileById>>>
): LawyerListItem {
  const nameParts = [profile.account.firstName, profile.account.lastName].filter(Boolean);
  const name = nameParts.length > 0 ? nameParts.join(" ") : profile.account.email;
  const specialization = profile.specializations[0] ?? "";
  const location = profile.location ??
    [profile.account.locationCity, profile.account.locationState]
      .filter(Boolean)
      .join(", ");

  return {
    id: profile.id,
    accountId: profile.account.id,
    name,
    profession: profile.profession,
    specialization,
    specializations: profile.specializations,
    hourlyRate: profile.hourlyRate ?? null,
    minRate: profile.minRate ?? null,
    maxRate: profile.maxRate ?? null,
    pricingModel: profile.pricingModel ?? null,
    location,
    rating: profile.rating,
    yearsExperience: profile.yearsExperience ?? profile.totalExperienceYears ?? null,
    description: profile.description ?? profile.account.bio ?? null,
    verified: profile.verified,
    acceptsNewClients: profile.acceptsNewClients,
    email: profile.account.email,
    phone: profile.account.phone,
  };
}
