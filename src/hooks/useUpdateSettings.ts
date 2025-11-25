import { settingsAPI } from "@/lib/api";
import type { ChatbotSettings } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateSettingsParams {
  agentId: string;
  settings: Partial<ChatbotSettings>;
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, settings }: UpdateSettingsParams) =>
      settingsAPI.update(agentId, settings),
    onSuccess: (_, variables) => {
      // Invalidate settings query for this specific agent
      queryClient.invalidateQueries({ queryKey: ["settings", variables.agentId] });
    },
  });
}
