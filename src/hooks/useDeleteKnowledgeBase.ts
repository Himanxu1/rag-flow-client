import { knowledgeBaseAPI } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (kbId: string) => knowledgeBaseAPI.delete(kbId),
    onSuccess: () => {
      // Invalidate all knowledge base queries
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases"] });
    },
  });
}
