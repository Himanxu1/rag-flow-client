import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UploadedFile {
  id: string;
  name: string;
  type: "FILE" | "TEXT" | "WEBSITE";
  size?: number;
  uploadedAt: string;
  file?: File;
  content?: string;
  url?: string;
}

interface CreateAgentState {
  agentName: string;
  agentModel: string;
  uploadedFiles: UploadedFile[];

  // Actions
  setAgentName: (name: string) => void;
  setAgentModel: (model: string) => void;
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (id: string) => void;
  clearAll: () => void;
  getTotalSize: () => number;
}

export const useCreateAgentStore = create<CreateAgentState>()(
  persist(
    (set, get) => ({
      agentName: "New AI Agent",
      agentModel: "gpt-4",
      uploadedFiles: [],

      setAgentName: (name) => set({ agentName: name }),

      setAgentModel: (model) => set({ agentModel: model }),

      addUploadedFile: (file) =>
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, file],
        })),

      removeUploadedFile: (id) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id),
        })),

      clearAll: () =>
        set({
          agentName: "New AI Agent",
          agentModel: "gpt-4",
          uploadedFiles: [],
        }),

      getTotalSize: () => {
        const state = get();
        return state.uploadedFiles.length;
      },
    }),
    {
      name: "create-agent-storage",
    }
  )
);
