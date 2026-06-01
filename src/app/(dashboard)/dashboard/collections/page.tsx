import { FolderPlus } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/features/auth/server/get-session";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SearchBox } from "@/features/dashboard/components/search-box";
import { prisma } from "@/lib/db/prisma";

type CollectionsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const session = await requireSession();
  const { q = "" } = await searchParams;
  const query = q.trim();

  const collections = await prisma.promptCollection.findMany({
    where: {
      ownerId: session.user.id,
      deletedAt: null,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { prompts: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collections"
        description="Group prompts by product, workflow, team, or tool."
        action={<SearchBox placeholder="Search collections..." defaultValue={query} />}
      />

      {collections.length === 0 ? (
        <EmptyState
          title={query ? "No collections found" : "No collections yet"}
          description={query ? "Try a different collection name." : "Create collections to organize prompts into reusable workspaces."}
          action={
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              New collection
            </Button>
          }
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <Card key={collection.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg">{collection.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {collection.description ?? "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{collection._count.prompts} prompts</span>
                <span>{collection.visibility.toLowerCase()}</span>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
