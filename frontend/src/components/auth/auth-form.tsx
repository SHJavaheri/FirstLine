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
import { ConsumerRegistrationSteps, type ConsumerFormData } from "@/components/auth/consumer-registration-steps";
import { ProfessionalRegistrationSteps, type ProfessionalFormData } from "@/components/auth/professional-registration-steps";

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
  const [affiliationType, setAffiliationType] = useState<string>("INDEPENDENT");
  const [pricingModel, setPricingModel] = useState<string>("HOURLY");

  async function handleConsumerSubmit(data: ConsumerFormData) {
    setError(null);
    setIsLoading(true);

    const payload: Record<string, unknown> = {
      email: data.email,
      password: data.password,
      role: "CONSUMER",
      firstName: data.firstName,
      lastName: data.lastName,
      profilePhotoUrl: data.profilePhotoUrl || undefined,
      bannerPhotoUrl: data.bannerPhotoUrl || undefined,
      jobTitle: data.jobTitle || undefined,
      bio: data.bio || undefined,
      locationCity: data.locationCity,
      locationState: data.locationState,
      phone: data.phone || undefined,
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseData = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(responseData?.error ?? "Unable to continue. Please try again.");
        return;
      }

      const responseData = (await response.json().catch(() => null)) as { user?: { role?: AccountRole } } | null;
      const role = responseData?.user?.role;

      router.push(role ? getDashboardPathByRole(role) : "/lawyers");
      router.refresh();
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleProfessionalSubmit(data: ProfessionalFormData) {
    setError(null);
    setIsLoading(true);

    const specializationsArray = data.specializations
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const payload: Record<string, unknown> = {
      email: data.email,
      password: data.password,
      role: "PROFESSIONAL",
      firstName: data.firstName,
      lastName: data.lastName,
      profilePhotoUrl: data.profilePhotoUrl || undefined,
      bannerPhotoUrl: data.bannerPhotoUrl || undefined,
      jobTitle: data.jobTitle || undefined,
      bio: data.bio || undefined,
      locationCity: data.locationCity,
      locationState: data.locationState,
      phone: data.phone || undefined,
      professional: {
        affiliationType: data.affiliationType,
        firmName: data.firmName || undefined,
        firmAddress: data.firmAddress || undefined,
        firmWebsite: data.firmWebsite || undefined,
        yearsAtCurrentFirm: data.yearsAtCurrentFirm,
        totalExperienceYears: data.totalExperienceYears,
        licenseNumber: data.licenseNumber,
        licensingBody: data.licensingBody,
        licenseJurisdiction: data.licenseJurisdiction,
        profession: data.profession,
        specializations: specializationsArray,
        pricingModel: data.pricingModel,
        pricingDetails: data.pricingDetails || undefined,
        hourlyRate: data.hourlyRate,
        minRate: data.minRate,
        maxRate: data.maxRate,
        acceptsNewClients: data.acceptsNewClients,
        offersInPerson: data.offersInPerson,
        offersRemote: data.offersRemote,
        education: data.education || undefined,
        certifications: data.certifications || undefined,
        professionalBio: data.professionalBio || undefined,
      },
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseData = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(responseData?.error ?? "Unable to continue. Please try again.");
        return;
      }

      const responseData = (await response.json().catch(() => null)) as { user?: { role?: AccountRole } } | null;
      const role = responseData?.user?.role;

      router.push(role ? getDashboardPathByRole(role) : "/lawyers");
      router.refresh();
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

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
      payload.bannerPhotoUrl = toOptionalString(formData.get("bannerPhotoUrl"));
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
              <div className="grid grid-cols-2 gap-2 rounded-md border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900/50">
                <button
                  type="button"
                  onClick={() => setRegisterRole("CONSUMER")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    registerRole === "CONSUMER" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Consumer Account
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole("PROFESSIONAL")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    registerRole === "PROFESSIONAL" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Professional Account
                </button>
              </div>

              {registerRole === "CONSUMER" ? (
                <ConsumerRegistrationSteps
                  onSubmit={handleConsumerSubmit}
                  isLoading={isLoading}
                />
              ) : (
                <ProfessionalRegistrationSteps
                  onSubmit={handleProfessionalSubmit}
                  isLoading={isLoading}
                />
              )}
            </>
          ) : null}

          {isLogin && (
            <>
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
                  placeholder="Enter password"
                  minLength={8}
                  required
                />
              </div>
            </>
          )}

          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

          {isLogin && (
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Please wait..." : "Sign In"}
            </Button>
          )}

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            {isLogin ? "New to FirstLine?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? "/auth/register" : "/auth/login"}
              className="font-medium text-slate-900 underline underline-offset-2 dark:text-slate-100"
            >
              {isLogin ? "Create account" : "Sign in"}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
