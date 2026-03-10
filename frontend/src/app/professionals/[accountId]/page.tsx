import { notFound } from "next/navigation";
import { getCurrentUser } from "@/backend/auth/current-user";
import { getProfessionalProfileByAccountId } from "@/backend/repositories/professional-repository";
import { getProfessionalRatings } from "@/backend/repositories/rating-repository";
import { ProfessionalProfileHeader } from "@/components/profile/professional-profile-header";
import { ProfessionalProfileSections } from "@/components/profile/professional-profile-sections";
import { ProfessionalProfileReviews } from "@/components/profile/professional-profile-reviews";

export const dynamic = "force-dynamic";

export default async function ProfessionalPublicProfilePage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  const user = await getCurrentUser();
  
  const [professionalProfile, ratings] = await Promise.all([
    getProfessionalProfileByAccountId(accountId),
    getProfessionalRatings(accountId),
  ]);

  if (!professionalProfile) {
    notFound();
  }

  const isSelf = user?.id === accountId;
  const isConsumer = user?.role === "CONSUMER";

  const reviewsWithConsumer = ratings.map((rating) => ({
    id: rating.id,
    rating: rating.rating,
    comment: rating.comment,
    createdAt: rating.createdAt,
    professionalReply: rating.professionalReply,
    consumer: {
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
      />
      <ProfessionalProfileSections profile={professionalProfile} />
      <ProfessionalProfileReviews
        reviews={reviewsWithConsumer}
        averageRating={professionalProfile.rating}
        totalReviews={professionalProfile.reviewCount}
      />
    </div>
  );
}
