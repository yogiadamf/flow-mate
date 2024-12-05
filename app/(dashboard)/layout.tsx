import React from "react";
import { getSessionFromCookie } from "@/lib/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BreadcrumbHeader } from "@/components/layout/breadcrumb-header";
import { NavActions } from "@/components/layout/nav-action";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSessionFromCookie();

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          image: session?.user?.image || "",
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbHeader />
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
