import { redirect } from "next/navigation";
import { User, MapPin, Mail, Phone, Star } from "lucide-react";

import { getCurrentUser } from "@/backend/auth/current-user";
import { getConsumerProfile } from "@/backend/repositories/consumer-repository";
import { getProfessionalProfileByAccountId } from "@/backend/repositories/professional-repository";
import { getProfessionalRatings } from "@/backend/repositories/rating-repository";
import { Card } from "@/components/ui/card";
import { ConsumerProfileHeader } from "@/components/profile/consumer-profile-header";
import { ConsumerProfileSections } from "@/components/profile/consumer-profile-sections";
import { ProfessionalProfileHeader } from "@/components/profile/professional-profile-header";
import { ProfessionalProfileSections } from "@/components/profile/professional-profile-sections";
import { ProfessionalProfileReviews } from "@/components/profile/professional-profile-reviews";
import { prisma } from "@/database/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role === "PROFESSIONAL") {
    const [professionalProfile, ratings, account] = await Promise.all([
      getProfessionalProfileByAccountId(user.id),
      getProfessionalRatings(user.id),
      prisma.account.findUnique({
        where: { id: user.id },
        select: {
          _count: {
            select: {
              friendships: true,
              friendOf: true,
            },
          },
        },
      }),
    ]);

    if (!professionalProfile) {
      return (
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900">Profile Not Found</h2>
            <p className="mt-2 text-sm text-slate-600">
              Your professional profile could not be loaded.
            </p>
          </Card>
        </div>
      );
    }

    const reviewsWithConsumer = ratings.map((rating) => ({
      id: rating.id,
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.createdAt,
      professionalReply: rating.professionalReply,
      consumer: {
        id: rating.consumer.id,
        firstName: rating.consumer.firstName,
        lastName: rating.consumer.lastName,
        profilePhotoUrl: rating.consumer.profilePhotoUrl,
      },
    }));

    const followingCount = account?._count.friendships || 0;
    const followersCount = account?._count.friendOf || 0;

    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <ProfessionalProfileHeader 
          profile={professionalProfile} 
          isSelf={true}
          isConsumer={false}
          followingCount={followingCount}
          followersCount={followersCount}
        />
        <ProfessionalProfileSections profile={professionalProfile} />
        <ProfessionalProfileReviews
          reviews={reviewsWithConsumer}
          averageRating={professionalProfile.rating}
          totalReviews={professionalProfile.reviewCount}
          isSelf={true}
        />
      </div>
    );
  }

  const consumerProfile = user.role === "CONSUMER" ? await getConsumerProfile(user.id, user.id) : null;

  if (user.role === "CONSUMER" && consumerProfile) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <ConsumerProfileHeader profile={consumerProfile} currentUserId={user.id} />
        <ConsumerProfileSections profile={consumerProfile} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900">Profile Not Found</h2>
        <p className="mt-2 text-sm text-slate-600">
          Unable to load your profile.
        </p>
      </Card>
    </div>
  );
}
