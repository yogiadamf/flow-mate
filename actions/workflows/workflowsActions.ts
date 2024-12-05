"use server";

import { getSessionFromCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GetWorkflowsForUser() {
  const user = await getSessionFromCookie();
  if (!user) {
    throw new Error("unauthenticated");
  }
  return prisma.workflow.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
