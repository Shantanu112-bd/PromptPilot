"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);
    const result = await authClient.signOut();

    if (result.error) {
      setIsPending(false);
      toast.error(result.error.message ?? "Sign out failed.");
      return;
    }

    toast.success("Signed out.");
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <Button type="button" variant="ghost" className="justify-start gap-2" disabled={isPending} onClick={handleSignOut}>
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Sign out
    </Button>
  );
}
