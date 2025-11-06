"use client";

import { AgentSidebar } from "@/components/AgentSidebar";
import { SourcesPage } from "@/components/source-page";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const Agent = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("playground");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <AgentSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Agent;
