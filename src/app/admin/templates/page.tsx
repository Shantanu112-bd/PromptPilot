import { requireSession } from "@/features/auth/server/get-session";
import { getTemplatesAction } from "@/features/admin/server/manage-templates";
import { AdminTemplatesClient } from "@/features/admin/components/admin-templates-client";

export default async function AdminTemplatesPage() {
  await requireSession(); // Layout handles auth

  const result = await getTemplatesAction(1, 100);
  const initialTemplates = result.ok ? result.data.templates : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prompt Templates</h1>
        <p className="text-muted-foreground">Manage global templates available to all users.</p>
      </div>

      <AdminTemplatesClient initialTemplates={initialTemplates} />
    </div>
  );
}
