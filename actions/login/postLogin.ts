"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema, loginSchemaType } from "@/schema/auth";

export async function PostLogin(form: loginSchemaType) {
  const { success, data } = loginSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user || !bcrypt.compareSync(data.password, user.password)) {
    throw new Error("Invalid email or password");
  }
}
