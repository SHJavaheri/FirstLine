"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Briefcase, Award } from "lucide-react";
import Link from "next/link";
import type { ConsumerProfile, ConsumerRating, PersonalRecommendation } from "@/types";

type ConsumerProfileTabsProps = {
  accountId: string;
  profile: ConsumerProfile;
};

export function ConsumerProfileTabs({ accountId, profile }: ConsumerProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"ratings" | "recommendations">("ratings");
  const [ratings, setRatings] = useState<ConsumerRating[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!profile.canViewDetails) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "ratings") {
          const response = await fetch(`/api/profile/${accountId}/ratings`);
          const data = await response.json();
          setRatings(data.ratings || []);
        } else {
          const response = await fetch(`/api/profile/${accountId}/recommendations`);
          const data = await response.json();
          setRecommendations(data.recommendations || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, accountId, profile.canViewDetails]);

  if (!profile.canViewDetails) {
    return null;
  }

  return (
    <motion.div
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
    >
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("ratings")}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "ratings"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Reviews ({profile.ratingsCount || 0})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "recommendations"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Recommendations</span>
            </div>
          </button>
        </nav>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : activeTab === "ratings" ? (
          <RatingsTab ratings={ratings} />
        ) : (
          <RecommendationsTab recommendations={recommendations} />
        )}
      </div>
    </motion.div>
  );
}

function RatingsTab({ ratings }: { ratings: ConsumerRating[] }) {
  if (ratings.length === 0) {
    return (
      <div className="py-12 text-center text-slate-600 dark:text-slate-400">
        <Star className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
        <p className="mt-4">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <div key={rating.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Link
                href={`/professionals/${rating.professional.id}`}
                className="text-lg font-semibold text-slate-900 dark:text-white hover:text-blue-600"
              >
                {rating.professional.name}
              </Link>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Briefcase className="h-4 w-4" />
                <span>{rating.professional.profession}</span>
                {rating.professional.specializations.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{rating.professional.specializations[0]}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < rating.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
          {rating.comment && (
            <p className="mt-3 text-slate-700 dark:text-slate-300">{rating.comment}</p>
          )}
          {rating.professionalReply && (
            <div className="mt-3 rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Professional Response
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{rating.professionalReply}</p>
            </div>
          )}
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {new Date(rating.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

function RecommendationsTab({ recommendations }: { recommendations: PersonalRecommendation[] }) {
  if (recommendations.length === 0) {
    return (
      <div className="py-12 text-center text-slate-600 dark:text-slate-400">
        <Award className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
        <p className="mt-4">No recommendations yet</p>
      </div>
    );
  }

  const favorites = recommendations.filter(r => r.isFavorite);
  const others = recommendations.filter(r => !r.isFavorite);

  return (
    <div className="space-y-6">
      {favorites.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">⭐ Top Recommendations</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {favorites.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          {favorites.length > 0 && (
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Other Recommendations</h3>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {others.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: PersonalRecommendation }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all">
      <Link
        href={`/professionals/${recommendation.professional.id}`}
        className="block"
      >
        <div className="flex items-start gap-3">
          {recommendation.professional.profilePhotoUrl && (
            <img
              src={recommendation.professional.profilePhotoUrl}
              alt={recommendation.professional.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-white hover:text-blue-600">
              {recommendation.professional.name}
            </h4>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span>{recommendation.category}</span>
              {recommendation.specialty && (
                <>
                  <span>•</span>
                  <span>{recommendation.specialty}</span>
                </>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < recommendation.professional.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}
              <span className="ml-1 text-xs text-slate-600 dark:text-slate-400">
                {recommendation.professional.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        
        {recommendation.selectedTags && recommendation.selectedTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {recommendation.selectedTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {recommendation.note && (
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{recommendation.note}</p>
        )}
        
        {recommendation.wouldUseAgain && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Would use again: <span className="font-medium">{recommendation.wouldUseAgain}</span>
          </p>
        )}
      </Link>
      
      {recommendation.professionalReply && (
        <div className="mt-3 rounded-lg bg-slate-50 dark:bg-slate-700 p-3 border-t border-slate-200 dark:border-slate-600">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Professional Response
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">{recommendation.professionalReply}</p>
        </div>
      )}
    </div>
  );
}
