import { create } from "zustand";
import { analyticsAPI } from "@/lib/api";

interface AnalyticsSummary {
  totalMessages: number;
  totalConversations: number;
  avgResponseTime: number;
  totalTokensUsed: number;
  errorCount: number;
  widgetOpens: number;
  dailyMessages: Record<string, number>;
  hourlyDistribution: Record<number, number>;
}

interface AnalyticsStore {
  summary: AnalyticsSummary | null;
  isLoading: boolean;
  error: string | null;
  dateRange: "7d" | "30d" | "all";

  // Actions
  setDateRange: (range: "7d" | "30d" | "all") => void;
  fetchSummary: (chatbotId: string) => Promise<void>;
  clearError: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  summary: null,
  isLoading: false,
  error: null,
  dateRange: "7d",

  setDateRange: (range) => {
    set({ dateRange: range });
  },

  fetchSummary: async (chatbotId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { dateRange } = get();
      let startDate: string | undefined;
      const endDate = new Date().toISOString();

      if (dateRange === "7d") {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        startDate = date.toISOString();
      } else if (dateRange === "30d") {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        startDate = date.toISOString();
      }

      const response = await analyticsAPI.getSummary(
        chatbotId,
        startDate,
        endDate
      );

      if (response.success && response.summary) {
        set({ summary: response.summary, isLoading: false });
      } else {
        set({
          error: "Failed to fetch analytics",
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
