import {
  createAccount,
  createProfessionalProfile,
  findAccountByEmail,
  type CreateAccountInput,
} from "@/backend/repositories/user-repository";
import { hashPassword, verifyPassword } from "@/backend/auth/password";
import type { RegisterInput, LoginInput } from "@/backend/validators/auth";

export class AuthServiceError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function registerUser(input: RegisterInput) {
  const existingAccount = await findAccountByEmail(input.email);
  if (existingAccount) {
    throw new AuthServiceError("Email is already registered.", 409);
  }

  const passwordHash = await hashPassword(input.password);
  const payload: CreateAccountInput = {
    email: input.email,
    passwordHash,
    role: input.role,
    firstName: input.firstName,
    lastName: input.lastName,
    jobTitle: input.jobTitle,
    bio: input.bio,
    locationCity: input.locationCity,
    locationState: input.locationState,
    phone: input.phone,
    profilePhotoUrl: input.profilePhotoUrl,
  };

  const account = await createAccount(payload);

  if (input.role === "PROFESSIONAL") {
    const profileSummary = [
      input.professional.professionalBio,
      input.professional.education ? `Education: ${input.professional.education}` : undefined,
      input.professional.certifications ? `Certifications: ${input.professional.certifications}` : undefined,
    ]
      .filter(Boolean)
      .join("\n\n");

    await createProfessionalProfile({
      accountId: account.id,
      profession: input.professional.profession,
      specializations: input.professional.specializations,
      location: [input.locationCity, input.locationState].filter(Boolean).join(", ") || undefined,
      firmName: input.professional.affiliationType === "FIRM" ? input.professional.firmName : undefined,
      firmAddress: input.professional.firmAddress,
      firmWebsite: input.professional.firmWebsite,
      yearsAtCurrentFirm: input.professional.yearsAtCurrentFirm,
      totalExperienceYears: input.professional.totalExperienceYears,
      licenseNumber: input.professional.licenseNumber,
      licensingBody: input.professional.licensingBody,
      licenseJurisdiction: input.professional.licenseJurisdiction,
      pricingModel: input.professional.pricingModel,
      pricingDetails: input.professional.pricingDetails,
      hourlyRate: input.professional.hourlyRate,
      yearsExperience: input.professional.totalExperienceYears,
      description: profileSummary || input.bio,
      minRate: input.professional.minRate,
      maxRate: input.professional.maxRate,
      acceptsNewClients: input.professional.acceptsNewClients,
      offersInPerson: input.professional.offersInPerson,
      offersRemote: input.professional.offersRemote,
    });
  }

  return account;
}

export async function loginUser(input: LoginInput) {
  const account = await findAccountByEmail(input.email);
  if (!account) {
    throw new AuthServiceError("Invalid email or password.", 401);
  }

  const { passwordHash, ...publicAccount } = account;
  const validPassword = await verifyPassword(input.password, passwordHash);
  if (!validPassword) {
    throw new AuthServiceError("Invalid email or password.", 401);
  }

  return publicAccount;
}
