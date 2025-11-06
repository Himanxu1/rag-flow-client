import CreateAgentSidebar from "@/components/creare-agent-sidebar";
import SideAction from "@/components/side-action";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }: any) => {
  return (
    <div className="flex justify-evenly p-10">
      <SidebarProvider>
        <CreateAgentSidebar />
        <SidebarTrigger />
        {children}
      </SidebarProvider>
      <SideAction />
    </div>
  );
};

export default layout;
