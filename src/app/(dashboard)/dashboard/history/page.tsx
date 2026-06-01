import { EmptyState } from "@/components/feedback/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/features/auth/server/get-session";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SearchBox } from "@/features/dashboard/components/search-box";
import { prisma } from "@/lib/db/prisma";

type HistoryPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const session = await requireSession();
  const { q = "" } = await searchParams;
  const query = q.trim();

  const history = await prisma.generationHistory.findMany({
    where: {
      userId: session.user.id,
      deletedAt: null,
      ...(query
        ? {
            OR: [
              { input: { contains: query, mode: "insensitive" } },
              { output: { contains: query, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      prompt: { select: { title: true } },
      model: { select: { displayName: true } },
      aiProvider: { select: { name: true } }
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prompt History"
        description="Review generated prompts, model runs, and execution outputs."
        action={<SearchBox placeholder="Search history..." defaultValue={query} />}
      />

      {history.length === 0 ? (
        <EmptyState
          title={query ? "No matching history" : "No prompt history yet"}
          description={query ? "Try a different search term." : "Generated prompts and model outputs will appear here."}
        />
      ) : (
        <section className="grid gap-4">
          {history.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="line-clamp-1 text-lg">{item.prompt?.title ?? "Ad hoc generation"}</CardTitle>
                    <CardDescription>
                      {item.aiProvider?.name ?? "Provider"} · {item.model?.displayName ?? "Model"} · {item.status.toLowerCase()}
                    </CardDescription>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(item.createdAt)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-2 text-sm text-muted-foreground">{item.input}</p>
                {item.output ? <p className="line-clamp-2 rounded-md bg-muted p-3 text-sm">{item.output}</p> : null}
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
