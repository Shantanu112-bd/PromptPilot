"use client";

import React, { useState } from "react";
import { Copy, Heart, Bookmark, Check } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toggleFavoritePrompt } from "@/features/library/server/library-actions";

type PromptCardProps = {
  savedPromptId: string;
  title: string;
  description?: string | null;
  content: string;
  tags: string[];
  initialFavorite: boolean;
  categoryName?: string | null;
};

export const PromptCard = React.memo(function PromptCard({ savedPromptId, title, description, content, tags, initialFavorite, categoryName }: PromptCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isCopied, setIsCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  async function handleToggleFavorite() {
    setIsToggling(true);
    try {
      const result = await toggleFavoritePrompt(savedPromptId, !isFavorite);
      if (result.ok) {
        setIsFavorite(result.data.isFavorite);
        toast.success(result.data.isFavorite ? "Added to favorites" : "Removed from favorites");
      }
    } catch (err) {
      toast.error("Failed to update favorite status");
    } finally {
      setIsToggling(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      toast.success("Prompt copied!");
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow group">
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1 overflow-hidden pr-4">
          <CardTitle className="truncate text-base">{title}</CardTitle>
          {categoryName && (
            <CardDescription className="text-xs font-medium text-primary">
              {categoryName}
            </CardDescription>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 -mt-2 -mr-2 shrink-0" 
          onClick={handleToggleFavorite}
          disabled={isToggling}
        >
          <span className="sr-only">Toggle Favorite</span>
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground group-hover:text-foreground"}`} />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 pb-3 text-sm text-muted-foreground">
        {description && <p className="mb-3 text-xs line-clamp-2">{description}</p>}
        <div className="relative rounded-md bg-muted/50 p-3 h-24 overflow-hidden border border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/80 z-10 pointer-events-none" />
          <p className="font-mono text-xs text-foreground/80 line-clamp-4 leading-relaxed">{content}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap overflow-hidden h-6">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-[10px] font-medium truncate max-w-[80px]">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] text-muted-foreground font-medium">+{tags.length - 3}</span>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <Button variant="secondary" size="icon" className="h-7 w-7" onClick={handleCopy} title="Copy Prompt">
            <span className="sr-only">Copy Prompt</span>
            {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="secondary" size="icon" className="h-7 w-7" title="Add to Collection">
            <span className="sr-only">Add to Collection</span>
            <Bookmark className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});
