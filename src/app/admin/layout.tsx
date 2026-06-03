import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireSession } from "@/features/auth/server/get-session";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await requireSession();

  // Admin protection barrier
  if ((session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileSidebar />
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">
        <AdminSidebar />
      </div>
      <div className="lg:pl-64">
        <DashboardHeader userName={session.user.name} />
        <main className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
