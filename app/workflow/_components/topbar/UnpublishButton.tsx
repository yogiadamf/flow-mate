"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { CloudDownload } from "lucide-react";
import { toast } from "sonner";
import { UnpublishWorkflow } from "@/actions/workflow/workflowActions";

const UnpublishButton = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow unpublished", { id: workflowId });
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
        toast.loading("Unpublishing workflow...", { id: workflowId });
        mutation.mutate(workflowId);
      }}
    >
      <CloudDownload size={16} className="stroke-orange-400" />
      Unpublish
    </Button>
  );
};

export default UnpublishButton;
