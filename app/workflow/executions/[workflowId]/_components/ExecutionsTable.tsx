"use client";

import { GetWorkflowExecutions } from "@/actions/workflow/executionActions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import ExecutionStatusIndicator from "./ExecutionStatusIndicator";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type initialDataTye = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

const ExecutionsTable = ({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: initialDataTye;
}) => {
  const router = useRouter();
  const query = useQuery({
    queryKey: ["executions", workflowId],
    initialData,
    queryFn: () => GetWorkflowExecutions(workflowId),
    refetchInterval: 5000,
  });
  return (
    <div className="border rounded-lg shadow-md overflow-auto">
      <Table className="h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Started At(desc)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {query.data.map((execution) => {
            const duration = DatesToDurationString(
              execution.completedAt,
              execution.startedAt
            );
            const formattedStartedAt =
              execution.startedAt &&
              formatDistanceToNow(execution.startedAt, { addSuffix: true });
            return (
              <TableRow
                key={execution.id}
                className="cursor-pointer"
                onClick={() => {
                  router.push(
                    `/workflow/executions/${execution.workflowId}/${execution.id}`
                  );
                }}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{execution.id}</span>
                    <div className="text-muted-foreground text-xs">
                      <span>Triggerd via</span>
                      <Badge variant="outline" className="ml-1">
                        {execution.trigger}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="flex gap-2 items-center">
                      <ExecutionStatusIndicator
                        status={execution.status as WorkflowExecutionStatus}
                      />
                      <span className="font-semibold capitalize">
                        {execution.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">
                      {duration}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formattedStartedAt}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExecutionsTable;
