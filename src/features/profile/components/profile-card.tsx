import { CalendarDays, Mail, ShieldCheck, UserCircle, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileCardProps = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt?: Date;
  };
};

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User profile</CardTitle>
        <CardDescription>Session-backed account details for your PromptForge AI workspace.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={72}
              height={72}
              className="h-20 w-20 rounded-full border object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border bg-muted">
              <UserCircle className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <ProfileField icon={Mail} label="Email" value={user.email} />
          <ProfileField icon={ShieldCheck} label="Email verified" value={user.emailVerified ? "Verified" : "Not verified"} />
          <ProfileField icon={UserCircle} label="User ID" value={user.id} />
          <ProfileField
            icon={CalendarDays}
            label="Created"
            value={user.createdAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(user.createdAt) : "Unknown"}
          />
        </dl>
      </CardContent>
    </Card>
  );
}

type ProfileFieldProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function ProfileField({ icon: Icon, label, value }: ProfileFieldProps) {
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
