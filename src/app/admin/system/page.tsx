import { requireSession } from "@/features/auth/server/get-session";
import { AdminSystemClient } from "@/features/admin/components/admin-system-client";

export default async function AdminSystemPage() {
  await requireSession(); // Layout handles auth

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
        <p className="text-muted-foreground">Monitor platform infrastructure and external provider statuses.</p>
      </div>

      <AdminSystemClient />
    </div>
  );
}
