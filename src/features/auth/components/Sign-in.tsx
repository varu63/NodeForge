"use client";

import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const router = useRouter();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isPending = form.formState.isSubmitting;
 const signInGithub = async () => {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "/",
  });
};

const signInGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};
  async function onSubmit(values: SignInFormData) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  }

  return (
    <div className="flex items-center justify-center bg-muted/30 ">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>

          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col space-y-4">
              <Button
                variant="outline"
                className="w-full"
                disabled={isPending}
                type="button"
                onClick={signInGithub}
              >
                <FaGithub /> Sign in with Github
              </Button>
              <Button
                variant="outline"
                className="w-full"
                disabled={isPending}
                type="button"
                 onClick={signInGoogle}
              >
                <FcGoogle /> Sign in with Google
              </Button>
            </div>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link href="/sign-up" className="underline underline-offset-1">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
