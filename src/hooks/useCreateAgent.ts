import { chatbotAPI } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentName: string) => chatbotAPI.createWithKB(agentName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}
