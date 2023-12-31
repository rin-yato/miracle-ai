"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getBaseUrl } from "@/lib/base-url";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { Icons } from "@/components/icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Provider } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailAuth, setIsEmailAuth] = React.useState<boolean>(false);

  const router = useRouter();

  const redirectUrl = getBaseUrl() + "/api/auth/callback";

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setIsEmailAuth(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (data.session) {
        router.push("/data");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      setIsEmailAuth(false);
    }, 2000);
  }

  async function signupWithOAuth(provider: Provider) {
    setIsLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
    setIsLoading(false);
  }

  return (
    <main className="flex flex-1">
      <Button
        disabled={isLoading}
        variant="outline"
        className="fixed right-5 top-5"
        asChild
      >
        <Link href="/auth/signup">I aint got no acc bro</Link>
      </Button>
      <div className="m-auto h-full w-full max-w-[90vw] md:max-w-xs">
        <Text variant="heading" className="pb-10">
          Login
        </Text>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="charizard@hotmail.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*******" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading}>
              {isLoading && isEmailAuth && (
                <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Login with Email
            </Button>
          </form>
        </Form>
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full"
          onClick={() => signupWithOAuth("google")}
        >
          {isLoading && !isEmailAuth ? (
            <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.Google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
      </div>
    </main>
  );
}
