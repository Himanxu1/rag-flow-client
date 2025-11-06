import { create } from "zustand";
import { conversationAPI, chatAPI, handleAPIError } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  chatbotId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  // Actions
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  createConversation: (chatbotId: string) => Promise<Conversation | null>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  sendMessage: (
    chatbotId: string,
    question: string,
    conversationId?: string
  ) => Promise<{ answer: string; conversationId: string } | null>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addMessage: (message: Message) => void;
  clearError: () => void;
  clearMessages: () => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await conversationAPI.getAll();

      if (response.status && response.conversations) {
        set({ conversations: response.conversations, isLoading: false });
      } else {
        set({ conversations: [], isLoading: false });
      }
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await conversationAPI.getMessages(conversationId);

      if (response.status && response.messages) {
        set({ messages: response.messages, isLoading: false });
      } else {
        set({ messages: [], isLoading: false });
      }
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  createConversation: async (chatbotId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await conversationAPI.create(chatbotId);

      if (response.status && response.conversation) {
        const newConversation = response.conversation;
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversation: newConversation,
          messages: [],
          isLoading: false,
        }));

        return newConversation;
      }

      set({ isLoading: false });
      return null;
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  deleteConversation: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      await conversationAPI.delete(conversationId);

      set((state) => ({
        conversations: state.conversations.filter(
          (conv) => conv.id !== conversationId
        ),
        currentConversation:
          state.currentConversation?.id === conversationId
            ? null
            : state.currentConversation,
        messages:
          state.currentConversation?.id === conversationId ? [] : state.messages,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  sendMessage: async (
    chatbotId: string,
    question: string,
    conversationId?: string
  ) => {
    set({ isSending: true, error: null });

    // Add user message immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
    }));

    try {
      const response = await chatAPI.query(
        chatbotId,
        question,
        conversationId
      );

      if (response.success && response.data) {
        const { answer, conversationId: newConversationId } = response.data;

        // Add assistant message
        const assistantMessage: Message = {
          id: `temp-${Date.now() + 1}`,
          role: "assistant",
          content: answer,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, assistantMessage],
          isSending: false,
        }));

        // Update current conversation ID if it's a new conversation
        if (!conversationId && newConversationId) {
          set((state) => ({
            currentConversation: state.currentConversation
              ? { ...state.currentConversation, id: newConversationId }
              : { id: newConversationId, chatbotId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          }));
        }

        return { answer, conversationId: newConversationId };
      }

      set({ isSending: false, error: "Failed to get response" });
      return null;
    } catch (error) {
      const errorMessage = handleAPIError(error);
      set({ error: errorMessage, isSending: false });
      return null;
    }
  },

  setCurrentConversation: (conversation: Conversation | null) => {
    set({ currentConversation: conversation });
    if (conversation && conversation.messages) {
      set({ messages: conversation.messages });
    }
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearError: () => set({ error: null }),

  clearMessages: () => set({ messages: [] }),
}));
