"use server";

import prisma from "@/lib/prisma";
import { loginSchema, loginSchemaType } from "@/schema/auth";
import { verifyPassword } from "@/lib/bcrypt";
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
        expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour expiration
      },
    });
  } else {
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: sessionToken,
        expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour expiration
      },
    });
  }

  cookies().set("session-token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });
  redirect("/");
}
