import { redirect } from "next/navigation";
import { User, MapPin, Briefcase, Mail, Phone, Star } from "lucide-react";

import { getCurrentUser } from "@/backend/auth/current-user";
import { getFavorites } from "@/backend/repositories/favorite-repository";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LawyerCard } from "@/components/lawyers/lawyer-card";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const favorites = user.role === "CONSUMER" ? await getFavorites(user.id) : [];

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Anonymous User";
  const location = [user.locationCity, user.locationState].filter(Boolean).join(", ");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-slate-700 to-slate-900" />

        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <div className="-mt-16 flex-shrink-0">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-lg">
                {user.profilePhotoUrl ? (
                  <img
                    src={user.profilePhotoUrl}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-300">
                    <User className="h-16 w-16 text-slate-600" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 pt-4 md:pt-0">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{fullName}</h1>
                {user.jobTitle && (
                  <p className="mt-1 text-lg text-slate-600">{user.jobTitle}</p>
                )}
                {location && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                )}
              </div>

              {user.bio && (
                <div className="rounded-lg bg-slate-50 p-4">
                  <h2 className="mb-2 text-sm font-semibold text-slate-900">About</h2>
                  <p className="text-sm text-slate-700">{user.bio}</p>
                </div>
              )}

              {user.professional && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default" className="text-sm">
                      {user.professional.profession}
                    </Badge>
                    {user.professional.verified && (
                      <Badge variant="secondary" className="text-sm">
                        <Star className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.professional.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
                {user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <EditProfileDialog user={user} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {user.role === "CONSUMER" && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Favorite Professionals</h2>
            {favorites.length === 0 ? (
              <p className="text-sm text-slate-600">
                Your favorite professionals will appear here. Browse the{" "}
                <a href="/lawyers" className="font-medium text-slate-900 underline">
                  Explore page
                </a>{" "}
                to add favorites.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.map((fav) => {
                  const fullName = [fav.professionalProfile.account.firstName, fav.professionalProfile.account.lastName]
                    .filter(Boolean)
                    .join(" ") || "Anonymous";
                  const location = [fav.professionalProfile.account.locationCity, fav.professionalProfile.account.locationState]
                    .filter(Boolean)
                    .join(", ") || "Location not specified";

                  return (
                    <LawyerCard
                      key={fav.id}
                      lawyer={{
                        id: fav.professionalProfile.id,
                        accountId: fav.professionalProfile.accountId,
                        name: fullName,
                        profession: fav.professionalProfile.profession,
                        specialization: fav.professionalProfile.specializations[0] || "",
                        specializations: fav.professionalProfile.specializations,
                        description: fav.professionalProfile.description || "No description available",
                        hourlyRate: fav.professionalProfile.hourlyRate || 0,
                        minRate: fav.professionalProfile.minRate,
                        maxRate: fav.professionalProfile.maxRate,
                        location,
                        rating: fav.professionalProfile.rating,
                        yearsExperience: fav.professionalProfile.yearsExperience || 0,
                        verified: fav.professionalProfile.verified,
                        acceptsNewClients: fav.professionalProfile.acceptsNewClients,
                        email: fav.professionalProfile.account.email,
                        phone: fav.professionalProfile.account.phone,
                      }}
                      showFavoriteButton={true}
                      initialIsFavorite={true}
                    />
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
