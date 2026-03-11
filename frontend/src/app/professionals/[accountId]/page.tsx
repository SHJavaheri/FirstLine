import { notFound } from "next/navigation";
import { getCurrentUser } from "@/backend/auth/current-user";
import { getProfessionalProfileByAccountId } from "@/backend/repositories/professional-repository";
import { getProfessionalRatings } from "@/backend/repositories/rating-repository";
import { ProfessionalProfileHeader } from "@/components/profile/professional-profile-header";
import { ProfessionalProfileSections } from "@/components/profile/professional-profile-sections";
import { ProfessionalProfileReviews } from "@/components/profile/professional-profile-reviews";
import { prisma } from "@/database/prisma";

export const dynamic = "force-dynamic";

export default async function ProfessionalPublicProfilePage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  const user = await getCurrentUser();
  
  const [professionalProfile, ratings, account] = await Promise.all([
    getProfessionalProfileByAccountId(accountId),
    getProfessionalRatings(accountId),
    prisma.account.findUnique({
      where: { id: accountId },
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
    notFound();
  }

  const isSelf = user?.id === accountId;
  const isConsumer = user?.role === "CONSUMER";
  const followingCount = account?._count.friendships || 0;
  const followersCount = account?._count.friendOf || 0;

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

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <ProfessionalProfileHeader 
        profile={professionalProfile} 
        isSelf={isSelf}
        isConsumer={isConsumer}
        followingCount={followingCount}
        followersCount={followersCount}
      />
      <ProfessionalProfileSections profile={professionalProfile} />
      <ProfessionalProfileReviews
        reviews={reviewsWithConsumer}
        averageRating={professionalProfile.rating}
        totalReviews={professionalProfile.reviewCount}
        professionalAccountId={accountId}
        professionalName={[professionalProfile.account.firstName, professionalProfile.account.lastName].filter(Boolean).join(" ") || "Professional"}
        isConsumer={isConsumer}
        isSelf={isSelf}
      />
    </div>
  );
}
