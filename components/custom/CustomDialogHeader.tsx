"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Props {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  titleClassName?: string;
  subtitleClassname?: string;
}

const CustomDialogHeader = (props: Props) => {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {props.icon && (
            <props.icon
              size={30}
              className={cn("stroke-primary", props.iconClassName)}
            />
          )}
          {props.title && (
            <p className={cn("text-xl text-primary", props.titleClassName)}>
              {props.title}
            </p>
          )}
          {props.subtitle && (
            <p
              className={cn(
                "text-sm text-muted-foreground",
                props.subtitleClassname
              )}
            >
              {props.subtitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
};

export default CustomDialogHeader;
