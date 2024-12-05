"use server";

import prisma from "@/lib/prisma";
import { registerSchema, registerSchemaType } from "@/schema/auth";
import { hashPassword } from "@/lib/bcrypt";
import { redirect } from "next/navigation";

export async function PostRegister(form: registerSchemaType) {
  const { success, data } = registerSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new Error("Account already exists");
  }
  // Hash the password
  const hashedPassword = await hashPassword(data.password);

  // Save the new user
  const user = await prisma.user.create({
    data: { email: data.email, password: hashedPassword, name: data.username },
  });
  if (!user) {
    throw new Error("Failed to create account");
  }
  redirect("/login");
}
