"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin caught error:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Admin System Error</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        An error occurred in the administrative interface.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Retry Action
        </Button>
        <Button onClick={() => window.location.href = "/admin"} variant="outline">
          Return to Admin Overview
        </Button>
      </div>
    </div>
  );
}
