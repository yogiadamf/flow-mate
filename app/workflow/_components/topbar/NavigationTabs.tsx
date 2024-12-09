"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationTabs = ({ workflowId }: { workflowId: string }) => {
  const pathname = usePathname();
  const activeValue = pathname?.split("/")[2];
  return (
    <Tabs value={activeValue} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <Link href={`/workflow/editor/${workflowId}`}>
          <TabsTrigger value="editor" className="w-full">
            Editor
          </TabsTrigger>
        </Link>
        <Link href={`/workflow/executions/${workflowId}`}>
          <TabsTrigger value="executions" className="w-full">
            Executions
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
};

export default NavigationTabs;
