"use client";

import { Button, buttonVariants } from "@/components/ui/button";
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
import { PostLogin } from "@/actions/login/postLogin";
import { toast } from "sonner";
import { useCallback } from "react";
import { Loader2 } from "lucide-react";

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
      toast.success("Login success", { id: "sign-in" });
    },
    onError: () => {
      toast.error("Invalid email or password ", {
        id: "sign-in",
      });
    },
  });

  const onSubmit = useCallback(
    (values: loginSchemaType) => {
      toast.loading("loading...", { id: "sign-in" });
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
                {!isPending && "Login"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default FormLogin;
