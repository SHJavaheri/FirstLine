"use client";

import { Star, MapPin, Briefcase, CheckCircle, Globe, Phone, Mail, MessageSquare, Calendar, Heart, Image, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditProfessionalProfileDialog } from "@/components/profile/edit-professional-profile-dialog";
import { ProfileBannerUpload } from "@/components/profile/profile-banner-upload";
import { ProfilePhotoUpload } from "@/components/profile/profile-photo-upload";
import type { ProfessionalProfileView } from "@/backend/repositories/professional-repository";

type ProfessionalProfileHeaderProps = {
  profile: ProfessionalProfileView;
  isSelf: boolean;
  isConsumer: boolean;
};

export function ProfessionalProfileHeader({ profile, isSelf, isConsumer }: ProfessionalProfileHeaderProps) {
  const displayName = [profile.account.firstName, profile.account.lastName]
    .filter(Boolean)
    .join(" ") || "Professional";
  
  const location = [profile.account.locationCity, profile.account.locationState]
    .filter(Boolean)
    .join(", ");

  const memberSince = new Date(profile.account.createdAt).getFullYear();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {isSelf ? (
        <ProfileBannerUpload 
          currentBannerUrl={profile.account.bannerPhotoUrl} 
          userName={displayName}
        />
      ) : (
        <div className="relative h-32 sm:h-40">
          {profile.account.bannerPhotoUrl ? (
            <img
              src={profile.account.bannerPhotoUrl}
              alt={`${displayName}'s banner`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700" />
          )}
        </div>
      )}
      
      <div className="relative px-6 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:gap-9">
          <div className="-mt-16 flex-shrink-0 sm:-mt-20">
            {isSelf ? (
              <ProfilePhotoUpload currentPhotoUrl={profile.account.profilePhotoUrl} userName={displayName}>
                <div className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg sm:h-40 sm:w-40">
                  {profile.account.profilePhotoUrl ? (
                    <img
                      src={profile.account.profilePhotoUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                      <span className="text-4xl font-bold text-white sm:text-5xl">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {profile.verified && (
                    <div className="absolute bottom-2 right-2 rounded-full bg-white p-1 shadow-md">
                      <CheckCircle className="h-6 w-6 fill-blue-600 text-white" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-5 w-5 text-white" />
                    <span className="text-xs font-semibold text-white">Update Photo</span>
                  </div>
                </div>
              </ProfilePhotoUpload>
            ) : (
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg sm:h-40 sm:w-40">
                {profile.account.profilePhotoUrl ? (
                  <img
                    src={profile.account.profilePhotoUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                    <span className="text-4xl font-bold text-white sm:text-5xl">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {profile.verified && (
                  <div className="absolute bottom-2 right-2 rounded-full bg-white p-1 shadow-md">
                    <CheckCircle className="h-6 w-6 fill-blue-600 text-white" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4 pt-4 sm:pt-0">
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="flex-1 min-w-0 space-y-2">
                  <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{displayName}</h1>
                  <p className="mt-1 text-lg font-medium text-slate-700">{profile.profession}</p>
                  
                  {profile.firmName && (
                    <div className="mt-2 flex items-center gap-2 text-slate-600">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm">{profile.firmName}</span>
                    </div>
                  )}
                  
                  {location && (
                    <div className="mt-1 flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{location}</span>
                    </div>
                  )}
                </div>

                {isSelf ? (
                  <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
                    <EditProfessionalProfileDialog profile={profile} />
                  </div>
                ) : isConsumer ? (
                  <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end sm:gap-3">
                    <Button size="sm" variant="outline" className="gap-2 px-4">
                      <Heart className="h-4 w-4" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 px-4">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                    <Button size="sm" className="gap-2 bg-blue-600 px-4 hover:bg-blue-700">
                      <Calendar className="h-4 w-4" />
                      Book Consultation
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {profile.specializations.slice(0, 3).map((spec, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
                {profile.specializations.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.specializations.length - 3} more
                  </Badge>
                )}
              </div>

              {(profile.professionalBio || profile.description || profile.account.bio) && (
                <p className="mt-4 text-sm leading-relaxed text-slate-700 line-clamp-2">
                  {profile.professionalBio || profile.description || profile.account.bio}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-slate-100 pt-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-900">{profile.rating.toFixed(1)}</span>
                <span className="text-slate-600">({profile.reviewCount} reviews)</span>
              </div>
              
              {profile.totalExperienceYears && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{profile.totalExperienceYears} years experience</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle className="h-4 w-4" />
                <span>Member since {memberSince}</span>
              </div>

              {profile.acceptsNewClients && (
                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                  Accepting New Clients
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
              {profile.firmWebsite && (
                <a
                  href={profile.firmWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <Globe className="h-4 w-4" />
                  <span>Website</span>
                </a>
              )}
              {profile.account.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{profile.account.email}</span>
                </div>
              )}
              {profile.account.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{profile.account.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
