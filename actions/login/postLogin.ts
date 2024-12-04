"use server";

import { loginSchema, loginSchemaType } from "@/schema/auth";

export async function PostLogin(form: loginSchemaType) {
  const { success, data } = loginSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const result = await fetch("/api/login");
  if (!result) {
    throw new Error("Failed to create account");
  }
}
