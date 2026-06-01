import { requireSession } from "@/features/auth/server/get-session";
import { getUsersAction } from "@/features/admin/server/manage-users";
import { AdminUsersClient } from "@/features/admin/components/admin-users-client";

export default async function AdminUsersPage() {
  await requireSession(); // Layout handles auth

  const result = await getUsersAction(1, 100);
  const initialUsers = result.ok ? result.data.users : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage user accounts, roles, and access.</p>
      </div>

      <AdminUsersClient initialUsers={initialUsers} />
    </div>
  );
}
