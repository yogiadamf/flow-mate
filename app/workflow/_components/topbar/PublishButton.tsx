"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CloudUpload } from "lucide-react";
import { toast } from "sonner";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { PublishWorkflow } from "@/actions/workflow/workflowActions";

const PublishButton = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow published", { id: workflowId });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage, { id: workflowId });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          // If the plan is null, return early
          return;
        }
        toast.loading("Publishing workflow...", { id: workflowId });
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <CloudUpload size={16} className="stroke-green-400" />
      Publish
    </Button>
  );
};

export default PublishButton;
