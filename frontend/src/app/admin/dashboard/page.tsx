import Link from "next/link";
import { redirect } from "next/navigation";
import { Ban, ShieldAlert, Trash2, Users } from "lucide-react";

import { getCurrentUser } from "@/backend/auth/current-user";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/lawyers");
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Admin Control Center"
        title="Platform moderation and operations"
        description="Use this panel to review accounts, moderate content, and quickly switch to role-specific experiences."
      />

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/consumer/dashboard">View Consumer Dashboard</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/professional/dashboard">View Professional Dashboard</Link>
        </Button>
        <Badge variant="outline" className="px-3 py-2 text-sm">
          Admin Mode Enabled
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-slate-500" />
              User Safety
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">Review flagged accounts and apply moderation actions.</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline">
                <Ban className="mr-1 h-4 w-4" />
                Ban User
              </Button>
              <Button type="button" size="sm" variant="outline">
                <ShieldAlert className="mr-1 h-4 w-4" />
                Suspend Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trash2 className="h-4 w-4 text-slate-500" />
              Content Moderation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">Remove harmful listings and moderate suspicious activity.</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline">
                Remove Post
              </Button>
              <Button type="button" size="sm" variant="outline">
                Archive Listing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
