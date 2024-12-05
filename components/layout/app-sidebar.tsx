"use client";

import * as React from "react";
import { Home, SquareDashedMousePointer, SquareTerminal } from "lucide-react";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import Link from "next/link";
import { cn } from "@/lib/utils";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Workflows",
      url: "/workflows",
      icon: SquareTerminal,
    },
  ],
};

interface UserType {
  name?: string;
  email?: string;
  image?: string;
}
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserType;
}
export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className={cn("flex items-center gap-2")}>
                <div className="flex aspect-square size-8  items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
                  <SquareDashedMousePointer
                    size={20}
                    className="stroke-white"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div>
                    <span className="font-extrabold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                      Flow
                    </span>
                    <span className="font-extrabold text-stone-700 dark:text-stone-300">
                      Mate
                    </span>
                  </div>
                  <span className="truncate text-[10px] text-muted-foreground font-semibold">
                    Workflows
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
