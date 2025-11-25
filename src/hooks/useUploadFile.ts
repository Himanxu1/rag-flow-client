import { chatbotAPI } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UploadFileParams {
  agentId: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, file, onProgress }: UploadFileParams) =>
      chatbotAPI.uploadFile(agentId, file, onProgress),
    onSuccess: () => {
      // Invalidate all knowledge base queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases"] });
    },
  });
}
