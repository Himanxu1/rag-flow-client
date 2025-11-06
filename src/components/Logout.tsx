"use client";
import { useAuthStore } from "@/store/authStore";
import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";

const Logout = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call backend logout API to clear httpOnly cookie
      await authAPI.logout();

      // Call auth store logout (clears state and localStorage)
      logout();

      console.log("[Logout] Complete - redirecting to login");

      // Redirect to login page
      router.replace("/login");
    } catch (error) {
      console.error("[Logout] Error:", error);
      // Even if API call fails, still clear client-side state and redirect
      logout();
      router.replace("/login");
    }
  };
  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </Button>
  );
};

export default Logout;
