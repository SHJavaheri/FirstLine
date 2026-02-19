import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleCheck, MessageSquare, Search } from "lucide-react";

import { getCurrentUser } from "@/backend/auth/current-user";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardPathByRole } from "@/lib/role-navigation";

export const dynamic = "force-dynamic";

export default async function ConsumerDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "CONSUMER") {
    redirect(getDashboardPathByRole(user.role));
  }

  const firstName = user.firstName ?? "there";

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Consumer Workspace"
        title={`Welcome back, ${firstName}`}
        description="Track your legal discovery progress and continue conversations with professionals."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-slate-500" />
              Saved Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">3</p>
            <p className="text-sm text-slate-600">Alerts ready for Family Law in Ontario.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4 text-slate-500" />
              Open Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">2</p>
            <p className="text-sm text-slate-600">Professionals responded within the last 24 hours.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CircleCheck className="h-4 w-4 text-slate-500" />
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">82%</p>
            <p className="text-sm text-slate-600">Add your profile photo to build more trust.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recommended next steps</CardTitle>
          <Badge variant="secondary">Consumer</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-700">
            Explore verified professionals, shortlist profiles, and start a secure inquiry from one place.
          </p>
          <Button asChild>
            <Link href="/lawyers">Explore Professionals</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
