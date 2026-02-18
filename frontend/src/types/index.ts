export type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
};

export type LawyerListItem = {
  id: string;
  name: string;
  specialization: string;
  hourlyRate: number;
  location: string;
  rating: number;
  yearsExperience: number;
  description: string;
};

export type LawyerSearchFilters = {
  q?: string;
  specialization?: string;
  location?: string;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
};
