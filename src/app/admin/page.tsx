import { requireSession } from "@/features/auth/server/get-session";
import { prisma } from "@/lib/db/prisma";
import { AdminOverviewClient } from "@/features/admin/components/admin-overview-client";

export default async function AdminOverviewPage() {
  await requireSession(); // Layout handles redirect

  // Server-rendered base stats
  const [totalUsers, activeUsers, totalPrompts, totalTemplates] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ 
      where: { 
        deletedAt: null,
        generationHistory: { some: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }
      } 
    }),
    prisma.prompt.count({ where: { deletedAt: null } }),
    prisma.promptTemplate.count({ where: { deletedAt: null } })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">System-wide metrics and performance.</p>
      </div>

      <AdminOverviewClient 
        baseStats={{
          totalUsers,
          activeUsers,
          totalPrompts,
          totalTemplates
        }}
      />
    </div>
  );
}
