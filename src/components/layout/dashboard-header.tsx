"use client";

import { Menu } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";

type DashboardHeaderProps = {
  userName: string;
};

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Open navigation</span>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Workspace</p>
          <h1 className="text-base font-semibold leading-none sm:text-lg">Welcome, {userName}</h1>
        </div>
      </div>
      <ModeToggle />
    </header>
  );
}
