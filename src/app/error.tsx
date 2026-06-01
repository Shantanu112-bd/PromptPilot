"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";

export default function GlobalError({
  error,
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <EmptyState
          icon={AlertCircle}
          title="Something went wrong"
          description="The application encountered an unexpected error. Try refreshing the page, or contact support if the issue persists."
          action={
            <Button onClick={reset} className="mt-4">
              Try again
            </Button>
          }
        />
      </div>
    </main>
  );
}
