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

export type FriendRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED";

export type ProfileVisibility = "PUBLIC" | "FRIENDS_ONLY" | "PRIVATE";

export type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profilePhotoUrl: string | null;
    email: string;
    role: AccountRole;
    profession?: string | null;
  };
  receiver: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profilePhotoUrl: string | null;
    email: string;
    role: AccountRole;
    profession?: string | null;
  };
};

export type Friend = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  profilePhotoUrl: string | null;
  email: string;
  bio: string | null;
  locationCity: string | null;
  locationState: string | null;
  jobTitle: string | null;
  role: AccountRole;
  profession?: string | null;
  createdAt: Date;
};

export type FriendTrustData = {
  friendsWhoUsed: Array<{
    friendId: string;
    friendName: string;
    friendPhoto: string | null;
    rating: number;
    comment: string | null;
    ratedAt: Date;
  }>;
  averageFriendRating: number;
  friendCount: number;
  trustScore: number;
};

export type LawyerWithTrust = LawyerListItem & {
  friendTrustData: {
    friendCount: number;
    averageFriendRating: number;
    trustScore: number;
    trustedByNetwork: boolean;
  };
  recommendedByFriends?: {
    count: number;
    friends: Array<{ id: string; name: string }>;
  };
  favoritedByFriends?: {
    count: number;
    friends: Array<{ id: string; name: string }>;
  };
};

export type ConsumerSearchResult = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: AccountRole;
  profilePhotoUrl: string | null;
  bio: string | null;
  locationCity: string | null;
  locationState: string | null;
  jobTitle: string | null;
  profileVisibility: ProfileVisibility;
  createdAt: Date;
  followingCount: number;
  followersCount: number;
  isFriend: boolean;
  pendingRequest: "sent" | "received" | null;
  profession?: string | null;
};

export type ConsumerProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email?: string;
  profilePhotoUrl: string | null;
  bio?: string | null;
  locationCity?: string | null;
  locationState?: string | null;
  jobTitle?: string | null;
  profileVisibility: ProfileVisibility;
  createdAt?: Date;
  followingCount?: number;
  followersCount?: number;
  ratingsCount?: number;
  isFriend: boolean;
  isSelf: boolean;
  canViewDetails: boolean;
  pendingRequest?: "sent" | "received" | null;
};

export type PersonalRecommendation = {
  id: string;
  category: string;
  specialty: string | null;
  note: string | null;
  isFavorite: boolean;
  visibility: ProfileVisibility;
  selectedTags: string[];
  wouldUseAgain: string | null;
  professionalReply: string | null;
  createdAt: Date;
  professional: {
    id: string;
    accountId: string;
    name: string;
    profession: string;
    specializations: string[];
    rating: number;
    profilePhotoUrl: string | null;
  };
};

export type ConsumerRating = {
  id: string;
  rating: number;
  comment: string | null;
  professionalReply: string | null;
  createdAt: Date;
  professional: {
    id: string;
    accountId: string;
    name: string;
    profession: string;
    specializations: string[];
    rating: number;
    profilePhotoUrl: string | null;
  };
};
