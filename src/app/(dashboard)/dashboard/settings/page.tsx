import { Bell, Database, Lock, Palette, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireSession } from "@/features/auth/server/get-session";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { prisma } from "@/lib/db/prisma";

export default async function SettingsPage() {
  const session = await requireSession();
  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
      deletedAt: null
    },
    select: {
      name: true,
      email: true
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account, workspace preferences, and product defaults." />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your profile details are connected to your Better Auth account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.name ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email ?? ""} disabled />
              </div>
            </div>
            <Button disabled>Save changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workspace defaults</CardTitle>
            <CardDescription>Default behavior for prompt generation and tool routing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingRow icon={Palette} title="Theme" description="System theme with light and dark mode support." />
            <SettingRow icon={Database} title="Data" description="Soft-deleted records are preserved for recovery workflows." />
            <SettingRow icon={Bell} title="Notifications" description="Usage and generation notifications are ready for integration." />
            <SettingRow icon={Lock} title="Security" description="Protected routes require a valid server-side session." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type SettingRowProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

function SettingRow({ icon: Icon, title, description }: SettingRowProps) {
  return (
    <div className="flex gap-3 rounded-lg border p-4">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
