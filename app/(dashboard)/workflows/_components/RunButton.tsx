"use client";

import { ExecutionWorkflow } from "@/actions/workflow/executionActions";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";

const RunButton = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: ExecutionWorkflow,
    onSuccess: () => {
      toast.success("Workflow started", { id: workflowId });
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
      size={"sm"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Running workflow...", { id: workflowId });
        mutation.mutate({ workflowId });
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
};

export default RunButton;
