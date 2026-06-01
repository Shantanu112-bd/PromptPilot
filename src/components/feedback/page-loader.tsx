import { Loader2 } from "lucide-react";

export function PageLoader({ label = "Loading..." }: Readonly<{ label?: string }>) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <span>{label}</span>
      </div>
    </main>
  );
}
