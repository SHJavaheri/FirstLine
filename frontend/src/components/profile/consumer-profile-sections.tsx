"use client";

import { useState, useEffect } from "react";
import { 
  Heart, 
  Clock, 
  Star, 
  Briefcase,
  MapPin,
  DollarSign,
  CheckCircle,
  Calendar,
  MessageSquare,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ConsumerProfile } from "@/types";

type ConsumerProfileSectionsProps = {
  profile: ConsumerProfile;
};

const SERVICE_CATEGORIES = [
  { id: "legal", label: "Legal Services", icon: Briefcase, color: "cyan" },
  { id: "financial", label: "Financial Planning", icon: DollarSign, color: "blue" },
  { id: "real-estate", label: "Real Estate", icon: MapPin, color: "indigo" },
  { id: "therapy", label: "Therapy & Counseling", icon: Heart, color: "cyan" },
  { id: "consulting", label: "Business Consulting", icon: TrendingUp, color: "blue" },
  { id: "accounting", label: "Accounting", icon: DollarSign, color: "indigo" },
];

export function ConsumerProfileSections({ profile }: ConsumerProfileSectionsProps) {
  const [activeTab, setActiveTab] = useState<string>("saved");
  const [serviceInterests, setServiceInterests] = useState<string[]>(profile.serviceInterests || []);
  const [savedProfessionals, setSavedProfessionals] = useState<any[]>([]);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "saved") {
      fetchSavedProfessionals();
    } else if (activeTab === "activity") {
      fetchActivityHistory();
    } else if (activeTab === "reviews") {
      fetchReviews();
    } else if (activeTab === "recommendations") {
      fetchRecommendations();
    }
  }, [activeTab]);

  const fetchSavedProfessionals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/favorites");
      const data = await response.json();
      setSavedProfessionals(data.favorites || []);
    } catch (error) {
      console.error("Error fetching saved professionals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivityHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile/activity");
      const data = await response.json();
      setActivityHistory(data.activities || []);
    } catch (error) {
      console.error("Error fetching activity history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/profile/${profile.id}/ratings`);
      const data = await response.json();
      setReviews(data.ratings || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/profile/${profile.id}/recommendations`);

      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations (${response.status})`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json") ? await response.json() : {};
      setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleServiceInterest = async (serviceId: string) => {
    const updated = serviceInterests.includes(serviceId)
      ? serviceInterests.filter(id => id !== serviceId)
      : [...serviceInterests, serviceId];
    
    setServiceInterests(updated);
    
    try {
      await fetch("/api/profile/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceInterests: updated }),
      });
    } catch (error) {
      console.error("Error updating service interests:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Needs Help With Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="h-5 w-5 text-cyan-600" />
            What I Need Help With
          </CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">Select services you're interested in to get personalized recommendations</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = serviceInterests.includes(category.id);
              
              return (
                <button
                  key={category.id}
                  onClick={() => toggleServiceInterest(category.id)}
                  className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                    isSelected
                      ? "border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-950/30 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-200 dark:hover:border-cyan-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    isSelected ? "bg-cyan-100 dark:bg-cyan-900" : "bg-slate-100 dark:bg-slate-700"
                  }`}>
                    <Icon className={`h-5 w-5 ${isSelected ? "text-cyan-600 dark:text-cyan-400" : "text-slate-600 dark:text-slate-400"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${isSelected ? "text-cyan-900 dark:text-cyan-100" : "text-slate-900 dark:text-white"}`}>
                      {category.label}
                    </h3>
                    {isSelected && (
                      <CheckCircle className="mt-1 h-4 w-4 text-cyan-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-8" aria-label="Profile sections">
          <button
            onClick={() => setActiveTab("saved")}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "saved"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Saved Professionals</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "activity"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Activity History</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "reviews"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>My Reviews</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "recommendations"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>My Recommendations</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "saved" && (
          <SavedProfessionalsSection 
            professionals={savedProfessionals} 
            isLoading={isLoading}
            onRefresh={fetchSavedProfessionals}
          />
        )}
        
        {activeTab === "activity" && (
          <ActivityHistorySection 
            activities={activityHistory} 
            isLoading={isLoading}
          />
        )}
        
        {activeTab === "reviews" && (
          <ReviewsSection 
            reviews={reviews} 
            isLoading={isLoading}
          />
        )}
        
        {activeTab === "recommendations" && (
          <RecommendationsSection 
            recommendations={recommendations} 
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

function SavedProfessionalsSection({ professionals, isLoading, onRefresh }: any) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">No saved professionals yet</p>
          <Link href="/lawyers">
            <Button className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              Browse Professionals
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {professionals.map((fav: any) => {
        const fullName = [fav.professionalProfile?.account?.firstName, fav.professionalProfile?.account?.lastName]
          .filter(Boolean)
          .join(" ") || "Professional";
        
        return (
          <Card key={fav.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {fav.professionalProfile?.account?.profilePhotoUrl && (
                  <img
                    src={fav.professionalProfile.account.profilePhotoUrl}
                    alt={fullName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <Link href={`/professionals/${fav.professionalProfile?.accountId}`}>
                    <h3 className="font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 truncate">
                      {fullName}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{fav.professionalProfile?.profession}</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Message
                    </Button>
                    <Button size="sm" className="text-xs bg-cyan-600 hover:bg-cyan-700">
                      <Calendar className="mr-1 h-3 w-3" />
                      Book
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ActivityHistorySection({ activities, isLoading }: any) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">No activity yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity: any) => (
            <div key={activity.id} className="flex gap-4 border-b border-slate-100 dark:border-slate-700 pb-4 last:border-0">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900">
                <Clock className="h-5 w-5 text-cyan-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">
                  {activity.activityType.replace(/_/g, " ")}
                </p>
                {activity.professional && (
                  <Link href={`/professionals/${activity.professional.accountId}`}>
                    <p className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300">
                      {activity.professional.name}
                    </p>
                  </Link>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewsSection({ reviews, isLoading }: any) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Star className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">No reviews written yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review: any) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Link href={`/professionals/${review.professional.accountId}`}>
                  <h3 className="font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400">
                    {review.professional.name}
                  </h3>
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-400">{review.professional.profession}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{review.comment}</p>
            )}
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecommendationsSection({ recommendations, isLoading }: any) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Award className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">No recommendations yet</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Recommend professionals you've worked with to help others</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation: any) => (
        <Card key={recommendation.id}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <Link href={`/professionals/${recommendation.professional.accountId}`}>
                  <h3 className="font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400">
                    {recommendation.professional.name}
                  </h3>
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-400">{recommendation.professional.profession}</p>
                {recommendation.comment && (
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{recommendation.comment}</p>
                )}
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Recommended on {new Date(recommendation.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

