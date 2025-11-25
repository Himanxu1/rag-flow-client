import { settingsAPI } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useResetSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: string) => settingsAPI.reset(agentId),
    onSuccess: (_, agentId) => {
      // Invalidate settings query for this specific agent
      queryClient.invalidateQueries({ queryKey: ["settings", agentId] });
    },
  });
}
