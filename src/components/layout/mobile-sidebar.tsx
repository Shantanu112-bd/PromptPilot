"use client";

import { X } from "lucide-react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

export function MobileSidebar() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

  return (
    <div className={cn("fixed inset-0 z-40 lg:hidden", sidebarOpen ? "block" : "hidden")}>
      <button
        type="button"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      />
      <div className="relative h-full w-72 max-w-[85vw] bg-background shadow-xl">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-3 top-3 z-10"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Close navigation</span>
        </Button>
        <AppSidebar className="w-full" />
      </div>
    </div>
  );
}
