import type { ReactNode } from "react";

import { ModeToggle } from "@/components/mode-toggle";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="min-h-screen bg-muted/40">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      <div className="flex min-h-screen items-center justify-center px-4 py-12">{children}</div>
    </main>
  );
}
