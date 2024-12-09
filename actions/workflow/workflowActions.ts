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
import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";
import { TaskType } from "@/types/task";
import { CreateFlowNode } from "@/lib/workflow/createWorkFlowNode";
import { FLowToExecutionPlan } from "@/lib/workflow/executionPlan";

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
  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };
  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await prisma.workflow.create({
    data: {
      userId: user.id,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  });
  if (!result) {
    throw new Error("Failed to create workflow");
  }
  redirect(`/workflow/editor/${result.id}`);
}

export async function UpdateWorkflow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const user = await getSessionFromCookie();
  if (!user) {
    throw new Error("unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  if (workflow.status === WorkflowStatus.PUBLISHED) {
    throw new Error("Cannot update a published workflow");
  }
  await prisma.workflow.update({
    data: {
      definition,
    },
    where: {
      id,
      userId: user.id,
    },
  });
  revalidatePath("/workflows");
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

export async function PublishWorkflow({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) {
  const user = await getSessionFromCookie();
  if (!user) {
    throw new Error("unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Cannot publish a non-draft workflow");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FLowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("Flow definition is not valid");
  }
  if (!result.executionPlan) {
    throw new Error("No execution plan generated");
  }
  await prisma.workflow.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      status: WorkflowStatus.PUBLISHED,
    },
  });
  revalidatePath(`/workflow/editor/${id}`);
}

export async function UnpublishWorkflow(id: string) {
  const user = await getSessionFromCookie();
  if (!user) {
    throw new Error("unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }
  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("Workflow is not published");
  }
  await prisma.workflow.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
    },
  });
  revalidatePath(`/workflow/editor/${id}`);
}
