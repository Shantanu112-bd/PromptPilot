"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  createCollectionAction, 
  addPromptToCollectionAction, 
  removePromptFromCollectionAction 
} from "@/features/prompts/server/manage-collections";

type CollectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: any | null; // The prompt being managed
  collections: any[]; // User's existing collections
  onCollectionCreated?: () => void;
};

export function CollectionDialog({ open, onOpenChange, prompt, collections, onCollectionCreated }: CollectionDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // We assume prompt.collections is populated with { id, name } of collections it belongs to, 
  // or we just manage optimistic state locally if not perfectly passed.
  const promptCollectionIds = prompt?.collections?.map((c: any) => c.id) || [];
  const [activeCollectionIds, setActiveCollectionIds] = useState<Set<string>>(new Set(promptCollectionIds));

  const handleToggleCollection = async (collectionId: string, checked: boolean) => {
    if (!prompt) return;
    
    setIsPending(true);
    let result;
    if (checked) {
      result = await addPromptToCollectionAction(prompt.id, collectionId);
    } else {
      result = await removePromptFromCollectionAction(prompt.id, collectionId);
    }
    setIsPending(false);

    if (result.ok) {
      const next = new Set(activeCollectionIds);
      if (checked) next.add(collectionId);
      else next.delete(collectionId);
      setActiveCollectionIds(next);
      toast.success("Collections updated.");
    } else {
      toast.error(result.error || "Failed to update collections.");
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    
    setIsPending(true);
    const result = await createCollectionAction({ name: newCollectionName });
    setIsPending(false);

    if (result.ok) {
      toast.success("Collection created.");
      setNewCollectionName("");
      setIsCreating(false);
      onCollectionCreated?.(); // Trigger parent refresh
      
      // Optionally automatically add this prompt to the new collection
      if (prompt) {
        handleToggleCollection(result.data.id, true);
      }
    } else {
      toast.error(result.error || "Failed to create collection.");
    }
  };

  if (!prompt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Collections</DialogTitle>
          <DialogDescription>
            Add or remove "{prompt.title}" from your collections.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {collections.length === 0 && !isCreating ? (
            <p className="text-sm text-muted-foreground text-center py-4">No collections found.</p>
          ) : (
            <div className="space-y-3">
              {collections.map(col => (
                <div key={col.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`col-${col.id}`} 
                    checked={activeCollectionIds.has(col.id)}
                    onCheckedChange={(checked) => handleToggleCollection(col.id, checked as boolean)}
                    disabled={isPending}
                  />
                  <Label htmlFor={`col-${col.id}`} className="flex-1 cursor-pointer">
                    {col.name}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {isCreating ? (
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="new-col">New Collection Name</Label>
              <div className="flex gap-2">
                <Input 
                  id="new-col" 
                  value={newCollectionName} 
                  onChange={e => setNewCollectionName(e.target.value)} 
                  placeholder="e.g. Content Writing" 
                  disabled={isPending}
                />
                <Button onClick={handleCreateCollection} disabled={isPending || !newCollectionName.trim()}>Save</Button>
                <Button variant="ghost" onClick={() => setIsCreating(false)} disabled={isPending}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" className="w-full mt-4" onClick={() => setIsCreating(true)}>
              + Create New Collection
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
