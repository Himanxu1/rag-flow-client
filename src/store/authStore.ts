import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,

      login: (token: string) => {
        // Store in both localStorage and Zustand
        localStorage.setItem("token", token);
        // Also set cookie for middleware authentication
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        set({
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        // Clear from both localStorage and Zustand
        localStorage.removeItem("token");
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("botId");

        // Clear cookie with multiple methods to ensure it's gone
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";

        // Reset state
        set({
          token: null,
          isAuthenticated: false,
        });

        console.log("[AuthStore] Logout complete - all credentials cleared");
      },

      initializeAuth: () => {
        // Sync from localStorage on app start
        const token = localStorage.getItem("token");
        if (token) {
          set({
            token,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
