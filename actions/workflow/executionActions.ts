"use server";

import prisma from "@/lib/prisma";
import { getSessionFromCookie } from "@/lib/auth";
import { FLowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
} from "@/types/workflow";
import { redirect } from "next/navigation";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";

export async function ExecutionWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const user = await getSessionFromCookie();
  if (!user) {
    throw new Error("unauthenticated");
  }

  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("Workflow not found");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId: user.id,
    },
  });
  if (!workflow) {
    throw new Error("Workflow not found");
  }

  let executionPlan: WorkflowExecutionPlan;
  let workflowDefinition = flowDefinition;
  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error("No execution plan found in published workflow");
    }
    executionPlan = JSON.parse(workflow.executionPlan);
    workflowDefinition = workflow.definition;
  } else {
    if (!flowDefinition) {
      throw new Error("Flow definition is not defined");
    }
    const flow = JSON.parse(flowDefinition);
    const result = FLowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error) {
      throw new Error("Flow definition is not valid");
    }
    if (!result.executionPlan) {
      throw new Error("Execution plan not found");
    }

    executionPlan = result.executionPlan;
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId: user.id,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId: user.id,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Workflow execution not created");
  }
  ExecuteWorkflow(execution.id);
  redirect(`/workflow/executions/${workflowId}/${execution.id}`);
}

export async function GetWorkflowExecutionWithPhases(executionId: string) {
  const user = await getSessionFromCookie();
  if (!user) {
    throw new Error("unauthenticated");
  }
  return await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId: user.id,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}

export async function GetWorkflowPhaseDetails(phaseId: string) {
  const user = await getSessionFromCookie();
  if (!user) {
    throw new Error("unauthenticated");
  }
  return await prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId: user.id,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
}

export async function GetWorkflowExecutions(workflowId: string) {
  const user = await getSessionFromCookie();
  if (!user) {
    throw new Error("unauthenticated");
  }
  return await prisma.workflowExecution.findMany({
    where: {
      workflowId,
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
