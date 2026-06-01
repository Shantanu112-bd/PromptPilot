"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";

const authSchema = z.object({
  name: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(2, "Name must be at least 2 characters.").optional()
  ),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

type AuthFormValues = z.infer<typeof authSchema>;

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

export function SignInForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGooglePending, setIsGooglePending] = useState(false);
  const callbackURL = getSafeCallbackURL(searchParams.get("callbackUrl"));
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  });

  async function onSubmit(values: AuthFormValues) {
    const result =
      mode === "sign-in"
        ? await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL
          })
        : await authClient.signUp.email({
            name: values.name ?? values.email.split("@")[0],
            email: values.email,
            password: values.password,
            callbackURL
          });

    if (result.error) {
      toast.error(result.error.message ?? "Authentication failed.");
      return;
    }

    toast.success(mode === "sign-in" ? "Welcome back." : "Account created.");
    router.push(callbackURL);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setIsGooglePending(true);

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL
    });

    if (result.error) {
      setIsGooglePending(false);
      toast.error(result.error.message ?? "Google sign-in failed.");
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "sign-in" ? "Sign in" : "Create account"}</CardTitle>
        <CardDescription>
          {mode === "sign-in"
            ? "Access your PromptForge AI workspace."
            : "Create your PromptForge AI workspace account."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {mode === "sign-up" ? (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" autoComplete="name" disabled={isSubmitting} {...register("name")} />
              {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" disabled={isSubmitting} {...register("email")} />
            {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              disabled={isSubmitting}
              {...register("password")}
            />
            {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {mode === "sign-in" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isSubmitting || isGooglePending}
          onClick={handleGoogleSignIn}
        >
          {isGooglePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Continue with Google
        </Button>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "sign-in" ? "Need an account?" : "Already have an account?"}{" "}
          <Link
            href={mode === "sign-in" ? "/sign-up" : "/sign-in"}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {mode === "sign-in" ? "Create one" : "Sign in"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function getSafeCallbackURL(callbackUrl: string | null) {
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return "/dashboard";
  }

  return callbackUrl;
}
