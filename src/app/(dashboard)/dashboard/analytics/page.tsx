import { Activity, Coins, History, Timer } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/features/auth/server/get-session";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { prisma } from "@/lib/db/prisma";

export default async function AnalyticsPage() {
  const session = await requireSession();

  const [generationCount, completedCount, tokenUsage, recentEvents] = await Promise.all([
    prisma.generationHistory.count({ where: { userId: session.user.id, deletedAt: null } }),
    prisma.generationHistory.count({ where: { userId: session.user.id, status: "COMPLETED", deletedAt: null } }),
    prisma.usageAnalytics.aggregate({
      where: { userId: session.user.id, deletedAt: null },
      _sum: {
        inputTokens: true,
        outputTokens: true,
        costUsd: true
      }
    }),
    prisma.usageAnalytics.findMany({
      where: { userId: session.user.id, deletedAt: null },
      orderBy: { occurredAt: "desc" },
      take: 10,
      include: {
        prompt: { select: { title: true } },
        model: { select: { displayName: true } },
        aiProvider: { select: { name: true } }
      }
    })
  ]);

  const totalTokens = (tokenUsage._sum.inputTokens ?? 0) + (tokenUsage._sum.outputTokens ?? 0);
  const totalCost = tokenUsage._sum.costUsd?.toNumber?.() ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Monitor usage, costs, prompt runs, and model activity." />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Analytics metrics">
        <StatCard title="Generations" value={generationCount} description="Total prompt runs" icon={<History className="h-4 w-4" />} />
        <StatCard title="Completed" value={completedCount} description="Successful runs" icon={<Activity className="h-4 w-4" />} />
        <StatCard title="Tokens" value={totalTokens.toLocaleString()} description="Input and output" icon={<Timer className="h-4 w-4" />} />
        <StatCard title="Estimated cost" value={`$${totalCost.toFixed(4)}`} description="Tracked usage" icon={<Coins className="h-4 w-4" />} />
      </section>

      {recentEvents.length === 0 ? (
        <EmptyState
          title="No analytics yet"
          description="Usage events will appear after prompts are generated, saved, or executed."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest tracked prompt and model events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">{event.eventType.toLowerCase().replaceAll("_", " ")}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.prompt?.title ?? "Workspace event"} · {event.aiProvider?.name ?? "Provider"} · {event.model?.displayName ?? "Model"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(event.occurredAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
