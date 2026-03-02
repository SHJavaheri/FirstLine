import { getCurrentUser } from "@/backend/auth/current-user";
import { redirect } from "next/navigation";
import { getFriendRequests } from "@/backend/repositories/friend-repository";
import { FriendRequestsList } from "@/components/friends/friend-requests-list";

export const dynamic = "force-dynamic";

export default async function FriendRequestsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "CONSUMER") {
    redirect("/");
  }

  const [receivedRequests, sentRequests] = await Promise.all([
    getFriendRequests(user.id, "received", "PENDING"),
    getFriendRequests(user.id, "sent", "PENDING"),
  ]);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Friend Requests</h1>
        <p className="text-slate-600">
          Manage your pending friend requests and see who you've sent requests to.
        </p>
      </div>

      <FriendRequestsList
        receivedRequests={receivedRequests}
        sentRequests={sentRequests}
      />
    </section>
  );
}
