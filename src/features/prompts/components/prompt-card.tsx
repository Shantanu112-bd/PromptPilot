"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Copy, MoreVertical, Star, Pen, CopyPlus, Trash2, Tag, Archive } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { toggleFavoriteAction } from "@/features/prompts/server/toggle-favorite";
import { deletePromptAction, duplicatePromptAction } from "@/features/prompts/server/manage-prompt";

// We import the return type of our getPromptsAction to type this properly
type PromptCardProps = {
  prompt: any; // In a strict app, extract the type from GetPromptsAction return data
  onDeleted?: (id: string) => void;
  onDuplicated?: (id: string) => void;
  onEdit?: (prompt: any) => void;
  onViewHistory?: (id: string) => void;
  onManageCollections?: (prompt: any) => void;
};

export function PromptCard({ 
  prompt, 
  onDeleted, 
  onDuplicated, 
  onEdit, 
  onViewHistory, 
  onManageCollections 
}: PromptCardProps) {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(prompt.isFavorite);
  const [isPending, setIsPending] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard."
    });
  };

  const handleToggleFavorite = async () => {
    setIsPending(true);
    const result = await toggleFavoriteAction(prompt.id);
    setIsPending(false);

    if (result.ok) {
      setIsFavorite(result.data.isFavorite);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;
    
    setIsPending(true);
    const result = await deletePromptAction(prompt.id);
    setIsPending(false);

    if (result.ok) {
      toast({ title: "Prompt deleted." });
      onDeleted?.(prompt.id);
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleDuplicate = async () => {
    setIsPending(true);
    const result = await duplicatePromptAction(prompt.id);
    setIsPending(false);

    if (result.ok) {
      toast({ title: "Prompt duplicated." });
      onDuplicated?.(result.data.id);
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors group">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 pr-4">
          <CardTitle className="line-clamp-1 text-lg font-bold" title={prompt.title}>
            {prompt.title}
          </CardTitle>
          <CardDescription className="text-xs mt-1 flex items-center text-muted-foreground">
            {formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true })}
            {prompt.usageCount > 0 && ` • ${prompt.usageCount} uses`}
            {prompt.versionCount > 0 && ` • v${prompt.versionCount}`}
          </CardDescription>
        </div>
        
        <div className="flex items-center space-x-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleToggleFavorite}
            disabled={isPending}
            title={isFavorite ? "Unfavorite" : "Favorite"}
          >
            <Star className={`h-4 w-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
            <span className="sr-only">{isFavorite ? "Unfavorite" : "Favorite"}</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending}>
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" /> Copy Content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(prompt)}>
                <Pen className="mr-2 h-4 w-4" /> Edit Metadata
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageCollections?.(prompt)}>
                <Archive className="mr-2 h-4 w-4" /> Manage Collections
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewHistory?.(prompt.id)}>
                <Tag className="mr-2 h-4 w-4" /> View History
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDuplicate}>
                <CopyPlus className="mr-2 h-4 w-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pt-2">
        <p className="text-sm line-clamp-3 text-foreground/80 mb-4">
          {prompt.description || prompt.content}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {prompt.tool && (
            <Badge variant="secondary" className="text-xs">
              {prompt.tool.name}
            </Badge>
          )}
          {prompt.model && (
            <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5">
              {prompt.model.displayName}
            </Badge>
          )}
          {prompt.category && (
            <Badge variant="outline" className="text-xs">
              {prompt.category.name}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button variant="secondary" className="w-full" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" /> Quick Copy
        </Button>
      </CardFooter>
    </Card>
  );
}
