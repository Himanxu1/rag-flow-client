import { conversationAPI } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => conversationAPI.delete(conversationId),
    onSuccess: () => {
      // Invalidate conversations query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
