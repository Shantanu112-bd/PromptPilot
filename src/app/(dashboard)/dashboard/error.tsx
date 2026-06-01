"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: Readonly<{ reset: () => void }>) {
  return (
    <section className="rounded-lg border bg-card p-6 text-card-foreground">
      <h2 className="text-lg font-semibold">Dashboard unavailable</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We could not load your workspace dashboard. Please retry the request.
      </p>
      <Button className="mt-6" onClick={reset}>
        Retry
      </Button>
    </section>
  );
}
