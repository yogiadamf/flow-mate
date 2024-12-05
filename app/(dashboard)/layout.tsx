import BreadcrumbHeader from "@/components/layout/BreadcrumbHeader";
import DesktopSidebar from "@/components/layout/Sidebar";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getSessionFromCookie } from "@/lib/auth";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSessionFromCookie();
  return (
    <div className="flex h-screnn">
      <DesktopSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
          <BreadcrumbHeader />
          <div className="gap-1 flex items-center">
            <ModeToggle />
            <Avatar>
              <AvatarFallback>{session?.user.name}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="flex-1 container py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
