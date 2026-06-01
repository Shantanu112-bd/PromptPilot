import { Plus } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/features/auth/server/get-session";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SearchBox } from "@/features/dashboard/components/search-box";
import { prisma } from "@/lib/db/prisma";

type PromptsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const session = await requireSession();
  const { q = "" } = await searchParams;
  const query = q.trim();

  const prompts = await prisma.prompt.findMany({
    where: {
      ownerId: session.user.id,
      deletedAt: null,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: { updatedAt: "desc" },
    take: 20
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prompt Library"
        description="Manage reusable prompts and prompt versions."
        action={<SearchBox placeholder="Search prompts..." defaultValue={query} />}
      />

      {prompts.length === 0 ? (
        <EmptyState
          title={query ? "No prompts found" : "Your prompt library is empty"}
          description={query ? "Try a different prompt search." : "Create a prompt to begin building a reusable library for AI workflows."}
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
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Prompt library">
          {prompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg">{prompt.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {prompt.description ?? "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{prompt.content}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
