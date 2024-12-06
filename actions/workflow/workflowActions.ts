"use server";

import { getSessionFromCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function CreateWorkFlow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }
  const user = await getSessionFromCookie();
  if (!user) {
    throw new Error("unauthenticated");
  }
  const result = await prisma.workflow.create({
    data: {
      userId: user.id,
      status: WorkflowStatus.DRAFT,
      definition: "TODO",
      ...data,
    },
  });
  if (!result) {
    throw new Error("Failed to create workflow");
  }
  redirect(`/workflow/editor/${result.id}`);
}

export async function DeleteWorkflow(id: string) {
  const user = await getSessionFromCookie();
  if (!user) {
    throw new Error("unauthenticated");
  }
  await prisma.workflow.delete({
    where: {
      id,
      userId: user.id,
    },
  });
  revalidatePath("/workflows");
}
