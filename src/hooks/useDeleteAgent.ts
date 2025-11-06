import { chatbotAPI } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteAgents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: string) => chatbotAPI.delete(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}
