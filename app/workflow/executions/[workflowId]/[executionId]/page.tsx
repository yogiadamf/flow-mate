import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflow/executionActions";
import ExecutionViewer from "./_components/ExecutionViewer";

const ExecutionViewerWrapper = async ({
  executionId,
}: {
  executionId: string;
}) => {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) {
    return <div>Workflow not found</div>;
  }

  return <ExecutionViewer initialData={workflowExecution} />;
};

const ExecutionViewerPage = ({
  params,
}: {
  params: {
    workflowId: string;
    executionId: string;
  };
}) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        title="Workflow execution details"
        workflowId={params.workflowId}
        subtitle={`Run ID: ${params.executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
};

export default ExecutionViewerPage;
