import { chatbotAPI } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UploadTextParams {
  agentId: string;
  text: string;
  name: string;
}

export function useUploadText() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, text, name }: UploadTextParams) =>
      chatbotAPI.uploadText(agentId, text, name),
    onSuccess: () => {
      // Invalidate all knowledge base queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases"] });
    },
  });
}
