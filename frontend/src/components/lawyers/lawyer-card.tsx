import Link from "next/link";
import { MapPin, Star, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/lawyers/favorite-button";
import type { LawyerListItem } from "@/types";

type LawyerCardProps = {
  lawyer: LawyerListItem;
  showFavoriteButton?: boolean;
  initialIsFavorite?: boolean;
};

export function LawyerCard({ lawyer, showFavoriteButton = false, initialIsFavorite }: LawyerCardProps) {
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

  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">{lawyer.name}</CardTitle>
              {showFavoriteButton && (
                <FavoriteButton
                  professionalAccountId={lawyer.accountId}
                  initialIsFavorite={initialIsFavorite}
                />
              )}
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
        <p className="line-clamp-2 text-sm text-slate-600">{lawyer.description}</p>
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-slate-700">
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
          <Link href={`/lawyers/${lawyer.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
