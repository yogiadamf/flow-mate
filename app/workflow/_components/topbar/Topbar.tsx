"use client";

import TooltipWrapper from "@/components/custom/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import SaveButton from "@/app/workflow/_components/topbar/SaveButton";
import ExecuteButton from "@/app/workflow/_components/topbar/ExecuteButton";

interface Props {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
}

const Topbar = ({
  title,
  subtitle,
  workflowId,
  hideButtons = false,
}: Props) => {
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && (
            <p className="text-muted-foreground text-xs text-ellipsis truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-1 flex-1 justify-end">
        {!hideButtons && (
          <>
            <ExecuteButton workflowId={workflowId} />
            <SaveButton workflowId={workflowId} />
          </>
        )}
      </div>
    </header>
  );
};

export default Topbar;
