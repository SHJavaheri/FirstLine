import { notFound } from "next/navigation";
import { Mail, MapPin, Phone, Star, Wallet } from "lucide-react";

import { getLawyerProfile } from "@/backend/services/lawyer-service";
import { getCurrentUser } from "@/backend/auth/current-user";
import { getRating, getProfessionalRatings } from "@/backend/repositories/rating-repository";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RatingDialog } from "@/components/ratings/rating-dialog";
import { RatingsList } from "@/components/ratings/ratings-list";

export const dynamic = "force-dynamic";

export default async function LawyerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lawyer = await getLawyerProfile(id);

  if (!lawyer) {
    notFound();
  }

  const user = await getCurrentUser();
  const isConsumer = user?.role === "CONSUMER";
  const userRating = isConsumer ? await getRating(user.id, lawyer.accountId) : null;
  const allRatings = await getProfessionalRatings(lawyer.accountId);

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-4xl text-slate-900">{lawyer.name}</h1>
              <p className="mt-1 text-slate-600">{lawyer.yearsExperience} years of experience</p>
            </div>
            <Badge>{lawyer.specialization}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-slate-700">
              <Wallet className="h-4 w-4 text-slate-500" />
              ${lawyer.hourlyRate}/hr
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Star className="h-4 w-4 text-amber-500" />
              {lawyer.rating.toFixed(1)} average rating
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="h-4 w-4 text-slate-500" />
              {lawyer.location}
            </div>
            {lawyer.email ? (
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="h-4 w-4 text-slate-500" />
                {lawyer.email}
              </div>
            ) : null}
            {lawyer.phone ? (
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="h-4 w-4 text-slate-500" />
                {lawyer.phone}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">Profile Summary</h2>
            <p className="leading-7 text-slate-700">{lawyer.description}</p>
          </div>

          {isConsumer && (
            <div className="border-t pt-4">
              <RatingDialog
                professionalAccountId={lawyer.accountId}
                professionalName={lawyer.name}
                existingRating={userRating?.rating}
                existingComment={userRating?.comment || undefined}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-slate-900">
            Ratings & Reviews ({allRatings.length})
          </h2>
        </CardHeader>
        <CardContent>
          <RatingsList ratings={allRatings} />
        </CardContent>
      </Card>
    </section>
  );
}
