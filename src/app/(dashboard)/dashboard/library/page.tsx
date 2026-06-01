import { PageHeader } from "@/features/dashboard/components/page-header";
import { PromptLibraryClient } from "@/features/prompts/components/prompt-library-client";
import { getPromptsAction } from "@/features/prompts/server/get-prompts";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/features/auth/server/get-session";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default async function LibraryPage() {
  const session = await requireSession();

  // Fetch initial data for filters
  const [tools, categories, collections, initialPromptsResult] = await Promise.all([
    prisma.tool.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.promptCollection.findMany({ 
      where: { ownerId: session.user.id, deletedAt: null }, 
      select: { id: true, name: true }, 
      orderBy: { name: "asc" } 
    }),
    getPromptsAction({ page: 1, limit: 20 })
  ]);

  const initialPrompts = initialPromptsResult.ok ? initialPromptsResult.data.prompts : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prompt Library"
        description="Your personal collection of saved, favorite, and curated prompts."
        action={
          <Button asChild>
            <Link href="/dashboard/generator">
              <Sparkles className="mr-2 h-4 w-4" />
              New Prompt
            </Link>
          </Button>
        }
      />

      <PromptLibraryClient 
        initialPrompts={initialPrompts} 
        tools={tools} 
        categories={categories} 
        collections={collections} 
      />
    </div>
  );
}

