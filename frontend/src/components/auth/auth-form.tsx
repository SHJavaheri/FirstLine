"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { getDashboardPathByRole } from "@/lib/role-navigation";
import type { AccountRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

type RegisterRole = Extract<AccountRole, "CONSUMER" | "PROFESSIONAL">;

const PROFESSIONS = ["Lawyer", "Accountant", "Real Estate Agent", "Financial Advisor", "Consultant", "Other"];

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toOptionalString(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registerRole, setRegisterRole] = useState<RegisterRole>("CONSUMER");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    if (!isLogin) {
      payload.role = registerRole;
      payload.firstName = String(formData.get("firstName") ?? "");
      payload.lastName = String(formData.get("lastName") ?? "");
      payload.profilePhotoUrl = toOptionalString(formData.get("profilePhotoUrl"));
      payload.jobTitle = toOptionalString(formData.get("jobTitle"));
      payload.bio = toOptionalString(formData.get("bio"));
      payload.locationCity = String(formData.get("locationCity") ?? "");
      payload.locationState = String(formData.get("locationState") ?? "");
      payload.phone = toOptionalString(formData.get("phone"));

      if (registerRole === "PROFESSIONAL") {
        const specializationsInput = String(formData.get("specializations") ?? "");
        const specializations = specializationsInput
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);

        payload.professional = {
          affiliationType: String(formData.get("affiliationType") ?? "INDEPENDENT"),
          firmName: toOptionalString(formData.get("firmName")),
          firmAddress: toOptionalString(formData.get("firmAddress")),
          firmWebsite: toOptionalString(formData.get("firmWebsite")),
          yearsAtCurrentFirm: parseOptionalNumber(formData.get("yearsAtCurrentFirm")),
          totalExperienceYears: parseOptionalNumber(formData.get("totalExperienceYears")) ?? 0,
          licenseNumber: String(formData.get("licenseNumber") ?? ""),
          licensingBody: String(formData.get("licensingBody") ?? ""),
          licenseJurisdiction: String(formData.get("licenseJurisdiction") ?? ""),
          profession: String(formData.get("profession") ?? ""),
          specializations,
          pricingModel: String(formData.get("pricingModel") ?? ""),
          pricingDetails: toOptionalString(formData.get("pricingDetails")),
          hourlyRate: parseOptionalNumber(formData.get("hourlyRate")),
          minRate: parseOptionalNumber(formData.get("minRate")),
          maxRate: parseOptionalNumber(formData.get("maxRate")),
          acceptsNewClients: formData.get("acceptsNewClients") === "on",
          offersInPerson: formData.get("offersInPerson") === "on",
          offersRemote: formData.get("offersRemote") === "on",
          education: toOptionalString(formData.get("education")),
          certifications: toOptionalString(formData.get("certifications")),
          professionalBio: toOptionalString(formData.get("professionalBio")),
        };
      }
    }

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Unable to continue. Please try again.");
        return;
      }

      const data = (await response.json().catch(() => null)) as { user?: { role?: AccountRole } } | null;
      const role = data?.user?.role;

      router.push(role ? getDashboardPathByRole(role) : "/lawyers");
      router.refresh();
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const isLogin = mode === "login";
  const registerButtonLabel =
    registerRole === "PROFESSIONAL" ? "Create Professional Account" : "Create Consumer Account";

  return (
    <Card className={`mx-auto w-full ${isLogin ? "max-w-md" : "max-w-3xl"}`}>
      <CardHeader>
        <CardTitle>{isLogin ? "Welcome back" : "Create your account"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Sign in to access your personalized lawyer discovery dashboard."
            : "Choose account type and complete your profile to join FirstLine."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin ? (
            <>
              <div className="grid grid-cols-2 gap-2 rounded-md border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setRegisterRole("CONSUMER")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    registerRole === "CONSUMER" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Consumer Account
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole("PROFESSIONAL")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    registerRole === "PROFESSIONAL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Professional Account
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="Taylor" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Morgan" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePhotoUrl">Profile Photo URL (Optional)</Label>
                <Input id="profilePhotoUrl" name="profilePhotoUrl" placeholder="https://example.com/photo.jpg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title / Occupation (Optional)</Label>
                <Input id="jobTitle" name="jobTitle" placeholder="Student, Founder, Engineer..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Short Bio (Optional)</Label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  placeholder="Tell professionals what you need help with..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="locationCity">City</Label>
                  <Input id="locationCity" name="locationCity" placeholder="Toronto" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationState">Province / State</Label>
                  <Input id="locationState" name="locationState" placeholder="Ontario" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" name="phone" placeholder="+1 (555) 123-4567" />
              </div>

              {registerRole === "PROFESSIONAL" ? (
                <div className="space-y-4 rounded-lg border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">Professional Details</p>

                  <div className="space-y-2">
                    <Label htmlFor="affiliationType">Affiliation</Label>
                    <select
                      id="affiliationType"
                      name="affiliationType"
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                      defaultValue="INDEPENDENT"
                    >
                      <option value="INDEPENDENT">Independent</option>
                      <option value="FIRM">Affiliated with a Firm</option>
                    </select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firmName">Firm Name</Label>
                      <Input id="firmName" name="firmName" placeholder="Acme Legal LLP" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firmWebsite">Firm Website</Label>
                      <Input id="firmWebsite" name="firmWebsite" placeholder="https://firm.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firmAddress">Firm Address (Optional)</Label>
                    <Input id="firmAddress" name="firmAddress" placeholder="123 Market St" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="yearsAtCurrentFirm">Years at Current Firm</Label>
                      <Input id="yearsAtCurrentFirm" name="yearsAtCurrentFirm" type="number" min={0} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalExperienceYears">Total Years of Experience</Label>
                      <Input id="totalExperienceYears" name="totalExperienceYears" type="number" min={0} required />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input id="licenseNumber" name="licenseNumber" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licensingBody">Licensing Body</Label>
                      <Input id="licensingBody" name="licensingBody" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseJurisdiction">License Jurisdiction</Label>
                    <Input id="licenseJurisdiction" name="licenseJurisdiction" required />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <select
                        id="profession"
                        name="profession"
                        className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        defaultValue="Lawyer"
                      >
                        {PROFESSIONS.map((profession) => (
                          <option key={profession} value={profession}>
                            {profession}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                      <Input id="specializations" name="specializations" placeholder="Family Law, Immigration Law" required />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pricingModel">Pricing Model</Label>
                      <select
                        id="pricingModel"
                        name="pricingModel"
                        className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        defaultValue="HOURLY"
                      >
                        <option value="HOURLY">Hourly Rate</option>
                        <option value="FIXED">Fixed Fee</option>
                        <option value="CONTINGENCY">Contingency</option>
                        <option value="FREE_CONSULTATION">Free Consultation</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pricingDetails">Pricing Notes (Optional)</Label>
                      <Input id="pricingDetails" name="pricingDetails" placeholder="Packages start at $1,000" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate</Label>
                      <Input id="hourlyRate" name="hourlyRate" type="number" min={0} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minRate">Min Rate</Label>
                      <Input id="minRate" name="minRate" type="number" min={0} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxRate">Max Rate</Label>
                      <Input id="maxRate" name="maxRate" type="number" min={0} />
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-700">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" name="acceptsNewClients" defaultChecked className="h-4 w-4" />
                      Accepting new clients
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" name="offersInPerson" defaultChecked className="h-4 w-4" />
                      Offers in-person services
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" name="offersRemote" defaultChecked className="h-4 w-4" />
                      Offers remote services
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education (Optional)</Label>
                    <textarea
                      id="education"
                      name="education"
                      rows={2}
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications (Optional)</Label>
                    <textarea
                      id="certifications"
                      name="certifications"
                      rows={2}
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="professionalBio">Professional Bio (Optional)</Label>
                    <textarea
                      id="professionalBio"
                      name="professionalBio"
                      rows={3}
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    />
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@company.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={isLogin ? "Enter password" : "At least 8 characters"}
              minLength={8}
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : isLogin ? "Sign In" : registerButtonLabel}
          </Button>

          <p className="text-center text-sm text-slate-600">
            {isLogin ? "New to FirstLine?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? "/auth/register" : "/auth/login"}
              className="font-medium text-slate-900 underline underline-offset-2"
            >
              {isLogin ? "Create account" : "Sign in"}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
