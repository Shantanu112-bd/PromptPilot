import { requireSession } from "@/features/auth/server/get-session";
import { AdminAnalyticsClient } from "@/features/admin/components/admin-analytics-client";

export default async function AdminAnalyticsPage() {
  await requireSession(); // Layout handles auth

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Deep dive into usage metrics across tools, models, and providers.</p>
      </div>

      <AdminAnalyticsClient />
    </div>
  );
}
