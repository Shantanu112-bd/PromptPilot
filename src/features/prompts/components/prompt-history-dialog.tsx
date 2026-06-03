"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getPromptHistoryAction } from "@/features/prompts/server/get-prompt-history";
import { Loader2 } from "lucide-react";

type PromptHistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptId: string | null;
};

export function PromptHistoryDialog({ open, onOpenChange, promptId }: PromptHistoryDialogProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && promptId) {
      loadHistory();
    }
  }, [open, promptId]);

  const loadHistory = async () => {
    setIsLoading(true);
    const result = await getPromptHistoryAction(promptId!);
    setIsLoading(false);

    if (result.ok) {
      setHistory(result.data);
    } else {
      toast.error(result.error || "Failed to load history.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            Past versions of this prompt.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 mt-4 overflow-y-auto max-h-[60vh] pr-2">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No version history available.</p>
          ) : (
            <div className="space-y-6">
              {history.map((version) => (
                <div key={version.id} className="relative pl-6 border-l-2 pb-6 last:pb-0">
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary" />
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline">v{version.version}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(version.createdAt), "MMM d, yyyy h:mm a")}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{version.title}</h4>
                  <div className="text-sm bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                    {version.content}
                  </div>
                  {version.changelog && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Note: {version.changelog}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
