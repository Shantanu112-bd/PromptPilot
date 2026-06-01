import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthFormSkeleton } from "@/features/auth/components/auth-form-skeleton";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { getSession } from "@/features/auth/server/get-session";

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <SignInForm mode="sign-up" />
    </Suspense>
  );
}
