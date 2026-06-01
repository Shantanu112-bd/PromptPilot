import { EmptyState } from "@/components/feedback/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/features/auth/server/get-session";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SearchBox } from "@/features/dashboard/components/search-box";
import { prisma } from "@/lib/db/prisma";

type SavedPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SavedPage({ searchParams }: SavedPageProps) {
  const session = await requireSession();
  const { q = "" } = await searchParams;
  const query = q.trim();

  const savedPrompts = await prisma.savedPrompt.findMany({
    where: {
      userId: session.user.id,
      deletedAt: null,
      prompt: {
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
      }
    },
    orderBy: { createdAt: "desc" },
    include: {
      prompt: {
        select: {
          id: true,
          title: true,
          description: true,
          content: true,
          status: true,
          updatedAt: true
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Prompts"
        description="Keep your most useful prompts close at hand."
        action={<SearchBox placeholder="Search saved prompts..." defaultValue={query} />}
      />

      {savedPrompts.length === 0 ? (
        <EmptyState
          title={query ? "No saved prompts found" : "No saved prompts yet"}
          description={query ? "Try another search query." : "Save prompts from your library to access them quickly."}
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedPrompts.map((saved) => (
            <Card key={saved.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg">{saved.prompt.title}</CardTitle>
                <CardDescription className="line-clamp-2">{saved.prompt.description ?? "No description provided."}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{saved.prompt.content}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
