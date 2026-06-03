import type { ReactNode, ComponentType } from "react";

import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
};

export function EmptyState({ title, description, action, icon: Icon }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        {Icon ? <Icon className="h-10 w-10 text-muted-foreground mb-4" /> : null}
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
