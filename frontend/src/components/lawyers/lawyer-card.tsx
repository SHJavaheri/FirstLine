import Link from "next/link";
import { MapPin, Star, Wallet, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/lawyers/favorite-button";
import { RecommendButton } from "@/components/recommendations/recommend-button";
import type { LawyerListItem, LawyerWithTrust } from "@/types";

type LawyerCardProps = {
  lawyer: LawyerListItem | LawyerWithTrust;
  showFavoriteButton?: boolean;
  initialIsFavorite?: boolean;
  showRecommendButton?: boolean;
  initialIsRecommended?: boolean;
};

export function LawyerCard({ 
  lawyer, 
  showFavoriteButton = false, 
  initialIsFavorite,
  showRecommendButton = false,
  initialIsRecommended,
}: LawyerCardProps) {
  const formatCurrency = (value?: number | null) =>
    value != null ? `$${value.toLocaleString()}` : null;

  const hourlyDisplay = () => {
    if (lawyer.pricingModel !== "HOURLY") {
      return formatCurrency(lawyer.hourlyRate) ? `${formatCurrency(lawyer.hourlyRate)}/hr` : "Rate not provided";
    }

    const min = formatCurrency(lawyer.minRate);
    const max = formatCurrency(lawyer.maxRate);

    if (min && max && min !== max) {
      return `${min} - ${max}/hr`;
    }

    if (formatCurrency(lawyer.hourlyRate)) {
      return `${formatCurrency(lawyer.hourlyRate)}/hr`;
    }

    return min ? `${min}/hr` : "Hourly rate not provided";
  };

  const lawyerWithTrust = lawyer as LawyerWithTrust;
  const hasRecommendations = lawyerWithTrust.recommendedByFriends && lawyerWithTrust.recommendedByFriends.count > 0;
  const hasFavorites = lawyerWithTrust.favoritedByFriends && lawyerWithTrust.favoritedByFriends.count > 0;
  const totalFriendEndorsements = (lawyerWithTrust.recommendedByFriends?.count || 0) + (lawyerWithTrust.favoritedByFriends?.count || 0);

  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        {totalFriendEndorsements > 0 && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-200">
              <Users className="h-4 w-4" />
              <span className="font-medium">
                Recommended by {totalFriendEndorsements} friend{totalFriendEndorsements !== 1 ? 's' : ''} you follow
              </span>
            </div>
          </div>
        )}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">{lawyer.name}</CardTitle>
              <div className="flex gap-1">
                {showRecommendButton && (
                  <RecommendButton
                    professionalAccountId={lawyer.accountId}
                    professionalName={lawyer.name}
                    profession={lawyer.profession}
                    initialIsRecommended={initialIsRecommended}
                  />
                )}
                {showFavoriteButton && (
                  <FavoriteButton
                    professionalAccountId={lawyer.accountId}
                    initialIsFavorite={initialIsFavorite}
                  />
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {lawyer.specializations.map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{lawyer.description}</p>
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-slate-500" />
          <span>{hourlyDisplay()}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-500" />
          <span>{lawyer.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          <span>
            {lawyer.rating.toFixed(1)} rating · {lawyer.yearsExperience} years
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/professionals/${lawyer.accountId}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
