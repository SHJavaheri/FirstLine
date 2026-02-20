import { Star, User } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type Rating = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  consumer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profilePhotoUrl: string | null;
  };
};

type RatingsListProps = {
  ratings: Rating[];
};

export function RatingsList({ ratings }: RatingsListProps) {
  if (ratings.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        No ratings yet. Be the first to rate this professional!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => {
        const fullName = [rating.consumer.firstName, rating.consumer.lastName]
          .filter(Boolean)
          .join(" ") || "Anonymous";

        return (
          <Card key={rating.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                    {rating.consumer.profilePhotoUrl ? (
                      <img
                        src={rating.consumer.profilePhotoUrl}
                        alt={fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-300">
                        <User className="h-5 w-5 text-slate-600" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{fullName}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= rating.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-slate-700">{rating.comment}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
