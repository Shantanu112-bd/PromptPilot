import { requireSession } from "@/features/auth/server/get-session";
import { AdminModelsClient } from "@/features/admin/components/admin-models-client";

export default async function AdminModelsPage() {
  await requireSession(); // Layout handles auth

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Models & Providers</h1>
        <p className="text-muted-foreground">Monitor usage, cost, and active models across the platform.</p>
      </div>

      <AdminModelsClient />
    </div>
  );
}
