"use server";

import prisma from "@/lib/prisma";
import {
  loginSchema,
  loginSchemaType,
  registerSchema,
  registerSchemaType,
} from "@/schema/auth";
import { hashPassword, verifyPassword } from "@/lib/bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateSessionToken } from "@/lib/uuid";

export async function PostLogin(form: loginSchemaType) {
  const { success, data } = loginSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    throw new Error("User not found");
  }
  // Verify password
  const isValid = await verifyPassword(data.password, user.password);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }
  const session = await prisma.session.findFirst({
    where: { userId: user.id },
  });
  const sessionToken = generateSessionToken(); // A random session identifier, stored on the server side.
  if (session) {
    await prisma.session.update({
      where: { id: session.id },
      data: {
        sessionToken: sessionToken,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day expiration
      },
    });
  } else {
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: sessionToken,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day expiration
      },
    });
  }

  cookies().set("session-token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
  const redirectUrl = cookies().get("redirect-url")?.value || "/";
  redirect(redirectUrl);
}

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

export async function PostLogout() {
  cookies().delete("session-token");
  cookies().delete("redirect-url");
  redirect("/login");
}
