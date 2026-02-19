import { redirect } from "next/navigation";
import { BriefcaseBusiness, CalendarClock, ShieldCheck } from "lucide-react";

import { getCurrentUser } from "@/backend/auth/current-user";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardPathByRole } from "@/lib/role-navigation";

export const dynamic = "force-dynamic";

export default async function ProfessionalDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "PROFESSIONAL") {
    redirect(getDashboardPathByRole(user.role));
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Professional Workspace"
        title={`Welcome, ${fullName}`}
        description="Manage your public profile, lead pipeline, and availability settings."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BriefcaseBusiness className="h-4 w-4 text-slate-500" />
              New Client Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">7</p>
            <p className="text-sm text-slate-600">3 marked high-priority this week.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="h-4 w-4 text-slate-500" />
              Upcoming Consultations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">4</p>
            <p className="text-sm text-slate-600">Next consultation in 2 hours.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-slate-500" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-emerald-700">Active</p>
            <p className="text-sm text-slate-600">License and profile details are up to date.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile health</CardTitle>
          <Badge>Professional</Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <p>- Add case highlights to improve profile visibility.</p>
          <p>- Keep pricing details updated for better consumer conversion.</p>
          <p>- Respond within 4 hours to boost platform ranking.</p>
        </CardContent>
      </Card>
    </section>
  );
}
