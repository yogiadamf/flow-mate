import { Suspense } from "react";
import { GetWorkflowsForUser } from "@/actions/workflow/workflowActions";
import { Skeleton } from "@/components/ui/skeleton";
import { InboxIcon } from "lucide-react";
import WorkflowCard from "./_components/WorkflowCard";
import CreateWorkFlowDialog from "./_components/CreateWorkflowDialog";

const UserWorkflowsSkeleton = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </div>
  );
};

const WorkFlowsPage = () => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkFlowDialog />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
};
const UserWorkflows = async () => {
  const workflows = await GetWorkflowsForUser();
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflows created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkFlowDialog />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
};

export default WorkFlowsPage;
