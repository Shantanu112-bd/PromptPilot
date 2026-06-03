"use client";

import { useEffect, useState, useTransition } from "react";
import { getPromptsAction, type GetPromptsInput } from "@/features/prompts/server/get-prompts";
import { PromptCard } from "@/features/prompts/components/prompt-card";
import { LibraryFilters } from "@/features/prompts/components/library-filters";
import { CollectionDialog } from "@/features/prompts/components/collection-dialog";
import { PromptHistoryDialog } from "@/features/prompts/components/prompt-history-dialog";
import { EmptyState } from "@/components/feedback/empty-state";
import { BookmarkX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

type PromptLibraryClientProps = {
  initialPrompts: any[];
  tools: any[];
  categories: any[];
  collections: any[];
};

export function PromptLibraryClient({ initialPrompts, tools, categories, collections }: PromptLibraryClientProps) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<Partial<GetPromptsInput>>({});
  
  // Modals state
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyPromptId, setHistoryPromptId] = useState<string | null>(null);

  useEffect(() => {
    // Skip initial fetch since we have initialPrompts, only fetch when filters change
    if (Object.keys(filters).length === 0) return;
    
    startTransition(async () => {
      const result = await getPromptsAction(filters as GetPromptsInput);
      if (result.ok) {
        setPrompts(result.data.prompts);
      } else {
        toast.error(result.error || "Failed to fetch prompts.");
      }
    });
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<GetPromptsInput>) => {
    setFilters(newFilters);
  };

  const handlePromptDeleted = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handlePromptDuplicated = () => {
    // Refresh list to show duplicate
    startTransition(async () => {
      const result = await getPromptsAction(filters as GetPromptsInput);
      if (result.ok) setPrompts(result.data.prompts);
    });
  };

  return (
    <div className="space-y-6">
      <LibraryFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        tools={tools}
        categories={categories}
        collections={collections}
      />

      {isPending ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : prompts.length === 0 ? (
        <EmptyState
          icon={BookmarkX}
          title="No prompts found"
          description="We couldn't find any prompts matching your current filters."
          action={
            <Button variant="outline" asChild className="mt-4">
              <Link href="/dashboard/generator">Go to Generator</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onDeleted={handlePromptDeleted}
              onDuplicated={handlePromptDuplicated}
              onManageCollections={(p) => {
                setSelectedPrompt(p);
                setIsCollectionOpen(true);
              }}
              onViewHistory={(id) => {
                setHistoryPromptId(id);
                setIsHistoryOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CollectionDialog 
        open={isCollectionOpen} 
        onOpenChange={setIsCollectionOpen}
        prompt={selectedPrompt}
        collections={collections}
      />

      <PromptHistoryDialog 
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        promptId={historyPromptId}
      />
    </div>
  );
}
