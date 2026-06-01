import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AuthFormSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="h-7 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-9 w-full animate-pulse rounded bg-muted" />
        <div className="h-9 w-full animate-pulse rounded bg-muted" />
        <div className="h-9 w-full animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
