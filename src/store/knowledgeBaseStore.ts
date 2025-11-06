import { create } from "zustand";
import { knowledgeBaseAPI, chatbotAPI, handleAPIError } from "@/lib/api";

interface KnowledgeBase {
  id: string;
  name: string;
  chatbotId: string;
  sourceType: string;
  status?: "pending" | "processing" | "ready" | "failed";
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

interface KnowledgeBaseState {
  knowledgeBases: KnowledgeBase[];
  uploadProgress: UploadProgress[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchKnowledgeBases: (botId: string) => Promise<void>;
  fetchByCategory: (botId: string, category: string) => Promise<void>;
  deleteKnowledgeBase: (kbId: string) => Promise<boolean>;
  uploadFile: (botId: string, file: File) => Promise<boolean>;
  uploadText: (botId: string, text: string, name: string) => Promise<boolean>;
  uploadWebsite: (
    botId: string,
    websiteLink: string,
    name?: string
  ) => Promise<boolean>;
  updateUploadProgress: (fileId: string, progress: number) => void;
  setUploadStatus: (
    fileId: string,
    status: "uploading" | "success" | "error",
    error?: string
  ) => void;
  clearUploadProgress: () => void;
  clearError: () => void;
}

export const useKnowledgeBaseStore = create<KnowledgeBaseState>(
  (set, get) => ({
    knowledgeBases: [],
    uploadProgress: [],
    isLoading: false,
    error: null,

    fetchKnowledgeBases: async (botId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await knowledgeBaseAPI.getAll(botId);

        if (response.status && response.knowledgeBases) {
          set({ knowledgeBases: response.knowledgeBases, isLoading: false });
        } else {
          set({ knowledgeBases: [], isLoading: false });
        }
      } catch (error) {
        const errorMessage = handleAPIError(error);
        set({ error: errorMessage, isLoading: false });
      }
    },

    fetchByCategory: async (botId: string, category: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await knowledgeBaseAPI.getByCategory(botId, category);

        if (response.status && response.knowledgeBases) {
          set({ knowledgeBases: response.knowledgeBases, isLoading: false });
        } else {
          set({ knowledgeBases: [], isLoading: false });
        }
      } catch (error) {
        const errorMessage = handleAPIError(error);
        set({ error: errorMessage, isLoading: false });
      }
    },

    deleteKnowledgeBase: async (kbId: string) => {
      set({ isLoading: true, error: null });
      try {
        await knowledgeBaseAPI.delete(kbId);

        set((state) => ({
          knowledgeBases: state.knowledgeBases.filter((kb) => kb.id !== kbId),
          isLoading: false,
        }));

        return true;
      } catch (error) {
        const errorMessage = handleAPIError(error);
        set({ error: errorMessage, isLoading: false });
        return false;
      }
    },

    uploadFile: async (botId: string, file: File) => {
      const fileId = `${Date.now()}-${file.name}`;

      // Add to progress tracking
      set((state) => ({
        uploadProgress: [
          ...state.uploadProgress,
          {
            fileId,
            fileName: file.name,
            progress: 0,
            status: "uploading",
          },
        ],
      }));

      try {
        await chatbotAPI.uploadFile(botId, file, (progress) => {
          get().updateUploadProgress(fileId, progress);
        });

        get().setUploadStatus(fileId, "success");

        // Refresh knowledge bases
        await get().fetchKnowledgeBases(botId);

        return true;
      } catch (error) {
        const errorMessage = handleAPIError(error);
        get().setUploadStatus(fileId, "error", errorMessage);
        return false;
      }
    },

    uploadText: async (botId: string, text: string, name: string) => {
      set({ isLoading: true, error: null });
      try {
        await chatbotAPI.uploadText(botId, text, name);

        // Refresh knowledge bases
        await get().fetchKnowledgeBases(botId);

        set({ isLoading: false });
        return true;
      } catch (error) {
        const errorMessage = handleAPIError(error);
        set({ error: errorMessage, isLoading: false });
        return false;
      }
    },

    uploadWebsite: async (
      botId: string,
      websiteLink: string,
      name?: string
    ) => {
      set({ isLoading: true, error: null });
      try {
        await chatbotAPI.uploadWebsite(botId, websiteLink, name);

        // Refresh knowledge bases
        await get().fetchKnowledgeBases(botId);

        set({ isLoading: false });
        return true;
      } catch (error) {
        const errorMessage = handleAPIError(error);
        set({ error: errorMessage, isLoading: false });
        return false;
      }
    },

    updateUploadProgress: (fileId: string, progress: number) => {
      set((state) => ({
        uploadProgress: state.uploadProgress.map((item) =>
          item.fileId === fileId ? { ...item, progress } : item
        ),
      }));
    },

    setUploadStatus: (
      fileId: string,
      status: "uploading" | "success" | "error",
      error?: string
    ) => {
      set((state) => ({
        uploadProgress: state.uploadProgress.map((item) =>
          item.fileId === fileId ? { ...item, status, error } : item
        ),
      }));
    },

    clearUploadProgress: () => {
      set({ uploadProgress: [] });
    },

    clearError: () => set({ error: null }),
  })
);
