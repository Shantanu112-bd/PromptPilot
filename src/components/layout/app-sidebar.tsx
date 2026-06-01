"use client";

import {
  BarChart3,
  Bookmark,
  BookOpen,
  FolderKanban,
  History,
  LayoutDashboard,
  Settings,
  Sparkles,
  type LucideIcon,
  UserCircle,
  WandSparkles,
  Library,
  ListTodo,
  Workflow
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/generator", label: "Prompt Generator", icon: WandSparkles },
  { href: "/dashboard/improver", label: "Prompt Improver", icon: Workflow },
  { href: "/dashboard/library", label: "Prompt Library", icon: Library },
  { href: "/dashboard/planner", label: "Project Planner", icon: ListTodo },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/saved", label: "Saved Prompts", icon: Bookmark },
  { href: "/dashboard/collections", label: "Collections", icon: FolderKanban },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle }
];

type AppSidebarProps = {
  className?: string;
};

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex h-full w-64 flex-col border-r bg-background", className)}>
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold leading-none">PromptForge AI</p>
          <p className="text-xs text-muted-foreground">Prompt workspace</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Dashboard navigation">
        {navItems.map((item) => (
          <SidebarLink key={item.href} href={item.href} active={pathname === item.href} icon={item.icon} label={item.label} />
        ))}
      </nav>

      <div className="border-t p-3">
        <SignOutButton />
      </div>
    </aside>
  );
}

type SidebarLinkProps = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
};

function SidebarLink({ href, label, active, icon: Icon }: SidebarLinkProps) {
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
