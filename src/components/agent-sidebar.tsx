"use client";
import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Play,
  Clock,
  BarChart3,
  Database,
  Zap,
  Users,
  Rocket,
  Settings,
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function AgentSidebar({ currentPage, onPageChange }: SidebarProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const agentId = params.agentId as string;

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "sources",
    "settings",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleNavigation = (pageId: string) => {
    const routes: Record<string, string> = {
      playground: `/agents/${agentId}/playground`,
      analytics: `/agents/${agentId}/analytics`,
      deploy: `/agents/${agentId}/deploy`,
      activity: `/agents/${agentId}/activity`,
      actions: `/agents/${agentId}/actions`,
    };

    if (routes[pageId]) {
      router.push(routes[pageId]);
    } else {
      // Fallback to old behavior for other pages
      onPageChange(pageId);
    }
  };

  const handleSourceNavigation = (sourceId: string) => {
    const routes: Record<string, string> = {
      files: `/agents/${agentId}/file`,
      text: `/agents/${agentId}/text`,
      website: `/agents/${agentId}/website`,
      notion: `/agents/${agentId}/notion`,
    };

    if (routes[sourceId]) {
      router.push(routes[sourceId]);
    }
  };

  const handleSettingsNavigation = (settingId: string) => {
    router.push(`/agents/${agentId}/setting?tab=${settingId}`);
  };

  const isCurrentPage = (pageId: string) => {
    if (pageId === "playground" && pathname?.includes("/playground"))
      return true;
    if (pageId === "analytics" && pathname?.includes("/analytics")) return true;
    if (pageId === "deploy" && pathname?.includes("/deploy")) return true;
    if (pageId === "activity" && pathname?.includes("/activity")) return true;
    if (pageId === "actions" && pathname?.includes("/actions")) return true;
    return currentPage === pageId;
  };

  const menuItems = [
    { id: "playground", label: "Playground", icon: Play },
    { id: "activity", label: "Activity", icon: Clock, collapsible: true },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const sourcesSubmenu = [
    { id: "files", label: "Files" },
    { id: "text", label: "Text" },
    { id: "website", label: "Website" },
  ];

  const settingsSubmenu = [
    { id: "general", label: "General" },
    { id: "ai", label: "AI" },
  ];

  const bottomItems = [
    { id: "actions", label: "Actions", icon: Zap },
    { id: "deploy", label: "Deploy", icon: Rocket },
  ];

  return (
    <div className="w-64 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col h-screen overflow-y-auto">
      <div className="p-4 border-b border-sidebar-border">
        <button
          onClick={() => handleNavigation("playground")}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Play size={20} />
          <span className="font-semibold">Playground</span>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4">
        {/* Top Menu Items */}
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors mb-2 ${
                isCurrentPage(item.id)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
              {item.collapsible && (
                <ChevronDown size={16} className="opacity-50" />
              )}
            </button>
          </div>
        ))}

        {/* Sources Section */}
        <div className="mt-4">
          <button
            onClick={() => toggleSection("sources")}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors mb-2 ${
              currentPage === "sources" || expandedSections.includes("sources")
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Database size={20} />
              <span>Sources</span>
            </div>
            {expandedSections.includes("sources") ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {expandedSections.includes("sources") && (
            <div className="ml-4 space-y-1">
              {sourcesSubmenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSourceNavigation(item.id)}
                  className="w-full text-left px-4 py-2 text-sm rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Menu Items */}
        <div className="mt-6 space-y-2">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isCurrentPage(item.id)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Section */}
        <div className="mt-6">
          <button
            onClick={() => toggleSection("settings")}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors mb-2 ${
              currentPage === "settings" ||
              expandedSections.includes("settings")
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings size={20} />
              <span>Settings</span>
            </div>
            {expandedSections.includes("settings") ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {expandedSections.includes("settings") && (
            <div className="ml-4 space-y-1">
              {settingsSubmenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSettingsNavigation(item.id)}
                  className="w-full text-left px-4 py-2 text-sm rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
