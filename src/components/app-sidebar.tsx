import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Bot, BarChart3 } from "lucide-react";
import Logout from "./Logout";

const items = [
  {
    title: "Agents",
    url: "/home",
    icon: Bot,
  },
  {
    title: "Analytics",
    url: "/home/analytics",
    icon: BarChart3,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div>
            <h2 className="font-semibold text-sidebar-foreground">ChatFlow</h2>
            <p className="text-xs text-muted-foreground">AI Agent Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 mt-auto">
        <Logout />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
