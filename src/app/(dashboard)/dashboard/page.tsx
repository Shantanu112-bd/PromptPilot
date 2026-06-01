import { BarChart3, Bookmark, FolderKanban, History, Plus } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/features/auth/server/get-session";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { prisma } from "@/lib/db/prisma";

export default async function DashboardPage() {
  const session = await requireSession();

  const [promptCount, savedCount, collectionCount, generationCount, recentPrompts] = await Promise.all([
    prisma.prompt.count({ where: { ownerId: session.user.id, deletedAt: null } }),
    prisma.savedPrompt.count({ where: { userId: session.user.id, deletedAt: null } }),
    prisma.promptCollection.count({ where: { ownerId: session.user.id, deletedAt: null } }),
    prisma.generationHistory.count({ where: { userId: session.user.id, deletedAt: null } }),
    prisma.prompt.findMany({
      where: { ownerId: session.user.id, deletedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        updatedAt: true
      }
    })
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Track your prompt library and build reusable AI workflows."
        action={
          <Button asChild>
            <Link href="/dashboard/generator">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              New prompt
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Workspace metrics">
        <StatCard title="Total prompts" value={promptCount} description="Owned prompts" icon={<History className="h-4 w-4" />} />
        <StatCard title="Saved prompts" value={savedCount} description="Bookmarked prompts" icon={<Bookmark className="h-4 w-4" />} />
        <StatCard title="Collections" value={collectionCount} description="Organized groups" icon={<FolderKanban className="h-4 w-4" />} />
        <StatCard title="Generations" value={generationCount} description="Prompt runs" icon={<BarChart3 className="h-4 w-4" />} />
      </section>

      {recentPrompts.length === 0 ? (
        <EmptyState
          title="No prompts yet"
          description="Create your first reusable prompt to start organizing AI workflows for your team."
          action={
            <Button asChild>
              <Link href="/dashboard/generator">
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Create prompt
              </Link>
            </Button>
          }
        />
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {recentPrompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg">{prompt.title}</CardTitle>
                <CardDescription className="line-clamp-2">{prompt.description ?? "No description provided."}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{prompt.status.toLowerCase()}</span>
                <span>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(prompt.updatedAt)}</span>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
