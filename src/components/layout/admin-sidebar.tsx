"use client";

import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileCode2,
  Cpu,
  ActivitySquare,
  LogOut,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/templates", label: "Prompt Templates", icon: FileCode2 },
  { href: "/admin/models", label: "Models & Providers", icon: Cpu },
  { href: "/admin/system", label: "System Health", icon: ActivitySquare },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex h-full w-64 flex-col border-r bg-muted/20", className)}>
      <div className="flex h-16 items-center gap-2 border-b px-4 bg-background">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-destructive text-destructive-foreground">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold leading-none">Admin Portal</p>
          <p className="text-xs text-muted-foreground">PromptForge AI</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
        {adminNavItems.map((item) => (
          <SidebarLink key={item.href} href={item.href} active={pathname === item.href} icon={item.icon} label={item.label} />
        ))}
      </nav>

      <div className="border-t p-3 space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/dashboard">
            <LogOut className="mr-2 h-4 w-4" />
            Back to App
          </Link>
        </Button>
        <SignOutButton />
      </div>
    </aside>
  );
}

function SidebarLink({ href, label, active, icon: Icon }: { href: string; label: string; active: boolean; icon: LucideIcon }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
