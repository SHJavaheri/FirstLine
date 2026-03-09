"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";

interface ProfessionalRegistrationStepsProps {
  onSubmit: (data: ProfessionalFormData) => void;
  isLoading: boolean;
}

export interface ProfessionalFormData {
  firstName: string;
  lastName: string;
  bio?: string;
  profilePhotoUrl?: string;
  locationCity: string;
  locationState: string;
  phone?: string;
  email: string;
  password: string;
  jobTitle?: string;
  affiliationType: string;
  firmName?: string;
  firmAddress?: string;
  firmWebsite?: string;
  yearsAtCurrentFirm?: number;
  totalExperienceYears: number;
  licenseNumber: string;
  licensingBody: string;
  licenseJurisdiction: string;
  profession: string;
  specializations: string;
  pricingModel: string;
  pricingDetails?: string;
  hourlyRate?: number;
  minRate?: number;
  maxRate?: number;
  acceptsNewClients: boolean;
  offersInPerson: boolean;
  offersRemote: boolean;
  education?: string;
  certifications?: string;
  professionalBio?: string;
}

const PROFESSIONS = ["Lawyer", "Accountant", "Real Estate Agent", "Financial Advisor", "Consultant", "Other"];

const STEPS = [
  { id: 1, title: "Personal Info", description: "Tell us about yourself" },
  { id: 2, title: "Profile Picture", description: "Add a photo (optional)" },
  { id: 3, title: "Professional Details", description: "Your credentials" },
  { id: 4, title: "Firm & Experience", description: "Your practice information" },
  { id: 5, title: "Pricing & Services", description: "How you work with clients" },
  { id: 6, title: "Location & Contact", description: "Where are you located?" },
  { id: 7, title: "Account Credentials", description: "Secure your account" },
];

export function ProfessionalRegistrationSteps({ onSubmit, isLoading }: ProfessionalRegistrationStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProfessionalFormData>({
    firstName: "",
    lastName: "",
    bio: "",
    profilePhotoUrl: "",
    locationCity: "",
    locationState: "",
    phone: "",
    email: "",
    password: "",
    jobTitle: "",
    affiliationType: "INDEPENDENT",
    firmName: "",
    firmAddress: "",
    firmWebsite: "",
    yearsAtCurrentFirm: undefined,
    totalExperienceYears: 0,
    licenseNumber: "",
    licensingBody: "",
    licenseJurisdiction: "",
    profession: "Lawyer",
    specializations: "",
    pricingModel: "HOURLY",
    pricingDetails: "",
    hourlyRate: undefined,
    minRate: undefined,
    maxRate: undefined,
    acceptsNewClients: true,
    offersInPerson: true,
    offersRemote: true,
    education: "",
    certifications: "",
    professionalBio: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfessionalFormData, string>>>({});

  const updateFormData = (field: keyof ProfessionalFormData, value: string | number | boolean | null | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value === null || value === undefined ? "" : value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof ProfessionalFormData, string>> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
    } else if (step === 3) {
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = "License number is required";
      }
      if (!formData.licensingBody.trim()) {
        newErrors.licensingBody = "Licensing body is required";
      }
      if (!formData.licenseJurisdiction.trim()) {
        newErrors.licenseJurisdiction = "License jurisdiction is required";
      }
      if (!formData.specializations.trim()) {
        newErrors.specializations = "At least one specialization is required";
      }
    } else if (step === 4) {
      if (formData.totalExperienceYears === undefined || formData.totalExperienceYears < 0) {
        newErrors.totalExperienceYears = "Total experience years is required";
      }
      if (formData.affiliationType === "FIRM") {
        if (!formData.firmName?.trim()) {
          newErrors.firmName = "Firm name is required";
        }
        if (formData.yearsAtCurrentFirm === undefined || formData.yearsAtCurrentFirm < 0) {
          newErrors.yearsAtCurrentFirm = "Years at current firm is required";
        }
      }
    } else if (step === 6) {
      if (!formData.locationCity.trim()) {
        newErrors.locationCity = "City is required";
      }
      if (!formData.locationState.trim()) {
        newErrors.locationState = "State/Province is required";
      }
    } else if (step === 7) {
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
              <Label htmlFor="jobTitle">Job Title (Optional)</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => updateFormData("jobTitle", e.target.value)}
                placeholder="Senior Partner, Associate Attorney..."
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => updateFormData("bio", e.target.value)}
                placeholder="Brief introduction about yourself..."
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
                Upload a professional photo to help clients recognize you
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
              <Label htmlFor="profession">Profession *</Label>
              <select
                id="profession"
                value={formData.profession}
                onChange={(e) => updateFormData("profession", e.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-100 dark:focus-visible:ring-slate-500"
                disabled={isLoading}
              >
                {PROFESSIONS.map((profession) => (
                  <option key={profession} value={profession}>
                    {profession}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specializations">Specializations (comma-separated) *</Label>
              <Input
                id="specializations"
                value={formData.specializations}
                onChange={(e) => updateFormData("specializations", e.target.value)}
                placeholder="Family Law, Immigration Law"
                disabled={isLoading}
              />
              {errors.specializations && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.specializations}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => updateFormData("licenseNumber", e.target.value)}
                  disabled={isLoading}
                />
                {errors.licenseNumber && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.licenseNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="licensingBody">Licensing Body *</Label>
                <Input
                  id="licensingBody"
                  value={formData.licensingBody}
                  onChange={(e) => updateFormData("licensingBody", e.target.value)}
                  disabled={isLoading}
                />
                {errors.licensingBody && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.licensingBody}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseJurisdiction">License Jurisdiction *</Label>
              <Input
                id="licenseJurisdiction"
                value={formData.licenseJurisdiction}
                onChange={(e) => updateFormData("licenseJurisdiction", e.target.value)}
                placeholder="State, Province, or Country"
                disabled={isLoading}
              />
              {errors.licenseJurisdiction && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.licenseJurisdiction}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="affiliationType">Affiliation *</Label>
              <select
                id="affiliationType"
                value={formData.affiliationType}
                onChange={(e) => updateFormData("affiliationType", e.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-100 dark:focus-visible:ring-slate-500"
                disabled={isLoading}
              >
                <option value="INDEPENDENT">Independent</option>
                <option value="FIRM">Affiliated with a Firm</option>
              </select>
            </div>

            {formData.affiliationType === "FIRM" && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firmName">Firm Name *</Label>
                    <Input
                      id="firmName"
                      value={formData.firmName}
                      onChange={(e) => updateFormData("firmName", e.target.value)}
                      placeholder="Acme Legal LLP"
                      disabled={isLoading}
                    />
                    {errors.firmName && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.firmName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firmWebsite">Firm Website (Optional)</Label>
                    <Input
                      id="firmWebsite"
                      value={formData.firmWebsite}
                      onChange={(e) => updateFormData("firmWebsite", e.target.value)}
                      placeholder="https://firm.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firmAddress">Firm Address (Optional)</Label>
                  <Input
                    id="firmAddress"
                    value={formData.firmAddress}
                    onChange={(e) => updateFormData("firmAddress", e.target.value)}
                    placeholder="123 Market St"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="yearsAtCurrentFirm">Years at Current Firm *</Label>
                    <Input
                      id="yearsAtCurrentFirm"
                      type="number"
                      min={0}
                      value={formData.yearsAtCurrentFirm ?? ""}
                      onChange={(e) => updateFormData("yearsAtCurrentFirm", e.target.value ? Number(e.target.value) : undefined)}
                      disabled={isLoading}
                    />
                    {errors.yearsAtCurrentFirm && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.yearsAtCurrentFirm}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalExperienceYears">Total Years of Experience *</Label>
                    <Input
                      id="totalExperienceYears"
                      type="number"
                      min={0}
                      value={formData.totalExperienceYears}
                      onChange={(e) => updateFormData("totalExperienceYears", Number(e.target.value))}
                      disabled={isLoading}
                    />
                    {errors.totalExperienceYears && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.totalExperienceYears}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {formData.affiliationType === "INDEPENDENT" && (
              <div className="space-y-2">
                <Label htmlFor="totalExperienceYears">Total Years of Experience *</Label>
                <Input
                  id="totalExperienceYears"
                  type="number"
                  min={0}
                  value={formData.totalExperienceYears}
                  onChange={(e) => updateFormData("totalExperienceYears", Number(e.target.value))}
                  disabled={isLoading}
                />
                {errors.totalExperienceYears && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.totalExperienceYears}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="education">Education (Optional)</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => updateFormData("education", e.target.value)}
                placeholder="Degrees, universities, graduation years..."
                rows={2}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications (Optional)</Label>
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => updateFormData("certifications", e.target.value)}
                placeholder="Professional certifications and credentials..."
                rows={2}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalBio">Professional Bio (Optional)</Label>
              <Textarea
                id="professionalBio"
                value={formData.professionalBio}
                onChange={(e) => updateFormData("professionalBio", e.target.value)}
                placeholder="Detailed description of your practice and expertise..."
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pricingModel">Pricing Model *</Label>
                <select
                  id="pricingModel"
                  value={formData.pricingModel}
                  onChange={(e) => updateFormData("pricingModel", e.target.value)}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-100 dark:focus-visible:ring-slate-500"
                  disabled={isLoading}
                >
                  <option value="HOURLY">Hourly Rate</option>
                  <option value="FIXED">Fixed Fee</option>
                  <option value="CONTINGENCY">Contingency</option>
                  <option value="FREE_CONSULTATION">Free Consultation</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricingDetails">Pricing Notes (Optional)</Label>
                <Input
                  id="pricingDetails"
                  value={formData.pricingDetails}
                  onChange={(e) => updateFormData("pricingDetails", e.target.value)}
                  placeholder="Packages start at $1,000"
                  disabled={isLoading}
                />
              </div>
            </div>

            {formData.pricingModel === "HOURLY" && (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (Optional)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min={0}
                    value={formData.hourlyRate ?? ""}
                    onChange={(e) => updateFormData("hourlyRate", e.target.value ? Number(e.target.value) : undefined)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minRate">Min Rate (Optional)</Label>
                  <Input
                    id="minRate"
                    type="number"
                    min={0}
                    value={formData.minRate ?? ""}
                    onChange={(e) => updateFormData("minRate", e.target.value ? Number(e.target.value) : undefined)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxRate">Max Rate (Optional)</Label>
                  <Input
                    id="maxRate"
                    type="number"
                    min={0}
                    value={formData.maxRate ?? ""}
                    onChange={(e) => updateFormData("maxRate", e.target.value ? Number(e.target.value) : undefined)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {formData.pricingModel === "FIXED" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minRate">Min Fixed Fee (Optional)</Label>
                  <Input
                    id="minRate"
                    type="number"
                    min={0}
                    value={formData.minRate ?? ""}
                    onChange={(e) => updateFormData("minRate", e.target.value ? Number(e.target.value) : undefined)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxRate">Max Fixed Fee (Optional)</Label>
                  <Input
                    id="maxRate"
                    type="number"
                    min={0}
                    value={formData.maxRate ?? ""}
                    onChange={(e) => updateFormData("maxRate", e.target.value ? Number(e.target.value) : undefined)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label>Service Options</Label>
              <div className="grid gap-2 text-sm">
                <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.acceptsNewClients}
                    onChange={(e) => updateFormData("acceptsNewClients", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
                    disabled={isLoading}
                  />
                  Accepting new clients
                </label>
                <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.offersInPerson}
                    onChange={(e) => updateFormData("offersInPerson", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
                    disabled={isLoading}
                  />
                  Offers in-person services
                </label>
                <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.offersRemote}
                    onChange={(e) => updateFormData("offersRemote", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
                    disabled={isLoading}
                  />
                  Offers remote services
                </label>
              </div>
            </div>
          </div>
        );

      case 6:
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

      case 7:
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
            {isLoading ? "Creating Account..." : "Create Professional Account"}
          </Button>
        )}
      </div>
    </div>
  );
}
