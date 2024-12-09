"use client";

import CustomDialogHeader from "@/components/custom/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TriangleAlertIcon } from "lucide-react";

const ScheduleDialog = () => {
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
        <CustomDialogHeader title="Set schedule" />
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
