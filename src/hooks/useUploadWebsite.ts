import { chatbotAPI } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UploadWebsiteParams {
  agentId: string;
  websiteUrl: string;
  name?: string;
}

export function useUploadWebsite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, websiteUrl, name }: UploadWebsiteParams) =>
      chatbotAPI.uploadWebsite(agentId, websiteUrl, name),
    onSuccess: () => {
      // Invalidate all knowledge base queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases"] });
    },
  });
}
