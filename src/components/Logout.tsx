"use client";
import { useAuthStore } from "@/store/authStore";
import React from "react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
