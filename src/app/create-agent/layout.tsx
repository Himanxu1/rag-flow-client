import CreateAgentSidebar from "@/components/CreateAgentSidebar";
import SideAction from "@/components/SideAction";
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
