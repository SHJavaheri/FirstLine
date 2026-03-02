import { getCurrentUser } from "@/backend/auth/current-user";
import { getConsumerProfile } from "@/backend/repositories/consumer-repository";
import { redirect } from "next/navigation";
import { ConsumerProfileHeader } from "@/components/profile/consumer-profile-header";
import { ConsumerProfileTabs } from "@/components/profile/consumer-profile-tabs";

export const dynamic = "force-dynamic";

export default async function ConsumerProfilePage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "CONSUMER") {
    redirect("/");
  }

  const { accountId } = await params;

  try {
    const profile = await getConsumerProfile(user.id, accountId);

    return (
      <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <ConsumerProfileHeader profile={profile} currentUserId={user.id} />
        <ConsumerProfileTabs accountId={accountId} profile={profile} />
      </section>
    );
  } catch (error) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
          <h2 className="text-xl font-semibold text-red-900">Profile Not Found</h2>
          <p className="mt-2 text-sm text-red-700">
            {error instanceof Error ? error.message : "This profile could not be found."}
          </p>
        </div>
      </section>
    );
  }
}
