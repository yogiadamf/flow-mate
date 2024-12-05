"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { loginSchema, loginSchemaType } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCallback } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { PostLogin } from "@/actions/auth/authActions";

const FormLogin = () => {
  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: PostLogin,
    onSuccess: () => {
      toast.success("Login success", { id: "login" });
    },
    onError: (error) => {
      // If the error is an instance of Error, show its message, otherwise show a generic message
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage, { id: "login" });
    },
  });

  const onSubmit = useCallback(
    (values: loginSchemaType) => {
      toast.loading("loading...", { id: "login" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <div className="flex items-center justify-center [&>div]:w-full">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col p-6 space-y-1">
          <div className="font-semibold tracking-tight text-2xl">Sign In</div>
          <div className="text-sm text-muted-foreground">
            Welcome back! Please sign in to continue
          </div>
        </div>
        <div className="p-6 pt-0 grid">
          <Form {...form}>
            <form
              className="space-y-4 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Email
                      <p className="text-xs text-red-500">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="current-email"
                        autoFocus
                      />
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
                    <FormLabel className="flex gap-1 items-center">
                      Password
                      <p className="text-xs text-red-500">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Sign In"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
          <div className="flex justify-center text-sm pt-2 gap-1">
            <span className="bg-background text-muted-foreground">
              Dont have an account?
            </span>
            <Link href="/register" className="text-primary font-semibold">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormLogin;
