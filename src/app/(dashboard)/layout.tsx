import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { requireSession } from "@/features/auth/server/get-session";

export default async function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await requireSession();

  return (
    <div className="min-h-screen bg-background">
      <MobileSidebar />
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">
        <AppSidebar />
      </div>
      <div className="lg:pl-64">
        <DashboardHeader userName={session.user.name} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
