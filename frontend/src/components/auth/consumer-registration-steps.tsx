"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";

interface ConsumerRegistrationStepsProps {
  onSubmit: (data: ConsumerFormData) => void;
  isLoading: boolean;
}

export interface ConsumerFormData {
  firstName: string;
  lastName: string;
  bio?: string;
  profilePhotoUrl?: string;
  bannerPhotoUrl?: string;
  locationCity: string;
  locationState: string;
  phone?: string;
  email: string;
  password: string;
  jobTitle?: string;
}

const STEPS = [
  { id: 1, title: "Personal Info", description: "Tell us about yourself" },
  { id: 2, title: "Profile Picture", description: "Add a photo (optional)" },
  { id: 3, title: "Banner Photo", description: "Add a cover photo (optional)" },
  { id: 4, title: "Location & Contact", description: "Where are you located?" },
  { id: 5, title: "Account Credentials", description: "Secure your account" },
];

export function ConsumerRegistrationSteps({ onSubmit, isLoading }: ConsumerRegistrationStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ConsumerFormData>({
    firstName: "",
    lastName: "",
    bio: "",
    profilePhotoUrl: "",
    bannerPhotoUrl: "",
    locationCity: "",
    locationState: "",
    phone: "",
    email: "",
    password: "",
    jobTitle: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ConsumerFormData, string>>>({});

  const updateFormData = (field: keyof ConsumerFormData, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value || "" }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof ConsumerFormData, string>> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
    } else if (step === 4) {
      if (!formData.locationCity.trim()) {
        newErrors.locationCity = "City is required";
      }
      if (!formData.locationState.trim()) {
        newErrors.locationState = "State/Province is required";
      }
    } else if (step === 5) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="Taylor"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Morgan"
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title / Occupation (Optional)</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => updateFormData("jobTitle", e.target.value)}
                placeholder="Student, Founder, Engineer..."
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => updateFormData("bio", e.target.value)}
                placeholder="Tell professionals what you need help with..."
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Picture (Optional)</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload a photo to help professionals recognize you
              </p>
              <ImageUpload
                value={formData.profilePhotoUrl}
                onChange={(value) => updateFormData("profilePhotoUrl", value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Banner Photo (Optional)</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Add a cover photo to personalize your profile
              </p>
              <ImageUpload
                value={formData.bannerPhotoUrl}
                onChange={(value) => updateFormData("bannerPhotoUrl", value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="locationCity">City *</Label>
                <Input
                  id="locationCity"
                  value={formData.locationCity}
                  onChange={(e) => updateFormData("locationCity", e.target.value)}
                  placeholder="Toronto"
                  disabled={isLoading}
                />
                {errors.locationCity && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.locationCity}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationState">Province / State *</Label>
                <Input
                  id="locationState"
                  value={formData.locationState}
                  onChange={(e) => updateFormData("locationState", e.target.value)}
                  placeholder="Ontario"
                  disabled={isLoading}
                />
                {errors.locationState && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.locationState}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="you@company.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {STEPS[currentStep - 1].title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {STEPS[currentStep - 1].description}
            </p>
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Step {currentStep} of {STEPS.length}
          </div>
        </div>

        <div className="flex gap-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`h-2 flex-1 rounded-full transition ${
                step.id <= currentStep
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="min-h-[300px]">{renderStepContent()}</div>

      <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-700">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            type="button"
            variant="gradient"
            onClick={handleNext}
            disabled={isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="gradient"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        )}
      </div>
    </div>
  );
}
