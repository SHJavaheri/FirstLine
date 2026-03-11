"use client";

import Link from "next/link";
import { Star, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RatingDialog } from "@/components/ratings/rating-dialog";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  professionalReply: string | null;
  consumer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profilePhotoUrl: string | null;
  };
};

type ProfessionalProfileReviewsProps = {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  professionalAccountId?: string;
  professionalName?: string;
  isConsumer?: boolean;
  isSelf?: boolean;
};

export function ProfessionalProfileReviews({ 
  reviews, 
  averageRating, 
  totalReviews,
  professionalAccountId,
  professionalName,
  isConsumer = false,
  isSelf = false,
}: ProfessionalProfileReviewsProps) {
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Star className="h-5 w-5 text-amber-400" />
            Reviews & Ratings
          </CardTitle>
          {isConsumer && professionalAccountId && professionalName && (
            <RatingDialog
              professionalAccountId={professionalAccountId}
              professionalName={professionalName}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Rating Summary */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6">
              <div className="text-5xl font-bold text-slate-900 dark:text-white">{averageRating.toFixed(1)}</div>
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
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{totalReviews} reviews</p>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-12 text-sm text-slate-600 dark:text-slate-400">{stars} star</span>
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full bg-amber-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right text-sm text-slate-600 dark:text-slate-400">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="py-12 text-center">
              <Star className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-600 dark:text-slate-400">No reviews yet</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Be the first to leave a review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const reviewerName = [review.consumer.firstName, review.consumer.lastName]
                  .filter(Boolean)
                  .join(" ") || "Anonymous";

                return (
                  <div 
                    key={review.id} 
                    className={`rounded-lg border border-slate-200 dark:border-slate-700 p-4 transition-all ${
                      isSelf ? "hover:shadow-md hover:border-cyan-300 dark:hover:border-cyan-600 cursor-default" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Link href={`/profile/${review.consumer.id}`} className="flex-shrink-0">
                        {review.consumer.profilePhotoUrl ? (
                          <img
                            src={review.consumer.profilePhotoUrl}
                            alt={reviewerName}
                            className="h-10 w-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-cyan-500 transition-all"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                            <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                          </div>
                        )}
                      </Link>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link href={`/profile/${review.consumer.id}`}>
                              <h4 className="font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors">{reviewerName}</h4>
                            </Link>
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
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {review.comment && (
                          <p className="mt-3 text-slate-700 dark:text-slate-300">{review.comment}</p>
                        )}

                        {review.professionalReply && (
                          <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3">
                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">Professional Response</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{review.professionalReply}</p>
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
