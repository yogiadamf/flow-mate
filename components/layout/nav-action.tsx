"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Bell, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function NavActions() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 text-sm">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent"
          >
            <Bell />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <div className="flex items-center p-4">
            <div className="font-semibold text-sm">Notifications</div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2 p-4">
            <button className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent">
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">William</div>
                  </div>
                  <div className="ml-auto text-xs text-foreground">
                    about 1 year ago
                  </div>
                </div>
                <div className="text-xs font-medium">Meeting Tomorrow</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                I have a question about the budget for the upcoming project. It
                seems like there's a discrepancy in the allocation of resources.
                I've reviewed the budget report and identified a few areas where
                we might be able to optimize our spending without compromising
                the project's quality. I've attached a de
              </div>
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
