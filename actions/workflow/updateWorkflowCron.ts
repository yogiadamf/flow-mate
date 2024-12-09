"use server";

import { getSessionFromCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import parser from "cron-parser";

export async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const user = await getSessionFromCookie();
  if (!user) {
    throw new Error("unauthenticated");
  }
  try {
    const interval = parser.parseExpression(cron, {
      utc: true,
    });
    return await prisma.workflow.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error) {
    throw new Error("Invalid cron expression");
  }
}
