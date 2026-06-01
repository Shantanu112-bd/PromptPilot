import { Clock, KeyRound, MonitorSmartphone, type LucideIcon } from "lucide-react";

import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SessionCardProps = {
  session: {
    session: {
      id: string;
      expiresAt: Date;
      ipAddress?: string | null;
      userAgent?: string | null;
    };
  };
};

export function SessionCard({ session }: SessionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active session</CardTitle>
        <CardDescription>Your current authenticated browser session.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SessionField icon={KeyRound} label="Session ID" value={session.session.id} />
        <SessionField
          icon={Clock}
          label="Expires"
          value={new Intl.DateTimeFormat("en", {
            dateStyle: "medium",
            timeStyle: "short"
          }).format(session.session.expiresAt)}
        />
        <SessionField icon={MonitorSmartphone} label="Device" value={session.session.userAgent ?? "Unknown device"} />
        <div className="pt-2">
          <SignOutButton />
        </div>
      </CardContent>
    </Card>
  );
}

type SessionFieldProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function SessionField({ icon: Icon, label, value }: SessionFieldProps) {
  return (
    <div className="rounded-lg border p-4">
      <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-medium">{value}</dd>
    </div>
  );
}
