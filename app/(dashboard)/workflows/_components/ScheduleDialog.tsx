"use client";

import { UpdateWorkflowCron } from "@/actions/workflow/updateWorkflowCron";
import CustomDialogHeader from "@/components/custom/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import cronstrue from "cronstrue";

const ScheduleDialog = (props: { cron: string | null; workflowId: string }) => {
  const [cron, setCron] = useState(props.cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule upadted successfully", { id: "cron" });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage, { id: "cron" });
    },
  });
  useEffect(() => {
    try {
      const cronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(cronStr);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn("text-sm p-0 h-auto")}
        >
          <div className="flex items-center gap-1">
            <TriangleAlertIcon className="w-3 h-3 mr-1" />
            Set schedule
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule the execution of this
            workflow. All times are in UTC
          </p>
          <Input
            placeholder="E.g * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm",
              validCron && "border-primary text-primary"
            )}
          >
            {validCron ? readableCron : "Invalid cron expression"}
          </div>
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-full"
            disabled={mutation.isPending}
            onClick={() => {
              toast.loading("Saving...", { id: "cron" });
              mutation.mutate({ id: props.workflowId, cron });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
