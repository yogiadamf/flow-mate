"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { registerSchema, registerSchemaType } from "@/schema/auth";
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
import { PostRegister } from "@/actions/auth/authActions";

const FormRegister = () => {
  const form = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: PostRegister,
    onSuccess: () => {
      toast.success("Register success", { id: "register" });
    },
    onError: (error) => {
      // If the error is an instance of Error, show its message, otherwise show a generic message
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage, { id: "login" });
    },
  });

  const onSubmit = useCallback(
    (values: registerSchemaType) => {
      toast.loading("loading...", { id: "register" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <div className="flex items-center justify-center [&>div]:w-full">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col p-6 space-y-1">
          <div className="font-semibold tracking-tight text-2xl">
            Create an account
          </div>
          <div className="text-sm text-muted-foreground">
            Enter your email below to create your account
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Username
                      <p className="text-xs text-red-500">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="current-username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <Input {...field} autoComplete="current-email" />
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
                {!isPending && "Create account"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
          <div className="flex justify-center text-sm pt-2 gap-1">
            <span className="bg-background text-muted-foreground">
              Already have an account?
            </span>
            <Link href="/login" className="text-primary font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormRegister;
