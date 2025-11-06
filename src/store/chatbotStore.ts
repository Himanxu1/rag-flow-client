import { create } from "zustand";
import { chatbotAPI, handleAPIError } from "@/lib/api";

interface Chatbot {
  id: string;
  name: string;
  model: string;
  embedId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatbotState {
  chatbots: Chatbot[];
  currentChatbot: Chatbot | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchChatbots: () => Promise<void>;
  createChatbot: (name: string) => Promise<Chatbot | null>;
  deleteChatbot: (botId: string) => Promise<boolean>;
  setCurrentChatbot: (chatbot: Chatbot | null) => void;
  clearError: () => void;
}

export const useChatbotStore = create<ChatbotState>((set, get) => ({
  chatbots: [],
  currentChatbot: null,
  isLoading: false,
  error: null,

  fetchChatbots: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatbotAPI.getAll();

      if (response.status && response.chatbots) {
        set({ chatbots: response.chatbots, isLoading: false });
      } else {
        set({ chatbots: [], isLoading: false });
      }
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  createChatbot: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatbotAPI.create(name);

      if (response.status && response.chatbot) {
        const newChatbot = response.chatbot;
        set((state) => ({
          chatbots: [newChatbot, ...state.chatbots],
          currentChatbot: newChatbot,
          isLoading: false,
        }));

        // Store in localStorage for backward compatibility
        localStorage.setItem("botId", newChatbot.id);

        return newChatbot;
      }

      set({ isLoading: false });
      return null;
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  deleteChatbot: async (botId: string) => {
    set({ isLoading: true, error: null });
    try {
      await chatbotAPI.delete(botId);

      set((state) => ({
        chatbots: state.chatbots.filter((bot) => bot.id !== botId),
        currentChatbot:
          state.currentChatbot?.id === botId ? null : state.currentChatbot,
        isLoading: false,
      }));

      // Clear from localStorage if it was the current bot
      if (localStorage.getItem("botId") === botId) {
        localStorage.removeItem("botId");
      }

      return true;
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  setCurrentChatbot: (chatbot: Chatbot | null) => {
    set({ currentChatbot: chatbot });
    if (chatbot) {
      localStorage.setItem("botId", chatbot.id);
    } else {
      localStorage.removeItem("botId");
    }
  },

  clearError: () => set({ error: null }),
}));
