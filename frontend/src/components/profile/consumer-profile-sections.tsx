"use client";

import { useState, useEffect } from "react";
import { 
  Heart, 
  Clock, 
  Star, 
  Settings, 
  Shield, 
  Bell,
  Briefcase,
  MapPin,
  DollarSign,
  Video,
  CheckCircle,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Calendar,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  const [preferences, setPreferences] = useState({
    consultationPreference: profile.consultationPreference || "both",
    budgetMin: profile.budgetMin || 0,
    budgetMax: profile.budgetMax || 500,
    distancePreference: profile.distancePreference || 25,
  });
  const [notifications, setNotifications] = useState({
    newProfessionals: true,
    savedUpdates: true,
    consultationReminders: true,
    messageNotifications: true,
    reviewResponses: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "saved") {
      fetchSavedProfessionals();
    } else if (activeTab === "activity") {
      fetchActivityHistory();
    } else if (activeTab === "reviews") {
      fetchReviews();
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

  const updatePreferences = async () => {
    try {
      await fetch("/api/profile/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  const updateNotifications = async (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    
    try {
      await fetch("/api/profile/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationPreferences: updated }),
      });
    } catch (error) {
      console.error("Error updating notifications:", error);
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
          <p className="text-sm text-slate-600">Select services you're interested in to get personalized recommendations</p>
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
                      ? "border-cyan-300 bg-cyan-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    isSelected ? "bg-cyan-100" : "bg-slate-100"
                  }`}>
                    <Icon className={`h-5 w-5 ${isSelected ? "text-cyan-600" : "text-slate-600"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${isSelected ? "text-cyan-900" : "text-slate-900"}`}>
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
      <div className="border-b border-slate-200">
        <nav className="flex gap-8" aria-label="Profile sections">
          <button
            onClick={() => setActiveTab("saved")}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "saved"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
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
                : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
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
                : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>My Reviews</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "preferences"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Preferences</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "security"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "notifications"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
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
        
        {activeTab === "preferences" && (
          <PreferencesSection 
            preferences={preferences}
            setPreferences={setPreferences}
            onSave={updatePreferences}
          />
        )}
        
        {activeTab === "security" && (
          <SecuritySection profile={profile} />
        )}
        
        {activeTab === "notifications" && (
          <NotificationsSection 
            notifications={notifications}
            onUpdate={updateNotifications}
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
          <Heart className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-slate-600">No saved professionals yet</p>
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
                    <h3 className="font-semibold text-slate-900 hover:text-cyan-600 truncate">
                      {fullName}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-600">{fav.professionalProfile?.profession}</p>
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
          <Clock className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-slate-600">No activity yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity: any) => (
            <div key={activity.id} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100">
                <Clock className="h-5 w-5 text-cyan-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">
                  {activity.activityType.replace(/_/g, " ")}
                </p>
                {activity.professional && (
                  <Link href={`/professionals/${activity.professional.accountId}`}>
                    <p className="text-sm text-cyan-600 hover:text-cyan-700">
                      {activity.professional.name}
                    </p>
                  </Link>
                )}
                <p className="text-xs text-slate-500">
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
          <Star className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-slate-600">No reviews written yet</p>
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
                  <h3 className="font-semibold text-slate-900 hover:text-cyan-600">
                    {review.professional.name}
                  </h3>
                </Link>
                <p className="text-sm text-slate-600">{review.professional.profession}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="mt-3 text-sm text-slate-700">{review.comment}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PreferencesSection({ preferences, setPreferences, onSave }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Consultation Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-semibold text-slate-700">Consultation Type</Label>
          <div className="mt-2 flex gap-3">
            {["virtual", "in-person", "both"].map((type) => (
              <button
                key={type}
                onClick={() => setPreferences({ ...preferences, consultationPreference: type })}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  preferences.consultationPreference === type
                    ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-cyan-200"
                }`}
              >
                {type === "virtual" && <Video className="mr-2 inline h-4 w-4" />}
                {type === "in-person" && <MapPin className="mr-2 inline h-4 w-4" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700">Budget Range (per hour)</Label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-slate-600">Minimum</Label>
              <div className="mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  value={preferences.budgetMin}
                  onChange={(e) => setPreferences({ ...preferences, budgetMin: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-600">Maximum</Label>
              <div className="mt-1 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  value={preferences.budgetMax}
                  onChange={(e) => setPreferences({ ...preferences, budgetMax: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700">Distance Preference (miles)</Label>
          <div className="mt-2">
            <input
              type="range"
              min="5"
              max="100"
              value={preferences.distancePreference}
              onChange={(e) => setPreferences({ ...preferences, distancePreference: parseInt(e.target.value) })}
              className="w-full"
            />
            <p className="mt-1 text-sm text-slate-600">{preferences.distancePreference} miles</p>
          </div>
        </div>

        <Button onClick={onSave} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}

function SecuritySection({ profile }: { profile: ConsumerProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              profile.emailVerified ? "bg-green-100" : "bg-slate-100"
            }`}>
              <Mail className={`h-5 w-5 ${profile.emailVerified ? "text-green-600" : "text-slate-600"}`} />
            </div>
            <div>
              <p className="font-medium text-slate-900">Email Verification</p>
              <p className="text-sm text-slate-600">
                {profile.emailVerified ? "Verified" : "Not verified"}
              </p>
            </div>
          </div>
          {!profile.emailVerified && (
            <Button size="sm" variant="outline">Verify Email</Button>
          )}
          {profile.emailVerified && (
            <CheckCircle className="h-6 w-6 text-green-600" />
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              profile.phoneVerified ? "bg-green-100" : "bg-slate-100"
            }`}>
              <Phone className={`h-5 w-5 ${profile.phoneVerified ? "text-green-600" : "text-slate-600"}`} />
            </div>
            <div>
              <p className="font-medium text-slate-900">Phone Verification</p>
              <p className="text-sm text-slate-600">
                {profile.phoneVerified ? "Verified" : "Not verified"}
              </p>
            </div>
          </div>
          {!profile.phoneVerified && (
            <Button size="sm" variant="outline">Verify Phone</Button>
          )}
          {profile.phoneVerified && (
            <CheckCircle className="h-6 w-6 text-green-600" />
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              profile.identityVerified ? "bg-green-100" : "bg-slate-100"
            }`}>
              <Shield className={`h-5 w-5 ${profile.identityVerified ? "text-green-600" : "text-slate-600"}`} />
            </div>
            <div>
              <p className="font-medium text-slate-900">Identity Verification</p>
              <p className="text-sm text-slate-600">
                {profile.identityVerified ? "Verified" : "Optional"}
              </p>
            </div>
          </div>
          {!profile.identityVerified && (
            <Button size="sm" variant="outline">Verify Identity</Button>
          )}
          {profile.identityVerified && (
            <CheckCircle className="h-6 w-6 text-green-600" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsSection({ notifications, onUpdate }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">New Professionals in Area</p>
            <p className="text-sm text-slate-600">Get notified when new professionals join near you</p>
          </div>
          <Switch
            checked={notifications.newProfessionals}
            onCheckedChange={(checked) => onUpdate("newProfessionals", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">Updates from Saved Professionals</p>
            <p className="text-sm text-slate-600">Receive updates from professionals you've saved</p>
          </div>
          <Switch
            checked={notifications.savedUpdates}
            onCheckedChange={(checked) => onUpdate("savedUpdates", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">Consultation Reminders</p>
            <p className="text-sm text-slate-600">Reminders for upcoming consultations</p>
          </div>
          <Switch
            checked={notifications.consultationReminders}
            onCheckedChange={(checked) => onUpdate("consultationReminders", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">Message Notifications</p>
            <p className="text-sm text-slate-600">Get notified when you receive messages</p>
          </div>
          <Switch
            checked={notifications.messageNotifications}
            onCheckedChange={(checked) => onUpdate("messageNotifications", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">Review Responses</p>
            <p className="text-sm text-slate-600">Notifications when professionals respond to your reviews</p>
          </div>
          <Switch
            checked={notifications.reviewResponses}
            onCheckedChange={(checked) => onUpdate("reviewResponses", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
