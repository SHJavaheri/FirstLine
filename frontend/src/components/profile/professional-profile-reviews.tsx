"use client";

import { Star, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  professionalReply: string | null;
  consumer: {
    firstName: string | null;
    lastName: string | null;
    profilePhotoUrl: string | null;
  };
};

type ProfessionalProfileReviewsProps = {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
};

export function ProfessionalProfileReviews({ 
  reviews, 
  averageRating, 
  totalReviews 
}: ProfessionalProfileReviewsProps) {
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Star className="h-5 w-5 text-amber-400" />
          Reviews & Ratings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Rating Summary */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6">
              <div className="text-5xl font-bold text-slate-900">{averageRating.toFixed(1)}</div>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-slate-600">{totalReviews} reviews</p>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-12 text-sm text-slate-600">{stars} star</span>
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full bg-amber-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right text-sm text-slate-600">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="py-12 text-center">
              <Star className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-600">No reviews yet</p>
              <p className="mt-1 text-sm text-slate-500">Be the first to leave a review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const reviewerName = [review.consumer.firstName, review.consumer.lastName]
                  .filter(Boolean)
                  .join(" ") || "Anonymous";

                return (
                  <div key={review.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {review.consumer.profilePhotoUrl ? (
                          <img
                            src={review.consumer.profilePhotoUrl}
                            alt={reviewerName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                            <User className="h-5 w-5 text-slate-500" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-slate-900">{reviewerName}</h4>
                            <div className="mt-1 flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {review.comment && (
                          <p className="mt-3 text-slate-700">{review.comment}</p>
                        )}

                        {review.professionalReply && (
                          <div className="mt-3 rounded-lg bg-blue-50 p-3">
                            <p className="mb-1 text-xs font-semibold text-blue-900">
                              Professional Response
                            </p>
                            <p className="text-sm text-blue-800">{review.professionalReply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
