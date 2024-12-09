import { GetWorkflowExecutions } from "@/actions/workflow/executionActions";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExecutionsTable from "./_components/ExecutionsTable";

const ExecutionsPage = ({ params }: { params: { workflowId: string } }) => {
  return (
    <div className="w-full h-full overflow-auto ">
      <Topbar
        workflowId={params.workflowId}
        hideButtons
        title="All Runs"
        subtitle="List of all your workflow"
      />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2Icon size={32} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
};

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions) {
    return <div>No data</div>;
  }
  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow
            </p>
            <p className="text-muted-foreground text-sm">
              You can trigger a run from the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}

export default ExecutionsPage;
