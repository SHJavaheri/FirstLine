import Link from "next/link";
import { MapPin, Star, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LawyerListItem } from "@/types";

type LawyerCardProps = {
  lawyer: LawyerListItem;
};

export function LawyerCard({ lawyer }: LawyerCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">{lawyer.name}</CardTitle>
          <Badge variant="secondary">{lawyer.specialization}</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-slate-600">{lawyer.description}</p>
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-slate-500" />
          <span>${lawyer.hourlyRate}/hr</span>
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
