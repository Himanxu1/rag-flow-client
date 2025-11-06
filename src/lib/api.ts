import axios, { AxiosError } from "axios";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Create axios instance with defaults
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem("token");
      // Clear Zustand store (if available)
      if (typeof window !== "undefined") {
        // Trigger logout in auth store
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          try {
            const parsed = JSON.parse(authStorage);
            parsed.state.token = null;
            parsed.state.isAuthenticated = false;
            localStorage.setItem("auth-storage", JSON.stringify(parsed));
          } catch (e) {
            console.error("Failed to clear auth storage:", e);
          }
        }
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Chat API
export const chatAPI = {
  // Query chatbot with RAG
  query: async (
    chatbotId: string,
    question: string,
    conversationId?: string,
    options?: {
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ) => {
    const response = await apiClient.post(`/chat/${chatbotId}/query`, {
      question,
      conversationId,
      ...options,
    });
    return response.data;
  },

  // Stream chatbot response
  streamQuery: async (
    chatbotId: string,
    question: string,
    conversationId?: string,
    onChunk?: (chunk: string) => void,
    onComplete?: (conversationId: string) => void,
    onError?: (error: string) => void
  ) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat/${chatbotId}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, conversationId }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("Failed to get response reader");
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.chunk) {
              onChunk?.(data.chunk);
            } else if (data.done) {
              onComplete?.(data.conversationId);
            } else if (data.error) {
              onError?.(data.error);
            }
          }
        }
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Stream error");
    }
  },

  // Get chatbot status
  getStatus: async (chatbotId: string) => {
    const response = await apiClient.get(`/chat/${chatbotId}/status`);
    return response.data;
  },

  getAllChatbats: async () => {
    const response = await apiClient.get(
      "http://localhost:3001/api/v1/chatbot/get-chatbots"
    );
    return response.data.chatbots;
  },
};

// Chatbot API
export const chatbotAPI = {
  // Get all chatbots
  getAll: async () => {
    const response = await apiClient.get("/chatbot/get-chatbots");
    return response.data;
  },

  // Create new chatbot
  create: async (name: string) => {
    const response = await apiClient.post("/chatbot/create-chatbot", { name });
    return response.data;
  },

  // Create chatbot with knowledge base
  createWithKB: async (name: string) => {
    const response = await apiClient.post("/chatbot/create-chatbot-with-kb", {
      name,
    });
    return response.data;
  },

  // Delete chatbot
  delete: async (botId: string) => {
    const response = await apiClient.delete(`/chatbot/chatbot/${botId}`);
    return response.data;
  },

  // Upload file
  uploadFile: async (
    botId: string,
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("botId", botId);

    const response = await apiClient.post("/chatbot/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percentCompleted);
        }
      },
    });
    return response.data;
  },

  // Upload text
  uploadText: async (botId: string, text: string, name: string) => {
    const response = await apiClient.post("/chatbot/text", {
      botId,
      text,
      name,
    });
    return response.data;
  },

  // Upload website
  uploadWebsite: async (botId: string, websiteLink: string, name?: string) => {
    const response = await apiClient.post("/chatbot/website", {
      botId,
      websiteLink,
      name,
    });
    return response.data;
  },
};

// Knowledge Base API
export const knowledgeBaseAPI = {
  // Get all knowledge bases for a chatbot
  getAll: async (botId: string) => {
    const response = await apiClient.get(`/knowledgebase/getall`, {
      params: { botId },
    });
    return response.data;
  },

  // Get knowledge bases by category
  getByCategory: async (botId: string, category: string) => {
    const response = await apiClient.get(
      `/knowledgebase/get/${botId}/${category}`
    );
    return response.data;
  },

  // Delete knowledge base
  delete: async (knowledgeBaseId: string) => {
    const response = await apiClient.delete(
      `/knowledgebase/${knowledgeBaseId}`
    );
    return response.data;
  },
};

// Conversation API
export const conversationAPI = {
  // Get all conversations
  getAll: async () => {
    const response = await apiClient.get("/conversation/chats/messages");
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId: string) => {
    const response = await apiClient.get(
      `/conversation/chat/message/${conversationId}`
    );
    return response.data;
  },

  // Create new conversation
  create: async (chatbotId: string) => {
    const response = await apiClient.post("/conversation/chat", { chatbotId });
    return response.data;
  },

  // Delete conversation
  delete: async (conversationId: string) => {
    const response = await apiClient.delete(
      `/conversation/chat/${conversationId}`
    );
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  // Get analytics for a chatbot
  getAnalytics: async (
    chatbotId: string,
    startDate?: string,
    endDate?: string
  ) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await apiClient.get(
      `/analytics/${chatbotId}?${params.toString()}`
    );
    return response.data;
  },

  // Get analytics summary
  getSummary: async (
    chatbotId: string,
    startDate?: string,
    endDate?: string
  ) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await apiClient.get(
      `/analytics/${chatbotId}/summary?${params.toString()}`
    );
    return response.data;
  },
};

// Settings API
export const settingsAPI = {
  // Get chatbot settings
  get: async (chatbotId: string) => {
    const response = await apiClient.get(`/settings/${chatbotId}`);
    return response.data;
  },

  // Update chatbot settings
  update: async (chatbotId: string, settings: Partial<ChatbotSettings>) => {
    const response = await apiClient.put(`/settings/${chatbotId}`, settings);
    return response.data;
  },

  // Reset settings to defaults
  reset: async (chatbotId: string) => {
    const response = await apiClient.post(`/settings/${chatbotId}/reset`);
    return response.data;
  },
};

// Auth API
export const authAPI = {
  // Login
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/signin", {
      email,
      password,
    });
    return response.data;
  },

  // Register
  register: async (email: string, password: string, fullname: string) => {
    const response = await apiClient.post("/auth/register", {
      email,
      password,
      fullname,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      // Call backend logout endpoint to clear httpOnly cookie
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Backend logout failed:", error);
      // Continue with client-side cleanup even if backend call fails
    }

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("botId");

    // Clear session storage
    sessionStorage.clear();
  },
};

// Types
export interface ChatbotSettings {
  primaryColor: string;
  fontFamily: string;
  placeholderMessage: string;
  welcomeMessage: string;
  widgetPosition: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  maxContextLength: number;
  temperature: number;
  modelName: string;
  brandingEnabled: boolean;
  customCss?: string;
  systemPrompt?: string;
}

// Error handler helper
export const handleAPIError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An error occurred"
    );
  }
  return error instanceof Error ? error.message : "An unknown error occurred";
};
