export type AccountRole = "CONSUMER" | "PROFESSIONAL" | "ADMIN";

export type PublicAccount = {
  id: string;
  email: string;
  role: AccountRole;
  firstName?: string | null;
  lastName?: string | null;
  profilePhotoUrl?: string | null;
  jobTitle?: string | null;
  bio?: string | null;
  locationCity?: string | null;
  locationState?: string | null;
  phone?: string | null;
  isSuspended: boolean;
  professional?: {
    profession: string;
    specializations: string[];
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type LawyerListItem = {
  id: string;
  accountId: string;
  name: string;
  profession: string;
  specialization: string;
  specializations: string[];
  hourlyRate?: number | null;
  minRate?: number | null;
  maxRate?: number | null;
  location: string;
  rating: number;
  yearsExperience?: number | null;
  description?: string | null;
  verified: boolean;
  acceptsNewClients: boolean;
  pricingModel?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type LawyerSearchFilters = {
  q?: string;
  specialization?: string;
  location?: string;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
};
