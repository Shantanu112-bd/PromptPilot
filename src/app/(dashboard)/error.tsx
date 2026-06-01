"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, log to an external service like Sentry or Datadog
    console.error("Dashboard caught error:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        We encountered an error while loading this dashboard view. Our systems have logged the issue.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button onClick={() => window.location.href = "/dashboard"} variant="outline">
          Return to Dashboard Home
        </Button>
      </div>
    </div>
  );
}
